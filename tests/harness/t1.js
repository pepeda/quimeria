// Reflect kills enemy while last critter dies -> battle won with whole team KO -> next battle crashes
const ev=require('./h.js'); const F=process.argv[2];
ev(`G.world='foc';G.zone=0;G.pick=[G.owned[0].uid];startRun();
var r=run(); startBattle({el:'foc',L:1,n:'Test'}); var b=r.event; var u=r.team[0];
r.hp[u]=1; b.tm.reflect[u]=2; b.enemy.hp=2; b.enemy.max=1000; b.ch[u]=b.ch[u].map(function(){return 9});
// make our own hit too weak to kill: enemy def huge
b.enemy.def=100000;b.meter=0;`);
const evs=ev('battleTick()');
console.log('events:',evs.map(e=>e.t).join(','),'over=',ev('run().event.over'),'teamHP=',ev('JSON.stringify(run().hp)'));
ev('battleWon(); var e=run().event; console.log("after win event:",e.type,e.kind)');
try{ ev(`startBattle({el:'foc',L:1,n:'Next'}); battleTick()`); console.log('next tick OK, over=',ev('run().event.over')); }
catch(e){ console.log('NEXT BATTLE CRASH:',e.message); }
