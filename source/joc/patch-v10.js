// v10: comic/manga look for every battle effect (sound-word bursts, impact frames, halftone, ink outlines, comic font).
const fs = require('fs');
const P = __dirname + '/joc-bestioles.html';
let s = fs.readFileSync(P, 'utf8');
function must(c, m) { if (!c) { console.error('FAIL: ' + m); process.exit(1); } }
function rep(a, b) { const n = s.split(a).length - 1; must(n === 1, 'expected once (' + n + '): ' + a.slice(0, 90)); s = s.replace(a, () => b); }
rep('family=Baloo+2:wght@600;800&family=Nunito:wght@600;700;800&display=swap', 'family=Baloo+2:wght@600;800&family=Nunito:wght@600;700;800&family=Bangers&display=swap');
const css = `
.sfx{position:absolute;top:-6px;transform:translate(-50%,0) rotate(var(--rot,0deg));font-family:'Bangers','Baloo 2',sans-serif;font-size:26px;letter-spacing:.04em;padding:8px 14px;color:#1E1B2E;background:#FFE14D;clip-path:polygon(0% 22%,12% 0%,25% 15%,40% 0%,52% 14%,68% 0%,78% 16%,100% 6%,90% 32%,100% 52%,88% 66%,100% 92%,74% 82%,60% 100%,46% 84%,30% 100%,20% 82%,0% 94%,8% 62%,0% 44%,10% 34%);z-index:7;pointer-events:none;white-space:nowrap;line-height:1;animation:sfxIn 1s ease-out forwards}
.sfx.r{background:#FF4A2E;color:#fff}.sfx.w{background:#fff;color:#C0392B}.sfx.b{background:#7CC0FF}.sfx.g{background:#9BE36B}
.sfx.big{font-size:40px;padding:10px 18px}
.sfx.stay{left:72%;top:8px;animation:sfxStay .5s ease-out forwards;font-size:24px}
@keyframes sfxIn{0%{transform:translate(-50%,0) rotate(var(--rot,0deg)) scale(.2);opacity:0}15%{transform:translate(-50%,0) rotate(var(--rot,0deg)) scale(1.3);opacity:1}30%{transform:translate(-50%,0) rotate(var(--rot,0deg)) scale(1)}80%{opacity:1}100%{opacity:0;transform:translate(-50%,-12px) rotate(var(--rot,0deg)) scale(1.05)}}
@keyframes sfxStay{0%{transform:translate(-50%,0) rotate(-8deg) scale(.2)}70%{transform:translate(-50%,0) rotate(-8deg) scale(1.25)}100%{transform:translate(-50%,0) rotate(-8deg) scale(1)}}
.stage.impact{filter:invert(1) contrast(1.5)}
.stage::after{content:"";position:absolute;inset:0;background:radial-gradient(rgba(255,255,255,.08) 1.2px,transparent 1.6px) 0 0/7px 7px;pointer-events:none}
.stage .cr,.cutin .cr,.bigcard .cr{filter:drop-shadow(1.6px 0 0 #111) drop-shadow(-1.6px 0 0 #111) drop-shadow(0 1.6px 0 #111) drop-shadow(0 -1.6px 0 #111)}
.cutin{border:5px solid #111;box-shadow:inset 0 0 0 4px #fff;transform:rotate(-1.5deg)}
.cutin::after{content:"";position:absolute;inset:0;background:radial-gradient(rgba(0,0,0,.3) 1.3px,transparent 1.8px) 0 0/6px 6px;pointer-events:none}
.cutin .sname,.cutin .side{font-family:'Bangers','Baloo 2',sans-serif;letter-spacing:.05em}
.cutin .sname{font-size:40px}
.pop-num{font-family:'Bangers','Baloo 2',sans-serif;-webkit-text-stroke:1.5px #111;paint-order:stroke;letter-spacing:.03em}
.caption{background:#fff;color:#1E1B2E;border:3px solid #111;border-radius:6px}
.caption.us{background:#E6FFEF;border-color:#1F6B35;color:#123D20}.caption.them{background:#FFE3DF;border-color:#9E2B1F;color:#5A140D}
.bigcard{box-shadow:6px 6px 0 #111}
.bigcard .art::after{content:"";position:absolute;inset:0;background:radial-gradient(rgba(0,0,0,.12) 1.2px,transparent 1.6px) 0 0/6px 6px;pointer-events:none}
`;
rep('.shield{display:none;', css + '.shield{display:none;');
const js = `
/* ================= V10: comic / manga effects ================= */
var SFX_EL={foc:'FSSSHH!',aigua:'SPLAAASH!',planta:'KRAC-KRAC!',llamp:'ZZZAAP!',psiquic:'VUUUMMM!'};
function sfx(host,text,tone,big){if(!host)return;var e=document.createElement('span');e.className='sfx '+(tone||'')+(big?' big':'');e.textContent=text;
  e.style.setProperty('--rot',(Math.random()*24-12).toFixed(0)+'deg');e.style.left=(30+Math.random()*40)+'%';host.appendChild(e);setTimeout(function(){e.remove()},RM?900:1100)}
function impact(){var st=$('stage');if(!st||RM)return;st.classList.remove('impact');void st.offsetWidth;st.classList.add('impact');setTimeout(function(){st.classList.remove('impact')},200)}
function mangaFx(e){
  var fa=$('foe-art'),late=RM?0:760;
  if(e.t==='hit')sfx(fa,pickOne(['PAM!','ZAS!','POF!','TOC!']),e.eff==='super'||e.eff==='zap'?'r':'',0);
  else if(e.t==='special'){if(OFFENSIVE.indexOf(e.kind)>=0)setTimeout(function(){sfx($('foe-art'),SFX_EL[e.el]||'BUM!','r',1);impact()},late);
    else setTimeout(function(){sfx($('squad'),e.kind==='shield'?'KLANG!':e.kind==='reflect'?'TZING!':'BRIIILL!','b',1)},late)}
  else if(e.t==='combo')setTimeout(function(){sfx($('foe-art'),'KA-BOOOM!','r',1);impact()},RM?0:950);
  else if(e.t==='ehit')sfx($('m-'+e.tgt),e.strong?'KRAAAAK!':'BAM!','w',e.strong?1:0);
  else if(e.t==='aoe'){sfx($('squad'),'BOOOOM!','w',1);impact()}
  else if(e.t==='dot')sfx(fa,e.kind==='burn'?'FSSS!':'BLURP!','g',0);
  else if(e.t==='stunned')sfx(fa,'@#*!','',0);
  else if(e.t==='foeDown'){sfx(fa,'K.O.!','r',1);impact()}
  else if(e.t==='enrage'){sfx(fa,'GRRRAAAH!','w',1);impact()}
  else if(e.t==='heal')sfx($('m-'+e.tgt),'GLUP!','g',0);
}
`;
rep("if(big){enemyCut(e);setTimeout(function(){showEventNow(e)},RM?100:950);return}\n  showEventNow(e);", "if(big){enemyCut(e);setTimeout(function(){showEventNow(e);mangaFx(e)},RM?100:950);return}\n  showEventNow(e);mangaFx(e);");
rep("<div class=\"art\" style=\"background:'+bg+'\">'", "<div class=\"art\" style=\"background:'+bg+'\"><span class=\"sfx stay\">'+(e.kind==='critter'?'NOVA!':e.kind==='item'?'TXAN!':e.kind==='coins'?'DING!':e.kind==='food'?'ÑAM!':e.kind==='dup'?'REPE!':'OH!')+'</span>'");
rep('/* ================= COMMENTS ================= */', js + '\n/* ================= COMMENTS ================= */');
fs.writeFileSync(P, s);
console.log('patched v10, size', s.length);
