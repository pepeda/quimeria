'use strict';
/* ================= SOUNDS AND VIBRATION ================= */
try{document.title='Quimèria'}catch(e){}
function curZone(){var r=run();return r?(r.zone||0):-1}
/* --- forge: choose 1 power out of 3 --- */
function scrollTop0(){try{var sc=$('screen');if(sc&&sc.scrollTo)sc.scrollTo(0,0);window.scrollTo&&window.scrollTo(0,0)}catch(e){}}
/* --- short sounds (WebAudio, under 0.2 s), vibration on big moments, a switch to turn them off --- */
var AC=null;
function snd(kind){if(G.mute)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();var t=AC.currentTime;
  var P={tap:[[660,0.05]],hit:[[220,0.06]],crit:[[180,0.05],[360,0.07]],heal:[[523,0.06],[784,0.08]],combo:[[392,0.06],[523,0.06],[784,0.1]],big:[[130,0.12],[98,0.18]],win:[[523,0.08],[659,0.08],[784,0.14]],lose:[[300,0.12],[200,0.18]],evolve:[[392,0.07],[523,0.07],[659,0.07],[1047,0.16]],forge:[[880,0.05],[1320,0.09]]}[kind];if(!P)return;
  P.forEach(function(p,i){var o=AC.createOscillator(),g=AC.createGain();o.type=kind==='big'||kind==='hit'?'square':'triangle';o.frequency.value=p[0];var s0=t+i*0.07;g.gain.setValueAtTime(0.0001,s0);g.gain.exponentialRampToValueAtTime(0.12,s0+0.01);g.gain.exponentialRampToValueAtTime(0.0001,s0+p[1]);o.connect(g);g.connect(AC.destination);o.start(s0);o.stop(s0+p[1]+0.02)})}catch(e){}}
function buzz(p){if(G.mute)return;try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}}
(function(){try{var st=document.createElement('style');st.textContent='.ab-row span{font-size:12px!important}.mtabs{display:flex;gap:6px;overflow-x:auto;margin:4px 0 10px}.mtab{position:relative;flex:1 0 auto;min-height:44px;border:2px solid #1E1B2E;background:#fff;border-radius:12px;font-weight:800;font-size:13px;padding:6px 10px;color:#1E1B2E}.mtab.on{background:#1E1B2E;color:#fff}.rdot{position:absolute;top:4px;right:6px;width:10px;height:10px;border-radius:50%;background:#E5322D;border:2px solid #fff}.navb{position:relative}';document.head.appendChild(st)}catch(e){}})();

