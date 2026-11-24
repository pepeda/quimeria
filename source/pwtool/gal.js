const { chromium } = require('playwright-core');
const path=require('path');
const SH=path.resolve(__dirname,'../council-v13/shots');
const FILE=require('url').pathToFileURL(path.resolve(__dirname,'../council-v13/dbg/joc.html')).href;
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const p=await b.newPage({viewport:{width:900,height:900},deviceScaleFactor:1.5});
  await p.goto(FILE);await p.waitForTimeout(600);
  const html=await p.evaluate(()=>{
    const S=D.SPECIES,O=D.SP_ORDER;
    const row=s=>{const x=S[s];const e2=x.evos[2].el2||'';
      return '<tr><td style="font:700 13px sans-serif;width:150px">'+x.n+'<br><span style="font-weight:400;color:#666">'+x.el+' · '+x.role+' · '+x.shape+'</span></td>'+
      '<td>'+D.critter(x.el,'',72,false,false,x.shape)+'<div class=c>'+x.n+'</div></td>'+
      '<td>'+D.critter(x.el,'',72,false,true,x.shape)+'<div class=c>'+x.evos[0].n+' / '+x.evos[1].n+'</div></td>'+
      '<td>'+D.critter(x.el,e2,72,false,true,x.shape)+'<div class=c>'+x.evos[2].n+'</div></td>'+
      '<td>'+D.critter(x.el,'',32,false,false,x.shape)+D.critter(x.el,'',32,false,true,x.shape)+'</td></tr>'};
    const tbl=l=>'<table>'+l.map(row).join('')+'</table>';
    return {a:tbl(O.slice(0,20)),b:tbl(O.slice(20)),
      m:Object.keys(D.ELS).map(e=>D.monster(e,90,false)+D.monster(e,90,true)).join('')+'<br>'+D.hero(80)+D.hero(34)};
  });
  const css='<style>body{background:#FFF4E6;margin:8px}td{text-align:center;padding:2px 6px;border-bottom:1px solid #eee}.c{font:11px sans-serif}</style>';
  for(const [k,n] of [['a','10-galeria-bestioles-1-20'],['b','11-galeria-bestioles-21-40'],['m','12-monstres-guardians-heroi']]){
    await p.setContent(css+html[k]);await p.screenshot({path:SH+'/'+n+'.png',fullPage:true});console.log('SHOT',n)}
  await b.close();
})();
