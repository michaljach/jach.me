// Runs Jet off the page's main thread (see api.js for the other side of these messages).
import {Jet, RequestError} from "./jet.js";

let jet = null;

self.onmessage = async ({data: msg}) => {
  if (msg.type === "load") {
    try {
      jet = await Jet.load(msg.base, {file: msg.file, onProgress: (p) => self.postMessage({type: "progress", ...p})});
      self.postMessage({type: "ready", threads: jet.threads, notSaved: jet.notSaved});
    } catch (e) {
      self.postMessage({type: "failed", message: String(e?.message || e)});
    }
  } else if (msg.type === "decide") {
    try {
      self.postMessage({type: "result", id: msg.id, result: await jet.decide(msg.body)});
    } catch (e) {
      self.postMessage({type: "result", id: msg.id, error: String(e?.message || e), invalid: e instanceof RequestError});
    }
  }
};
