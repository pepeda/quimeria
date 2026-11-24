// v9: forge with item tiers, harder enemies scaled by equipment, enemy cut-ins, green/red caption, battle on one screen.
const fs = require('fs');
const P = __dirname + '/joc-bestioles.html';
let s = fs.readFileSync(P, 'utf8');
function must(c, m) { if (!c) { console.error('FAIL: ' + m); process.exit(1); } }
function removeFn(name) {
  const key = '\nfunction ' + name + '(';
  const a = s.indexOf(key); must(a >= 0, 'fn not found ' + name); must(s.indexOf(key, a + 1) < 0, 'fn twice ' + name);
  const b = Math.min(...['\nfunction ', '\nvar ', '\n/* ', '\ndocument.', '\n})();'].map(m => s.indexOf(m, a + 1)).filter(i => i > 0));
  s = s.slice(0, a) + s.slice(b);
}
function rep(a, b) { const n = s.split(a).length - 1; must(n === 1, 'expected once (' + n + '): ' + a.slice(0, 90)); s = s.replace(a, () => b); }
['scMotxilla', 'itemStats'].forEach(removeFn);
// all item lookups go through IT(), which understands tiers ("espasaFusta#2")
s = s.replace(/ITEMS\[([^\]]+)\]/g, 'IT($1)');
// equip by id (items are grouped now)
rep("case 'equip':var k=G.items[+d.i];if(!IT(k))break;var sl=d.slot;if(G.equip[sl])G.items.push(G.equip[sl]);G.equip[sl]=k;G.items.splice(+d.i,1);toast(IT(k).n+' equipat.');break;",
  "case 'equip':var ix=G.items.indexOf(d.id);if(ix<0||!IT(d.id))break;var sl=d.slot;G.items.splice(ix,1);if(G.equip[sl])G.items.push(G.equip[sl]);G.equip[sl]=d.id;toast(IT(d.id).n+' equipat.');break;\n" +
  "    case 'forge':var nid=baseOf(d.id)+'#'+(tierOf(d.id)+1);if(forgeOnce(d.id))toast('Forjat: '+IT(nid).n+' ('+TIER_N[tierOf(nid)]+')!');break;\n" +
  "    case 'forgeAll':var nf=forgeAll();toast(nf?'Has forjat '+nf+' objecte'+(nf>1?'s':'')+'!':'No hi ha res per forjar.');break;");
// harder enemies, also scaled by the team's equipment
rep("return 1+0.55*st+0.04*ml}", "var q=bonusPct(G.equip);return (1+0.55*st+0.04*ml)*(1+(q.atk+q.def+q.hp)/400)}");
rep("return {hp:Math.round((70+45*L)*s*(guardian?1.8:1)),atk:Math.round((7+3.2*L)*", "return {hp:Math.round((85+50*L)*s*(guardian?1.8:1)),atk:Math.round((8+3.8*L)*");
// longer pause for big enemy moves
rep("setTimeout(next,e.t==='combo'?(RM?300:1500)", "setTimeout(next,((e.t==='ehit'&&e.strong)||e.t==='aoe'||e.t==='enrage')?(RM?200:1500):e.t==='combo'?(RM?300:1500)");
// our cut-ins say whose move it is
rep("ci.innerHTML='<div class=\"lines\"></div><div class=\"who\">'", "ci.innerHTML='<div class=\"lines\"></div><div class=\"side\">EL TEU EQUIP</div><div class=\"who\">'");
rep("<div class=\"lines\"></div><div class=\"pair\">", "<div class=\"lines\"></div><div class=\"side\">EL TEU EQUIP</div><div class=\"pair\">");
rep("function showEvent(e){", "function showEventNow(e){");
// battle on one screen: compact header, result box on top of the stage, smaller art, scroll to top
rep("var e=r.event,body='',showTeam=true;", "var e=r.event,body='',showTeam=true;\n  if(e&&e.type==='battle')head='<div class=\"row between small\" style=\"font-weight:800\"><span>'+esc(ZONES[r.world][r.zone||0])+' \\u00b7 lloc '+(r.i+1)+' de '+r.slots.length+'</span>'+starStr(starsN(r.L))+'</div>';");
s = s.split("<div class=\"event\" style=\"color:var(--ink)\">").join("<div class=\"event result\" style=\"color:var(--ink)\">");
rep("'</div>'}).join('')+'</div></div>'+res;", "'</div>'}).join('')+'</div>'+res+'</div>';");
rep("var art=en.wild?spArt(en.wild,'',92):monster(en.el,92,en.guardian);", "var art=en.wild?spArt(en.wild,'',76):monster(en.el,76,en.guardian);");
rep("cArt(c,44)+'<span>'+esc(cName(c))+'</span>'+roleTag", "cArt(c,36)+'<span>'+esc(cName(c))+'</span>'+roleTag");
rep("var ev=battleTick();persist();playEvents(ev,function(){var b=r.event;if(b.over)render();else scheduleTick()})", "var ev=battleTick();persist();playEvents(ev,function(){var b=r.event;if(b.over){render();var sc=$('screen');if(sc)sc.scrollTop=0}else scheduleTick()})");
rep("if(a==='nav'||a==='fork'||a==='choice'||a==='claim'||a==='next'||a==='skip'||a==='bwin'||a==='go'){var sc=$('screen');if(sc)sc.scrollTop=0}",
  "if(['nav','fork','choice','claim','next','skip','bwin','go','wfight','gfight','mfight','mleave','blose','restartNow','join','wfeed','efight'].indexOf(a)>=0){var sc=$('screen');if(sc)sc.scrollTop=0}");
rep("spArt(e.sp,'',150)", "spArt(e.sp,'',120)");
rep(".bigcard .art{width:100%;height:190px;", ".bigcard .art{width:100%;height:150px;");
// css
rep(".shield{display:none;", ".stage .result{position:absolute;left:10px;right:10px;top:10px;z-index:9;box-shadow:0 10px 30px rgba(0,0,0,.45)}\n" +
  ".caption.us{background:rgba(61,220,132,.3)}.caption.them{background:rgba(255,80,70,.42)}\n" +
  ".cutin .side{position:absolute;top:7%;left:0;right:0;text-align:center;font-family:var(--display);font-weight:800;font-size:17px;letter-spacing:.2em;color:#fff}\n" +
  ".cutin.enemy{background:repeating-linear-gradient(135deg,#1B0A0A 0 18px,#5A0F0F 18px 36px)}\n" +
  ".cutin.enemy .lines{background:repeating-conic-gradient(from 0deg,rgba(255,70,60,.55) 0deg 3deg,transparent 3deg 11deg)}\n" +
  ".cutin.enemy .sname{color:#FFE08A;-webkit-text-stroke:2px #5A0F0F;font-size:38px}\n" +
  ".cutin .foeIn{animation:foeIn .45s cubic-bezier(.2,1.4,.4,1) both,shake .3s linear .5s 2}\n" +
  "@keyframes foeIn{0%{transform:translateY(-140%) scale(1.6)}100%{transform:translateY(0) scale(1.6)}}\n" +
  ".stage{gap:8px}.ab-row span{font-size:9.5px}\n.shield{display:none;");
rep('/* ================= COMMENTS ================= */', fs.readFileSync(__dirname + '/v9-js.txt', 'utf8') + '\n/* ================= COMMENTS ================= */');
fs.writeFileSync(P, s);
console.log('patched v9, size', s.length);
