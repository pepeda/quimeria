const ev=require('./h.js');
ev(`globalThis.__fuzz=function(N){
 var res={win:0,lose:0,crash:{},nan:0,long:0,maxTurn:0,allKOwin:0,turnsHist:{}};
 var allItems=Object.keys(ITEMS);
 for(var n=0;n<N;n++){
  G=newGame();G.v13=1;G.completed=9;G.psiquic=true;G.built={};
  G.owned=SP_ORDER.map(function(s){var c=mk(s);c.stage=0;c.evo=c.stage?(c.stage===1?0:1+rnd(Math.max(1,SPECIES[s].evos.length-1))):-1;if(c.stage&&!SPECIES[s].evos[c.evo])c.evo=0;c.mill=rnd(6);return c});
  G.equip={};SLOTS.forEach(function(x){var key=x[0].indexOf('anell')===0?'anell':x[0];var c=allItems.filter(function(k){return ITEMS[k].slot===key});if(c.length&&Math.random()<0.4){var b=pickOne(c),t=ITEMS[b].set?4:rnd(5),a=[];for(var i=0;i<t;i++)a.push(pickOne(AFF_KEYS));G.equip[x[0]]=b+'#'+t+(a.length&&!ITEMS[b].set?'~'+a.join('.'):'')}});
  pCache={k:null,P:null};
  var w=pickOne(ORDER);G.world=w;G.zone=rnd(3);G.pick=shuffle(G.owned).slice(0,2+rnd(5)).map(function(c){return c.uid});
  startRun();var r=run();
  var kind=rnd(4),o=kind===0?{el:w,L:r.L+0.6,guardian:true,final:true,n:'G'}:kind===1?{el:w,L:r.L,waves:2,n:'Camp'}:kind===2?{wild:pickOne(SP_ORDER),L:r.L}:{el:w,L:r.L+2.5,guardian:true,n:'Rei de la cova'};
  startBattle(o);var b=r.event;
  try{for(var t=0;t<400&&!b.over;t++){battleTick();
     if(isNaN(b.enemy.hp)||r.team.some(function(u){return isNaN(r.hp[u])}))throw new Error('NaN');}
   if(t>=400)res.long++;res.maxTurn=Math.max(res.maxTurn,b.turn);var bk=Math.min(100,Math.floor(b.turn/10)*10);res.turnsHist[bk]=(res.turnsHist[bk]||0)+1;
   if(b.over==='win'){res.win++;if(!alive(r).length)res.allKOwin++}else if(b.over==='lose')res.lose++;
  }catch(e){var k=e.message;res.crash[k]=(res.crash[k]||0)+1;if(k==='NaN')res.nan++}
  G.runs={};G.active=null;
 }
 return res};`);
console.log(JSON.stringify(ev('__fuzz(20000)'),null,1));
