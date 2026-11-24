const fs=require('fs');let t=fs.readFileSync(__dirname+'/sim.js','utf8');t=t.slice(0,t.indexOf('const T = global.__T;'))+'const T=global.__T;';eval(t);
const T=global.__T;const G=T.G;G.coins=1000;G.equip={};G.items=[].concat(Array(9).fill('espasaFusta'),Array(4).fill('anellFoc'),['cascPetxina']);
console.log('before',JSON.stringify(T.itemGroups()));
console.log('forged',T.forgeAll(),'coins left',G.coins);
console.log('after',JSON.stringify(T.itemGroups()));
console.log('IT tier1',JSON.stringify(T.IT('espasaFusta#1')));
const be=T.bestEquipSet();console.log('best equip',JSON.stringify(be.equip),'bonus',JSON.stringify(T.bonusPct(be.equip)));
