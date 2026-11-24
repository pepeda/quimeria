// v12: comic-page intro for bosses and comic-page ultimate attack.
const fs = require('fs');
const P = __dirname + '/joc-bestioles.html';
let s = fs.readFileSync(P, 'utf8');
function must(c, m) { if (!c) { console.error('FAIL: ' + m); process.exit(1); } }
function rep(a, b) { const n = s.split(a).length - 1; must(n === 1, 'expected once (' + n + '): ' + a.slice(0, 90)); s = s.replace(a, () => b); }
rep('function scheduleTick(){', 'function scheduleTick0(){');
rep('function battleTick(){', 'function battleTick1(){');
rep('function showEvent(e){', "function showEvent(e){\n  if(e.t==='ult'){var c0=$('caption');if(c0){c0.classList.add('them');c0.classList.remove('us');c0.textContent=e.txt}mangaUlt(e,function(){bossFx(e);impact();sfx($('squad'),'KRAAAAK!','w',1);anim($('squad'),'shake')});return}");
rep("setTimeout(next,((e.t==='ehit'&&e.strong)", "setTimeout(next,e.t==='ult'?(RM?500:3500):((e.t==='ehit'&&e.strong)");
const css = `
.mseq{position:absolute;inset:0;z-index:60;background:#0D0B12;padding:10px;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1.1fr 1fr 1.2fr;gap:8px;cursor:pointer}
.mp{position:relative;overflow:hidden;border:4px solid #000;box-shadow:0 0 0 2px #fff;opacity:0;animation:panelIn .35s ease-out forwards;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;min-height:0}
.mp.wide{grid-column:1/-1}
.mp::after{content:"";position:absolute;inset:0;background:radial-gradient(rgba(0,0,0,.22) 1.3px,transparent 1.8px) 0 0/6px 6px;pointer-events:none}
.mbox{position:absolute;left:8px;top:8px;background:#fff;border:3px solid #000;padding:4px 9px;font-weight:800;font-size:14px;max-width:85%;color:#111;z-index:3;line-height:1.2}
.mname{font-family:'Bangers','Baloo 2',sans-serif;font-size:36px;letter-spacing:.04em;color:#fff;-webkit-text-stroke:2px #000;paint-order:stroke;text-align:center;line-height:1;z-index:2;position:relative;padding:0 8px;transform:skewX(-10deg)}
.mp[style*="#fff"] .mname{color:#C0392B}
.mdesc{font-size:13px;font-weight:700;color:#111;text-align:center;padding:0 12px;z-index:2;position:relative;line-height:1.3}
.mteam{display:flex;gap:6px;justify-content:center;z-index:2;position:relative}
.mscared{position:relative;display:inline-block;animation:shake .3s linear infinite}
.mscared b{position:absolute;right:-6px;top:-8px;font-family:'Bangers',sans-serif;color:#C0392B;font-size:18px}
.msil .cr{filter:brightness(0) drop-shadow(0 0 6px #FF3B30) drop-shadow(0 0 2px #FF3B30)!important}
.meyes{position:absolute;left:50%;top:50%;transform:translate(-50%,-46%)}
.meyes .cr{filter:drop-shadow(0 0 10px var(--cc)) contrast(1.3)!important}
.mfoe{animation:foeIn .5s cubic-bezier(.2,1.4,.4,1) both;z-index:2;position:relative}
.mcrack{position:absolute;inset:0;width:100%;height:100%}
.mskip{position:absolute;right:14px;bottom:4px;color:#fff;font-size:12px;font-weight:800;z-index:5}
@keyframes panelIn{0%{opacity:0;transform:scale(1.18) rotate(-1.5deg)}100%{opacity:1;transform:none}}
`;
rep('.shield{display:none;', css + '.shield{display:none;');
rep('/* ================= COMMENTS ================= */', fs.readFileSync(__dirname + '/v12-js.txt', 'utf8') + '\n/* ================= COMMENTS ================= */');
fs.writeFileSync(P, s);
console.log('patched v12, size', s.length);
