// Renders the benchmark charts from results.json. Empty or null results show a pending frame.
//   val_loss:   [{ "step": 200, "loss": 2.31 }, ...]     validation loss during training
//   perplexity: { "base": 41.2, "engram": 12.8 }        on held-out messages I wrote
//   blind_test: { "correct": 23, "total": 50 }          friends guessing real me vs engram
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

function lossChart(card, points) {
  const host = card.querySelector(".chart-plot");
  if (!points?.length) return pending(host, "Validation loss appears once the first eval step runs.");
  const W = 640, H = 240, L = 44, R = 16, T = 12, B = 28;
  const maxStep = Math.max(...points.map((p) => p.step));
  const maxLoss = niceMax(Math.max(...points.map((p) => p.loss)));
  const x = (s) => L + (s / maxStep) * (W - L - R);
  const y = (v) => T + (1 - v / maxLoss) * (H - T - B);
  const s = svg(host, W, H);
  s.setAttribute("aria-label", `Validation loss over ${points.length} eval steps`);
  for (let i = 0; i <= 2; i++) {
    const v = (maxLoss / 2) * i;
    el("line", { x1: L, x2: W - R, y1: y(v), y2: y(v), class: "grid" }, s);
    el("text", { x: L - 8, y: y(v) + 4, class: "tick", "text-anchor": "end" }, s).textContent = v.toFixed(1);
  }
  el("text", { x: W - R, y: H - 6, class: "tick", "text-anchor": "end" }, s).textContent = `step ${maxStep}`;
  el("text", { x: L, y: H - 6, class: "tick" }, s).textContent = "0";
  el("path", { d: points.map((p, i) => `${i ? "L" : "M"}${x(p.step)},${y(p.loss)}`).join(""), class: "line" }, s);
  const last = points[points.length - 1];
  el("circle", { cx: x(last.step), cy: y(last.loss), r: 4, class: "dot" }, s);
  const cross = el("line", { y1: T, y2: H - B, class: "cross", visibility: "hidden" }, s);
  const hit = el("rect", { x: L, y: T, width: W - L - R, height: H - T - B, fill: "transparent" }, s);
  hit.addEventListener("pointermove", (e) => {
    const box = s.getBoundingClientRect();
    const step = ((e.clientX - box.left) / box.width * W - L) / (W - L - R) * maxStep;
    const p = points.reduce((a, b) => (Math.abs(b.step - step) < Math.abs(a.step - step) ? b : a));
    cross.setAttribute("x1", x(p.step));
    cross.setAttribute("x2", x(p.step));
    cross.setAttribute("visibility", "visible");
    showTip(e, `Step ${p.step}<br><strong>${p.loss.toFixed(3)}</strong> loss`);
  });
  hit.addEventListener("pointerleave", () => {
    cross.setAttribute("visibility", "hidden");
    hideTip();
  });
  table(card, ["Step", "Loss"], points.map((p) => [p.step, p.loss.toFixed(3)]));
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
    lossChart(document.getElementById("chart-loss"), data.val_loss);

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
      "Friends guess real me vs Engram on held-out chats.",
    );
  });
