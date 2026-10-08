// Renders the benchmark charts from results.json. Empty or null results show a pending frame.
//   val_loss:   [{ "step": 200, "loss": 2.31 }, ...]     validation loss during training
//   perplexity: { "base": 41.2, "engram": 12.8 }        on held-out messages the person wrote
//   blind_test: { "correct": 23, "total": 50 }          friends guessing real person vs engram
//   speed:      [{ "context": 512, "tps": 112 }, ...]     generation tokens/s, Q4_K_M on the 4080 Super
//   vram:       [{ "context": 512, "gb": 5.6 }, ...]      GPU memory at that context length
//   data_mix:   { "Messenger": 4100000, ... }            training tokens per source
//   sample:     true                                   marks placeholder numbers; remove for real results
const NS = "http://www.w3.org/2000/svg";
const tip = document.createElement("div");
tip.className = "chart-tip";
tip.hidden = true;
document.body.appendChild(tip);

function el(name, attrs = {}, parent) {
  const node = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (parent) parent.appendChild(node);
  return node;
}

function svg(host, w, h) {
  host.textContent = "";
  return el("svg", { viewBox: `0 0 ${w} ${h}`, role: "img" }, host);
}

function showTip(e, html) {
  tip.innerHTML = html;
  tip.hidden = false;
  const x = Math.min(e.clientX + 14, window.innerWidth - tip.offsetWidth - 8);
  tip.style.left = `${x}px`;
  tip.style.top = `${e.clientY + 14}px`;
}

function hideTip() {
  tip.hidden = true;
}

function pending(host, label) {
  host.classList.add("pending");
  host.innerHTML = `<span class="blink">Training</span><span class="pending-note">${label}</span>`;
}

function table(card, head, rows) {
  const t = card.querySelector(".chart-table");
  t.innerHTML = `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
  t.hidden = false;
}

function niceMax(v) {
  const p = 10 ** Math.floor(Math.log10(v));
  return Math.ceil(v / p) * p;
}

// Single-series line chart. o: { x, y, xFmt, yFmt, tip, head, label, note, fromZero }
function lineChart(card, points, o) {
  const host = card.querySelector(".chart-plot");
  if (!points?.length) return pending(host, o.note);
  const W = Math.round(host.clientWidth) || 640, H = W > 480 ? 240 : 180, L = 44, R = 16, T = 12, B = 28;
  const xs = points.map((p) => p[o.x]);
  const minX = o.fromZero ? 0 : Math.min(...xs);
  const maxX = Math.max(...xs);
  const maxY = niceMax(Math.max(...points.map((p) => p[o.y])));
  const x = (v) => L + ((v - minX) / (maxX - minX || 1)) * (W - L - R);
  const y = (v) => T + (1 - v / maxY) * (H - T - B);
  const s = svg(host, W, H);
  s.setAttribute("aria-label", o.label);
  for (let i = 0; i <= 2; i++) {
    const v = (maxY / 2) * i;
    el("line", { x1: L, x2: W - R, y1: y(v), y2: y(v), class: "grid" }, s);
    el("text", { x: L - 8, y: y(v) + 4, class: "tick", "text-anchor": "end" }, s).textContent = o.yFmt(v, true);
  }
  el("text", { x: L, y: H - 6, class: "tick" }, s).textContent = o.xFmt(minX);
  el("text", { x: W - R, y: H - 6, class: "tick", "text-anchor": "end" }, s).textContent = o.xFmt(maxX, true);
  el("path", { d: points.map((p, i) => `${i ? "L" : "M"}${x(p[o.x])},${y(p[o.y])}`).join(""), class: "line" }, s);
  const last = points[points.length - 1];
  el("circle", { cx: x(last[o.x]), cy: y(last[o.y]), r: 4, class: "dot" }, s);
  const cross = el("line", { y1: T, y2: H - B, class: "cross", visibility: "hidden" }, s);
  const hit = el("rect", { x: L, y: T, width: W - L - R, height: H - T - B, fill: "transparent" }, s);
  hit.addEventListener("pointermove", (e) => {
    const box = s.getBoundingClientRect();
    const at = minX + (((e.clientX - box.left) / box.width) * W - L) / (W - L - R) * (maxX - minX);
    const p = points.reduce((a, b) => (Math.abs(b[o.x] - at) < Math.abs(a[o.x] - at) ? b : a));
    cross.setAttribute("x1", x(p[o.x]));
    cross.setAttribute("x2", x(p[o.x]));
    cross.setAttribute("visibility", "visible");
    showTip(e, o.tip(p));
  });
  hit.addEventListener("pointerleave", () => {
    cross.setAttribute("visibility", "hidden");
    hideTip();
  });
  table(card, o.head, points.map((p) => [o.xFmt(p[o.x]), o.yFmt(p[o.y])]));
}

// Horizontal bars, sorted largest first, labels and values written beside each bar.
function hbarChart(card, rows, format, note) {
  const host = card.querySelector(".chart-plot");
  if (!rows?.length) return pending(host, note);
  rows = [...rows].sort((a, b) => b.value - a.value);
  const W = Math.round(host.clientWidth) || 640, L = 96, R = 64, bh = 18, gap = 10;
  const H = rows.length * (bh + gap) - gap;
  const max = Math.max(...rows.map((r) => r.value));
  const s = svg(host, W, H);
  s.setAttribute("aria-label", rows.map((r) => `${r.label} ${format(r.value)}`).join(", "));
  rows.forEach((r, i) => {
    const top = i * (bh + gap);
    const w = Math.max(2, (r.value / max) * (W - L - R));
    const rr = Math.min(4, w);
    el("text", { x: L - 10, y: top + bh / 2 + 4, class: "tick", "text-anchor": "end" }, s).textContent = r.label;
    el("path", {
      d: `M${L},${top}H${L + w - rr}Q${L + w},${top} ${L + w},${top + rr}V${top + bh - rr}Q${L + w},${top + bh} ${L + w - rr},${top + bh}H${L}Z`,
      class: "bar engram",
    }, s);
    el("text", { x: L + w + 8, y: top + bh / 2 + 4, class: "value" }, s).textContent = format(r.value);
    const hit = el("rect", { x: 0, y: top - gap / 2, width: W, height: bh + gap, fill: "transparent" }, s);
    hit.addEventListener("pointermove", (e) => showTip(e, `${r.label}<br><strong>${format(r.value)}</strong>`));
    hit.addEventListener("pointerleave", hideTip);
  });
  table(card, ["Source", "Tokens"], rows.map((r) => [r.label, format(r.value)]));
}

function barChart(card, bars, format, note) {
  const host = card.querySelector(".chart-plot");
  if (bars.some((b) => b.value == null)) return pending(host, note);
  const W = 300, H = 220, T = 28, B = 28, gap = 24;
  const max = niceMax(Math.max(...bars.map((b) => b.value), bars.ref ?? 0));
  const bw = Math.min(72, (W - gap * (bars.length + 1)) / bars.length);
  const x0 = (W - (bars.length * bw + (bars.length - 1) * gap)) / 2;
  const y = (v) => T + (1 - v / max) * (H - T - B);
  const s = svg(host, W, H);
  s.setAttribute("aria-label", bars.map((b) => `${b.label} ${format(b.value)}`).join(", "));
  el("line", { x1: 0, x2: W, y1: H - B, y2: H - B, class: "axis" }, s);
  bars.forEach((b, i) => {
    const bx = x0 + i * (bw + gap);
    const top = y(b.value);
    const h = H - B - top;
    const r = Math.min(4, h);
    el("path", {
      d: `M${bx},${H - B}V${top + r}Q${bx},${top} ${bx + r},${top}H${bx + bw - r}Q${bx + bw},${top} ${bx + bw},${top + r}V${H - B}Z`,
      class: `bar ${b.kind}`,
    }, s);
    el("text", { x: bx + bw / 2, y: top - 8, class: "value", "text-anchor": "middle" }, s).textContent = format(b.value);
    el("text", { x: bx + bw / 2, y: H - 8, class: "tick", "text-anchor": "middle" }, s).textContent = b.label;
    const hit = el("rect", { x: bx - gap / 2, y: T - 20, width: bw + gap, height: H - T - B + 20, fill: "transparent" }, s);
    hit.addEventListener("pointermove", (e) => showTip(e, `${b.label}<br><strong>${format(b.value)}</strong>`));
    hit.addEventListener("pointerleave", hideTip);
  });
  if (bars.ref != null) {
    el("line", { x1: 0, x2: W, y1: y(bars.ref), y2: y(bars.ref), class: "ref" }, s);
    el("text", { x: 0, y: y(bars.ref) - 6, class: "tick" }, s).textContent = bars.refLabel;
  }
  table(card, ["", "Value"], bars.map((b) => [b.label, format(b.value)]));
}

fetch("./results.json")
  .then((r) => (r.ok ? r.json() : {}))
  .catch(() => ({}))
  .then((data) => {
    if (data.sample) {
      for (const h of document.querySelectorAll(".chart h3")) {
        h.insertAdjacentHTML("beforeend", ' <span class="tag">Sample data</span>');
      }
    }
    render(data);
    // Charts draw at their box's pixel width, so redraw when that width changes.
    const charts = document.querySelector(".charts");
    let width = charts.clientWidth;
    let frame;
    new ResizeObserver(() => {
      if (charts.clientWidth === width) return;
      width = charts.clientWidth;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        hideTip();
        render(data);
      });
    }).observe(charts);
  });

function render(data) {
  lineChart(document.getElementById("chart-loss"), data.val_loss, {
    x: "step", y: "loss", fromZero: true,
    xFmt: (v, end) => (end ? `step ${v}` : `${v}`),
    yFmt: (v, axis) => v.toFixed(axis ? 1 : 3),
    tip: (p) => `Step ${p.step}<br><strong>${p.loss.toFixed(3)}</strong> loss`,
    head: ["Step", "Loss"],
    label: "Validation loss during training",
    note: "Validation loss appears once the first eval step runs.",
  });

  const k = (v) => `${(v / 1024).toFixed(v % 1024 ? 1 : 0)}k`;
  lineChart(document.getElementById("chart-speed"), data.speed, {
    x: "context", y: "tps",
    xFmt: (v, end) => (end ? `${k(v)} tokens` : k(v)),
    yFmt: (v) => `${Math.round(v)}`,
    tip: (p) => `${p.context.toLocaleString()} tokens of context<br><strong>${Math.round(p.tps)}</strong> tokens/s`,
    head: ["Context", "Tokens/s"],
    label: "Generation speed in tokens per second across context length",
    note: "Benchmarked with llama.cpp once the GGUF is exported.",
  });

  lineChart(document.getElementById("chart-vram"), data.vram, {
    x: "context", y: "gb",
    xFmt: (v, end) => (end ? `${k(v)} tokens` : k(v)),
    yFmt: (v, axis) => `${axis && Number.isInteger(v) ? v : v.toFixed(1)} GB`,
    tip: (p) => `${p.context.toLocaleString()} tokens of context<br><strong>${p.gb.toFixed(1)} GB</strong> VRAM`,
    head: ["Context", "VRAM"],
    label: "GPU memory used across context length",
    note: "Benchmarked with llama.cpp once the GGUF is exported.",
  });

  hbarChart(
    document.getElementById("chart-mix"),
    Object.entries(data.data_mix ?? {}).map(([label, value]) => ({ label, value })),
    (v) => (v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : `${Math.round(v / 1e3)}k`),
    "Counted after ingest and build.",
  );

  const ppl = data.perplexity ?? {};
  barChart(
    document.getElementById("chart-ppl"),
    [
      { label: "Qwen3 8B", value: ppl.base ?? null, kind: "base" },
      { label: "Engram", value: ppl.engram ?? null, kind: "engram" },
    ],
    (v) => v.toFixed(1),
    "Measured on held-out messages after training.",
  );

  const bt = data.blind_test ?? {};
  const rate = bt.total ? (bt.correct / bt.total) * 100 : null;
  const bars = [{ label: "Guessed right", value: rate, kind: "engram" }];
  bars.ref = 50;
  bars.refLabel = "chance 50%";
  barChart(
    document.getElementById("chart-blind"),
    bars,
    (v) => `${Math.round(v)}%`,
    "Friends guess the real person vs Engram on held-out chats.",
  );
}
