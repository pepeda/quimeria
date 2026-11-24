const { chromium } = require('playwright-core');
const path=require('path');
const SH=path.resolve(__dirname,'../council-v13/shots');
const FILE=require('url').pathToFileURL(path.resolve(__dirname,'../council-v13/dbg/joc-v14.html')).href;
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const p=await b.newPage({viewport:{width:820,height:900},deviceScaleFactor:1.5});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto(FILE);await p.waitForTimeout(600);
  const html=await p.evaluate(()=>{
    const S=D.SPECIES,O=D.SP_ORDER;
    const row=s=>{const x=S[s];const e2=x.evos[2].el2||'';
      return '<tr><td style="font:700 12px sans-serif;width:110px">'+x.n+'<br><span style="font-weight:400;color:#666">'+x.role+'</span></td>'+
      [[0,''],[1,''],[2,''],[2,e2]].map(a=>'<td>'+D.artDraw(s,a[0],a[1],false,84)+'</td>').join('')+
      '<td style="background:#fff">'+[0,1,2].map(st=>D.artDraw(s,st,'',false,32)).join('')+D.artDraw(s,0,'',true,32)+'</td></tr>'};
    const tbl=l=>'<table>'+l.map(row).join('')+'</table>';
    return [tbl(O.slice(0,10)),tbl(O.slice(10,20)),tbl(O.slice(20,30)),tbl(O.slice(30))];
  });
  const css='<style>body{background:#FFF4E6;margin:6px}td{text-align:center;padding:1px 4px;border-bottom:1px solid #eee}</style>';
  for(let i=0;i<4;i++){await p.setContent(css+html[i]);await p.screenshot({path:SH+'/new-gallery-'+(i+1)+'.png',fullPage:true});}
  console.log('errors',errs);
  await b.close();
})();
