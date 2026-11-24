const { chromium } = require('playwright-core');const path=require('path');
const SH=path.resolve(__dirname,'../council-v13/shots');
const FILE=require('url').pathToFileURL(path.resolve(__dirname,'../council-v13/dbg/joc.html')).href;
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const p=await b.newPage({viewport:{width:412,height:915},deviceScaleFactor:2});await p.goto(FILE);await p.waitForTimeout(500);
await p.evaluate(()=>{const G=D.g();G.tips={motxilla:1};G.items=['espasaFusta','cascCristall#3~a','capaEstrellada','botesNuvol#2','anellFoc','escutCloska'];G.equip={espasa:'espasaLlamp#4',capa:'capaFulles'};G.screen='motxilla';D.render()});
await p.screenshot({path:SH+'/14-motxilla.png',fullPage:true});await b.close()})();
