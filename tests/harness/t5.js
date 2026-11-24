const ev=require('./h.js');
ev(`var ks=Object.keys(ITEMS).filter(function(k){return !ITEMS[k].set});for(var i=0;i<120;i++)G.items.push(pickOne(ks)+'#'+rnd(4));`);
['bestBlock()','forgeReady()','itemGroups()','setsBlock()','scMotxilla()','bestEquipSet()'].forEach(f=>{const t=ev(`var t0=performance.now();for(var i=0;i<50;i++)${f};(performance.now()-t0)/50`);console.log(f,t.toFixed(2),'ms');});
