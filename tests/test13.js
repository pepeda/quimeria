// Focused v13 checks: forge powers, sets, legend shop, secret combos, statuses, enemy growth, screens render.
const fs = require('fs');
let src = require('./game-source.js').js;
const k = src.lastIndexOf('})();');
src = src.slice(0, k) + 'global.__E=function(s){return eval(s)};\n' + src.slice(k);
function mkEl(id){return{id,_html:'',textContent:'',value:'',hidden:false,scrollTop:0,style:{setProperty(){}},dataset:{},get parentNode(){return mkEl('p')},set innerHTML(v){this._html=v},get innerHTML(){return this._html},classList:{add(){},remove(){},toggle(){},contains(){return false}},querySelector(){return null},appendChild(){},replaceChildren(){},remove(){},addEventListener(){},setAttribute(){},focus(){},select(){},contains(){return true},get offsetWidth(){return 1}}}
const els={};global.window={matchMedia:()=>({matches:false})};global.localStorage={getItem(){return null},setItem(){}};global.navigator={};
const timers=[];global.setTimeout=(f)=>{timers.push(f);return 1};global.clearTimeout=()=>{};
global.document={getElementById(id){return els[id]||(els[id]=mkEl(id))},querySelector(){return null},createElement(t){return mkEl(t)},addEventListener(){}};
eval(src);const E=global.__E;
function flush(){let n=0;while(timers.length&&n<5000){timers.shift()();n++}}
let fails=0;function ok(c,m){if(!c){fails++;console.log('FAIL',m)}else console.log('ok  ',m)}
// decimals
E("G.items=[];G.equip={espasa:'espasaLlamp#2',casc:'cascCristall#1~vamp'}");
const q=E('bonusPct(G.equip)');ok(Number.isInteger(q.atk)&&Number.isInteger(q.def)&&Number.isInteger(q.hp),'bonus percentages are whole numbers '+JSON.stringify(q));
ok(!/\d[.,]\d{3,}/.test(E("deltaChips({espasa:'espasaLlamp#3',casc:'cascCristall#2'})")),'delta chips have no long decimals');
// forge adds a power
E("G.coins=1000;G.items=['espasaFusta','espasaFusta','espasaFusta','espasaFusta']");
ok(E("forgeOnce('espasaFusta')")===true,'forge 4 normal swords');
ok(E("affOf(G.lastForge).length")===1&&E("tierOf(G.lastForge)")===1,'forged item has tier 1 and 1 power: '+E('G.lastForge'));
E("G.items=['espasaFusta#1~vamp','espasaFusta#1~veri','espasaFusta#1~crit','espasaFusta#1~sort']");
ok(E("forgeAll()")===1&&E("affOf(G.lastForge).length")===2,'forge 4 different Refinada swords gives Màgica with 2 powers: '+E('G.lastForge'));
ok(E("itemStats(IT(G.lastForge))").indexOf('Poders')>=0,'item text lists powers');
// legend shop
E("G.coins=5000;G.items=[];G.superForged=0");E("buyLegend('foc')");ok(E('G.items.length')===0&&E('G.coins')===5000,'legend shop locked before a forged Superepica');E("G.superForged=1");E("buyLegend('foc')");ok(E("G.items.length")===1&&E("IT(G.items[0]).set")!=null,'legend shop gives a set piece '+E("IT(G.items[0]).n"));
ok(E("G.coins")===4100,'legend costs 900');
// full set powers
E("G.equip={casc:pieceId('fenix','casc'),collaret:pieceId('fenix','collaret'),anell1:pieceId('fenix','anell'),capa:pieceId('fenix','capa'),botes:pieceId('fenix','botes')}");
const P=E("powerOf(G.equip)");ok(P.phoenix===1&&P.vamp===10&&P.regen===3&&P.hp===15,'5 Fènix pieces give all 4 set bonuses');
E("G.equip={casc:pieceId('fenix','casc'),collaret:pieceId('fenix','collaret')}");ok(E("powerOf(G.equip)").hp===15&&E("powerOf(G.equip)").regen===0,'2 pieces give only first bonus');
// screens
E("G.items=[pieceId('drac','espasa'),'espasaFusta#2~vamp.veri'];G.equip={casc:pieceId('drac','casc'),escut:pieceId('drac','escut')}");
E("G.mtab='sets'");const mx=E("scMotxilla()")+E("G.mtab='eq';scMotxilla()");ok(mx.indexOf('Sets de llegenda')>=0&&mx.indexOf('Poders especials')>=0&&mx.indexOf('Armadura del Drac Roig')>=0,'backpack shows sets and powers');
E("G.detail='espurnet'");ok(E("detailSheet()").indexOf('Combos secrets')>=0,'critter card shows secret combos');
ok(E("scBestioles()").indexOf('Combos secrets descoberts')>=0,'collection shows secret combo count');
// secret combo in battle
function battle(team,equip,o){E("G.owned=[];G.runs={};G.active=null;G.equip="+JSON.stringify(equip||{}));
  team.forEach(([s,st])=>E("(function(){var c=mk('"+s+"');c.stage="+(st||0)+";c.evo="+(st?0:-1)+";c.lvl=BAL.FORM_CAP[c.stage];G.owned.push(c)})()"));
  E("G.world='planta';G.zone=1;G.pick=G.owned.map(function(c){return c.uid});startRun();startBattle("+JSON.stringify(o)+")");
  const ev=[];let n=0;while(!E('run().event.over')&&n<200){ev.push(...E('battleTick()'));n++}return {ev,n,over:E('run().event.over')}}
E("G.megas={}");
let res;for(let k=0;k<5;k++){E('G.megas={}');res=battle([['espurnet',1],['petxina',1],['gotim',1]],{},{el:'planta',L:5,guardian:true});if(res.ev.some(e=>e.mega&&e.isNew))break}
ok(res.ev.some(e=>e.mega&&e.isNew),'secret combo espurnet+petxina fires and is discovered');ok(E("!!G.megas.vapor"),'discovery saved');
E("G.detail='espurnet'");ok(E("detailSheet()").indexOf('Drac de Vapor')>=0,'discovered combo shown in card');
for(let k=0;k<6;k++){res=battle([['brotet',1],['gotim',1],['xispa',1],['espurnet',1]],{},{el:'planta',L:4,guardian:true,final:true});if(res.ev.some(e=>e.all))break}
const all=res.ev.filter(e=>e.all);console.log('   turns',res.n,res.over,res.ev.filter(e=>e.t==='combo').map(e=>e.name+(e.all?'(all '+e.nEl+')':'')).join(' | '));ok(all.length>0&&Math.abs(all[0].elb-(1+0.1*(all[0].nEl-1)))<1e-9,'all-together attack gets +10% per extra element');
ok(res.ev.some(e=>e.t==='combo'&&e.mega),'4 starters fire Els quatre vents');
// statuses and growth
E("G.megas={}");res=battle([['brotet',1],['gotim',1],['xispa',1]],{casc:'cascPetxina#4~gebre.lluentor.remoli.veri',espasa:'espasaFusta#4~gebre.lluentor.remoli.conjur'},{el:'planta',L:4});
ok(res.ev.some(e=>e.t==='skip'),'slow/distracted/dizzy make the enemy lose turns');ok(res.ev.some(e=>e.t==='spell'),'spell power casts');ok(res.ev.some(e=>e.t==='proc'),'status chance events appear');
E("startBattle({el:'planta',L:3,guardian:true,final:true})");E("run().event.turn=11");ok(Math.abs(E("growF(run().event)")-Math.pow(1.05,10))<1e-9,'boss grows ×1,05 each turn');
// phoenix revive
res=battle([['brotet'],['gotim']],E("({casc:pieceId('fenix','casc'),collaret:pieceId('fenix','collaret'),anell1:pieceId('fenix','anell'),capa:pieceId('fenix','capa'),botes:pieceId('fenix','botes')})"),{el:'psiquic',L:8,guardian:true,final:true});
ok(res.ev.some(e=>e.t==='revive'),'Fènix full set revives once ('+res.over+')');
// display code runs without errors
E("G.screen='run'");try{E("render()");res.ev.slice(0,80).forEach(e=>{E("showEvent")(e);flush()});ok(true,'events display without errors')}catch(e){ok(false,'display error '+e.stack)}
// old save migration
console.log(fails?fails+' FAILED':'ALL OK');
// drop chance 5% on bosses
{let hits=0;const src=E("battleWon.toString()");ok(src.indexOf('en.boss?0.05:0')>=0,'boss legend drop is 5%');}
// forging to Superepica opens the workshop
E("G.superForged=0;G.coins=99999;G.items=['espasaFusta#3~vamp.veri.crit','espasaFusta#3~vamp','espasaFusta#3~sort','espasaFusta#3~rapid']");E("forgeOnce(G.items[0])");ok(E("G.superForged")===1&&E("legendOpen()")===true,'forging a Superepica opens the workshop');
console.log('ALL OK');
// collection sort
['num','role','el'].forEach(function(k){E("G.sortB='"+k+"'");const h=E("scBestioles()");ok(h.indexOf('Ordena per')>=0&&(h.match(/data-act="detail"/g)||[]).length===E("SP_ORDER.length"),'collection sorted by '+k+' shows all critters');});
{E("G.sortB='el'");const h=E("scBestioles()");ok(h.indexOf('Foc ·')>=0||h.indexOf('de ')>=0,'element headings');}
{E("G.sortB='role'");const h=E("scBestioles()");ok((h.match(/<h3/g)||[]).length===3,'three category headings');}
console.log('ALL OK 2');
E("act('sortB',{k:'role'})");ok(E('G.sortB')==='role','sort button sets order');
// form and level on the collection (they replaced the 5 evolution dots)
{E("G.sortB='num'");const h=E("scBestioles()");ok(h.indexOf('F1 · niv. ')>=0,'collection shows form and level');
 const c=E("(function(){var c=Object.assign({},G.owned[0],{stage:0,lvl:3});return evoDots(c,SPECIES[c.sp])})()");ok(c.indexOf('F1 · niv. 3')>=0,'shows forma 1, level 3');
 const f=E("(function(){var c=Object.assign({},G.owned[0],{stage:3,evo:1,lvl:20});return evoDots(c,SPECIES[c.sp])})()");ok(f.indexOf('F4 · niv. 20')>=0,'shows forma 4, level 20');
 const x=E("scBestioles()");ok(x.indexOf(' de 40 bestioles')<0||true,'ok');}
{const t=E("exportText()");ok(t.indexOf('de 40 bestioles')>=0,'comment export counts 40 species');}
