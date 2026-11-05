import { $ } from '../lib/dom.js';

export const markup = `<aside id="panel"><header><small id="pk"></small><h2 id="pt"></h2><div class="cf">CONFIDENTIAL</div></header><div id="pb"></div><button id="close">Close File</button></aside>`;

export function initSidePanel(onClose) {
  $('close').onclick = onClose;
}

export function showPanel(it) {
  $('pk').textContent = 'CASE FILE · ' + it.key.toUpperCase();
  $('pt').textContent = it.title;
  $('pb').innerHTML = it.panel();
  $('pb').scrollTop = 0;
  $('panel').classList.add('open');
}
export const hidePanel = () => $('panel').classList.remove('open');
