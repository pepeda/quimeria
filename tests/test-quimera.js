// The legendary Quimera (src/js/28-quimera.js): when it wakes up, the sheet, and how it fights.

const ev=require('./harness/h.js');
function ok(c,m){console.log((c?'ok   ':'FAIL ')+m);if(!c)process.exitCode=1}
ev("G=newGame();G.tut.done=1;G.completed=12;G.psiquic=true");
ok(ev("quimeraReady()")===false,'not ready with nothing finished');
ok(ev("scBestioles()").indexOf('Acaba la zona 3 dels cinc mons')>=0,'locked box on Bestioles (0 de 5)');
ev("['foc','aigua','planta','llamp'].forEach(function(w){G.done[w+':z0']=G.done[w+':z1']=G.done[w+':z2']=true});G.done['psiquic:z0']=G.done['psiquic:z1']=true");
ok(ev("quimeraReady()")===false,'not ready with 4 of 5 worlds');
// finish the zone 3 of the fifth world through the real finishRun
ev("G.world='psiquic';G.zone=2;G.pick=G.owned.slice(0,3).map(function(c){return c.uid});startRun();finishRun(true)");
ok(ev("G.quimera")===1&&ev("G.owned.concat(G.niu).filter(function(c){return c.sp==='quimera'}).length")===1,'wakes once after the 5th world');
ok(ev("G.summary.quimera")===true&&ev("scResum()").indexOf('La Quimera s’ha despertat!')>=0,'summary shows it');
ok(ev("quimeraWake()")===false,'never twice');
ok(ev("scBestioles()").indexOf('data-s=\"quimera\"')>=0,'tile on Bestioles');
ev("G.detail='quimera'");ok(ev("detailSheet()").indexOf('Ve de tots els mons')>=0&&ev("detailSheet()").indexOf('Adopta')<0,'detail sheet, no adopt');ev("G.detail=null");
ok(ev("cName(G.owned.concat(G.niu).filter(function(c){return c.sp==='quimera'})[0])")==='Quimera dels Cinc','name');
// battle: always x1.5, no extra damage taken, prism once
const q=ev("G.owned.concat(G.niu).filter(function(c){return c.sp==='quimera'})[0].uid");
ok(['foc','aigua','planta','llamp','psiquic'].every(e=>ev("effMult(byUid('"+q+"')||G.niu.filter(function(c){return c.uid==='"+q+"'})[0],'"+e+"')")===1.5),'hits every element x1.5');
ev("if(!byUid('"+q+"')){var c=G.niu.filter(function(x){return x.uid==='"+q+"'})[0];G.niu=G.niu.filter(function(x){return x!==c});G.owned[0]=c}");
const res=ev(`(function(){var out={wins:0,prism:0,maxPrism:0};for(var g=0;g<40;g++){G.runs={};G.active=null;G.world='planta';G.zone=0;G.pick=['${q}'];startRun();startBattle({el:'planta',L:run().L+0.6,guardian:true,final:true,n:'G'});var b=run().event,n=0,pc=0;
  var orig=b.ch;while(!b.over&&n<300){var ev=battleTick();ev.forEach(function(e){if(e.kind==='prism')pc++});n++}out.prism+=pc;out.maxPrism=Math.max(out.maxPrism,pc);if(b.over==='win')out.wins++;delete G.runs.planta;G.active=null}return JSON.stringify(out)})()`);
console.log('solo quimera vs Boscúria zone-1 guardian, 40 battles:',res);
ok(JSON.parse(res).maxPrism<=1,'Prisma dels Cinc at most once per battle');
