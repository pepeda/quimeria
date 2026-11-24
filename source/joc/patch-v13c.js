// v13.4: safety fixes found by the code review.
// 1) the mirror (reflect) could win a battle after the last critter fell, leaving a whole-KO team that crashed the next battle;
// 2) a corrupt or unknown save was replaced by a new game and the old one was lost; a save missing fields crashed on load;
// 3) the rest clock froze when the phone clock went backwards; 4) double-tap zoom on phones.
const fs = require('fs');
const P = __dirname + '/joc-bestioles.html';
let s = fs.readFileSync(P, 'utf8');
function rep(a, b) { const n = s.split(a).length - 1; if (n !== 1) { console.error('FAIL expected once (' + n + '): ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, () => b); }
// 1) mirror cannot win when the whole team is down
rep("(r.hp[tg.uid]===0?'. Queda fora de combat.':'')});\n    if(foeCheck(r,b,ev))return ev;",
    "(r.hp[tg.uid]===0?'. Queda fora de combat.':'')});\n    if(alive(r).length&&foeCheck(r,b,ev))return ev;");
// v13 wrappers renamed so the safety wrappers below can call them
rep("function battleTick(){\n  var r=run(),b=r.event;if(!b.P)", "function battleTick3(){\n  var r=run(),b=r.event;if(!b.P)");
rep("function battleWon(){var r=run(),b=r.event,en=b.enemy,P=b.P||emptyP();", "function battleWon3(){var r=run(),b=r.event,en=b.enemy,P=b.P||emptyP();");
// 2) safe load: keep a backup copy of a save we cannot read, fill missing fields instead of crashing
rep("var G=migrate(load(S_KEY));", "var G=(function(){var raw=null,g=null;try{raw=localStorage.getItem(S_KEY)}catch(e){storageOk=false}\n" +
  "  try{g=raw?JSON.parse(raw):null}catch(e){g=null}\n" +
  "  if(raw&&(!g||typeof g!=='object'||(g.v!==1&&g.v!==2))){try{localStorage.setItem(S_KEY+'.bak-'+Date.now(),raw)}catch(e){}g=null}\n" +
  "  g=migrate(g);var d=newGame();Object.keys(d).forEach(function(k){if(g[k]===undefined||g[k]===null)g[k]=d[k]});\n" +
  "  if(!Array.isArray(g.owned))g.owned=[];g.owned=g.owned.filter(function(c){return c&&SPECIES[c.sp]});if(!g.owned.length)g.owned=d.owned;\n" +
  "  if(!Array.isArray(g.items))g.items=[];['equip','built','food','runs','done','seen','tips'].forEach(function(k){if(typeof g[k]!=='object'||Array.isArray(g[k]))g[k]={}});\n" +
  "  return g})();");
// 3) phone clock went backwards: restart the rest clock from now
rep("var now=Date.now(),steps=Math.floor((now-G.restClock)/600000);", "var now=Date.now();if(!(G.restClock<=now))G.restClock=now;var steps=Math.floor((now-G.restClock)/600000);");
// safety wrappers
rep('/* ================= COMMENTS ================= */', `/* --- v13.4 safety: a battle never continues with the whole team down, and an error in a turn ends the battle instead of freezing the game --- */
function battleTick(){var r=run(),b=r&&r.event;
  if(b&&!b.over&&!alive(r).length){b.over='lose';return [{t:'teamDown',txt:'Tot l’equip ha caigut.'}]}
  try{return battleTick3()}catch(e){if(b){b.over='lose'}return [{t:'teamDown',txt:'Alguna cosa ha fallat en aquest torn. La batalla s’acaba.'}]}}
function battleWon(){battleWon3();var r=run();if(r&&r.team&&!r.team.some(function(u){return r.hp[u]>0}))r.team.forEach(function(u){r.hp[u]=1})}
try{document.documentElement.style.touchAction='manipulation'}catch(e){}
/* ================= COMMENTS ================= */`);
fs.writeFileSync(P, s);
console.log('patched v13c');
