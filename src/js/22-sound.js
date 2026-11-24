'use strict';
/* ================= SOUNDS AND VIBRATION ================= */
try{document.title='Quimèria'}catch(e){}
function curZone(){var r=run();return r?(r.zone||0):-1}
/* --- forge: choose 1 power out of 3 --- */
function scrollTop0(){try{var sc=$('screen');if(sc&&sc.scrollTo)sc.scrollTo(0,0);window.scrollTo&&window.scrollTo(0,0)}catch(e){}}
/* --- sounds: the generated beeps were removed (the family did not like them). snd() is kept as the one place to play real
   sound files later; vibration on big moments stays, with a switch to turn it off --- */
function snd(kind){}
function buzz(p){if(G.mute)return;try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}}
(function(){try{var st=document.createElement('style');st.textContent='.ab-row span{font-size:12px!important}.mtabs{display:flex;gap:6px;overflow-x:auto;margin:4px 0 10px}.mtab{position:relative;flex:1 0 auto;min-height:44px;border:2px solid #1E1B2E;background:#fff;border-radius:12px;font-weight:800;font-size:13px;padding:6px 10px;color:#1E1B2E}.mtab.on{background:#1E1B2E;color:#fff}.rdot{position:absolute;top:4px;right:6px;width:10px;height:10px;border-radius:50%;background:#E5322D;border:2px solid #fff}.navb{position:relative}';document.head.appendChild(st)}catch(e){}})();

