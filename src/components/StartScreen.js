import { $ } from '../lib/dom.js';
import { IMG } from '../assets/index.js';
import { ALLEY } from '../visuals/alley.js';

export const markup = `<section id="start"><div class="flk2"></div><div class="warm"></div>
<div class="alleyp"><div id="al1"></div></div>
<div class="emb"><img class="fig" alt="" decoding="async" src="${IMG.fig}"></div>
<div class="hl"><p>INTERN SHIPS 8+ REACT COMPONENTS</p><svg viewBox="0 0 260 120" preserveAspectRatio="none"><ellipse cx="130" cy="60" rx="124" ry="54" fill="none" stroke="#c0281f" stroke-width="5" pathLength="1"/></svg></div>
<div class="magw"><div class="lens"><div id="al2"></div></div><img class="mgS" alt="" src="${IMG.magS}"></div>
<div class="ttl"><div class="cs">Case File No. 001 · Under Investigation</div><h1><span>THE</span><em id="nm"></em></h1>
<svg class="fl" viewBox="0 0 400 24"><path d="M4 12H150M250 12H396" stroke="#f4d03f" stroke-width="4"/><path d="M150 12c20-16 30 16 50 0s30 16 50 0" fill="none" stroke="#f4d03f" stroke-width="4"/></svg></div>
<div class="tg">A game of<br>code, mystery<br>&amp; deduction!</div>
<button class="pbtn" id="go">▶ Start Game</button><div class="badge">A Portfolio<br>Game</div></section>`;

export function initStartScreen(onStart) {
  $('nm').textContent = 'SUSPECT';
$('al1').innerHTML=`<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">${ALLEY}</svg><div class="rn"></div>`;
$('al2').innerHTML=`<svg viewBox="150 276 112 112" width="100%" height="100%">${ALLEY}</svg>`;
  $('go').onclick = onStart;
}
