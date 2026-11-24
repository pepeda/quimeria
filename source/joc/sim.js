// Balance simulation: runs many battles directly with the game's own battle code.
const fs = require('fs');
let src = fs.readFileSync(__dirname + '/check.js', 'utf8');
const k = src.lastIndexOf('})();');
src = src.slice(0, k) + 'global.__T={get G(){return G},forgeAll:forgeAll,itemGroups:itemGroups,IT:IT,bestEquipSet:bestEquipSet,bonusPct:bonusPct,startRun:startRun,battleTick:battleTick,run:run,startBattle:startBattle,mk:mk,stats:stats,abilities:abilities};\n' + src.slice(k);
function mkEl(id){return{id,_html:'',textContent:'',value:'',hidden:false,scrollTop:0,style:{setProperty(){}},dataset:{},get parentNode(){return mkEl('p')},set innerHTML(v){this._html=v},get innerHTML(){return this._html},classList:{add(){},remove(){},toggle(){},contains(){return false}},querySelector(){return null},appendChild(){},replaceChildren(){},remove(){},addEventListener(){},setAttribute(){},focus(){},select(){},contains(){return true},get offsetWidth(){return 1}}}
const els={};global.window={matchMedia:()=>({matches:false})};global.localStorage={getItem(){return null},setItem(){}};global.navigator={};
global.setTimeout=()=>0;global.clearTimeout=()=>{};
global.document={getElementById(id){return els[id]||(els[id]=mkEl(id))},querySelector(){return null},createElement(t){return mkEl(t)},addEventListener(){}};
eval(src);
const T = global.__T;
function trial(team, world, zone, battle, mill) {
  const G = T.G; G.owned = team.map(([s, st]) => { const c = T.mk(s); c.stage = st || 0; c.evo = st ? (st === 1 ? 0 : 1) : -1; c.mill = mill || 0; return c; });
  G.runs = {}; G.active = null; G.world = world; G.zone = zone; G.pick = G.owned.map(c => c.uid); G.equip = {};
  T.startRun(); T.startBattle(battle(world, T.run()));
  const b = T.run().event; let n = 0; while (!b.over && n < 200) { T.battleTick(); n++; }
  return { win: b.over === 'win', turns: n };
}
function report(label, team, world, zone, battle, mill) {
  let w = 0, t = 0; const N = 300;
  for (let i = 0; i < N; i++) { const r = trial(team, world, zone, battle, mill); if (r.win) w++; t += r.turns; }
  console.log(label.padEnd(58), 'win', Math.round(w * 100 / N) + '%', ' avg turns', (t / N).toFixed(1));
}
const starters = [['brotet'], ['gotim'], ['xispa']];
const normal = (w, r) => ({ el: w, L: r.L });
const camp = (w, r) => ({ el: w, L: r.L + 0.3, waves: 2 });
const guard = (w, r) => ({ el: w, L: r.L + 0.6, guardian: true, final: true });
report('Planta z1, 3 starters, normal monster', starters, 'planta', 0, normal);
report('Planta z1, 3 starters, camp (2 waves)', starters, 'planta', 0, camp);
report('Planta z1, 3 starters, guardian', starters, 'planta', 0, guard);
report('Planta z1, espurnet+gotim+xispa, guardian', [['espurnet'], ['gotim'], ['xispa']], 'planta', 0, guard);
report('Foc z1, 3 starters, guardian', starters, 'foc', 0, guard);
report('Planta z2, 4 critters mill3, guardian', [['brotet'], ['gotim'], ['xispa'], ['espurnet']], 'planta', 1, guard, 3);
report('Llamp z1, 4 lvl2 critters, guardian', [['brotet', 1], ['gotim', 1], ['xispa', 1], ['espurnet', 1]], 'llamp', 0, guard);
report('Psiquic z3, 6 lvl3 critters, guardian', [['brotet', 2], ['gotim', 2], ['xispa', 2], ['espurnet', 2], ['petxina', 2], ['trona', 2]], 'psiquic', 2, guard, 5);
const bossTeam=[['brotet',1],['gotim',1],['xispa',1],['espurnet',1]];
for (const w of ['foc','aigua','planta','llamp','psiquic']) report('Boss '+w+' z2, 4 lvl2', bossTeam, w, 1, (ww, r) => ({ el: ww, L: r.L + 0.6, guardian: true, final: true }), 3);
report('Rei de la cova, planta z2, 4 lvl2', bossTeam, 'planta', 1, (w, r) => ({ el: w, L: r.L + 0.5 + 1.1, guardian: true, n: 'Rei de la cova' }), 3);
