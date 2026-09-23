// Jet in the browser: a port of the jet repo's src/format.py and src/model.py onto onnxruntime-web.
// It returns the same response as jet-serve's POST /v1/decide. The model is the fused Qwen3-0.6B,
// exported to ONNX with its KV cache, cut to last-position logits and quantized to 8 bits.
// models/jet/golden.json in the jet repo holds test vectors for this port (see test.html).

import * as ort from "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.30.0/dist/ort.webgpu.min.mjs";
import {Tokenizer} from "https://cdn.jsdelivr.net/npm/@huggingface/tokenizers@0.2.0/dist/tokenizers.min.mjs";

export const SYSTEM_PROMPT =
  "You are Jet, a decision model. Read the state and the question, then answer " +
  "with exactly one label from the allowed labels.";
// Bound the KV cache and attention memory on devices with limited GPU memory.
export const MAX_STATE_TOKENS = 2048;
const MAX_CHOICE_OPTIONS = 255;
const MIN_SCORE_LEVELS = 2, MAX_SCORE_LEVELS = 10;
const MAX_QUESTIONS = 64;
// Prompts are fed through the KV cache in chunks, so attention never holds a full n x n matrix
// (a 4k-token state would otherwise need over a gigabyte per layer).
const CHUNK = 128;
const CACHE_NAME = "jet-model-v1";

export class RequestError extends Error {}

// ---- prompt format (src/format.py) ----

function validate(q) {
  if (q === null || typeof q !== "object") throw new RequestError("question must be an object");
  const {type, instructions, criteria} = q;
  if (!["choice", "score", "noul"].includes(type)) throw new RequestError(`unknown question type ${JSON.stringify(type)}`);
  if (typeof instructions !== "string" || !instructions.trim()) throw new RequestError("instructions must be a non-empty string");
  if (type === "choice") {
    const n = criteria && typeof criteria === "object" && !Array.isArray(criteria) ? Object.keys(criteria).length : 0;
    if (n < 2 || n > MAX_CHOICE_OPTIONS) throw new RequestError(`choice criteria must be an object with 2-${MAX_CHOICE_OPTIONS} options`);
  } else if (type === "score") {
    if (!Array.isArray(criteria) || criteria.length < MIN_SCORE_LEVELS || criteria.length > MAX_SCORE_LEVELS)
      throw new RequestError(`score criteria must be a list of ${MIN_SCORE_LEVELS}-${MAX_SCORE_LEVELS} levels`);
  } else if (criteria !== undefined && criteria !== null) {
    throw new RequestError("noul questions take no criteria");
  }
  return {type, instructions, criteria: type === "noul" ? null : criteria};
}

const keysOf = (q) => q.type === "choice" ? Object.keys(q.criteria) : q.type === "score" ? q.criteria : ["no", "yes"];

export function renderState(state) {
  if (typeof state === "string") return state;
  if (Array.isArray(state) && state.every((s) => typeof s === "string")) return state.join("\n\n");
  return JSON.stringify(state, null, 2);
}

function renderUser(stateText, q, labels) {
  const parts = [`<state>\n${stateText}\n</state>`, ""];
  if (q.type === "choice") {
    const opts = Object.entries(q.criteria).map(([key, desc], i) => `${labels[i]}: ${key}: ${desc}`).join("\n");
    parts.push(`Question: ${q.instructions}`, `Options:\n${opts}`,
      `Answer with the label of the best option (${labels[0]}-${labels.at(-1)}).`);
  } else if (q.type === "score") {
    const levels = q.criteria.map((desc, i) => `${labels[i]}: ${desc}`).join("\n");
    parts.push(`Question: ${q.instructions}`, `Scale (lowest to highest):\n${levels}`,
      `Answer with the level number (0-${labels.length - 1}).`);
  } else {
    parts.push(`Question: ${q.instructions}`, "Answer yes or no.");
  }
  return parts.join("\n");
}

// Qwen3's chat template with enable_thinking=False, for a system and a user message.
const chat = (user) =>
  `<|im_start|>system\n${SYSTEM_PROMPT}<|im_end|>\n<|im_start|>user\n${user}<|im_end|>\n` +
  "<|im_start|>assistant\n<think>\n\n</think>\n\n";

// ---- answers (summarize in src/model.py) ----

const round4 = (x) => Math.round(x * 1e4) / 1e4;

function softmax(z, temperature) {
  const s = z.map((v) => v / temperature);
  const max = Math.max(...s);
  const e = s.map((v) => Math.exp(v - max));
  const sum = e.reduce((a, b) => a + b, 0);
  return e.map((v) => v / sum);
}

export function summarize(q, probs) {
  const k = probs.length;
  const entropy = -probs.reduce((acc, p) => acc + p * Math.log(Math.min(Math.max(p, 1e-12), 1)), 0);
  const confidence = round4(1 - entropy / Math.log(k));
  const best = probs.indexOf(Math.max(...probs));
  if (q.type === "choice") {
    const keys = keysOf(q);
    return {type: "choice", choice: keys[best],
      probabilities: Object.fromEntries(keys.map((key, i) => [key, round4(probs[i])])), confidence};
  }
  if (q.type === "score") {
    return {type: "score", score: round4(probs.reduce((acc, p, i) => acc + i * p, 0)), level: q.criteria[best],
      probabilities: probs.map(round4), confidence};
  }
  return {type: "noul", probability: round4(probs[1]), confidence};
}

// ---- downloads ----

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.json();
}

// Fetches a large file with progress, keeping it in the Cache API so later visits skip the download.
// The download is streamed into the cache as it arrives rather than copied in afterwards, because a
// second full copy of the model in memory is enough to get a phone's tab killed. Returns the bytes and,
// if the copy couldn't be kept, why (quota, private browsing, ...).
async function fetchBytes(url, onProgress) {
  let cache = null, cacheError = null;
  try { cache = await caches.open(CACHE_NAME); } catch (e) { cacheError = e; }
  let res = cache && await cache.match(url).catch(() => null);
  const cached = Boolean(res);
  let saving = null;
  if (!res) {
    res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    if (cache) {
      try { await navigator.storage?.persist?.(); } catch {}  // ask the browser not to evict it
      const headers = {"content-type": "application/octet-stream"};
      if (res.headers.get("content-length")) headers["content-length"] = res.headers.get("content-length");
      const [toCache, toRead] = res.body.tee();
      saving = cache.put(url, new Response(toCache, {headers})).catch(e => { cacheError = e; });
      res = new Response(toRead, {headers});
    }
  }
  const total = Number(res.headers.get("content-length")) || 0;
  const reader = res.body.getReader();
  let bytes = total ? new Uint8Array(total) : null;
  const chunks = [];
  let loaded = 0;
  for (;;) {
    const {done, value} = await reader.read();
    if (done) break;
    if (bytes && loaded + value.length <= total) bytes.set(value, loaded);
    else chunks.push(value);
    loaded += value.length;
    onProgress?.({loaded, total, cached});
  }
  if (!bytes || loaded !== total) {  // no or wrong content-length: stitch the chunks instead
    const all = new Uint8Array(loaded);
    let at = 0;
    if (bytes) { all.set(bytes.subarray(0, Math.min(loaded, total))); at = Math.min(loaded, total); }
    for (const c of chunks) { all.set(c, at); at += c.length; }
    bytes = all;
  }
  if (saving) {
    try { await saving; } catch (e) { cacheError = e; }
  }
  const notSaved = cached ? null : String(cacheError?.message || cacheError?.name || (cache ? "" : "no Cache Storage")) || null;
  return {bytes, notSaved};
}

export async function isCached(url) {
  try { return Boolean(await (await caches.open(CACHE_NAME)).match(url)); } catch { return false; }
}

// ---- the model ----

export class Jet {
  // base: a URL ending in "/" holding tokenizer.json, tokenizer_config.json, calibration.json and the ONNX file.
  static async load(base, {file = "onnx/model_q8_compact.onnx", onProgress, threads, maxStateTokens = MAX_STATE_TOKENS} = {}) {
    if (!navigator.gpu) throw new Error("WebGPU is unavailable. Use a browser with WebGPU enabled, or select Server.");
    const adapter = await navigator.gpu.requestAdapter({powerPreference: "high-performance"});
    if (!adapter) throw new Error("No compatible GPU found. Select Server to use hosted inference.");
    ort.env.wasm.numThreads = 1;
    const [tokenizerJson, tokenizerConfig, calibration] = await Promise.all([
      fetchJson(base + "tokenizer.json"),
      fetchJson(base + "tokenizer_config.json"),
      fetchJson(base + "calibration.json").catch(() => ({})),
    ]);
    const {bytes, notSaved} = await fetchBytes(base + file, onProgress);
    onProgress?.({stage: "init"});
    // Keep graph initialization bounded; attention and matrix operations use WebGPU.
    const preferredOutputLocation = {logits: "cpu"};
    for (let i = 0; i < 28; i++) for (const kv of ["key", "value"]) preferredOutputLocation[`present.${i}.${kv}`] = "gpu-buffer";
    const session = await ort.InferenceSession.create(bytes, {
      executionProviders: ["webgpu"], graphOptimizationLevel: "basic", preferredOutputLocation,
    });
    const jet = new Jet(new Tokenizer(tokenizerJson, tokenizerConfig), session, calibration, ort.env.wasm.numThreads, maxStateTokens);
    jet.notSaved = notSaved;  // why the model couldn't be kept for the next visit, if it couldn't
    return jet;
  }

  constructor(tokenizer, session, calibration, threads, maxStateTokens = MAX_STATE_TOKENS) {
    this.maxStateTokens = maxStateTokens;
    this.tokenizer = tokenizer;
    this.session = session;
    this.threads = threads;
    this.temperatures = {choice: 1, score: 1, noul: 1, ...calibration};
    this.layers = session.inputNames.filter((n) => n.startsWith("past_key_values.") && n.endsWith(".key")).length;
    this.queue = Promise.resolve();
    this._choiceLabels = null;
  }

  encode(text) {
    return this.tokenizer.encode(text, {add_special_tokens: false}).ids;
  }

  // A..Z, then the two-letter labels AA, AB, ... that are single tokens for this tokenizer.
  choiceLabels() {
    if (!this._choiceLabels) {
      const letters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
      const pairs = letters.flatMap((a) => letters.map((b) => a + b)).filter((p) => this.encode(p).length === 1);
      this._choiceLabels = [...letters, ...pairs].slice(0, MAX_CHOICE_OPTIONS);
    }
    return this._choiceLabels;
  }

  labelsFor(q) {
    if (q.type === "choice") return this.choiceLabels().slice(0, Object.keys(q.criteria).length);
    if (q.type === "score") return q.criteria.map((_, i) => String(i));
    return ["no", "yes"];
  }

  labelTokenIds(q) {
    return this.labelsFor(q).map((label) => {
      const ids = this.encode(label);
      if (ids.length !== 1) throw new Error(`label ${label} is not a single token`);
      return ids[0];
    });
  }

  // The full prompt, with the middle of an over-long state cut out.
  promptText(state, q) {
    let text = renderState(state);
    const ids = this.encode(text);
    if (ids.length > this.maxStateTokens) {
      const half = Math.floor(this.maxStateTokens / 2);
      text = this.tokenizer.decode(ids.slice(0, half)) + "\n[...]\n" + this.tokenizer.decode(ids.slice(-half));
    }
    return chat(renderUser(text, q, this.labelsFor(q)));
  }

  emptyPast() {
    const past = {};
    for (let i = 0; i < this.layers; i++) {
      for (const kv of ["key", "value"]) past[`past_key_values.${i}.${kv}`] = new ort.Tensor("float32", new Float32Array(0), [1, 8, 0, 128]);
    }
    return past;
  }

  // Intermediate KV tensors stay on the GPU; release each chunk before the next request.
  async extend(ids, past, offset) {
    let logits;
    try {
      for (let done = 0; done < ids.length; done += CHUNK) {
        const chunk = ids.slice(done, done + CHUNK), start = offset + done;
        const inputs = {
          input_ids: new ort.Tensor("int64", BigInt64Array.from(chunk, BigInt), [1, chunk.length]),
          attention_mask: new ort.Tensor("int64", new BigInt64Array(start + chunk.length).fill(1n), [1, start + chunk.length]),
          position_ids: new ort.Tensor("int64", BigInt64Array.from(chunk, (_, i) => BigInt(start + i)), [1, chunk.length]),
        };
        let out;
        try { out = await this.session.run({...inputs, ...past}); }
        finally { Object.values(inputs).forEach(t => t.dispose()); }
        Object.values(past).forEach(t => t.dispose());
        past = {};
        for (const [name, t] of Object.entries(out)) {
          if (name.startsWith("present.")) past[name.replace("present.", "past_key_values.")] = t;
        }
        logits = Float32Array.from(out.logits.data);
        out.logits.dispose();
      }
      return {logits, past};
    } catch (e) {
      Object.values(past).forEach(t => t.dispose());
      throw e;
    }
  }

  async rawLogits(state, questions) {
    const logits = [];
    let inputTokens = 0;
    for (const q of questions) {
      const ids = this.encode(this.promptText(state, q));
      if (ids.length > 4096) throw new RequestError("Prompt is too long for browser inference (4096 tokens maximum).");
      const out = await this.extend(ids, this.emptyPast(), 0);
      try { logits.push(this.labelTokenIds(q).map(id => out.logits[id])); }
      finally { Object.values(out.past).forEach(t => t.dispose()); }
      inputTokens += ids.length;
    }
    return {logits, inputTokens};
  }

  // Same request and response as jet-serve's POST /v1/decide. Requests run one at a time.
  decide(body) {
    const run = this.queue.then(() => this._decide(body));
    this.queue = run.catch(() => {});
    return run;
  }

  async _decide({state, questions}) {
    const started = performance.now();
    if (typeof state !== "string" && (state === null || typeof state !== "object")) throw new RequestError("state must be a string, object or list");
    if (!questions || typeof questions !== "object" || !Object.keys(questions).length) throw new RequestError("questions must not be empty");
    const names = Object.keys(questions);
    if (names.length > MAX_QUESTIONS) throw new RequestError(`at most ${MAX_QUESTIONS} questions per request`);
    let qs;
    try {
      qs = names.map((name) => validate(questions[name]));
    } catch (e) {
      throw new RequestError(`invalid question: ${e.message}`);
    }
    const {logits, inputTokens} = await this.rawLogits(state, qs);
    const answers = {};
    names.forEach((name, i) => { answers[name] = summarize(qs[i], softmax(logits[i], this.temperatures[qs[i].type])); });
    return {model: "michaljach/jet · WebGPU", answers, usage: {input_tokens: inputTokens}, latency_ms: Math.round((performance.now() - started) * 10) / 10};
  }
}
