// v11: original bosses with mechanics, group attacks (3+ critters), team attack meter, harder enemies.
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
['findCombo', 'doCombo', 'showCombo'].forEach(removeFn);
rep('function battleTick(){', 'function battleTick0(){');
rep('function makeBattle(o){', 'function makeBattle0(o){');
rep('function outDmg(c,pow,b,r){', 'function outDmg0(c,pow,b,r){');
rep('function updateStatus(){', 'function updateStatus0(){');
rep('acted[cx.A.uid]=acted[cx.B.uid]=1', 'cx.parts.forEach(function(p){acted[p.c.uid]=1})');
rep("return {hp:Math.round((85+50*L)*s*(guardian?1.8:1)),atk:Math.round((8+3.8*L)*", "return {hp:Math.round((95+58*L)*s*(guardian?1.8:1)),atk:Math.round((9+4.2*L)*");
rep("var big=(e.t==='ehit'&&e.strong)||e.t==='aoe'||e.t==='enrage';", "var big=(e.t==='ehit'&&e.strong)||e.t==='aoe'||e.t==='enrage'||e.t==='boss';");
rep("showEventNow(e);mangaFx(e)},RM?100:950);return}\n  showEventNow(e);mangaFx(e);", "showEventNow(e);mangaFx(e);bossFx(e)},RM?100:950);return}\n  showEventNow(e);mangaFx(e);bossFx(e);");
rep("THEM_EV=['ehit','aoe','warn','enrage','wave','teamDown']", "THEM_EV=['ehit','aoe','warn','enrage','wave','teamDown','boss','minion']");
rep("(e.t==='aoe'?'ATAC A TOTHOM!':e.t==='enrage'?", "(e.label?e.label:e.t==='aoe'?'ATAC A TOTHOM!':e.t==='enrage'?");
rep("setTimeout(next,((e.t==='ehit'&&e.strong)||e.t==='aoe'||e.t==='enrage')?", "setTimeout(next,((e.t==='ehit'&&e.strong)||e.t==='aoe'||e.t==='enrage'||e.t==='boss')?");
rep("'<div class=\"row\" style=\"gap:6px\">'+synChips(b.syn)+'</div><div class=\"stchips\" id=\"team-st\"></div>'",
  "'<div class=\"row\" style=\"gap:6px\">'+synChips(b.syn)+'</div><div class=\"ab-row\"><span style=\"color:#fff\">Atac de tot l\\u2019equip</span><div class=\"charge\"><i id=\"team-meter\"></i></div></div><div class=\"stchips\" id=\"team-st\"></div>'");
rep("(fin?'<p class=\"muted\">Si el guanyes, acabes la zona", "(ge.bossD?'<p><b>Habilitats:</b> '+esc(ge.bossD)+'</p>':'')+(fin?'<p class=\"muted\">Si el guanyes, acabes la zona");
rep('/* ================= COMMENTS ================= */', fs.readFileSync(__dirname + '/v11-js.txt', 'utf8') + '\n/* ================= COMMENTS ================= */');
fs.writeFileSync(P, s);
console.log('patched v11, size', s.length);
