const ev=require('./h.js');
ev(`G.completed=9;G.psiquic=true;G.built={};BUILD.forEach(function(b){G.built[b.k]=b.max});
G.owned=SP_ORDER.map(function(s){return mk(s)});var ks=Object.keys(ITEMS).filter(function(k){return !ITEMS[k].set});for(var i=0;i<120;i++)G.items.push(pickOne(ks)+'#'+rnd(4));persist();`);
['casa','explorar','bestioles','motxilla'].forEach(s=>{
  const r=ev(`G.screen='${s}';G.detail=null;var t0=performance.now();for(var i=0;i<50;i++)render();var dt=(performance.now()-t0)/50;[dt.toFixed(2),$('screen').innerHTML.length,($('screen').innerHTML.match(/<svg/g)||[]).length,($('screen').innerHTML.match(/<[a-z]/g)||[]).length]`);
  console.log(s,'ms/render(node)=',r[0],'html chars=',r[1],'svgs=',r[2],'elements~',r[3]);});
const d=ev(`G.screen='bestioles';G.detail=SP_ORDER[0];render();[$('overlay').innerHTML.length]`);console.log('detail sheet chars',d[0]);
console.log('save size bytes',store['bestioles-joc-v1'].length);
ev(`G.world='foc';G.zone=0;G.pick=G.owned.slice(0,4).map(function(c){return c.uid});startRun();startBattle({el:'foc',L:1,n:'x'});G.screen='run';render()`);
console.log('battle screen chars',ev(`$('screen').innerHTML.length`),'svgs',ev(`($('screen').innerHTML.match(/<svg/g)||[]).length`));
