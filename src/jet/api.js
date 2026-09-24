// Shared connection to the Jet inference server.
export const DEFAULT_SERVER = "http://127.0.0.1:8000";
const $ = id => document.getElementById(id);
const load = k => { try { return localStorage.getItem(k) || ""; } catch { return ""; } };
const save = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
const server = () => ($("server").value.trim() || DEFAULT_SERVER).replace(/\/+$/, "");
const unreachable = () => `Can't reach ${server()}. Start it with: jet-serve --cors-origin ${location.origin}`;
let healthCheck = 0, initialized = false;
function status(text, error = false) {
  $("conn").textContent = text;
  $("conn").className = error ? "err" : "muted";
}
export function setupConnection() {
  if (initialized) return;
  initialized = true;
  const conn = $("conn");
  conn.setAttribute("role", "status"); conn.setAttribute("aria-live", "polite");
  const fromQuery = new URLSearchParams(location.search).get("server");
  $("server").value = fromQuery || load("jet-server") || DEFAULT_SERVER;
  $("key").value = load("jet-key");
  $("server").addEventListener("change", () => { save("jet-server", $("server").value.trim()); checkHealth(); });
  $("key").addEventListener("change", () => save("jet-key", $("key").value));
  checkHealth();
}
async function checkHealth() {
  const id = ++healthCheck;
  status("Connecting…");
  try {
    const res = await fetch(server() + "/health", {signal: AbortSignal.timeout(10000)});
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (id === healthCheck) status(`Connected · ${data.model}`);
  } catch { if (id === healthCheck) status(unreachable(), true); }
}
export async function decide(body) {
  const headers = {"Content-Type": "application/json"};
  if ($("key").value) headers.Authorization = "Bearer " + $("key").value;
  let res;
  try { res = await fetch(server() + "/v1/decide", {method: "POST", headers, body: JSON.stringify(body)}); }
  catch { throw new Error(unreachable()); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${res.status}: ${typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail)}`);
  return data;
}
