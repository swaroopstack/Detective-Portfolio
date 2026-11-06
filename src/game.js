import { $ } from './lib/dom.js';
import { IMG } from './assets/index.js';
import { game } from './state.js';
import { ME } from './config/profile.js';
import { ITEMS } from './data/evidence.js';
import { INTRO } from './data/dialogue.js';
import { ambient, sfx } from './lib/audio.js';
import { say, hideDialogue, isShowing, advance } from './components/Dialogue.js';
import { showPanel, hidePanel } from './components/SidePanel.js';
import { hidePreview } from './components/LinkPreview.js';
import { resumeDust } from './components/DustCanvas.js';

let camera;

/** Wires the interaction flow: Start -> intro -> explore -> inspect -> close -> detective comment. */
export function initGame(cam) {
  camera = cam;
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeEvidence();
    if ((e.key === ' ' || e.key === 'Enter') && isShowing()) { e.preventDefault(); advance(); }
    if (game.locked || game.cur) return;
    if (e.key === '+' || e.key === '=') camera.zoomBy(1.25);
    else if (e.key === '-' || e.key === '_') camera.zoomBy(0.8);
    else if (e.key === '0') camera.fit();
  });
}

export function startGame() {
  try { ambient(); } catch { /* audio unavailable: the game still works silently */ }
  sfx('c');
  preloadPreviews();
  $('start').classList.add('out');
  setTimeout(() => {
    $('start').style.display = 'none';
    game.locked = false;               // the board is usable straight away
    resumeDust();
    say(INTRO);                        // one box, fades when the user moves the board
    $('hint').style.opacity = 1;
    setTimeout(() => ($('hint').style.opacity = 0), 7000);
  }, 1000);
}

export const canOpen = () => !camera.wasDrag() && !game.locked;

export function openEvidence(it) {
  game.cur = it; game.prev = camera.snapshot(); game.locked = true;
  sfx('p'); $('hint').style.opacity = 0;
  ITEMS.forEach((o) => o.el.classList.toggle('dim', o !== it));
  it.el.classList.add('focus'); hideDialogue();
  camera.focus(it);
  setTimeout(() => showPanel(it), 550);
}

export function closeEvidence() {
  if (!game.cur) return;
  const it = game.cur;
  hidePreview(); sfx('p'); hidePanel();
  ITEMS.forEach((o) => o.el.classList.remove('dim'));
  it.el.classList.remove('focus');
  camera.restore(game.prev);
  game.cur = null;
  const first = !game.seen.has(it.id);
  game.seen.add(it.id); it.el.classList.add('seen');
  setTimeout(() => {
    const lines = [...it.say];
    const all = ITEMS.filter((o) => o.id !== 'suspect').every((o) => game.seen.has(o.id));
    if (all && first && it.id !== 'suspect') lines.push('That’s every piece of evidence on the board. Case closed: ' + ME.name + ' is exactly who you’re looking for. Want to talk? The envelope is still pinned up there.');
    game.locked = false;
    resumeDust();
    say(lines);
  }, 700);
}

/** Fetch the hover-preview screenshots while the browser is idle so the first hover is instant. */
function preloadPreviews() {
  const idle = window.requestIdleCallback || ((f) => setTimeout(f, 1500));
  idle(() => [IMG.gh, IMG.lc, IMG.gst].forEach((u) => { new Image().src = u; }));
}
