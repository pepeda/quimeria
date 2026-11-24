const fs=require('fs'),path=require('path');
const dir=path.resolve(__dirname,'..');
let h=fs.readFileSync(dir+'/joc/joc-bestioles.html','utf8');
const blk=fs.readFileSync(dir+'/joc/v14-art-js.txt','utf8').trim();
const head='/* ================= V14 ART:';
const tailRe=/if\(n!==src\)detailSheet=eval\('\('\+n\+'\)'\)\}catch\(e\)\{\}\}\)\(\);/;
const i=h.indexOf(head);
if(i>=0){const m=tailRe.exec(h.slice(i));if(!m)throw 'old block end not found';h=h.slice(0,i)+blk+h.slice(i+m.index+m[0].length);console.log('replaced existing block')}
else{const mk='/* ================= COMMENTS ================= */';h=h.replace(mk,blk+'\n'+mk);console.log('inserted before COMMENTS')}
const mk='/* ================= COMMENTS ================= */';
h=h.replace(mk,'window.D={g:function(){return G},render:render,mk:mk,artDraw:artDraw,spArt:spArt,SPECIES:SPECIES,SP_ORDER:SP_ORDER,ELS:ELS};\n'+mk);
fs.writeFileSync(dir+'/council-v13/dbg/joc-v14.html',h);
fs.writeFileSync(dir+'/council-v13/dbg/joc-v14-script.js',h.slice(h.indexOf('<script>')+8,h.lastIndexOf('</script>')));
console.log('blocks in copy:',h.split(head).length-1);
