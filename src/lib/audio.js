import { $ } from './dom.js';

let AC,MG,snd=true,amb=false;
function ac(){if(!AC){AC=new (window.AudioContext||window.webkitAudioContext)();MG=AC.createGain();MG.gain.value=snd?.5:0;MG.connect(AC.destination)}if(AC.state=='suspended')AC.resume();return AC}
function nb(sec,br){const b=AC.createBuffer(1,AC.sampleRate*sec,AC.sampleRate),d=b.getChannelData(0);let l=0;for(let i=0;i<d.length;i++){const w=Math.random()*2-1;if(br){l=(l+.02*w)/1.02;d[i]=l*3.5}else d[i]=w}return b}
function ambient(){if(amb)return;amb=true;ac();[['bandpass',3000,.03],['lowpass',700,.05]].forEach(c=>{const o=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();o.buffer=nb(4);o.loop=true;f.type=c[0];f.frequency.value=c[1];g.gain.value=c[2];o.connect(f).connect(g).connect(MG);o.start()});(function lp(){setTimeout(()=>{thunder();lp()},12000+Math.random()*25000)})()}
function thunder(){const fl=$('flash');fl.classList.remove('on');void fl.offsetWidth;fl.classList.add('on');if(!AC)return;const t=AC.currentTime+.25,o=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();o.buffer=nb(6,true);f.type='lowpass';f.frequency.value=200;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.4,t+.5);g.gain.exponentialRampToValueAtTime(.001,t+5.5);o.connect(f).connect(g).connect(MG);o.start(t)}
function sfx(k){if(!snd)return;try{ac();const n=k=='p'?9000:2500,b=AC.createBuffer(1,n,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);const o=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();o.buffer=b;f.type='bandpass';f.frequency.value=k=='p'?1800:600;g.gain.value=.25;o.connect(f).connect(g).connect(MG);o.start()}catch(e){}}

export function toggleSound() {
  snd = !snd;
  if (MG) MG.gain.setTargetAtTime(snd ? 0.5 : 0, AC.currentTime, 0.1);
  return snd;
}
export { ambient, sfx, thunder };
