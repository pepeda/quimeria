// Balance simulation: runs many battles directly with the game's own battle code.
const fs = require('fs');
let src = fs.readFileSync(__dirname + '/check.js', 'utf8');
const k = src.lastIndexOf('})();');
src = src.slice(0, k) + 'global.__T={setHard:function(v){HARD_TP=v},get G(){return G},forgeAll:forgeAll,itemGroups:itemGroups,IT:IT,bestEquipSet:bestEquipSet,bonusPct:bonusPct,startRun:startRun,battleTick:battleTick,run:run,startBattle:startBattle,mk:mk,stats:stats,abilities:abilities};\n' + src.slice(k);
function mkEl(id){return{id,_html:'',textContent:'',value:'',hidden:false,scrollTop:0,style:{setProperty(){}},dataset:{},get parentNode(){return mkEl('p')},set innerHTML(v){this._html=v},get innerHTML(){return this._html},classList:{add(){},remove(){},toggle(){},contains(){return false}},querySelector(){return null},appendChild(){},replaceChildren(){},remove(){},addEventListener(){},setAttribute(){},focus(){},select(){},contains(){return true},get offsetWidth(){return 1}}}
const els={};global.window={matchMedia:()=>({matches:false})};global.localStorage={getItem(){return null},setItem(){}};global.navigator={};
global.setTimeout=()=>0;global.clearTimeout=()=>{};
global.document={getElementById(id){return els[id]||(els[id]=mkEl(id))},querySelector(){return null},createElement(t){return mkEl(t)},addEventListener(){}};
eval(src);
const T = global.__T;
function trialE(team, world, zone, battle, mill, equip) {
  const G = T.G; G.owned = team.map(([s, st]) => { const c = T.mk(s); c.stage = st || 0; c.evo = st ? (st === 1 ? 0 : 1) : -1; c.mill = mill || 0; return c; });
  G.runs = {}; G.active = null; G.world = world; G.zone = zone; G.pick = G.owned.map(c => c.uid); G.equip = equip || {};
  T.startRun(); T.startBattle(battle(world, T.run()));
  const b = T.run().event; let n = 0; while (!b.over && n < 300) { T.battleTick(); n++; }
  return { win: b.over === 'win', turns: n };
}
function rep(label, team, world, zone, battle, mill, equip){let w=0,t=0;const N=200;for(let i=0;i<N;i++){const r=trialE(team,world,zone,battle,mill,equip);if(r.win)w++;t+=r.turns}console.log(label.padEnd(52),'win',Math.round(w*100/N)+'%','turns',(t/N).toFixed(1))}
const ep=t=>({casc:'cascCristall#'+t,espasa:'martellPedra#'+t,escut:'escutCloska#'+t,collaret:'collaretPetxina#'+t,anell1:'anellFoc#'+t,anell2:'anellMolsa#'+t,capa:'capaFulles#'+t,botes:'botesNuvol#'+t,vestit:'armaduraLleugera#'+t});
const guard=(w,r)=>({el:w,L:r.L+0.6,guardian:true,final:true});
const norm=(w,r)=>({el:w,L:r.L});
const T3=[['brasa',2],['gotim',2],['arrel',2],['xispa',2]], T2=[['brasa',1],['gotim',1],['arrel',1],['xispa',1]];
for(const w of ['foc','aigua','planta','llamp','psiquic']){rep(w+' guard, lvl2, Magica',T2,w,3,guard,5,ep(2));rep(w+' guard, lvl3, Magica',T3,w,3,guard,5,ep(2));rep(w+' guard, lvl3, Epica',T3,w,3,guard,5,ep(3));rep(w+' guard, lvl3, Superepica',T3,w,3,guard,5,ep(4));rep(w+' normal monster, lvl3, Magica',T3,w,3,norm,5,ep(2));}rep('Foc z1 guardian, 3 starters (was 40%)',[['brotet'],['gotim'],['xispa']],'foc',0,guard);