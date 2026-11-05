import { $ } from '../lib/dom.js';
import { game } from '../state.js';
import { hideDialogue } from './Dialogue.js';

const icon = (d) => `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;

export const markup = `<div id="zoom">
<button data-z="in" title="Zoom in (+)" aria-label="Zoom in">${icon('M12 5v14M5 12h14')}</button>
<button data-z="out" title="Zoom out (-)" aria-label="Zoom out">${icon('M5 12h14')}</button>
<button data-z="fit" title="Show the full board (0)" aria-label="Show the full board">${icon('M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5')}</button></div>`;

export function initZoomControls(camera) {
  $('zoom').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b || game.locked || game.cur) return;
    hideDialogue();
    const z = b.dataset.z;
    if (z === 'in') camera.zoomBy(1.3);
    else if (z === 'out') camera.zoomBy(1 / 1.3);
    else camera.fit();
  });
}
