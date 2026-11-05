import { $ } from '../lib/dom.js';
import { toggleSound } from '../lib/audio.js';

export const markup = `</head><body>
<button id="snd" title="Sound on/off"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9v6h4l5 4V5L7 9z" fill="currentColor"/><path class="wv" d="M16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12"/><path class="x" d="M16 9l6 6M22 9l-6 6"/></svg></button><div id="flash"></div>`;

export function initSoundToggle() {
  $('snd').onclick = () => $('snd').classList.toggle('off', !toggleSound());
}
