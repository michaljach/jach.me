// Shared backend selector. Model downloads only start after an explicit click.
export const DEFAULT_SERVER = "http://127.0.0.1:8000";
export const MODEL_BASE = "https://huggingface.co/michaljach/jet/resolve/dc0dc4a1882118f5dcdc9347dddddabeea6456da/";
const $ = id => document.getElementById(id);
const load = k => { try { return localStorage.getItem(k) || ""; } catch { return ""; } };
const save = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
const server = () => ($("server").value.trim() || DEFAULT_SERVER).replace(/\/+$/, "");
const unreachable = () => `Can't reach ${server()}. Start it with: jet-serve --cors-origin ${location.origin}`;
let worker, ready = false, loading = false, sequence = 0, healthCheck = 0;
const pending = new Map();
const browserMode = () => $("backend")?.value === "webgpu";
function status(text, error = false) {
  $("conn").textContent = text;
  $("conn").className = error ? "err" : "muted";
}
function stopModel(message = "Model unloaded.") {
  worker?.terminate(); worker = null; ready = loading = false;
  for (const {reject} of pending.values()) reject(new Error(message));
  pending.clear();
  $("load-model").textContent = "Load Jet · 627 MB";
  $("load-model").disabled = false;
  $("unload-model").hidden = true;
  status(message);
}
function loadModel() {
  if (loading || ready) return;
  loading = true;
  $("load-model").disabled = true;
  $("unload-model").hidden = false;
  $("unload-model").textContent = "Cancel";
  status("Checking GPU…");
  worker = new Worker(new URL("./jet-worker.js", import.meta.url), {type: "module"});
  worker.onerror = e => { stopModel(); status(e.message || "Could not start browser inference. Select Server or retry.", true); };
  worker.onmessage = ({data: msg}) => {
    if (msg.type === "progress") {
      status(msg.stage === "init" ? "Preparing GPU… this can take a minute." :
        `${msg.cached ? "Reading cached model" : "Downloading model"} · ${Math.round(msg.loaded / 1e6)} / ${Math.round((msg.total || 627326333) / 1e6)} MB`);
    } else if (msg.type === "ready") {
      ready = true; loading = false;
      $("load-model").textContent = "GPU ready";
      $("unload-model").textContent = "Unload";
      status("Ready · inference stays on this device" + (msg.notSaved ? " · download could not be cached" : " · model cached"));
    } else if (msg.type === "failed") {
      stopModel(); status(`GPU load failed: ${msg.message} Select Server or retry.`, true);
    } else if (msg.type === "result") {
      const request = pending.get(msg.id);
      if (!request) return;
      clearTimeout(request.timer); pending.delete(msg.id);
      if (msg.error) request.reject(new Error(msg.error)); else request.resolve(msg.result);
    }
  };
  worker.postMessage({type: "load", base: MODEL_BASE, file: "onnx/model_q8_compact.onnx"});
}
export function setupConnection() {
  if ($("backend")) return;
  const conn = $("conn");
  const serverLabel = $("server").closest("label"), keyLabel = $("key").closest("label");
  const controls = document.createElement("span");
  controls.className = "controls";
  controls.innerHTML = '<label>Inference <select id="backend"><option value="webgpu">Browser GPU</option><option value="server">Server</option></select></label><button type="button" id="load-model">Load Jet · 627 MB</button><button type="button" id="unload-model" hidden>Unload</button>';
  serverLabel.before(controls);
  conn.setAttribute("role", "status"); conn.setAttribute("aria-live", "polite");
  const fromQuery = new URLSearchParams(location.search).get("server");
  $("server").value = fromQuery || load("jet-server") || DEFAULT_SERVER;
  $("key").value = load("jet-key");
  $("backend").value = fromQuery ? "server" : load("jet-backend") || "webgpu";
  $("server").addEventListener("change", () => { save("jet-server", $("server").value.trim()); checkHealth(); });
  $("key").addEventListener("change", () => save("jet-key", $("key").value));
  const update = () => {
    healthCheck++;
    const local = browserMode();
    serverLabel.hidden = keyLabel.hidden = local;
    $("load-model").hidden = !local;
    $("unload-model").hidden = !local || !worker;
    if (!local) { if (worker) stopModel(); checkHealth(); }
    else status(navigator.gpu ? "Load once to run Jet on your GPU. Requires available device memory; download is cached when possible." : "WebGPU is unavailable in this browser. Select Server, or use a browser with WebGPU support.", !navigator.gpu);
    $("load-model").disabled = !navigator.gpu || loading || ready;
  };
  $("backend").addEventListener("change", () => { save("jet-backend", $("backend").value); update(); });
  $("load-model").addEventListener("click", loadModel);
  $("unload-model").addEventListener("click", () => stopModel());
  update();
}
async function checkHealth() {
  const id = ++healthCheck;
  status("Connecting…");
  try {
    const res = await fetch(server() + "/health", {signal: AbortSignal.timeout(10000)});
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (id === healthCheck && !browserMode()) status(`Connected · ${data.model}`);
  } catch { if (id === healthCheck && !browserMode()) status(unreachable(), true); }
}
export async function decide(body) {
  if (browserMode()) {
    if (!ready) throw new Error(loading ? "Jet is still loading. Wait for GPU ready." : "Click Load Jet before running browser inference.");
    return new Promise((resolve, reject) => {
      const id = ++sequence;
      const timer = setTimeout(() => stopModel("GPU request timed out. Reload the model or select Server."), 120000);
      pending.set(id, {resolve, reject: e => { clearTimeout(timer); reject(e); }, timer});
      worker.postMessage({type: "decide", id, body});
    });
  }
  const headers = {"Content-Type": "application/json"};
  if ($("key").value) headers.Authorization = "Bearer " + $("key").value;
  let res;
  try { res = await fetch(server() + "/v1/decide", {method: "POST", headers, body: JSON.stringify(body)}); }
  catch { throw new Error(unreachable()); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${res.status}: ${typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail)}`);
  return data;
}
