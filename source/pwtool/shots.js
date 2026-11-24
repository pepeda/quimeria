const { chromium } = require('playwright-core');
const path=require('path');
const SH=path.resolve(__dirname,'../council-v13/shots');
const FILE=require('url').pathToFileURL(path.resolve(__dirname,'../council-v13/dbg/joc.html')).href;
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const p=await b.newPage({viewport:{width:412,height:915},deviceScaleFactor:2});
  await p.goto(FILE);await p.waitForTimeout(800);
  const acts=async()=>p.evaluate(()=>[...document.querySelectorAll('[data-act]')].filter(e=>e.offsetParent).map(e=>e.dataset.act+'|'+JSON.stringify(e.dataset)+'|'+e.textContent.trim().slice(0,30)).slice(0,40));
  const shot=async n=>{await p.screenshot({path:SH+'/'+n+'.png',fullPage:true});console.log('SHOT',n);};
  await shot('01-inici');console.log(await acts());
  // house, fresh
  await p.evaluate(()=>{const G=D.g();G.screen='casa';G.tips={};D.render()});await shot('02-casa-inicial');
  // house fully built + many critters
  await p.evaluate(()=>{const G=D.g();G.built={habitacio:3,jardi:1,piscina:1,spa:1,tennis:1,mobles:5};['dragonet','medusina','cranquet','mussolet','fantasmet','cucafera','popet','imantat'].forEach(s=>G.owned.push(D.mk(s)));G.owned[1].stage=1;G.owned[1].evo=0;G.coins=9999;D.render()});await shot('03-casa-completa');
  await p.evaluate(()=>{const G=D.g();G.screen='bestioles';D.render()});await shot('04-bestioles');
  await p.evaluate(()=>{const G=D.g();G.detail='dragonet';D.render()});await shot('05-fitxa-dragonet');
  await p.evaluate(()=>{const G=D.g();G.detail=null;G.psiquic=true;G.screen='explorar';D.render()});await shot('06-mapa');
  await b.close();
})();
