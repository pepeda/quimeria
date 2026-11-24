const fs=require('fs'),p=require('path');const S=p.resolve(__dirname,'..');
let h=fs.readFileSync(S+'/joc/joc-bestioles.html','utf8');const blk=fs.readFileSync(S+'/joc/v14-house-js.txt','utf8');
const HD='/* ================= V14: house';let a=h.indexOf(HD);
if(a>=0){let e=h.indexOf('\n/* ================= ',a+10);h=h.slice(0,a)+h.slice(e+1);console.log('stripped old house block')}
const M='/* ================= COMMENTS ================= */';if(h.indexOf(M)<0)throw 'no marker';
h=h.replace(M,()=>blk+'\nwindow.D={g:function(){return G},render:function(){render()},act:function(a,d){act(a,d)},mk:function(s){return mk(s)},sps:function(){return SP_ORDER},B:function(){return BUILD},ORDER:ORDER,ev:function(s){return eval(s)}};\n'+M);
fs.writeFileSync(__dirname+'/test.html',h);
fs.writeFileSync(__dirname+'/test.js',h.slice(h.indexOf('<script>')+8,h.lastIndexOf('</script>')));
