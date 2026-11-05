import { $ } from '../lib/dom.js';
import { IMG } from '../assets/index.js';
import { ITEMS } from '../data/evidence.js';
import { D, STAINS, SCR } from '../data/decor.js';
import { LINKS, XL } from '../data/connections.js';
import { V } from '../visuals/evidence.js';
import { DH } from '../visuals/props.js';
import { torn } from '../utils/torn.js';

const PIN = () => 'p' + (1 + Math.floor(Math.random() * 3));
const CLIPPED = ['github', 'contact', 'ach', 'research', 'edu'];

export const markup = `<div id="vp"><div id="world"><div id="board"></div><svg id="strings" width="2200" height="1500"></svg></div></div>
<div class="spot"></div><div class="vig"></div><div id="lite"></div>

<div id="hint">Drag to explore · Scroll to zoom · Click evidence</div>`;

/** Builds the decor, evidence items and red strings inside #world. */
export function mountBoard({ canOpen, onOpen }) {
  const world = $('world');
  const by = {};
D.forEach(d=>{const e=document.createElement('div');e.className='dc';e.style.cssText=`left:${d[1]}px;top:${d[2]}px;width:${d[3]}px;height:${d[4]}px;--r:${d[5]}deg`;e.innerHTML=`<div class="in"><div class="w" style="clip-path:${['key','bag'].includes(d[0])?'none':torn()};--cx:${30+Math.random()*40}%">${DH[d[0]](d)}</div></div>${d[0]=='key'?'':`<div class="pin ${PIN()}"></div>`}`;world.appendChild(e)});
STAINS.forEach(p=>{const e=document.createElement('div');e.className='stain';e.style.cssText=`left:${p[0]}px;top:${p[1]}px;transform:scale(${.6+Math.random()*.8})`;world.appendChild(e)});
ITEMS.forEach(it=>{by[it.id]=it;const e=document.createElement('div');e.className='item';e.style.cssText=`left:${it.x}px;top:${it.y}px;width:${it.w}px;height:${it.h}px;--r:${it.r}deg`;
e.innerHTML=`<div class="tip">${it.tip.toUpperCase()}</div><div class="in"><div class="w" style="clip-path:${torn()};--cx:${30+Math.random()*40}%">${V[it.id]()}</div>${['suspect','projects'].includes(it.id)?'<div class="tape"></div>':''}${CLIPPED.includes(it.id)?`<img class="pclip" alt="" src="${IMG.paperclip}">`:''}<div class="seal">REVIEWED</div></div><div class="pin ${PIN()}"></div>`;
e.onclick=()=>{if(!canOpen())return;onOpen(it)};it.el=e;world.appendChild(e)});
  const mgd=new Image();mgd.src=IMG.magD;mgd.className='mgd';world.appendChild(mgd);
  function pt(r){return typeof r=='number'?{x:D[r][1],y:D[r][2]-D[r][4]/2}:{x:by[r].x,y:by[r].y-by[r].h/2}}
const seg=(a,b,g)=>{const p=`M${a.x} ${a.y}Q${(a.x+b.x)/2} ${(a.y+b.y)/2+g} ${b.x} ${b.y}`;return `<path class="sh" d="${p}"/><path class="y" d="${p}"/><path class="t" d="${p}"/>`};
function drawStrings(){let d=SCR;XL.forEach(([a,b],i)=>d+=`<g class="${i%4==0?'wh':'th'}">${seg(pt(a),pt(b),30+(i*37)%80)}</g>`);LINKS.forEach(([a,b],i)=>d+=seg(pt(a),pt(b),40+(i*23)%60));$('strings').innerHTML=d}drawStrings();
}
