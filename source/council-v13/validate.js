const fs=require('fs'),vm=require('vm');
const html=fs.readFileSync(process.argv[2],'utf8'),N=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));
function grab(start,endRe){const i=html.indexOf(start);if(i<0)throw 'missing '+start;const r=new RegExp(endRe,'g');r.lastIndex=i;const m=r.exec(html);return html.slice(i,m.index+m[0].length);}
const ctx={};vm.createContext(ctx);
vm.runInContext('function E(n,el2){return {n:n,el2:el2||""}}',ctx);
vm.runInContext(grab('var ELS={','\n};'),ctx);
vm.runInContext(grab('var SPECIES={','\n};'),ctx);
vm.runInContext(grab('Object.assign(SPECIES,{','\n}[)];'),ctx);
vm.runInContext(grab("SP_ORDER=['espurnet','fumet','brasa','xurrufet'",'\];'),ctx);
vm.runInContext(grab('var BOSS={','\}\};'),ctx);
vm.runInContext(grab('var SETS={','(?=var SET_KEYS)'),ctx);
vm.runInContext(grab('var MEGA=[','\}\];'),ctx);
const S=vm.runInContext('SPECIES',ctx),O=vm.runInContext('SP_ORDER',ctx),EL=vm.runInContext('ELS',ctx),B=vm.runInContext('BOSS',ctx),ST=vm.runInContext('SETS',ctx),M=vm.runInContext('MEGA',ctx);
let err=[],changed=0;
console.log('SP_ORDER length',O.length,'SPECIES keys',Object.keys(S).length);
for(const k of Object.keys(N.species)){const g=S[k],p=N.species[k];if(!g){err.push('species '+k+' missing');continue}
 if(!O.includes(k))err.push(k+' not in SP_ORDER');
 if(p.evos.length!==g.evos.length)err.push(k+' evos len '+p.evos.length+' vs '+g.evos.length);
 if(p.n!==g.n||p.evos.some((e,i)=>e!==g.evos[i].n))changed++;else err.push(k+' unchanged (should be omitted)');}
const missing=O.filter(k=>!N.species[k]);console.log('species in json',Object.keys(N.species).length,'changed',changed,'SP_ORDER not covered',missing);
for(const k of Object.keys(N.worlds))if(!EL[k])err.push('world '+k+' missing');
const bn=Object.values(B).map(b=>b.n);
for(const k of Object.keys(N.bosses))if(!bn.includes(k)&&!html.includes("n:'"+k+"'"))err.push('boss name '+k+' not found');
for(const k of Object.keys(N.mega))if(!M.find(m=>m.id===k))err.push('mega '+k+' missing');
for(const k of Object.keys(N.sets))if(!ST[k])err.push('set '+k+' missing');
// duplicate check across all new names
const all=[];for(const k in N.species){all.push(N.species[k].n,...N.species[k].evos)}
const dup=all.filter((x,i)=>all.indexOf(x)!==i);console.log('duplicate species/evo names',dup);
console.log(err.length?'ERRORS:\n'+err.join('\n'):'OK: all keys exist, all evos lengths match');
