// v13: item powers on forge, legendary sets, secret combos, new statuses, enemies grow each turn, element bonus, lighter normal abilities.
const fs = require('fs');
const P = __dirname + '/joc-bestioles.html';
let s = fs.readFileSync(P, 'utf8');
function must(c, m) { if (!c) { console.error('FAIL: ' + m); process.exit(1); } }
function rep(a, b) { const n = s.split(a).length - 1; must(n === 1, 'expected once (' + n + '): ' + a.slice(0, 90)); s = s.replace(a, () => b); }
// renames so the v13 wrappers can call the previous versions
rep('function makeBattle(o){', 'function makeBattle1(o){');
rep('function battleTick(){\n  var ev=battleTick1()', 'function battleTick2(){\n  var ev=battleTick1()');
rep('function battleWon(){', 'function battleWon0(){');
rep('function act(a,d){', 'function act0(a,d){');
rep('function outDmg(c,pow,b,r){', 'function outDmg1(c,pow,b,r){');
rep('function inDmg(b,t,x){', 'function inDmg0(b,t,x){');
rep('function findCombo(r,b){', 'function findCombo0(r,b){');
rep('function doCombo(x,r,b){', 'function doCombo0(x,r,b){');
rep('function forgeOnce(id){', 'function forgeOnceV9(id){');
rep('function forgeAll(){', 'function forgeAllV9(){');
rep('function itemStats(it){', 'function itemStats0(it){');
rep('function updateStatus(){\n  updateStatus0()', 'function updateStatus1(){\n  updateStatus0()');
// no more decimals: bonus percentages are whole numbers, and include item powers and set bonuses
rep("function bonusPct(eq){var b={atk:0,def:0,hp:0};Object.keys(eq).forEach(function(s){var it=IT(eq[s]);if(it){b.atk+=it.atk*3;b.def+=it.def*3;b.hp+=it.hp*2}});return b}",
  "function bonusPct(eq){var b={atk:0,def:0,hp:0};Object.keys(eq).forEach(function(s){var it=IT(eq[s]);if(it){b.atk+=it.atk*3;b.def+=it.def*3;b.hp+=it.hp*2}});var P=powerOf(eq);return {atk:Math.round(b.atk+P.atk),def:Math.round(b.def+P.def),hp:Math.round(b.hp+P.hp)}}");
rep("function itemScore(k){var it=IT(k);return it.atk*3+it.def*3+it.hp*2}", "function itemScore(k){var it=IT(k);return it.atk*3+it.def*3+it.hp*2+(it.set?25:0)+(it.aff?it.aff.length*4:0)}");
// item ids may carry powers: base#tier~power.power
rep("function tierOf(id){return Math.min(4,+(String(id).split('#')[1]||0))}", "function tierOf(id){return Math.min(4,parseInt(String(id).split('#')[1],10)||0)}");
rep("return {n:b.n+(t?' '+'★'.repeat(t):'')", "return {aff:affOf(id),set:b.set,n:b.n+(t&&!b.set?' '+'★'.repeat(t):'')");
rep("rar:(b.relic?'Tresor · ':'')+TIER_N[t]", "rar:(b.set?'Set de llegenda · ':b.relic?'Tresor · ':'')+TIER_N[t]");
rep("if(forgeOnce(d.id))toast('Forjat: '+IT(nid).n+' ('+TIER_N[tierOf(nid)]+')!');", "if(forgeOnce(d.id)){var lf=IT(G.lastForge);toast('Forjat: '+lf.n+' ('+TIER_N[lf.tier]+'). Nou poder: '+AFFIX[lf.aff[lf.aff.length-1]].n+'!')}");
// backpack: forge counts by category, power text, sets section
rep("ready=groups.filter(function(g){return g.n>=4&&tierOf(g.id)<4})", "ready=forgeReady()");
rep("(g.n>=4&&G.coins>=cost?'':' disabled')", "(fcount(g.id)>=4&&G.coins>=cost?'':' disabled')");
rep("(g.n>=4?(G.coins>=cost?'':'Et falten monedes'):'En tens '+g.n+' de 4')", "(fcount(g.id)>=4?(G.coins>=cost?'':'Et falten monedes'):'En tens '+fcount(g.id)+' de 4 d’aquesta categoria')");
rep("Costa '+FORGE_COST.join(', ')+' monedes segons la categoria.", "Costa '+FORGE_COST.join(', ')+' monedes segons la categoria. <b>Cada vegada que forges, l’objecte guanya un poder especial</b> (Xucla vida, Verí, Encanteri, Espines…).");
rep("'<h2>A la motxilla</h2>'", "setsBlock()+'<h2>A la motxilla</h2>'");
// critter card and collection: secret combos
rep("'<h3>Arbre d’evolucions</h3>'+evos+'</div></div>'", "'<h3>Arbre d’evolucions</h3>'+evos+megaBlock(s)+'</div></div>'");
rep("<span>Evolucions <b>'+formsOwned()+' de '+SP_ORDER.length*3+'</b></span></div>'", "<span>Evolucions <b>'+formsOwned()+' de '+SP_ORDER.length*3+'</b></span></div><div class=\"row between\"><span>Combos secrets descoberts <b>'+megaCount()+' de '+MEGA.length+'</b></span></div>'");
// enemy may lose its attack: slow, distracted, dizzy
rep("if(b.st.stun>0){b.st.stun=0;ev.push({t:'stunned',txt:b.enemy.n+' està atordit i no ataca!'})}", "if(b.st.stun>0){b.st.stun=0;ev.push({t:'stunned',txt:b.enemy.n+' està atordit i no ataca!'})}else if(foeSkip(b,r,ev)){}");
// event display and timing: big comic page only for all-together and secret combos; normal abilities lighter and faster
rep('function showEvent(e){', 'function showEvent(e){\n  if(v13Show(e))return;');
rep("setTimeout(next,e.t==='ult'?(RM?500:3500):", "setTimeout(next,(e.t==='ult'||e.mega||e.all)?(RM?500:3700):(e.t==='spell'||e.t==='revive')?(RM?150:900):(e.t==='proc'||e.t==='drain'||e.t==='skip')?(RM?60:550):");
rep("e.t==='special'?(RM?250:1200)", "e.t==='special'?(RM?200:750)");
rep("st.appendChild(ci);anim($('m-'+e.uid),'lunge');", "anim($('m-'+e.uid),'lunge');floatNum($('m-'+e.uid),e.name,'tagtxt');");
rep("},RM?120:700);", "},RM?60:250);");
rep('/* ================= COMMENTS ================= */', fs.readFileSync(__dirname + '/v13-js.txt', 'utf8') + '\n/* ================= COMMENTS ================= */');
fs.writeFileSync(P, s);
console.log('patched v13, size', s.length);
