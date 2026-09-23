import {decide, setupConnection} from "./api.js";

const $ = (id) => document.getElementById(id);
const canvas = $("game"), ctx = canvas.getContext("2d");
const W = 600, H = 160, GROUND = 140, DINO_X = 40;
const GRAVITY = 0.6, JUMP_V = -10, FAST_FALL = 1.8;
const START_SPEED = 6, MAX_SPEED = 13, ACCEL = 0.0015;
const FRAME_MS = 1000 / 60;

// Sprites, 2 canvas px per cell. Drawn for this page, loosely after the offline game.
const bitmap = (rows) => rows.map((r) => [...r].map((c) => c === "#"));
const DINO = bitmap([
  "..........########..",
  ".........##.#######.",
  ".........##########.",
  ".........##########.",
  ".........#####......",
  ".........########...",
  "#.......#####.......",
  "#......#######......",
  "##....#########.....",
  "###..##########.....",
  "############.#......",
  "############........",
  ".##########.........",
  "..#########.........",
  "...#######..........",
  "....######..........",
]);
const LEGS = [bitmap(["....###.##..", "....##...#..", "....#....#..", "....##...##."]),
              bitmap(["....###.##..", "....##...#..", "....##...#..", ".........##."])];
const DUCK = bitmap([
  "..................########..",
  "#.......#########.##.######.",
  "##....#####################.",
  ".##########################.",
  "..########################..",
  "...#################........",
  "....######....###...........",
  "....##.........##...........",
  "....###........###..........",
]);
const BIRD = [bitmap([
  "....#..............",
  "....##.............",
  "..####.#...........",
  ".######.##.........",
  "##########.........",
  "....##############.",
  ".....############..",
  "......#########....",
]), bitmap([
  "...................",
  "..............#....",
  "...##.......###....",
  ".######...#####....",
  "##########.####....",
  "....##############.",
  ".....############..",
  "........######.....",
])];

const size = (bmp) => ({w: bmp[0].length * 2, h: bmp.length * 2});
function draw(bmp, x, y) {
  bmp.forEach((row, j) => row.forEach((on, i) => { if (on) ctx.fillRect(Math.round(x) + i * 2, Math.round(y) + j * 2, 2, 2); }));
}

// ---- game state ----

let g, best = 0, runs = 0, decisions = 0, running = false, runId = 0;

function newGame() {
  g = {speed: START_SPEED, dist: 0, frame: 0, y: 0, vy: 0, ducking: false, obstacles: [], nextGap: 300, dead: false};
}
newGame();

function dinoBox() {
  if (g.ducking && g.y === 0) { const s = size(DUCK); return {x: DINO_X, y: GROUND - s.h, w: s.w, h: s.h}; }
  const h = (DINO.length + 4) * 2;
  return {x: DINO_X, y: GROUND - h + g.y, w: 40, h};
}

function spawn() {
  const kinds = g.speed > 8 ? ["small", "small", "large", "bird"] : ["small", "small", "large"];
  const kind = kinds[Math.floor(Math.random() * kinds.length)];
  if (kind === "bird") {
    const level = ["low", "middle", "high"][Math.floor(Math.random() * 3)];
    const bottom = {low: GROUND - 8, middle: GROUND - 32, high: GROUND - 56}[level];
    const s = size(BIRD[0]);
    g.obstacles.push({kind: "bird", level, x: W, y: bottom - s.h, w: s.w, h: s.h});
  } else {
    const n = 1 + Math.floor(Math.random() * (kind === "small" ? 3 : 2));
    const w = (kind === "small" ? 12 : 18) * n + (n - 1) * 4, h = kind === "small" ? 34 : 48;
    g.obstacles.push({kind, n, x: W, y: GROUND - h, w, h});
  }
  g.nextGap = g.speed * (45 + Math.random() * 50);
}

function hit(a, b) {
  const pad = 4;
  return a.x + pad < b.x + b.w && a.x + a.w - pad > b.x && a.y + pad < b.y + b.h && a.y + a.h - pad > b.y;
}

function step() {
  g.frame++;
  g.speed = Math.min(MAX_SPEED, g.speed + ACCEL);
  g.dist += g.speed;
  if (g.y < 0 || g.vy < 0) {
    g.vy += GRAVITY + (g.ducking ? FAST_FALL : 0);
    g.y = Math.min(0, g.y + g.vy);
    if (g.y === 0) g.vy = 0;
  }
  for (const o of g.obstacles) o.x -= g.speed;
  g.obstacles = g.obstacles.filter((o) => o.x + o.w > 0);
  const last = g.obstacles[g.obstacles.length - 1];
  if (!last || W - (last.x + last.w) > g.nextGap) spawn();
  const d = dinoBox();
  if (g.obstacles.some((o) => hit(d, o))) die();
}

function jump() { if (!g.dead && g.y === 0 && !g.ducking) g.vy = JUMP_V; }
function duck(on) { g.ducking = on; }

function die() {
  g.dead = true;
  runs++;
  best = Math.max(best, score());
  render();
  stats();
  const endedRun = runId;
  if ($("player").value === "jet" && running) setTimeout(() => {
    if (running && endedRun === runId && g.dead && $("player").value === "jet") newGame();
  }, 1200);
}

const score = () => Math.floor(g.dist / 40);

// ---- drawing ----

function render() {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#555";
  ctx.fillRect(0, GROUND - 1, W, 1);
  for (let i = 0; i < 24; i++) {  // pebbles
    const x = ((i * 97 - g.dist * 1) % W + W) % W;
    ctx.fillRect(x, GROUND + 4 + (i % 3) * 4, 2 + (i % 2) * 2, 1);
  }
  ctx.fillStyle = "#000";
  for (const o of g.obstacles) {
    if (o.kind === "bird") draw(BIRD[Math.floor(g.frame / 10) % 2], o.x, o.y);
    else cactus(o);
  }
  const legFrame = g.y === 0 && !g.dead ? Math.floor(g.frame / 6) % 2 : 0;
  if (g.ducking && g.y === 0) draw(DUCK, DINO_X, GROUND - size(DUCK).h);
  else {
    const top = GROUND - (DINO.length + 4) * 2 + g.y;
    draw(DINO, DINO_X, top);
    draw(LEGS[legFrame], DINO_X, top + DINO.length * 2);
  }
  ctx.font = "14px ui-monospace, Menlo, Consolas, monospace";
  ctx.textAlign = "right";
  ctx.fillStyle = "#555";
  ctx.fillText(`HI ${String(best).padStart(5, "0")}  ${String(score()).padStart(5, "0")}`, W - 8, 20);
  if (g.dead) {
    ctx.textAlign = "center";
    ctx.fillStyle = "#000";
    ctx.fillText("G A M E   O V E R", W / 2, 60);
  } else if (!running) {
    ctx.textAlign = "center";
    ctx.fillText("press Start", W / 2, 60);
  }
}

function cactus(o) {
  const unit = o.kind === "small" ? 12 : 18;
  for (let i = 0; i < o.n; i++) {
    const x = o.x + i * (unit + 4), trunk = Math.round(unit * 0.45);
    ctx.fillRect(x + (unit - trunk) / 2, o.y, trunk, o.h);                   // trunk
    ctx.fillRect(x, o.y + o.h * 0.3, 3, o.h * 0.3);                          // left arm
    ctx.fillRect(x, o.y + o.h * 0.57, (unit - trunk) / 2, 3);
    ctx.fillRect(x + unit - 3, o.y + o.h * 0.2, 3, o.h * 0.3);               // right arm
    ctx.fillRect(x + (unit + trunk) / 2, o.y + o.h * 0.47, (unit - trunk) / 2, 3);
  }
}

// ---- asking Jet ----

// Jet reads words, not numbers: probing it with raw distances and frame counts got "run" whatever
// the distance. So the page turns the physics into a sentence (what is ahead, and whether it is
// about to hit) and Jet answers two questions: is it about to hit, and which move gets past it.
const DESCRIPTIONS = {
  small: "a small cactus on the ground",
  large: "a tall cactus on the ground",
  low: "a bird flying low, at the dinosaur's feet",
  middle: "a bird flying at head height, where ducking gets under it",
  high: "a bird flying high in the sky, well above the dinosaur",
};
const MOVES = {
  jump: "jump over it: it is on or near the ground",
  duck: "duck under it: it flies at head height",
  run: "keep running: it flies high overhead and cannot hit a running dinosaur",
};
const QUESTIONS = {
  close: {type: "noul", instructions: "Is an obstacle about to hit the dinosaur right now?"},
  move: {type: "choice", instructions: "How does the dinosaur get past this obstacle?", criteria: MOVES},
};
// How many frames ahead an obstacle counts as "about to hit". A jump has to start inside the
// window where the dinosaur clears it; ducking can start early and is held until the bird passes.
const WINDOW = {small: 10, large: 10, low: 10, middle: 30, high: 10};

function situation() {
  const o = g.obstacles.find((o) => o.x + o.w > DINO_X);
  if (!o) return {text: "Nothing is ahead of the dinosaur. The ground is clear.", frames: null};
  const d = dinoBox();
  const frames = Math.max(0, (o.x - (d.x + d.w)) / g.speed);
  const key = o.kind === "bird" ? o.level : o.kind;
  const near = frames <= WINDOW[key];
  const group = o.kind !== "bird" && o.n > 1 ? ` (a group of ${o.n})` : "";
  const where = near ? "It is right in front of the dinosaur, about to hit it." : "It is far away, not close yet.";
  return {text: `The obstacle ahead is ${DESCRIPTIONS[key]}${group}. ${where}`, frames: Math.round(frames)};
}

function payload() {
  return {state: situation().text, questions: QUESTIONS};
}

// Act only when Jet says an obstacle is about to hit; then do the move it picked.
function action(answers) {
  return answers.close.probability >= 0.5 ? answers.move.choice : "run";
}

async function thinkLoop(id) {
  while (running && id === runId && $("player").value === "jet") {
    if (g.dead) { await new Promise((r) => setTimeout(r, 100)); continue; }
    const body = payload();
    try {
      const data = await decide(body);
      if (!running || id !== runId || g.dead) continue;
      const act = action(data.answers);
      if (act === "jump") { duck(false); jump(); }
      else duck(act === "duck");
      decisions++;
      $("latency").textContent = `${data.latency_ms} ms`;
      $("error").textContent = "";
      showDecision(body, data, act);
      await new Promise((r) => setTimeout(r, 16));  // at most about one decision per frame
    } catch (e) {
      if (!running || id !== runId) return;
      $("error").textContent = e.message;
      stop();
    }
  }
}

function probRow(table, label, p, best) {
  const tr = table.insertRow();
  if (best) tr.className = "best";
  tr.insertCell().textContent = label;
  const bar = document.createElement("span");
  bar.className = "bar";
  bar.style.width = Math.round(p * 160) + "px";
  tr.insertCell().append(bar);
  const num = tr.insertCell();
  num.className = "num";
  num.textContent = (p * 100).toFixed(1) + "%";
}

function showDecision(body, data, act) {
  const {close, move} = data.answers;
  const box = $("decision");
  box.innerHTML = "";
  const el = (tag, text, cls) => { const e = document.createElement(tag); e.textContent = text; if (cls) e.className = cls; return e; };
  box.append(el("p", body.state, "muted"));
  box.append(el("h3", "About to hit?"));
  const t1 = document.createElement("table");
  t1.className = "probs";
  probRow(t1, "yes", close.probability, close.probability >= 0.5);
  probRow(t1, "no", 1 - close.probability, close.probability < 0.5);
  box.append(t1, el("h3", "How to get past it"));
  const t2 = document.createElement("table");
  t2.className = "probs";
  for (const [k, p] of Object.entries(move.probabilities)) probRow(t2, k, p, k === move.choice);
  box.append(t2, el("p", `So the dinosaur does: ${act}.`));
  if ($("raw").open) {
    $("req").textContent = JSON.stringify(body, null, 2);
    $("res").textContent = JSON.stringify(data, null, 2);
  }
  $("raw").hidden = false;
}

// ---- loop and controls ----

let lastT = 0, acc = 0, frameId = 0;
function tick(t) {
  if (!running) return;
  acc += Math.min(100, t - (lastT || t)) * Number($("pace").value);
  lastT = t;
  while (acc >= FRAME_MS) {
    acc -= FRAME_MS;
    if (!g.dead) step();
  }
  render();
  stats();
  frameId = requestAnimationFrame(tick);
}

function stats() {
  $("score").textContent = score();
  $("best").textContent = best;
  $("runs").textContent = runs;
  $("decisions").textContent = decisions;
}

function start() {
  cancelAnimationFrame(frameId);
  canvas.focus({preventScroll: true});
  runId++;
  running = true;
  newGame();
  lastT = 0; acc = 0;
  $("start").textContent = "Restart";
  $("error").textContent = "";
  frameId = requestAnimationFrame(tick);
  if ($("player").value === "jet") thinkLoop(runId);
}

function stop() {
  cancelAnimationFrame(frameId);
  runId++;
  running = false;
  $("start").textContent = "Start";
  render();
}

$("start").addEventListener("click", start);
let connectionReady = false;
function updatePlayer() {
  const manual = $("player").value === "you";
  $("keys").hidden = !manual;
  $("manual-controls").hidden = !manual;
  $("connection").hidden = manual;
  $("jet-details").hidden = manual;
  if (!manual && !connectionReady) { setupConnection(); connectionReady = true; }
}
$("player").addEventListener("change", () => {
  updatePlayer();
  if (running) start();
});
canvas.addEventListener("keydown", (e) => {
  if ($("player").value !== "you" || e.target.tagName === "INPUT") return;
  if (e.code === "Space" || e.code === "ArrowUp") {
    e.preventDefault();
    if (!running || g.dead) start(); else jump();
  } else if (e.code === "ArrowDown") { e.preventDefault(); duck(true); }
});
canvas.addEventListener("keyup", (e) => { if (e.code === "ArrowDown") duck(false); });
$("raw").addEventListener("toggle", () => { if (!$("raw").open) return; const b = payload(); $("req").textContent = JSON.stringify(b, null, 2); });

function manualJump() {
  if ($("player").value !== "you") return;
  if (!running || g.dead) start(); else jump();
}
canvas.addEventListener("pointerdown", manualJump);
$("jump").addEventListener("click", () => { manualJump(); canvas.focus({preventScroll: true}); });
$("duck").addEventListener("pointerdown", (e) => {
  if ($("player").value !== "you") return;
  if (!running || g.dead) start();
  e.currentTarget.setPointerCapture(e.pointerId);
  duck(true);
});
for (const event of ["pointerup", "pointercancel", "lostpointercapture"]) {
  $("duck").addEventListener(event, () => duck(false));
}
$("duck").addEventListener("keydown", (e) => {
  if ($("player").value !== "you" || !["Space", "Enter"].includes(e.code)) return;
  e.preventDefault();
  if (!running || g.dead) { start(); e.currentTarget.focus({preventScroll: true}); }
  duck(true);
});
$("duck").addEventListener("keyup", () => duck(false));
$("duck").addEventListener("blur", () => duck(false));
canvas.addEventListener("blur", () => duck(false));
updatePlayer();
render();
