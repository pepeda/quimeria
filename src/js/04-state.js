'use strict';
/* ================= STATE ================= */
function mk(sp){return {uid:'c'+Date.now().toString(36)+Math.random().toString(36).slice(2,7),sp:sp,stage:0,evo:-1,mill:0,fat:0,rest:0}}
function newGame(){
  return {v:2,coins:150,built:{},owned:[mk('brotet'),mk('gotim'),mk('espurnet'),mk('xispa')],food:{planta:1,aigua:1},items:[],equip:{},runs:{},active:null,done:{},completed:0,psiquic:false,
    screen:'explorar',world:null,path:null,pick:[],detail:null,summary:null,seen:{},tips:{},restClock:Date.now(),started:new Date().toISOString()};
}
function migrate(g){
  if(!g)return newGame();
  if(g.v===2)return g;
  if(g.v===1){var n=newGame();['coins','built','owned','food','items','equip','done','completed','psiquic'].forEach(function(k){if(g[k]!==undefined)n[k]=g[k]});
    if(n.equip&&n.equip.anell){n.equip.anell1=n.equip.anell;delete n.equip.anell}return n}
  return newGame();
}
var G=(function(){var raw=null,g=null;try{raw=localStorage.getItem(S_KEY)}catch(e){storageOk=false}
  try{g=raw?JSON.parse(raw):null}catch(e){g=null}
  if(raw&&(!g||typeof g!=='object'||(g.v!==1&&g.v!==2))){try{localStorage.setItem(S_KEY+'.bak-'+Date.now(),raw)}catch(e){}g=null}
  g=migrate(g);var d=newGame();Object.keys(d).forEach(function(k){if(g[k]===undefined||g[k]===null)g[k]=d[k]});
  if(!Array.isArray(g.owned))g.owned=[];g.owned=g.owned.filter(function(c){return c&&typeof c==='object'&&c.sp});if(!g.owned.length)g.owned=d.owned;
  if(!Array.isArray(g.items))g.items=[];['equip','built','food','runs','done','seen','tips'].forEach(function(k){if(typeof g[k]!=='object'||Array.isArray(g[k]))g[k]={}});
  return g})();
G.seen=G.seen||{};G.tips=G.tips||{};G.restClock=G.restClock||Date.now();
if(!G.evoTree){G.owned.forEach(function(c){if(c.stage===1&&c.evo>0)c.stage=2});G.evoTree=1}
function persist(){save(S_KEY,G)}

function sp(c){return SPECIES[c.sp]}
function byUid(u){for(var i=0;i<G.owned.length;i++)if(G.owned[i].uid===u)return G.owned[i];return null}
function cName(c){return c.stage?sp(c).evos[c.evo].n:sp(c).n}
function cEl2(c){return c.stage?(sp(c).evos[c.evo].el2||''):''}
function lvl(c){return c.stage+1}
function maxFat(c){return [0,3,5,8][lvl(c)]}
function cap(){var n=6;BUILD.forEach(function(b){n+=(G.built[b.k]||0)*b.cap});return n}
function bonusPct(eq){var b={atk:0,def:0,hp:0};Object.keys(eq).forEach(function(s){var it=IT(eq[s]);if(it){b.atk+=it.atk*3;b.def+=it.def*3;b.hp+=it.hp*2}});var P=powerOf(eq);return {atk:Math.round(b.atk+P.atk),def:Math.round(b.def+P.def),hp:Math.round(b.hp+P.hp)}}
function stats(c,eq){var b=ROLE[sp(c).role],k=(1+0.08*c.mill)*[1,1.35,1.75][c.stage],q=bonusPct(eq||G.equip);
  return {hp:Math.round(b.hp*k*(1+q.hp/100)),atk:Math.round(b.atk*k*(1+q.atk/100)),def:Math.round(b.def*k*(1+q.def/100)),heal:Math.round(b.heal*k)}}
function busyWorld(c){for(var w in G.runs)if(G.runs[w].team.indexOf(c.uid)>=0)return w;return null}
function run(){return G.active?G.runs[G.active]:null}
function effMult(c,d){var a=sp(c).el,b=cEl2(c);return b?0.7*mult(a,d)+0.3*mult(b,d):mult(a,d)}
function dmg(atk,m,def){return Math.max(1,Math.round(atk*m-def*0.5))}
function worldOpen(w){return w!=='psiquic'||G.psiquic}
function ownsSp(s){return G.owned.some(function(c){return c.sp===s})}
function speciesOf(w){return SP_ORDER.filter(function(s){return SPECIES[s].el===w})}
function formsOwned(){var f={};G.owned.forEach(function(c){if(c.stage)f[c.sp+':'+c.evo]=1});return Object.keys(f).length}
function starsN(L){return Math.max(1,Math.min(5,Math.round(L)))}
function starStr(n){var s='';for(var i=0;i<5;i++)s+=i<n?'★':'☆';return '<span class="stars" aria-label="Dificultat '+n+' de 5">'+s+'</span>'}
function pathL(w,path){return TIER[w]+(path==='llarg'?1:0)}
function worldScenes(w){return Object.keys(SCENES).filter(function(id){var s=SCENES[id];return (s.pool==='gen'||s.pool==='land'||s.pool==='fork'||(s.pool==='sig'&&s.world===w))})}
/* real-time rest: 1 point every 10 minutes at home (2 with the spa, and double again at night with the campfire) */
function applyRestClock(){
  var now=Date.now();if(!(G.restClock<=now))G.restClock=now;var steps=Math.floor((now-G.restClock)/600000);
  if(steps<=0)return;G.restClock+=steps*600000;
  var per=(G.built.spa?2:1)*Math.min(steps,20);
  G.owned.forEach(function(c){if(busyWorld(c))return;if(c.rest>0){c.rest=Math.max(0,c.rest-per);if(!c.rest)c.fat=0}else c.fat=Math.max(0,c.fat-per)});
  /* campfire (house): at night, from 21:00 to 8:00, the rest counts double */
  var hr=new Date().getHours();if(!G.built.foguera||(hr>=8&&hr<21))return;
  per=Math.min(steps,20);
  G.owned.forEach(function(c){if(busyWorld(c))return;if(c.rest>0){c.rest=Math.max(0,c.rest-per);if(!c.rest)c.fat=0}else c.fat=Math.max(0,c.fat-per)});
}
function available(c){return !busyWorld(c)&&c.rest===0}
var toastTimer=null;
function toast(m){var s=document.getElementById('toastSlot');s.innerHTML='<div class="toast" role="status">'+esc(m)+'</div>';clearTimeout(toastTimer);toastTimer=setTimeout(function(){s.innerHTML=''},2800)}

