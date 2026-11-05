import { $ } from './dom.js';
import { game } from '../state.js';

export const WORLD = { w: 2200, h: 1500 };
const MAX_SCALE = 1.6;

/** Smoothed pan/zoom camera: drag, wheel zoom, pinch zoom, momentum, and "fit whole board". */
export function createCamera(vp, world) {
  let s = 1, X = 0, Y = 0;               // target view
  let cx = 0, cy = 0, cs = 1;            // rendered view (eases toward target)
  let vx = 0, vy = 0, lf = 0.2, lt = 0;  // momentum, ease factor, last move time
  let run = false, down = false, moved = false, sx, sy, ox, oy, pinching = false, pd = 0;
  const pts = new Map();

  const minScale = () => Math.min(innerWidth / WORLD.w, innerHeight / WORLD.h); // whole board visible
  function clamp() {
    const W = innerWidth, H = innerHeight, ww = WORLD.w * s, wh = WORLD.h * s;
    X = ww <= W ? (W - ww) / 2 : Math.min(0, Math.max(W - ww, X));
    Y = wh <= H ? (H - wh) / 2 : Math.min(0, Math.max(H - wh, Y));
  }
  function apply() {
    // Promote the board to its own layer only while it is actually moving.
    world.style.willChange = 'transform';
    if (!run) { run = true; requestAnimationFrame(tick); }
  }
  function tick() {
    const coasting = Math.abs(vx) > 0.15 || Math.abs(vy) > 0.15;
    if (!down && !game.cur && coasting) { X += vx; Y += vy; vx *= 0.92; vy *= 0.92; clamp(); }
    cx += (X - cx) * lf; cy += (Y - cy) * lf; cs += (s - cs) * lf;
    world.style.transform = `translate3d(${cx.toFixed(2)}px,${cy.toFixed(2)}px,0) scale(${cs.toFixed(4)})`;
    if (Math.abs(X - cx) > 0.15 || Math.abs(Y - cy) > 0.15 || Math.abs(s - cs) > 0.0004 || (!game.cur && coasting)) requestAnimationFrame(tick);
    else { run = false; world.style.willChange = 'auto'; }
  }
  function center() {
    s = Math.max(minScale(), 1);
    X = innerWidth / 2 - 1100 * s; Y = innerHeight / 2 - 780 * s; clamp();
    cx = X; cy = Y; cs = s; apply();
  }
  /** Zoom to scale `ns`, keeping the world point under (px, py) fixed. */
  function zoomAt(ns, px, py) {
    ns = Math.min(MAX_SCALE, Math.max(minScale(), ns));
    const wx = (px - cx) / cs, wy = (py - cy) / cs;
    s = ns; X = px - wx * ns; Y = py - wy * ns;
    vx = vy = 0; lf = 0.2; clamp(); apply();
    $('hint').style.opacity = 0;
  }

  vp.addEventListener('pointerdown', (e) => {
    if (game.locked) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 2) {                       // two fingers: pinch zoom
      const [a, b] = [...pts.values()];
      pd = Math.hypot(a.x - b.x, a.y - b.y); pinching = true; down = false; moved = true;
      return;
    }
    down = true; moved = false; sx = e.clientX; sy = e.clientY; ox = X; oy = Y; vx = vy = 0; lf = 0.35;
  });
  let pending = null, pendingRaf = 0;
  function applyMove() {
    pendingRaf = 0;
    const e = pending; pending = null;
    if (!e || !down) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (!moved && Math.hypot(dx, dy) > 6) { moved = true; vp.classList.add('drag'); $('hint').style.opacity = 0; }
    if (moved) {
      const pX = X, pY = Y;
      X = ox + dx; Y = oy + dy; clamp();
      vx = (X - pX) * 0.6 + vx * 0.4; vy = (Y - pY) * 0.6 + vy * 0.4;
      lt = performance.now(); apply();
    }
  }
  addEventListener('pointermove', (e) => {
    if (pts.has(e.pointerId)) pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinching && pts.size === 2) {
      const [a, b] = [...pts.values()], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pd) zoomAt(s * (d / pd), (a.x + b.x) / 2, (a.y + b.y) / 2);
      pd = d; return;
    }
    if (!down) return;
    // Coalesce pointer events to one update per frame (high-rate mice/trackpads).
    pending = e;
    if (!pendingRaf) pendingRaf = requestAnimationFrame(applyMove);
  });
  const release = (e) => {
    pts.delete(e.pointerId);
    if (pts.size < 2) pinching = false;
    if (down) {
      if (pendingRaf) { cancelAnimationFrame(pendingRaf); pendingRaf = 0; }
      if (pending) { pendingRaf = 0; applyMove(); }   // flush the last coalesced move
      down = false; lf = 0.2; vp.classList.remove('drag');
      if (!moved || performance.now() - lt > 80) vx = vy = 0;
      apply();
    }
    setTimeout(() => (moved = false), 0);
  };
  addEventListener('pointerup', release);
  addEventListener('pointercancel', release);
  vp.addEventListener('wheel', (e) => {
    if (game.locked || game.cur) return;
    e.preventDefault();
    const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    if (e.shiftKey) { X -= dy; vx = vy = 0; lf = 0.18; clamp(); apply(); return; }   // shift+wheel pans sideways
    zoomAt(s * Math.exp(-dy * (e.ctrlKey ? 0.01 : 0.0015)), e.clientX, e.clientY);    // wheel / trackpad pinch zooms
  }, { passive: false });
  addEventListener('resize', () => { if (!game.cur) { s = Math.max(minScale(), s); clamp(); apply(); } });

  return {
    center,
    wasDrag: () => moved,
    snapshot: () => ({ X, Y, s }),
    restore(v) { X = v.X; Y = v.Y; s = v.s; lf = 0.1; apply(); },
    zoomBy: (f) => zoomAt(s * f, innerWidth / 2, innerHeight / 2),
    /** Zoom all the way out so the full board is visible. */
    fit: () => zoomAt(minScale(), innerWidth / 2, innerHeight / 2),
    /** Zoom so `it` fills the free area beside the side panel. */
    focus(it) {
      const W = innerWidth, H = innerHeight, m = W < 760, aw = m ? W : W - 470, ah = m ? H * 0.4 : H;
      s = Math.min(1.9, (aw * 0.8) / it.w, (ah * 0.78) / it.h);
      X = aw / 2 - it.x * s; Y = (m ? H * 0.22 : H * 0.5) - it.y * s;
      lf = 0.09; vx = vy = 0; apply();
    },
  };
}
