import { $ } from '../lib/dom.js';
import { perf, setLow } from '../lib/perf.js';

export const markup = '<button id="fx" aria-label="Toggle visual effects">FX</button>';

function sync() {
  const b = $('fx');
  b.classList.toggle('off', perf.low);
  b.title = perf.low ? 'Effects reduced (click for full quality)' : 'Full effects (click to reduce for smoother performance)';
}

export function initQualityToggle() {
  $('fx').onclick = () => setLow(!perf.low, true);
  addEventListener('perfchange', sync);
  sync();
}
