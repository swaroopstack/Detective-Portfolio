import { $ } from '../lib/dom.js';
import { PV } from '../visuals/previews.js';

export const markup = '<div id="pvw"></div>';

let pvw;
export const hidePreview = () => pvw && pvw.classList.remove('on');

export function initLinkPreview() {
  pvw = $('pvw');
let pvT,pvOn=false,pvA=null;const PW={lc:560,gh:560,p1:480};
function pvPlace(a){const w=Math.min(PW[a.dataset.pv]||340,innerWidth-24);pvw.style.width=w+'px';pvw.innerHTML=PV[a.dataset.pv]();const h=pvw.offsetHeight,r=a.getBoundingClientRect();let l=Math.max(12,Math.min(innerWidth-w-12,r.left+r.width/2-w/2)),t=r.top-h-12,up=true;if(t<12){t=r.bottom+12;up=false}pvw.style.left=l+'px';pvw.style.top=t+'px';pvw.style.right='auto';pvw.style.transformOrigin=(r.left+r.width/2-l)+'px '+(up?'100%':'0')}
document.addEventListener('mouseover',e=>{const a=e.target.closest&&e.target.closest('[data-pv]');if(!a||!$('panel').contains(a)||!PV[a.dataset.pv])return;clearTimeout(pvT);pvA=a;pvT=setTimeout(()=>{pvPlace(a);pvw.classList.add('on');pvOn=true},pvOn?0:380)});
document.addEventListener('mouseout',e=>{if(e.target.closest&&e.target.closest('[data-pv]')){clearTimeout(pvT);pvT=setTimeout(()=>{pvw.classList.remove('on');pvOn=false;pvw.style.translate='0 0'},260)}});
document.addEventListener('mousemove',e=>{if(!pvOn||!pvA)return;const a=e.target.closest&&e.target.closest('[data-pv]');if(a!==pvA)return;const r=a.getBoundingClientRect();pvw.style.translate=((e.clientX-r.left-r.width/2)*.06)+'px '+((e.clientY-r.top-r.height/2)*.12)+'px'});
}
