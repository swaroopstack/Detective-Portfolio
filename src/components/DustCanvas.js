import { $ } from '../lib/dom.js';

export const markup = '<canvas id="dust"></canvas>';

export function startDust() {
(()=>{const c=$('dust'),g=c.getContext('2d');let w,h,p=[];const r=()=>{w=c.width=innerWidth;h=c.height=innerHeight;p=Array.from({length:36},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.6+.4,a:Math.random()*6.3}))};r();addEventListener('resize',r);
(function f(){g.clearRect(0,0,w,h);g.fillStyle='#ffe3b0';p.forEach(d=>{d.a+=.01;d.x+=Math.sin(d.a)*.3;d.y-=.15;if(d.y<0)d.y=h;g.globalAlpha=.25+Math.sin(d.a*2)*.2;g.beginPath();g.arc(d.x,d.y,d.r,0,6.3);g.fill()});requestAnimationFrame(f)})()})();
}
