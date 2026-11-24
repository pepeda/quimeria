'use strict';
/* ================= V14: Quimèria. Balance, very hard zone 4, forge choice, backpack tabs, red dots, sounds ================= */
try{document.title='Quimèria'}catch(e){}
function curZone(){var r=run();return r?(r.zone||0):-1}
/* --- balance: a stronger team makes ordinary enemies only a little stronger (square root), so evolving and gear are felt.
   In zone 4 enemies never get weaker for a weak team: they assume at least a team of level-3 critters with Epic gear. --- */
var HARD_TP={foc:3.8,aigua:3.8,planta:3.1,llamp:2.9,psiquic:2.7};
var enemyStatsV13=enemyStats;
enemyStats=function(L,g,ts,tp){tp=tp||1;var hard=curZone()===3,eff=hard?(HARD_TP[(run()||{}).world]||3):Math.pow(tp,0.5);
  var s=enemyStatsV13(L,g,ts,1);s.hp=Math.round(s.hp*eff);s.atk=Math.round(s.atk*(1+(eff-1)*(hard?0.4:0.3)));if(hard)s.def=Math.round(s.def*1.3);return s};
/* first boss of the game was too hard for the starters: zone-1 final guardian has 15% less life */
var makeBattleV13=makeBattle;
makeBattle=function(o){var bt=makeBattleV13(o),r=run();
  if(o&&o.final&&r&&(r.zone||0)===0&&!r.cave&&bt&&bt.enemy){bt.enemy.hp=Math.round(bt.enemy.hp*0.85);bt.enemy.max=bt.enemy.hp}
  if(bt&&bt.enemy&&curZone()===3)bt.enemy.hard=true;
  return bt};
/* --- zone 4 in every world: very hard, opens after zone 3 --- */
(function(){var Z4={foc:'Forja prohibida',aigua:'Abisme sense fons',planta:'Bosc maleït',llamp:'Ull de la tempesta',psiquic:'Malson etern'};
  Object.keys(Z4).forEach(function(w){if(ZONES[w]&&ZONES[w].length===3)ZONES[w].push(Z4[w])});
  if(ZONE_ROUTES.length===3)ZONE_ROUTES.push(['gen','fork','mini','gen','land','sig','gen','cave','mini','gen','fork2','spring','gen','land','mini','guardian']);
  if(ZONE_BONUS.length===3)ZONE_BONUS.push(260);
  if(ZONE_INFO.length===3)ZONE_INFO.push('MOLT DIFÍCIL. Els enemics no s’adapten al teu equip: calen bestioles de nivell 3 i equip Èpic o millor. Tres campaments, una cova i el guardià més fort del món.');})();
/* --- forge: choose 1 power out of 3 --- */
function scrollTop0(){try{var sc=$('screen');if(sc&&sc.scrollTo)sc.scrollTo(0,0);window.scrollTo&&window.scrollTo(0,0)}catch(e){}}
function forgeChoiceBlock(){var fc=G.forgeChoice;if(!fc)return '';var it=IT(fc.id);if(!it){G.forgeChoice=null;return ''}
  return '<div class="flat" style="gap:8px;background:#1E1B2E;color:#fff;outline:3px solid #F2B705"><h2 style="color:#fff">Tria el poder nou</h2><p class="small">'+esc(it.n)+' → '+esc(TIER_N[it.tier+1])+' · '+FORGE_COST[it.tier]+' monedes</p>'+
    fc.opts.map(function(k){return '<button type="button" class="btn gold" style="text-align:left;display:block" data-act="forgePick" data-k="'+k+'"><b>'+esc(AFFIX[k].n)+'</b>'+(AFFIX[k].d?'<span class="small" style="display:block;font-weight:600">'+esc(AFFIX[k].d)+'</span>':'')+'</button>'}).join('')+
    '<button type="button" class="btn light sm" data-act="forgeCancel">Encara no</button></div>'}
function betterGear(){try{var b=bestEquipSet().equip;return SLOTS.some(function(x){return (b[x[0]]||'')!==(G.equip[x[0]]||'')&&itemScore(b[x[0]]||'')>itemScore(G.equip[x[0]]||'')})}catch(e){return false}}
/* --- short sounds (WebAudio, under 0.2 s), vibration on big moments, a switch to turn them off --- */
var AC=null;
function snd(kind){if(G.mute)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();var t=AC.currentTime;
  var P={tap:[[660,0.05]],hit:[[220,0.06]],crit:[[180,0.05],[360,0.07]],heal:[[523,0.06],[784,0.08]],combo:[[392,0.06],[523,0.06],[784,0.1]],big:[[130,0.12],[98,0.18]],win:[[523,0.08],[659,0.08],[784,0.14]],lose:[[300,0.12],[200,0.18]],evolve:[[392,0.07],[523,0.07],[659,0.07],[1047,0.16]],forge:[[880,0.05],[1320,0.09]]}[kind];if(!P)return;
  P.forEach(function(p,i){var o=AC.createOscillator(),g=AC.createGain();o.type=kind==='big'||kind==='hit'?'square':'triangle';o.frequency.value=p[0];var s0=t+i*0.07;g.gain.setValueAtTime(0.0001,s0);g.gain.exponentialRampToValueAtTime(0.12,s0+0.01);g.gain.exponentialRampToValueAtTime(0.0001,s0+p[1]);o.connect(g);g.connect(AC.destination);o.start(s0);o.stop(s0+p[1]+0.02)})}catch(e){}}
function buzz(p){if(G.mute)return;try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}}
var showEventV13=showEvent;
showEvent=function(e){try{
  if(e.mega||e.all||e.t==='ult'){snd('big');buzz([60,40,120])}else if(e.t==='combo')snd('combo');
  else if(e.t==='hit')snd(e.eff==='super'||e.crit?'crit':'hit');else if(e.t==='heal'||e.t==='regen')snd('heal');
  else if(e.t==='foeDown')snd('win');else if(e.t==='teamDown')snd('lose');}catch(x){}
  return showEventV13(e)};
(function(){try{var st=document.createElement('style');st.textContent='.ab-row span{font-size:12px!important}.mtabs{display:flex;gap:6px;overflow-x:auto;margin:4px 0 10px}.mtab{position:relative;flex:1 0 auto;min-height:44px;border:2px solid #1E1B2E;background:#fff;border-radius:12px;font-weight:800;font-size:13px;padding:6px 10px;color:#1E1B2E}.mtab.on{background:#1E1B2E;color:#fff}.rdot{position:absolute;top:4px;right:6px;width:10px;height:10px;border-radius:50%;background:#E5322D;border:2px solid #fff}.navb{position:relative}';document.head.appendChild(st)}catch(e){}})();

