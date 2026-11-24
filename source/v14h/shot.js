const { chromium } = require('../pwtool/node_modules/playwright-core');const path=require('path');
const SH=path.resolve(__dirname,'../council-v13/shots');
const FILE=require('url').pathToFileURL(path.resolve(__dirname,'test.html')).href;
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const p=await b.newPage({viewport:{width:412,height:915},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{try{localStorage.clear()}catch(e){}});
await p.goto(FILE);await p.waitForTimeout(500);
// 1) nothing built
await p.evaluate(()=>{const G=D.g();G.tips={casa:1};G.screen='casa';G.coins=320;D.render()});
await p.screenshot({path:SH+'/house-new-1-buit.png',fullPage:true});
const box=async(n)=>{const el=await p.$('.house');await el.screenshot({path:SH+'/house-new-'+n+'.png'})};
await box('1-buit-dibuix');
// 2) partway: some built, element rooms partly unlocked
await p.evaluate(()=>{const G=D.g();G.done={'foc:z0':1,'foc:z1':1,'foc:z2':1,'aigua:z2':1};G.built={habitacio:1,mobles:2,llit:1,posters:1,consola:1,pufs:2,cuina:1,salaFoc:1,skate:1,foguera:1,jardi:1};G.coins=480;
 const sp=D.sps();while(G.owned.length<7)G.owned.push(D.mk(sp[G.owned.length*3%sp.length]));D.render()});
await p.screenshot({path:SH+'/house-new-2-mig.png',fullPage:true});await box('2-mig-dibuix');
// 3) everything built
await p.evaluate(()=>{const G=D.g();G.done={};D.ORDER.forEach(w=>{G.done[w+':z0']=1;G.done[w+':z1']=1;G.done[w+':z2']=1});G.psiquic=true;
 G.built={};D.B().forEach(x=>G.built[x.k]=x.max);G.coins=5000;G.items=G.items.concat(['capaEstrellada','anellEstel','ullCristall']);
 const sp=D.sps();while(G.owned.length<24)G.owned.push(D.mk(sp[G.owned.length*3%sp.length]));G.hFold={};D.render()});
await p.screenshot({path:SH+'/house-new-3-tot.png',fullPage:true});await box('3-tot-dibuix');
// 4) everything built, no critters at home view of the drawing (to see decor)
await p.evaluate(()=>{const G=D.g();G._o=G.owned;G.owned=G.owned.slice(0,1);D.render()});await box('4-tot-sense-bestioles');
await p.evaluate(()=>{const G=D.g();G.owned=G._o;delete G._o;D.render()});

// list shots on a tall viewport
const q=await b.newPage({viewport:{width:412,height:3000},deviceScaleFactor:1.5});q.on('pageerror',e=>errs.push(e.message));
await q.addInitScript(()=>{try{localStorage.clear()}catch(e){}});await q.goto(FILE);await q.waitForTimeout(400);
await q.evaluate(()=>{const G=D.g();G.tips={casa:1};G.screen='casa';G.done={'foc:z2':1,'aigua:z2':1};G.built={habitacio:1,mobles:2,llit:1,posters:1,consola:1,pufs:2,cuina:1,salaFoc:1,skate:1,foguera:1,jardi:1};G.coins=480;D.render()});
await (await q.$('.h14builds')).screenshot({path:SH+'/house-new-5-llista.png'});
// effects test
const fx=await q.evaluate(()=>{const G=D.g();D.B().forEach(x=>G.built[x.k]=x.max);G.done={};D.ORDER.forEach(w=>G.done[w+':z2']=1);
 G.owned.forEach(c=>{c.fat=1;c.rest=0});const f0=JSON.stringify(G.food),c0=G.coins;
 G.world='aigua';G.zone=0;G.pick=[G.owned[0].uid];D.ev('startRun()');D.ev('run().coins=100');D.ev('finishRun(true)');
 return {house:G.summary.house,coins:G.summary.coins,gained:G.coins-c0,food0:f0,food1:JSON.stringify(G.food),forge:(D.render(),D.ev('FORGE_COST.join(",")')),cap:D.ev('cap()'),resum:D.ev('scResum()').indexOf('La casa ajuda')>=0}});
console.log(JSON.stringify(fx,null,1));
await q.evaluate(()=>{D.act('hfold',{k:'dorm'})});console.log('fold dorm ->',await q.evaluate(()=>D.g().hFold.dorm));
await q.evaluate(()=>{const G=D.g();G.done={};G.built={};G.coins=999;D.act('build',{k:'salaFoc'})});console.log('locked build blocked:',await q.evaluate(()=>!D.g().built.salaFoc));
console.log('errors:',errs);await b.close()})();
