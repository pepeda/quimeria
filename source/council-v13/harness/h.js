const fs=require('fs');
const html=fs.readFileSync(process.argv[2],'utf8');
let js=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
js=js.replace(/renderTypes\(\);render\(\);renderF\(\);\s*\}\)\(\);\s*$/,'globalThis.__ev=function(s){return eval(s)};})();');
function el(){const e={innerHTML:'',textContent:'',value:'',hidden:false,style:{setProperty(){}},dataset:{},children:[],
 classList:{add(){},remove(){},toggle(){},contains(){return false}},appendChild(c){return c},replaceChildren(){},remove(){},addEventListener(){},
 setAttribute(){},querySelector(){return null},contains(){return true},focus(){},select(){},parentNode:null,scrollTop:0,scrollHeight:0,offsetWidth:0};e.parentNode={classList:e.classList};return e}
const els={};
global.store={}; if(process.env.SAVE) store['bestioles-joc-v1']=process.env.SAVE;
global.localStorage={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{if(global.FULL)throw new Error('QuotaExceeded');store[k]=String(v)},removeItem:k=>delete store[k]};
global.document={getElementById:id=>els[id]||(els[id]=el()),createElement:()=>el(),querySelector:()=>null,addEventListener(){}};
global.window={matchMedia:()=>({matches:false})};global.navigator={};
global.timers=[];global.setTimeout=(f,ms)=>{timers.push(f);return timers.length};global.clearTimeout=()=>{};
eval(js);
module.exports=globalThis.__ev;
