const ev=require('./h.js');
console.log('storageOk=',ev('storageOk'),'saved v13=',JSON.parse(store['bestioles-joc-v1']||'null')&&JSON.parse(store['bestioles-joc-v1']).v13, 'coins=',ev('G.coins'), 'first 40 of store:',String(store['bestioles-joc-v1']).slice(0,40));
