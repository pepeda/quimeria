'use strict';
/* ================= STATE ================= */
/* a new critter of species sp: forma 1 (stage 0), level 1 */
function mk(sp){return {uid:'c'+Date.now().toString(36)+Math.random().toString(36).slice(2,7),sp:sp,stage:0,evo:-1,lvl:1,xp:0,fat:0,rest:0}}
/* version of the save format: a save of another version is kept as a backup and a new game starts */
var SAVE_V=3;
function newGame(){
  return {v:SAVE_V,niu:[],chest:null,megas:{},coins:150,built:{},owned:[mk('brotet'),mk('gotim'),mk('espurnet'),mk('xispa')],food:{planta:1,aigua:1},items:[],equip:{},runs:{},active:null,done:{},completed:0,psiquic:false,
    screen:'explorar',world:null,path:null,pick:[],detail:null,summary:null,seen:{},tips:{explorar:1,mon:1,equip:1,run:1},story:{},tut:{done:0},restClock:Date.now(),started:new Date().toISOString()};
}
var G=(function(){var raw=null,g=null;try{raw=localStorage.getItem(S_KEY)}catch(e){storageOk=false}
  try{g=raw?JSON.parse(raw):null}catch(e){g=null}
  /* an unreadable save or a save of an older version (before levels and forms): keep a copy and start a new game */
  if(raw&&(!g||typeof g!=='object'||g.v!==SAVE_V)){try{localStorage.setItem(S_KEY+'.bak-'+Date.now(),raw)}catch(e){}g=null}
  if(!g)g=newGame();var d=newGame();Object.keys(d).forEach(function(k){if(g[k]===undefined||g[k]===null)g[k]=d[k]});
  /* repair the critter lists. Unknown species are dropped only in 99-boot.js, after every species file has run */
  ['owned','niu'].forEach(function(k){if(!Array.isArray(g[k]))g[k]=[];g[k]=g[k].filter(function(c){return c&&typeof c==='object'&&c.sp});
    g[k].forEach(function(c){c.stage=Math.max(0,Math.min(3,c.stage|0));c.lvl=Math.max(1,Math.min(BAL.LEVEL_MAX,c.lvl|0||1));c.xp=Math.max(0,+c.xp||0);c.fat=c.fat|0;c.rest=c.rest|0})});
  if(!g.owned.length)g.owned=d.owned;
  if(!Array.isArray(g.items))g.items=[];['equip','built','food','runs','done','seen','tips','story','tut'].forEach(function(k){if(typeof g[k]!=='object'||Array.isArray(g[k]))g[k]={}});
  return g})();
G.seen=G.seen||{};G.tips=G.tips||{};G.story=G.story||{};if(!G.tut||typeof G.tut.done!=="number")G.tut={done:(G.completed>0||G.owned.length>4)?1:0};G.restClock=G.restClock||Date.now();
function persist(){save(S_KEY,G)}

function sp(c){return SPECIES[c.sp]}
function byUid(u){for(var i=0;i<G.owned.length;i++)if(G.owned[i].uid===u)return G.owned[i];return null}
/* every critter you have: at home (G.owned) and in the Niu (G.niu) */
function allCr(){return G.owned.concat(G.niu||[])}
function anyByUid(u){return allCr().filter(function(c){return c.uid===u})[0]||null}
function inNiu(c){return (G.niu||[]).indexOf(c)>=0}
/* name: forma 4 adds a word to the name of its forma 3 */
function cName(c){return c.stage?sp(c).evos[c.evo].n+(c.stage>=3?' '+FORM4_WORD:''):sp(c).n}
function cEl2(c){return c.stage?(sp(c).evos[c.evo].el2||''):''}
function lvl(c){return c.lvl||1}
function form(c){return c.stage+1}
/* experience: XP needed to go from level L to L+1; the highest level of the critter's form */
function xpNeed(L){return Math.round(BAL.XP_FIRST*Math.pow(BAL.XP_GROWTH,L-1))}
function levelCap(c){return BAL.FORM_CAP[c.stage]}
/* can it still gain XP? Not when it is at the highest level of its form with a full bar */
function canXp(c){return lvl(c)<levelCap(c)||c.xp<xpNeed(lvl(c))}
/* gives n XP; returns how many levels it went up. At the cap of its form the bar fills and waits for the evolution */
function addXp(c,n){var up=0;c.xp=(c.xp||0)+n;
  while(c.lvl<levelCap(c)&&c.xp>=xpNeed(c.lvl)){c.xp-=xpNeed(c.lvl);c.lvl++;up++}
  if(c.lvl>=levelCap(c))c.xp=Math.min(c.xp,xpNeed(c.lvl));return up}
function maxFat(c){return BAL.FATIGUE[c.stage]}
/* evolving: the rule for this critter's next form, and the copies it would use (lowest form and level first) */
function evoRule(c){return sp(c).legend?null:BAL.EVOLVE[c.stage]||null}
function copyPool(c){var R=evoRule(c);if(!R)return [];
  return allCr().filter(function(x){return x!==c&&x.sp===c.sp&&x.stage>=R.copyForm-1&&!busyWorld(x)&&G.pick.indexOf(x.uid)<0})
    .sort(function(a,b){return a.stage-b.stage||a.lvl-b.lvl||(a.xp||0)-(b.xp||0)})}
/* what is missing to evolve: {ok, rule, copies (to use), missing: [texts]} */
function evoCheck(c){var R=evoRule(c);if(!R)return {ok:false,final:true,missing:[]};
  var pool=copyPool(c),miss=[],need=R.copies-Math.min(R.copies,pool.length);
  if(lvl(c)<R.level)miss.push('Ha d’arribar al nivell '+R.level+' (ara és al '+lvl(c)+')');
  if(need>0)miss.push('Et '+(need>1?'falten ':'falta ')+need+(need>1?' còpies':' còpia')+' de forma '+R.copyForm+(R.copyForm>1?' o més':''));
  return {ok:!miss.length&&!busyWorld(c),rule:R,copies:pool.slice(0,R.copies),missing:miss}}
function cap(){var n=6;BUILD.forEach(function(b){n+=(G.built[b.k]||0)*b.cap});return n}
function bonusPct(eq){var b={atk:0,def:0,hp:0};Object.keys(eq).forEach(function(s){var it=IT(eq[s]);if(it){b.atk+=it.atk*3;b.def+=it.def*3;b.hp+=it.hp*2}});var P=powerOf(eq);return {atk:Math.round(b.atk+P.atk),def:Math.round(b.def+P.def),hp:Math.round(b.hp+P.hp)}}
function stats(c,eq){var b=ROLE[sp(c).role],k=(1+BAL.STAT_PER_LEVEL*(lvl(c)-1))*BAL.FORM_MULT[c.stage]*(sp(c).legend?BAL.LEGEND_MULT:1),q=bonusPct(eq||G.equip);
  return {hp:Math.round(b.hp*k*(1+q.hp/100)),atk:Math.round(b.atk*k*(1+q.atk/100)),def:Math.round(b.def*k*(1+q.def/100)),heal:Math.round(b.heal*k)}}
function busyWorld(c){for(var w in G.runs)if(G.runs[w].team.indexOf(c.uid)>=0)return w;return null}
function run(){return G.active?G.runs[G.active]:null}
function effMult(c,d){if(sp(c).all)return 1.5;var a=sp(c).el,b=cEl2(c);return b?0.7*mult(a,d)+0.3*mult(b,d):mult(a,d)}
function dmg(atk,m,def){return Math.max(1,Math.round(atk*m-def*0.5))}
function worldOpen(w){return w!=='psiquic'||G.psiquic}
function ownsSp(s){return allCr().some(function(c){return c.sp===s})}
function speciesOf(w){return SP_ORDER.filter(function(s){return SPECIES[s].el===w})}
/* evolved forms you have (forma 2, 3 and 4 of each branch) */
function formsOwned(){var f={};allCr().forEach(function(c){if(c.stage)f[c.sp+':'+c.stage+':'+c.evo]=1});return Object.keys(f).length}
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
/* a new critter goes home if there is room, else to the Niu (no limit). Returns true if it went home */
/* removes a critter for good (a copy used to evolve) */
function removeCritter(c){var i=G.owned.indexOf(c);if(i>=0)G.owned.splice(i,1);else{i=G.niu.indexOf(c);if(i>=0)G.niu.splice(i,1)}var p=G.pick.indexOf(c.uid);if(p>=0)G.pick.splice(p,1)}
function addCritter(c){if(G.owned.length<cap()){G.owned.push(c);return true}c.fat=0;c.rest=0;G.niu.push(c);return false}
var toastTimer=null;
function toast(m){var s=document.getElementById('toastSlot');s.innerHTML='<div class="toast" role="status">'+esc(m)+'</div>';clearTimeout(toastTimer);toastTimer=setTimeout(function(){s.innerHTML=''},2800)}

