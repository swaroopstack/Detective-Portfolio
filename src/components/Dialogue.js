import { $ } from '../lib/dom.js';
import { IMG } from '../assets/index.js';

export const markup = `<div id="dlg"><div class="av"><img class="ic" alt="" src="${IMG.icon}"></div>
<div class="nm">Det. Marlowe</div><div id="tx"></div><div class="nx">click to skip</div></div>`;

const TYPE_MS = 18;
let dlg, tx, timer, fadeT, full = '', done = true;

/** Shows ONE dialogue box. Accepts a string or an array (joined into a single box). It never blocks the board. */
export function say(lines) {
  clearInterval(timer); clearTimeout(fadeT);
  full = Array.isArray(lines) ? lines.join(' ') : lines;
  done = false; tx.textContent = ''; dlg.classList.add('show');
  let i = 0;
  timer = setInterval(() => { tx.textContent = full.slice(0, ++i); if (i >= full.length) finish(); }, TYPE_MS);
}
function finish() {
  clearInterval(timer); tx.textContent = full; done = true;
  clearTimeout(fadeT);
  fadeT = setTimeout(hideDialogue, 3500 + full.length * 45); // reading time, then fade away
}
export function hideDialogue() {
  clearInterval(timer); clearTimeout(fadeT); done = true;
  if (dlg) dlg.classList.remove('show');
}
export const isShowing = () => dlg.classList.contains('show');
/** First click/Enter completes the typing, the next one dismisses the box. */
export const advance = () => (done ? hideDialogue() : finish());

export function initDialogue() {
  dlg = $('dlg'); tx = $('tx');
  dlg.onclick = advance;
  // The box fades away as soon as the user drags, scrolls or zooms the board.
  const vp = $('vp'); let pressed = false, sx = 0, sy = 0;
  vp.addEventListener('pointerdown', (e) => { pressed = true; sx = e.clientX; sy = e.clientY; });
  addEventListener('pointermove', (e) => { if (pressed && isShowing() && Math.hypot(e.clientX - sx, e.clientY - sy) > 6) hideDialogue(); });
  addEventListener('pointerup', () => (pressed = false));
  addEventListener('pointercancel', () => (pressed = false));
  vp.addEventListener('wheel', () => hideDialogue(), { passive: true });
}
