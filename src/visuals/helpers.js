import { IMG } from '../assets/index.js';
import { ME } from '../config/profile.js';

export const LK=(k,u,t)=>`<a class="lk" data-pv="${k}" href="${u}" target="_blank" rel="noopener">${t}</a>`;
export const AV=n=>`<div style="flex:none;width:${n}px;height:${n}px;border-radius:50%;background:linear-gradient(135deg,#e0a458,#b3261e);display:flex;align-items:center;justify-content:center;font:700 ${n/2}px var(--cond);color:#fff">${ME.name[0]}</div>`;
export const hm=(c,sd=5,full)=>{let s=sd,h='';for(let i=0;i<156;i++){s=(s*9301+49297)%233280;const v=s/233280;h+=`<i style="background:${full?(v>.6?c:v>.3?c+'cc':c+'88'):(v>.7?c:v>.4?c+'99':v>.25?c+'44':'#ffffff10')}"></i>`}return `<div class="hm">${h}</div>`};
