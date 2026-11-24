const ev=require('./h.js');
console.log('coins',ev('G.coins'),'owned',ev('G.owned.length'),'items',ev('Array.isArray(G.items)'),'bak keys',Object.keys(store).filter(k=>k.indexOf('.bak-')>0).length);
try{ev('render()');console.log('render ok')}catch(e){console.log('render FAIL',e.message)}
