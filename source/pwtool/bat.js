const { chromium } = require('playwright-core');
const path=require('path');
const SH=path.resolve(__dirname,'../council-v13/shots');
const FILE=require('url').pathToFileURL(path.resolve(__dirname,'../council-v13/dbg/joc.html')).href;
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const p=await b.newPage({viewport:{width:412,height:915},deviceScaleFactor:2});
  await p.goto(FILE);await p.waitForTimeout(600);
  const acts=async()=>p.evaluate(()=>[...document.querySelectorAll('[data-act]')].filter(e=>e.offsetParent).map(e=>e.dataset.act+'|'+JSON.stringify(e.dataset)+'|'+e.textContent.trim().slice(0,30)));
  const click=async sel=>{await p.locator(sel).first().click({force:true});await p.waitForTimeout(500)};
  await p.evaluate(()=>{const G=D.g();G.tips={explorar:1,mon:1,equip:1,run:1,bestioles:1,casa:1};G.screen='explorar';D.render()});
  await click('[data-act=world][data-w=planta]');console.log('MON',await acts());
  const steps=process.argv.slice(2);
  for(const s of steps){await click(s);console.log('AFTER',s,await acts())}
  await p.screenshot({path:SH+'/'+'tmp.png'});
  await b.close();
})();
