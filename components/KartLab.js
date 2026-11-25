"use client";

import { useEffect, useRef } from "react";
import { Sim, makeTrack, TRACKS, STATES, ACTIONS, binOf, HALFW, DT } from "@/lib/kartLabCore";
import "@/app/projects/pytux/lab/lab.css";

// Static markup; the effect below wires it up and drives it each frame.
const MARKUP = `
<div class="kl-metrics">
  <div class="kl-metric"><span>Episode</span><strong id="klEp">0</strong></div>
  <div class="kl-metric"><span>Exploration ε</span><strong id="klEps">0.99</strong></div>
  <div class="kl-metric"><span>Last lap</span><strong id="klLast">–</strong></div>
  <div class="kl-metric"><span>Best lap</span><strong id="klBest" class="kl-accent">–</strong></div>
</div>
<div class="kl-main">
  <div class="kl-left">
    <div class="kl-track"><canvas id="klTrack" aria-label="Top-down view of the kart on the circuit"></canvas><div class="kl-flag" id="klFlag"></div></div>
    <div class="kl-controls">
      <button class="kl-btn kl-primary" id="klPlay" type="button">Pause</button>
      <div class="kl-ctl"><span>Sim speed</span>
        <div class="kl-seg" id="klSpeed"><button type="button" data-v="1">1×</button><button type="button" data-v="4" aria-pressed="true">4×</button><button type="button" data-v="25">25×</button><button type="button" data-v="0">Turbo</button></div></div>
      <div class="kl-ctl"><span>Mode</span>
        <div class="kl-seg" id="klMode"><button type="button" data-v="learn" aria-pressed="true">Learn</button><button type="button" data-v="race">Race greedy</button></div></div>
      <label class="kl-ctl" for="klTrackSel"><span>Circuit</span>
        <select id="klTrackSel"><option value="lakeside">Lakeside</option><option value="hairpins">Hairpins</option><option value="oval">Oval</option></select></label>
      <button class="kl-btn" id="klReset" type="button">Reset Q-tables</button>
    </div>
    <div class="kl-sliders">
      <div><label for="klSEps">ε exploration <output id="klOEps"></output></label><input type="range" id="klSEps" min="0" max="1" step="0.01"></div>
      <div><label for="klSDecay">ε decay per episode <output id="klODecay"></output></label><input type="range" id="klSDecay" min="0.9" max="1" step="0.005"></div>
      <div><label for="klSAlpha">α learning rate <output id="klOAlpha"></output></label><input type="range" id="klSAlpha" min="0.01" max="0.5" step="0.01"></div>
      <div><label for="klSGamma">γ discount <output id="klOGamma"></output></label><input type="range" id="klSGamma" min="0" max="0.99" step="0.01"></div>
    </div>
    <div class="kl-chart">
      <h3 id="klChartTitle">Reward per episode</h3>
      <p class="kl-hint">Dots are single episodes, the line is a 10-episode rolling mean, and the dashed line is ε on the right axis.</p>
      <div class="kl-fig" id="klChart"><svg></svg></div>
    </div>
  </div>
  <div class="kl-side">
    <section>
      <h3>What the agent sees</h3>
      <p class="kl-hint">The horizontal aim point, from −1 (left) to +1 (right), cut into the controller's nine buckets, plus whether it moved right (G) or left (L) since the last decision.</p>
      <div class="kl-aimstrip" id="klAimstrip"></div>
      <div class="kl-readout">
        <div><span>State</span><b id="klRState">F1G</b><small id="klRStateD">centred</small></div>
        <div><span>Action</span><b id="klRAct" class="kl-tan">F100</b><small id="klRActD">full throttle</small></div>
        <div><span>Step reward</span><b id="klRRew">0.0</b><small id="klRWhy">progress</small></div>
      </div>
    </section>
    <section>
      <div class="kl-qhead">
        <h3>Q-table</h3>
        <div class="kl-seg kl-seg-sm" id="klQview"><button type="button" data-v="avg" aria-pressed="true">A+B</button><button type="button" data-v="A">Q_A</button><button type="button" data-v="B">Q_B</button></div>
      </div>
      <p class="kl-hint">18 states × 10 actions, each row shaded on its own scale. A dot marks the greedy choice; the outlined cell is what the agent is doing now.</p>
      <div class="kl-qgrid" id="klQgrid"></div>
      <div class="kl-qfoot"><span id="klQhover">Hover a cell to read its values.</span><span>worst<i class="kl-ramp"></i>best</span></div>
    </section>
  </div>
</div>`;

const DISP_ROWS = [0, 1, 2, 3, 4, 10, 11, 12, 13, 5, 6, 7, 8, 9, 14, 15, 16, 17];
const DISP_COLS = [0, 1, 2, 3, 4, 5, 6, 7, 9, 8];
const ADESC = { F25: "25% throttle, straight", F50: "50% throttle, straight", F75: "75% throttle, straight", F100: "full throttle", SN10: "hard left", SN5: "half left", SP5: "half right", SP10: "hard right", SP10D: "hard right with drift", SN10D: "hard left with drift" };
const BINS = [["L4", .2], ["L3", .2], ["L2", .2], ["L1", .2], ["F1", .4], ["R1", .2], ["R2", .2], ["R3", .2], ["R4", .2]];
// canvas and svg colours, taken from the site's palette (app/globals.css)
const C = { paper: "#141512", ink: "#e8e8df", muted: "#a3a69b", rule: "#353830", sage: "#b6c8aa", tan: "#d6a77f", blue: "#9eaccd", cell: "#1f211c" };

function initLab(root) {
  const G = id => root.querySelector("#" + id);
  const tracks = {};
  for (const k in TRACKS) tracks[k] = makeTrack(TRACKS[k]);
  let trackName = "lakeside";
  const sim = new Sim(tracks[trackName]);
  sim.decay = .97;
  let running = true, speed = 4, mode = "learn", qview = "avg", raf = 0, chartDirty = true;
  while (sim.episode < 40) sim.step(false); // open mid-training rather than on an empty table

  // aim strip
  G("klAimstrip").innerHTML = BINS.map(([n, w]) => `<div style="flex:${w}">${n}</div>`).join("") + `<i id="klAimMark"></i>`;
  const binEls = [...G("klAimstrip").children].slice(0, 9);

  // q grid
  const qg = G("klQgrid");
  let html = `<div></div>` + DISP_COLS.map(c => `<div class="kl-ch">${ACTIONS[c]}</div>`).join("");
  DISP_ROWS.forEach((r, i) => {
    if (i == 9) html += `<div class="kl-gap"></div>`;
    html += `<div class="kl-rh" data-r="${r}">${STATES[r]}</div>` + DISP_COLS.map(c => `<div class="kl-c" data-r="${r}" data-c="${c}"></div>`).join("");
  });
  qg.innerHTML = html;
  const cells = {}, rowHeads = {};
  qg.querySelectorAll(".kl-c").forEach(el => cells[el.dataset.r + "_" + el.dataset.c] = el);
  qg.querySelectorAll(".kl-rh").forEach(el => rowHeads[el.dataset.r] = el);
  const qv = (s, a) => qview == "A" ? sim.QA[s][a] : qview == "B" ? sim.QB[s][a] : (sim.QA[s][a] + sim.QB[s][a]) / 2;
  qg.addEventListener("pointerover", e => {
    const t = e.target.closest(".kl-c"); if (!t) return;
    const s = +t.dataset.r, a = +t.dataset.c;
    G("klQhover").textContent = `${STATES[s]} × ${ACTIONS[a]}: Q_A ${sim.QA[s][a].toFixed(1)} · Q_B ${sim.QB[s][a].toFixed(1)}`;
  });
  function drawQ() {
    for (let s = 0; s < 18; s++) {
      let lo = Infinity, hi = -Infinity;
      for (let a = 0; a < 10; a++) { const v = qv(s, a); if (v < lo) lo = v; if (v > hi) hi = v; }
      const span = hi - lo || 1;
      let b = 0; for (let a = 1; a < 10; a++) if (sim.q(s, a) > sim.q(s, b)) b = a;
      const zero = sim.QA[s].every(v => v == 0) && sim.QB[s].every(v => v == 0);
      for (let a = 0; a < 10; a++) {
        const el = cells[s + "_" + a], t = zero ? 0 : (qv(s, a) - lo) / span;
        el.style.background = `color-mix(in oklab, ${C.sage} ${(t * 100).toFixed(0)}%, ${C.cell})`;
        el.classList.toggle("kl-best", a == b && !zero);
        el.classList.toggle("kl-cur", s == sim.s && a == sim.a);
      }
      rowHeads[s].classList.toggle("kl-on", s == sim.s);
    }
  }

  // track canvas
  const cv = G("klTrack"), ctx = cv.getContext("2d");
  let scale = 1, bg = null;
  function sizeCanvas() {
    const r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
    scale = cv.width / 1000; bg = null;
  }
  const cro = new ResizeObserver(sizeCanvas); cro.observe(cv);
  function path(c, pts) { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); }
  function renderBg() {
    const T = sim.track;
    bg = document.createElement("canvas"); bg.width = cv.width || 1; bg.height = cv.height || 1;
    const c = bg.getContext("2d"); c.scale(scale, scale);
    for (let i = 0; i < 20; i++) { c.fillStyle = i % 2 ? "#1a1c17" : "#181a15"; c.fillRect(i * 50, 0, 50, 630); }
    c.lineJoin = "round"; path(c, T.pts);
    c.strokeStyle = "#10110e"; c.lineWidth = HALFW * 2 + 22; c.stroke();
    c.setLineDash([14, 14]); c.strokeStyle = "#8d9085"; c.lineWidth = HALFW * 2 + 7; c.stroke();
    c.lineDashOffset = 14; c.strokeStyle = "#6e5a48"; c.stroke(); c.setLineDash([]);
    c.strokeStyle = "#2b2d28"; c.lineWidth = HALFW * 2; c.stroke();
    c.setLineDash([10, 16]); c.strokeStyle = "rgba(232,232,223,.14)"; c.lineWidth = 2; c.stroke(); c.setLineDash([]);
    const p = T.pts[0], th = T.tan[0];
    c.save(); c.translate(p[0], p[1]); c.rotate(th);
    for (let k = 0; k < 8; k++) for (let j = 0; j < 2; j++) { c.fillStyle = (k + j) % 2 ? C.paper : C.ink; c.fillRect(-4 + j * 4, -HALFW + k * HALFW / 4, 4, HALFW / 4); }
    c.restore();
  }
  function drawTrack() {
    if (!cv.width) return;
    if (!bg) renderBg();
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(bg, 0, 0); ctx.setTransform(scale, 0, 0, scale, 0, 0);
    const T = sim.track, tr = sim.trail; ctx.lineCap = "round";
    for (let i = 1; i < tr.length; i++) {
      ctx.strokeStyle = `rgba(214,167,127,${(i / tr.length * .5).toFixed(2)})`; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(tr[i - 1][0], tr[i - 1][1]); ctx.lineTo(tr[i][0], tr[i][1]); ctx.stroke();
    }
    const ap = T.pts[(sim.idx + 16) % T.N];
    ctx.setLineDash([5, 6]); ctx.strokeStyle = "rgba(182,200,170,.75)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(sim.x, sim.y); ctx.lineTo(ap[0], ap[1]); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = C.sage; ctx.beginPath(); ctx.arc(ap[0], ap[1], 5, 0, 7); ctx.fill();
    ctx.save(); ctx.translate(sim.x, sim.y); ctx.rotate(sim.th);
    ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.fillRect(-9, -6, 22, 15);
    ctx.fillStyle = "#0c0d0b"; [[-8, -8], [4, -8], [-8, 5], [4, 5]].forEach(([x, y]) => ctx.fillRect(x, y, 6, 3));
    ctx.fillStyle = sim.off && (sim.ticks >> 3) % 2 ? C.ink : C.tan;
    ctx.beginPath(); ctx.roundRect(-11, -6, 22, 12, 4); ctx.fill();
    ctx.fillStyle = "#23261f"; ctx.fillRect(1, -4, 5, 8);
    ctx.restore();
  }

  // chart
  const svg = G("klChart").querySelector("svg");
  const niceStep = x => { const p = 10 ** Math.floor(Math.log10(x || 1)), f = x / p; return (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * p; };
  function drawChart() {
    const W = svg.clientWidth, H = svg.clientHeight; if (!W) return;
    const h = sim.history.filter(x => !x.greedy).slice(-300);
    const m = { l: 46, r: 34, t: 12, b: 28 }, iw = W - m.l - m.r, ih = H - m.t - m.b;
    if (h.length < 2) { svg.innerHTML = `<text x="${W / 2}" y="${H / 2}" text-anchor="middle">Waiting for episodes…</text>`; G("klChartTitle").textContent = "Reward per episode"; return; }
    let lo = Math.min(...h.map(d => d.r)), hi = Math.max(...h.map(d => d.r));
    const step = niceStep((hi - lo) / 4); lo = Math.floor(lo / step) * step; hi = Math.ceil(hi / step) * step;
    const x0 = sim.episode - h.length, X = i => m.l + i / (h.length - 1) * iw, Y = v => m.t + ih - (v - lo) / (hi - lo) * ih, E = v => m.t + ih - v * ih;
    let s = "";
    for (let v = lo; v <= hi + 1e-9; v += step) s += `<line x1="${m.l}" x2="${W - m.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="${v == 0 ? '#4a4d44' : C.rule}" stroke-width="${v == 0 ? 1 : .6}"/><text x="${m.l - 8}" y="${Y(v) + 4}" text-anchor="end">${Math.round(v)}</text>`;
    [0, .5, 1].forEach(v => s += `<text x="${W - m.r + 8}" y="${E(v) + 4}" style="fill:${C.blue}">${v}</text>`);
    const nt = W < 520 ? 3 : 6;
    for (let k = 0; k <= nt; k++) { const i = Math.round(k / nt * (h.length - 1)); s += `<text x="${X(i)}" y="${H - 8}" text-anchor="middle">${x0 + i + 1}</text>`; }
    s += h.map((d, i) => `<circle cx="${X(i).toFixed(1)}" cy="${Y(d.r).toFixed(1)}" r="2" fill="${C.sage}" opacity=".3"/>`).join("");
    const roll = h.map((_, i) => { const a = h.slice(Math.max(0, i - 9), i + 1); return a.reduce((t, d) => t + d.r, 0) / a.length; });
    s += `<polyline fill="none" stroke="${C.blue}" stroke-width="1.2" stroke-dasharray="4 5" points="${h.map((d, i) => X(i).toFixed(1) + "," + E(d.eps).toFixed(1)).join(" ")}"/>`;
    s += `<polyline fill="none" stroke="${C.sage}" stroke-width="2" stroke-linejoin="round" points="${roll.map((v, i) => X(i).toFixed(1) + "," + Y(v).toFixed(1)).join(" ")}"/>`;
    s += `<text x="${m.l + 6}" y="${m.t + 14}">reward</text><text x="${W - m.r - 6}" y="${m.t + 14}" text-anchor="end" style="fill:${C.blue}">ε</text>`;
    svg.innerHTML = s;
    const first = roll[Math.min(9, roll.length - 1)], last = roll.at(-1);
    G("klChartTitle").textContent = h.length >= 20
      ? `Reward ${last > first ? "rose" : "fell"} from ${Math.round(first)} to ${Math.round(last)} over the last ${h.length} episodes`
      : "Reward per episode";
  }
  const chro = new ResizeObserver(() => { chartDirty = true; }); chro.observe(svg);

  // readouts
  const fmtLap = v => v == null ? "DNF" : v.toFixed(1) + "s";
  function updateText() {
    const a = sim.aim; G("klAimMark").style.left = ((a + 1) / 2 * 100) + "%";
    const name = STATES[sim.s], b = binOf(a);
    binEls.forEach((el, i) => el.classList.toggle("kl-on", i == b));
    G("klRState").textContent = name;
    G("klRStateD").textContent = (b == 4 ? "aim centred" : `aim ${b < 4 ? "left" : "right"}, bucket ${Math.abs(b - 4)}`) + (name.endsWith("G") ? ", moving right" : ", moving left");
    if (sim.a != null) { G("klRAct").textContent = ACTIONS[sim.a]; G("klRActD").textContent = ADESC[ACTIONS[sim.a]]; }
    const r = sim.lastR ?? 0;
    G("klRRew").textContent = (r >= 0 ? "+" : "") + r.toFixed(1);
    G("klRWhy").textContent = sim.off ? "off track" : r > 0 ? "progress" : "no progress";
    G("klEp").textContent = sim.episode;
    G("klEps").textContent = mode == "race" ? "0 (race)" : sim.epsilon.toFixed(2);
    const last = sim.history.at(-1);
    G("klLast").textContent = last ? fmtLap(last.lap) : "–";
    G("klBest").textContent = sim.best ? fmtLap(sim.best) : "–";
    G("klFlag").textContent = `${mode == "race" ? "Racing" : "Learning"} · lap ${Math.min(100, sim.prog / sim.track.len * 100).toFixed(0)}% · ${(sim.ticks * DT).toFixed(1)}s`;
    G("klSEps").value = sim.epsilon; G("klOEps").textContent = sim.epsilon.toFixed(2);
  }

  // controls
  function seg(id, fn) {
    G(id).addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      G(id).querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x == b));
      fn(b.dataset.v);
    });
  }
  seg("klSpeed", v => speed = +v);
  seg("klMode", v => { mode = v; sim.reset(); sim.a = null; });
  seg("klQview", v => { qview = v; drawQ(); });
  G("klPlay").onclick = () => { running = !running; G("klPlay").textContent = running ? "Pause" : "Play"; };
  G("klTrackSel").onchange = e => { trackName = e.target.value; sim.setTrack(tracks[trackName]); sim.a = null; sim.best = null; bg = null; };
  G("klReset").onclick = () => {
    sim.QA = STATES.map(() => ACTIONS.map(() => 0)); sim.QB = STATES.map(() => ACTIONS.map(() => 0));
    sim.epsilon = .99; sim.episode = 0; sim.history = []; sim.best = null; sim.reset(); sim.a = null; chartDirty = true;
  };
  [["klSEps", "klOEps", "epsilon", 2], ["klSDecay", "klODecay", "decay", 3], ["klSAlpha", "klOAlpha", "alpha", 2], ["klSGamma", "klOGamma", "gamma", 2]].forEach(([s, o, k, d]) => {
    const el = G(s); el.value = sim[k]; G(o).textContent = (+sim[k]).toFixed(d);
    el.oninput = () => { sim[k] = +el.value; G(o).textContent = (+el.value).toFixed(d); };
  });

  // main loop
  function frame() {
    if (running) {
      const greedy = mode == "race", t0 = performance.now();
      if (speed > 0) { for (let i = 0; i < speed; i++) if (sim.step(greedy)) chartDirty = true; }
      else { while (performance.now() - t0 < 12) for (let i = 0; i < 200; i++) if (sim.step(greedy)) chartDirty = true; }
    }
    drawTrack(); drawQ(); updateText();
    if (chartDirty) { drawChart(); chartDirty = false; }
    raf = requestAnimationFrame(frame);
  }
  sizeCanvas();
  raf = requestAnimationFrame(frame);

  return () => { cancelAnimationFrame(raf); cro.disconnect(); chro.disconnect(); };
}

export default function KartLab() {
  const ref = useRef(null);
  useEffect(() => initLab(ref.current), []);
  return <div className="kart-lab" ref={ref} dangerouslySetInnerHTML={{ __html: MARKUP }} />;
}
