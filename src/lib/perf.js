// Adaptive visual quality. Heavy effects are turned off automatically on slow devices
// (and manually with the FX button, ?perf=low / ?perf=high, or prefers-reduced-motion).
const KEY = 'dp-quality';
export const perf = { low: false, forced: false };

const store = {
  get() { try { return localStorage.getItem(KEY); } catch { return null; } },
  set(v) { try { localStorage.setItem(KEY, v); } catch { /* private mode */ } },
};

export function setLow(v, persist = false) {
  perf.low = v;
  document.documentElement.classList.toggle('perf-low', v);
  if (persist) { perf.forced = true; store.set(v ? 'low' : 'high'); }
  dispatchEvent(new Event('perfchange'));
}

export function initPerf() {
  const q = new URLSearchParams(location.search).get('perf') || store.get();
  const mm = (s) => typeof matchMedia === 'function' && matchMedia(s).matches;
  if (q === 'low' || q === 'high') { perf.forced = true; setLow(q === 'low'); return; }
  setLow(mm('(prefers-reduced-motion: reduce)') || mm('(pointer: coarse)') || (navigator.hardwareConcurrency || 8) <= 2);
  watchFrames(60);
}

// Measure the first ~60 frames (start screen); drop to low quality if the device cannot hold ~30fps.
function watchFrames(n) {
  let last = 0, sum = 0, c = 0;
  const f = (t) => {
    if (perf.low || perf.forced) return;
    if (last && t - last < 250) { sum += t - last; c++; }
    last = t;
    if (c < n) requestAnimationFrame(f);
    else if (sum / c > 30) setLow(true);
  };
  requestAnimationFrame(f);
}

// Called by the camera for every frame while the board is moving.
let win = [];
export function sample(dt) {
  if (perf.low || perf.forced || dt <= 0 || dt > 250) return;
  win.push(dt);
  if (win.length >= 45) {
    const avg = win.reduce((a, b) => a + b, 0) / win.length;
    win = [];
    if (avg > 30) setLow(true);
  }
}
