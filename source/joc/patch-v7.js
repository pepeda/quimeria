// Splices the v7 battle/zone code into joc-bestioles.html: removes the old versions of the functions that v7 replaces, then inserts the new code.
const fs = require('fs');
const P = __dirname + '/joc-bestioles.html';
let s = fs.readFileSync(P, 'utf8');
function must(cond, msg) { if (!cond) { console.error('FAIL: ' + msg); process.exit(1); } }
function removeFn(name) {
  const key = '\nfunction ' + name + '(';
  const a = s.indexOf(key); must(a >= 0, 'function not found ' + name);
  must(s.indexOf(key, a + 1) < 0, 'function twice ' + name);
  const ends = ['\nfunction ', '\nvar ', '\n/* ', '\ndocument.', '\n})();'].map(m => s.indexOf(m, a + 1)).filter(i => i > 0);
  const b = Math.min(...ends);
  s = s.slice(0, a) + s.slice(b);
}
function replaceOnce(a, b) { const i = s.indexOf(a); must(i >= 0, 'not found: ' + a.slice(0, 70)); must(s.indexOf(a, i + 1) < 0, 'twice: ' + a.slice(0, 70)); s = s.replace(a, b); }
['mult', 'startRun', 'arrive', 'enterScene', 'advance', 'applyEffect', 'makeBattle', 'alive', 'danger', 'sampleEnemy', 'battleTick', 'scheduleTick', 'stopBattle',
 'showEvent', 'playEvents', 'updateAbilities', 'wantsSpecial', 'doSpecial', 'showSpecial', 'abandonRun', 'restartRun', 'battleWon', 'finishRun', 'buildRoute',
 'worldPct', 'scMon', 'teamSummary', 'scEquip', 'routeStrip', 'scRun', 'battleStage', 'detailSheet'].forEach(removeFn);
// remove the old "var battleTimer" line (v7 declares it again)
replaceOnce('\nvar battleTimer=null,playing=false;', '\n');
// css
replaceOnce('.shield{display:none;', fs.readFileSync(__dirname + '/v7-css.txt', 'utf8') + '.shield{display:none;');
// scene art
replaceOnce("    case 'guardian':p=", "    case 'river':p='<rect y=\"110\" width=\"360\" height=\"26\" fill=\"#2E8BE6\"/><path d=\"M20 122 q10 -6 20 0 M120 128 q10 -6 20 0 M240 120 q10 -6 20 0\" stroke=\"#fff\" stroke-width=\"3\" fill=\"none\"/>'+[[80,118],[150,124],[220,116],[290,124]].map(function(q){return '<ellipse cx=\"'+q[0]+'\" cy=\"'+q[1]+'\" rx=\"13\" ry=\"6\" fill=\"#9D97AF\"/>'}).join('');break;\n" +
  "    case 'waterfall':p='<rect x=\"110\" y=\"8\" width=\"140\" height=\"124\" fill=\"#8E8AA0\"/><rect x=\"158\" y=\"8\" width=\"44\" height=\"124\" fill=\"#7CC0FF\"/><ellipse cx=\"180\" cy=\"134\" rx=\"90\" ry=\"12\" fill=\"#2E8BE6\"/><path d=\"M168 26 V122 M180 16 V126 M192 30 V120\" stroke=\"#fff\" stroke-width=\"3\" opacity=\".7\"/>';break;\n" +
  "    case 'balloon':p='<ellipse cx=\"200\" cy=\"54\" rx=\"40\" ry=\"46\" fill=\"#E2574C\"/><path d=\"M180 14 Q200 54 180 96 M220 14 Q200 54 220 96\" stroke=\"#F7C948\" stroke-width=\"5\" fill=\"none\"/><path d=\"M176 96 L188 120 M224 96 L212 120\" stroke=\"#6B3E26\" stroke-width=\"2\"/><rect x=\"186\" y=\"118\" width=\"28\" height=\"18\" rx=\"3\" fill=\"#B5793E\"/>';break;\n" +
  "    case 'guardian':p=");
// act changes
replaceOnce("case 'path':G.path=d.p;G.pick=[];G.screen='equip';break;", "case 'path':G.zone=+d.p;G.pick=[];G.screen='equip';break;");
replaceOnce("else if(G.pick.length<3)G.pick.push(d.u);else toast('Només hi caben 3 bestioles.');", "else if(G.pick.length<maxTeam())G.pick.push(d.u);else toast('Ara nom\\u00e9s hi caben '+maxTeam()+' bestioles.');");
{ const i = s.indexOf("    case 'gfight':"); must(i >= 0, 'gfight'); const j = s.indexOf('\n', i);
  s = s.slice(0, i) + "    case 'gfight':startBattle({el:r.world,L:r.L+1,guardian:true,final:true,n:'Guardi\\u00e0 de '+ZONES[r.world][r.zone||0]});break;\n" +
    "    case 'mfight':startBattle({el:r.world,L:r.L+0.3,waves:2,n:'Campament de monstres',win:{rand:[[0.5,{loot:'common'}],[0.5,{coins:40}]]}});break;\n" +
    "    case 'mleave':applyEffect({dmgTeam:15});break;" + s.slice(j); }
s = s.split('r.event=makeBattle(').join('startBattle(');
// summary: bigger team message
replaceOnce("(s.unlocked?", "(s.bigger?'<p class=\"tag good\" style=\"font-size:15px;padding:6px 12px\">Ara pots portar '+s.bigger+' bestioles a les aventures!</p>':'')+(s.unlocked?");
// insert v7 code
replaceOnce('/* ================= COMMENTS ================= */', fs.readFileSync(__dirname + '/v7-js.txt', 'utf8') + '\n/* ================= COMMENTS ================= */');
fs.writeFileSync(P, s);
console.log('patched, size', s.length);
