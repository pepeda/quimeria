'use strict';
/* ================= FIRST-EXPEDITION GUIDE AND NEXT GOAL =================
   A new game has G.tut.done = 0. Until the first expedition ends (or the player taps "Salta la guia"),
   a one-line bubble says what to do and the button to tap gets a moving yellow frame.
   The first expedition is in the Water world, zone 1, with the team already chosen, a short route
   (scene, a wild critter that can be fed, easy battle, spring, guardian) and softer enemies.
   Saves from before the guide (anything finished, or more than 4 critters) count as done. */
var TUT_TEAM=['brotet','gotim','xispa'];
var TUT_TIPS=['explorar','mon','equip','run'];
var TUT_ROUTE=['gen','wild','fight','spring','guardian'];
var TUT_GUARD_HP=0.7; /* the enemies of the guided expedition have 70% of their life */
function tutOn(){return !!(G.tut&&!G.tut.done&&!G.completed)}
function tutEnd(skipped){if(!G.tut)G.tut={};G.tut.done=1;
  if(skipped)TUT_TIPS.forEach(function(k){delete G.tips[k]});
  var c=$('coach');if(c)c.remove();var ph=$('phone');if(ph&&ph.classList)ph.classList.remove('has-coach');persist()}
/* the team for the guided expedition: the first critter of each starter species that can go */
function tutPick(){return TUT_TEAM.map(function(s){var c=G.owned.filter(function(x){return x.sp===s&&!busyWorld(x)&&!x.rest})[0];return c&&c.uid}).filter(Boolean)}
/* the wild critter of the guided expedition: a Water species the player does not have yet */
function tutWild(){var l=speciesOf('aigua').filter(function(s){return !ownsSp(s)});return l.length?pickOne(l):pickOne(speciesOf('aigua'))}
/* what the bubble says now, and which button it points at */
function tutStep(){
  var r=G.screen==='run'&&run(),e=r&&r.event;
  if(G.detail)return null;
  if(G.screen==='explorar'&&!G.active)return {sel:'[data-act="world"][data-w="aigua"]',t:'Toca el món d’Aigua per començar.'};
  if(G.screen==='mon')return G.world==='aigua'?{sel:'[data-act="path"][data-p="0"]',t:'Toca la Zona 1. Al final hi ha un guardià.'}:{sel:'[data-act="world"][data-w="aigua"]',t:'Primer prova el món d’Aigua.'};
  if(G.screen==='equip')return {sel:'[data-act="go"]',t:'L’equip ja està triat: un ataca, un protegeix i un cura. Toca Surt a explorar.'};
  if(!r||!e)return null;
  if(e.type==='scene')return {sel:'.opt:not([disabled])',t:'Tria què fas en aquest lloc del camí.'};
  if(e.type==='fork')return {sel:'[data-act="fork"]',t:'El camí es divideix. Tria per on vas.'};
  if(e.type==='battle'){if(e.over==='win')return {sel:'[data-act="bwin"]',t:'Heu guanyat! Toca Continua.'};
    if(e.over==='lose')return {sel:'[data-act="restartNow"]',t:'No passa res: torna-ho a provar amb tota la vida.'};
    return {sel:null,t:'Les teves bestioles lluiten soles. Tu només mires.'}}
  if(e.type==='wild')return (G.food[SPECIES[e.sp].el]||0)>0?{sel:'[data-act="wfeed"]',t:'Una bestiola nova! Dona-li menjar i vindrà amb tu.'}:{sel:'[data-act="wfight"]',t:'Una bestiola nova! Guanya-la i vindrà amb tu.'};
  if(e.type==='card'&&e.kind==='critter')return document.querySelector('[data-act="join"]')?{sel:'[data-act="join"]',t:'És teva! Afegeix-la a l’equip.'}:{sel:'[data-act="claim"]',t:'És teva! Viurà a la teva casa. Toca Envia-la a casa.'};
  if(e.type==='card')return {sel:'[data-act="claim"]',t:(e.kind==='item'?'Un objecte per a la motxilla.':e.kind==='food'?'Menjar per a les bestioles.':e.kind==='coins'?'Monedes per construir a la casa.':'')+' Toca Continua.'};
  if(e.type==='note')return {sel:'[data-act="next"]',t:'Toca Continua.'};
  if(e.type==='guardianPre')return {sel:'[data-act="gfight"]',t:'El guardià tanca la zona. Guanya’l!'};
  return null;
}
/* after every render: draw the bubble and frame the button */
function tutUpdate(){try{tutDraw()}catch(x){}}
function tutDraw(){
  var old=document.querySelectorAll('.coach-on');for(var i=0;i<old.length;i++)old[i].classList.remove('coach-on');
  var c=$('coach'),ph=$('phone');
  var s=tutOn()?tutStep():null;
  if(ph&&ph.classList)ph.classList.toggle('has-coach',!!s);
  if(!s){if(c)c.remove();return}
  if(!c){c=document.createElement('div');c.id='coach';c.className='coach';c.setAttribute('role','status');if(!ph)return;ph.appendChild(c);
    c.addEventListener('click',function(ev){if(ev.target.closest('[data-tut="skip"]')){tutEnd(true);render()}})}
  c.innerHTML='<p>'+esc(s.t)+'</p><button type="button" class="coach-skip" data-tut="skip">Salta la guia</button>';
  if(s.sel){var t=document.querySelector('#screen '+s.sel)||document.querySelector(s.sel);
    if(t){t.classList.add('coach-on');try{t.scrollIntoView({block:'center',behavior:RM?'auto':'smooth'})}catch(x){}}}
}

/* ---- the "next goal" card at the top of Explorar and Casa ---- */
function nextGoal(){
  if(tutOn())return null;
  if(G.chest&&!G.chest.open)return {t:'Tens un cofre per obrir.',b:'Obre’l',a:'nav',d:'resum'};
  var ws=Object.keys(G.runs);if(ws.length)return {t:'Tens una aventura a mitges a '+ELS[ws[0]].mon+'.',b:'Continua',a:'resume',d:ws[0]};
  var ev=G.owned.filter(function(c){var k=evoCheck(c);return k&&k.ok})[0];if(ev)return {t:cName(ev)+' ja pot evolucionar.',b:'Mira-la',a:'detail',d:ev.sp};
  if(!G.owned.some(function(c){return !c.rest&&!busyWorld(c)}))return {t:'Les bestioles estan cansades. Deixa-les descansar una estona.',b:'Casa',a:'nav',d:'casa'};
  if(G.completed<4&&G.owned.some(function(c){return (G.food[sp(c).el]||0)>0&&canXp(c)}))return {t:'Tens menjar: dona’l a una bestiola perquè pugi de nivell.',b:'Bestioles',a:'nav',d:'bestioles'};
  var best=null;ORDER.forEach(function(w){if(!worldOpen(w))return;for(var z=0;z<ZONES[w].length;z++){if(G.done[w+':z'+z])continue;if(!zoneOpen(w,z))break;
    var v=z*10+TIER[w];if(!best||v<best.v)best={w:w,z:z,v:v};break}});
  if(best)return {t:'Objectiu: guanya el guardià de '+ZONES[best.w][best.z]+' ('+ELS[best.w].mon+').',b:'Som-hi',a:'world',d:best.w};
  return null;
}
function goalCard(){var g=nextGoal();if(!g)return '';
  var attr=g.a==='nav'?'data-to="'+g.d+'"':g.a==='detail'?'data-s="'+g.d+'"':'data-w="'+g.d+'"';
  return '<div class="goal"><span>'+esc(g.t)+'</span><button type="button" class="btn sm gold" data-act="'+g.a+'" '+attr+'>'+esc(g.b)+'</button></div>'}
