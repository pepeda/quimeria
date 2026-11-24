// Balance simulation: win rate of the final guardian of every zone of every world, for teams of growing strength.
// Runs the game's own battle code. N battles per cell (env SIM_N, default 50). Optional env SIM_WORLDS=foc,aigua
const N = +process.env.SIM_N || 50;
let src = require('./game-source.js').js;
const k = src.lastIndexOf('})();');
src = src.slice(0, k) + 'global.__T={get G(){return G},BAL:BAL,chestTap:chestTap,bestEquipSet:bestEquipSet,IT:IT,TIER_N:TIER_N,startRun:startRun,battleTick:battleTick,run:run,startBattle:startBattle,mk:mk,ZONES:ZONES};\n' + src.slice(k);
function mkEl(id){return{id,_html:'',textContent:'',value:'',hidden:false,scrollTop:0,style:{setProperty(){}},dataset:{},get parentNode(){return mkEl('p')},set innerHTML(v){this._html=v},get innerHTML(){return this._html},classList:{add(){},remove(){},toggle(){},contains(){return false}},querySelector(){return null},appendChild(){},replaceChildren(){},remove(){},addEventListener(){},setAttribute(){},focus(){},select(){},contains(){return true},get offsetWidth(){return 1}}}
const els={};global.window={matchMedia:()=>({matches:false})};global.localStorage={getItem(){return null},setItem(){}};global.navigator={};
global.setTimeout=()=>0;global.clearTimeout=()=>{};
global.document={getElementById(id){return els[id]||(els[id]=mkEl(id))},querySelector(){return null},createElement(t){return mkEl(t)},addEventListener(){}};
eval(src);
const T = global.__T;
if(process.env.SIM_ZONE)Object.assign(T.BAL.ZONE,JSON.parse(process.env.SIM_ZONE)); // tuning: try other zone numbers
/* gear of a player after DAYS days with WINS won expeditions a day: every won run opens a chest (tapped until it opens)
   and the best item per slot is equipped. Run loot and forging are left out, so this is the chest part only. */
const WINS=4;
function chestGear(world,days){const G=T.G;G.items=[];G.equip={};G.owned=[];G.niu=[];for(let i=0;i<days*WINS;i++){G.chest={tier:0,world:world,taps:0,open:false};while(!G.chest.open)T.chestTap()}const b=T.bestEquipSet();return b.equip}
const CG={3:chestGear('foc',3),14:chestGear('foc',14)};
[3,14].forEach(d=>console.log('Chest gear after '+d+' days x '+WINS+' wins: '+Object.keys(CG[d]).map(k=>T.IT(CG[d][k]).n+' ('+T.TIER_N[T.IT(CG[d][k]).tier]+')').join(', ')));
const ZS=(process.env.SIM_Z||'1,2,3,4,5').split(',').map(Number);
// gear: every slot at item tier t (with t powers, like forged items)
const gear = t => t < 0 ? {} : ({casc:'cascCristall',espasa:'martellPedra',escut:'escutCloska',collaret:'collaretPetxina',anell1:'anellFoc',anell2:'anellMolsa',capa:'capaFulles',botes:'botesNuvol',vestit:'armaduraLleugera'});
function gearT(t){const g=gear(t),o={},P=['vamp','crit','sort','rapid'];Object.keys(g).forEach(s=>{o[s]=t>0?g[s]+'#'+t+'~'+P.slice(0,t).join('.'):g[s]});return t<0?{}:o}
const START=['brotet','gotim','xispa','espurnet'],TEAM=['brasa','gotim','arrel','xispa','espurnet','molsa'];
// team strengths: [label, team size, form (stage+1), level, gear tier (-1 none)]
const STR=[['Inicials F1 nv1, 3',3,1,1,-1,START],['Inicials F1 nv5, 4',4,1,5,-1,START],['F1 nv5, 4, Normal',4,1,5,0],['F2 nv10, 4, Normal',4,2,10,0],['F2 nv8, 4, cofres 3 dies',4,2,8,'chest3'],['F2 nv10, 4, cofres 3 dies',4,2,10,'chest3'],
  ['F2 nv10, 4, Refinada',4,2,10,1],['F2 nv10, 4, Màgica',4,2,10,2],['F3 nv15, 5, Màgica',5,3,15,2],['F3 nv15, 5, cofres 2 setm.',5,3,15,'chest14'],['F3 nv15, 5, Èpica',5,3,15,3],['F4 nv20, 5, Èpica',5,4,20,3],['F4 nv20, 5, cofres 2 setm.',5,4,20,'chest14'],['F4 nv20, 6, Superèpica',6,4,20,4]];
function trial(world, zone, s){
  const G=T.G;G.owned=(s[5]||TEAM).slice(0,s[1]).map(sp=>{const c=T.mk(sp);c.stage=s[2]-1;c.evo=c.stage?(c.stage===1?0:1):-1;c.lvl=s[3];return c});
  G.runs={};G.active=null;G.world=world;G.zone=zone;G.pick=G.owned.map(c=>c.uid);G.equip=typeof s[4]==='string'?Object.assign({},CG[s[4].slice(5)]):gearT(s[4]);
  T.startRun();const r=T.run();T.startBattle({el:world,L:r.L+0.6,guardian:true,final:true,n:'G'});
  const b=r.event;let n=0;while(!b.over&&n<300){T.battleTick();n++}return b.over==='win';
}
const worlds=(process.env.SIM_WORLDS||'foc,aigua,planta,llamp,psiquic').split(',');
console.log('Final guardian win rate per zone, '+N+' battles per cell');
for(const w of worlds){
  console.log('== '+w.padEnd(24)+ZS.map(z=>'Z'+z).join('    '));
  for(const s of STR){let line=s[0].padEnd(26);for(const z1 of ZS){const z=z1-1;let win=0;for(let i=0;i<N;i++)if(trial(w,z,s))win++;line+=String(Math.round(win*100/N)+'%').padStart(6)}console.log(line)}
}
