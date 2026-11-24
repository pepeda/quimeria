'use strict';
/* ---------- route ---------- */
function buildRoute(w,z){
  var used=[];
  return ZONE_ROUTES[z].map(function(k){
    if(k==='fork')return {k:'fork',opts:['tenda','cova'],scene:null};
    if(k==='fork2'){var a=pickScene('gen',w,used),b=pickScene('land',w,used);return {k:'fork',opts:[a,b],scene:null}}
    if(k==='guardian'||k==='mini'||k==='cave')return {k:k};
    if(k==='spring')return {k:'spring',scene:'font'};
    return {k:k,scene:pickScene(k,w,used)};
  });
}
function startRun(){
  var w=G.world,z=G.zone||0,hp={};
  G.pick.forEach(function(u){hp[u]=stats(byUid(u)).hp});
  var tu=tutOn()&&w==='aigua'&&!z;
  G.runs[w]={world:w,zone:z,L:zoneL(w,z),i:0,slots:tu?TUT_ROUTE.map(function(k,i){return k==='gen'?{k:k,scene:pickScene('gen',w,[])}:k==='spring'?{k:k,scene:'font'}:k==='wild'?{k:k,sp:tutWild()}:{k:k}}):buildRoute(w,z),tut:tu?1:0,team:G.pick.slice(),hp:hp,coins:0,cave:null,scene:null,node:'a',event:null,reveal:0,bless:0};
  G.active=w;G.pick=[];G.screen='run';arrive();
}
function arrive(){
  var r=run();if(!r)return;
  if(r.i>=r.slots.length){finishRun(true);return}
  var s=r.slots[r.i];
  if(s.k==='fork'&&!s.scene){r.event={type:'fork'};return}
  if(s.k==='guardian'){r.event={type:'guardianPre'};return}
  if(s.k==='mini'){r.event={type:'miniPre'};return}
  if(s.k==='wild'){r.event={type:'wild',sp:s.sp,rare:false};return}
  if(s.k==='fight'){startBattle({el:r.world,L:Math.max(0.5,r.L-0.3)});return}
  if(s.k==='cave'){r.cave=newCave(1);enterScene(r.cave.list[0]);return}
  enterScene(s.scene);
}
function newCave(lvl){return {lvl:lvl,i:0,list:['cova-tunels',pickOne(['cova-cristalls','cova-ratpenats','cova-bolets','cova-llac']),pickOne(['cova-ratpenats','cova-mina','cova-cristalls','cova-bolets']),lvl>=3?'cova-rei':'cova-escala']}}
function enterScene(id){
  var r=run();r.scene=id;r.node='a';r.event={type:'scene'};
  G.seen[r.world]=G.seen[r.world]||{};G.seen[r.world][id]=1;
}
function advance(){
  var r=run();if(!r)return;
  if(r.cave){r.cave.i++;if(r.cave.i<r.cave.list.length){enterScene(r.cave.list[r.cave.i]);return}r.cave=null;toast('Surts de la cova i tornes al camí.')}
  r.i++;arrive();
}
function caveL(r){return r.cave?0.5+0.6*(r.cave.lvl-1):0}
function startBattle(o){var r=run(),b=makeBattle(o);if(r.bless){b.tm.buff=3;r.bless=0;b.caption='La benedicció us dona +30% de mal!'}r.event=b}
function applyEffect(e){
  var r=run();if(!e){advance();return}
  if(e.shop||e.buyFood||e.price){var disc=teamTalent('mercat')?0.5:1;e=Object.assign({},e);if(e.shop)e.shop=Math.ceil(e.shop*disc);if(e.buyFood)e.buyFood=Math.ceil(e.buyFood*disc);if(e.price)e.price=Math.ceil(e.price*disc)}
  if(e.rand){var x=Math.random(),acc=0;for(var i=0;i<e.rand.length;i++){acc+=e.rand[i][0];if(x<acc){applyEffect(e.rand[i][1]);return}}applyEffect(e.rand[e.rand.length-1][1]);return}
  if(e.go){r.node=e.go;r.event={type:'scene'};return}
  if(e.exitCave){if(e.coins)r.coins+=e.coins;r.cave=null;r.i++;toast('Surts de la cova'+(e.coins?' amb '+e.coins+' monedes':'')+'.');arrive();return}
  if(e.deeper){var lv=r.cave.lvl+1;r.cave=newCave(lv);enterScene(r.cave.list[0]);toast('Baixeu al nivell '+lv+' de la cova. Ara és més perillós!');return}
  if(e.coins){var tr=teamTalent('tresor');r.event={type:'card',kind:'coins',n:Math.round(e.coins*(tr?1.5:1)),why:tr?'L\u2019Ensumatresors n\u2019ha trobat m\u00e9s!':'Has trobat monedes.'};return}
  if(e.food){r.event={type:'card',kind:'food',el:r.world,n:e.food+(teamTalent('bosc')&&!r.cave?1:0),why:'Menjar per a les bestioles.'};return}
  if(e.loot){r.event={type:'card',kind:'item',item:pickOne(e.loot==='relic'?RELICS:COMMON),why:e.loot==='relic'?'Un tresor rar!':'Un objecte per a la motxilla.'};return}
  if(e.heal){var ko=0;r.team.forEach(function(u){var c=byUid(u);if(!c)return;var mx=stats(c).hp;if(r.hp[u]<=0)ko++;r.hp[u]=Math.min(mx,Math.max(1,Math.round(r.hp[u]+(mx-r.hp[u])*e.heal/100)))});
    r.event={type:'note',title:'Descanseu',text:'L’equip recupera vida.'+(ko?' Les bestioles que estaven KO es desperten.':'')};return}
  if(e.dmgTeam){alive(r).forEach(function(c){var mx=stats(c).hp;r.hp[c.uid]=Math.max(1,r.hp[c.uid]-Math.round(mx*e.dmgTeam/100))});r.event={type:'note',title:'Ai!',text:'L’equip perd una mica de vida.'};return}
  if(e.bless){r.bless=1;r.event={type:'note',title:'Benedicció',text:'A la propera batalla, tot l’equip farà +30% de mal durant 3 torns.'};return}
  if(e.reveal){r.reveal=Math.min(r.slots.length-1,r.i+5);r.event={type:'note',title:'Des de dalt',text:'Veus els propers llocs del camí (mira les boles de dalt).'};return}
  if(e.skip){var to=Math.min(r.i+e.skip,r.slots.length-2),n=to-r.i;r.i=to;r.event={type:'note',title:'Drecera!',text:n>0?'Us salteu '+n+' llocs del camí.':'Ja sou a prop del final.'};return}
  if(e.wild){r.event={type:'wild',sp:pickOne(speciesOf(r.world)),rare:!!e.rare};return}
  if(e.fight){startBattle({el:r.world,L:r.L+(e.L||0)+caveL(r),n:e.n,win:e.win,waves:e.waves,guardian:!!e.guardian});return}
  if(e.cave){r.cave=newCave(1);enterScene(r.cave.list[0]);return}
  if(e.shop){if(r.coins>=e.shop){r.coins-=e.shop;r.event={type:'card',kind:'item',item:pickOne(COMMON),why:'L’has comprat.'}}else r.event={type:'note',title:'No tens prou monedes',text:'Necessites '+e.shop+' monedes de les que portes en aquesta aventura (en portes '+r.coins+').'};return}
  if(e.buyFood){if(r.coins>=e.buyFood){r.coins-=e.buyFood;r.event={type:'card',kind:'food',el:r.world,n:3,why:'L’has comprat.'}}else r.event={type:'note',title:'No tens prou monedes',text:'Necessites '+e.buyFood+' monedes de les que portes (en portes '+r.coins+').'};return}
  if(e.buyItem){if(r.coins>=e.price){r.coins-=e.price;r.event={type:'card',kind:'item',item:e.buyItem==='RELIC'?pickOne(RELICS):e.buyItem,why:'L’heu fet a la forja.'}}else r.event={type:'note',title:'No tens prou monedes',text:'Necessites '+e.price+' monedes de les que portes (en portes '+r.coins+').'};return}
  if(e.note){r.event={type:'note',title:'',text:e.note};return}
  advance();
}

