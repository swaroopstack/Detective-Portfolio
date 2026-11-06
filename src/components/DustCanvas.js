import { $ } from '../lib/dom.js';
import { game } from '../state.js';
import { perf } from '../lib/perf.js';

export const markup = '<canvas id="dust"></canvas>';

let c, g, w, h, p = [], active = false, running = false, last = 0;

function resize() {
  if (!c) return;
  w = c.width = innerWidth;
  h = c.height = innerHeight;
  p = Array.from({ length: 18 }, () => ({
    x: Math.random() * w, y: Math.random() * h,
    r: Math.random() * 1.4 + 0.4, a: Math.random() * 6.3,
  }));
}

function frame(t) {
  // Pause while hidden, on the start screen, or while a case file is open.
  if (!active || document.hidden || game.locked || perf.low) { running = false; return; }
  running = true;
  if (t - last >= 33) {           // cap at ~30fps: this is ambient dust, not gameplay
    last = t;
    g.clearRect(0, 0, w, h);
    g.fillStyle = '#ffe3b0';
    for (const d of p) {
      d.a += 0.01; d.x += Math.sin(d.a) * 0.3; d.y -= 0.15;
      if (d.y < 0) d.y = h;
      g.globalAlpha = 0.25 + Math.sin(d.a * 2) * 0.2;
      g.beginPath(); g.arc(d.x, d.y, d.r, 0, 6.3); g.fill();
    }
  }
  requestAnimationFrame(frame);
}

export function resumeDust() {
  if (active && !running) { running = true; requestAnimationFrame(frame); }
}

export function startDust() {
  c = $('dust');
  g = c.getContext('2d', { alpha: true });
  resize();
  addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) resumeDust();
  });
  addEventListener('perfchange', resumeDust);
  active = true;
  running = true;
  requestAnimationFrame(frame);
}
