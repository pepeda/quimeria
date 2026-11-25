'use strict';
/* ================= FIRST-EXPEDITION GUIDE, MENU UNLOCKS AND NEXT GOAL =================
   A new game (nothing finished yet) starts a guide that leads every tap:
   - the rest of the screen is dark and cannot be tapped; only the framed button works;
   - an arrow points at that button and a sign explains, in one or two short sentences, what happens;
   - "Salta la guia" on the sign ends it at any moment.
   The guided expedition has a fixed route with no choice that costs coins: a first place (food),
   a wild critter to feed, a monster, a camp with 2 monsters, a spring to rest, and the guardian.
   Enemies have 70% of their life. After the guardian: open the chest, then the Casa opens.
   The bottom menu shows only Explorar at first; Motxilla, Bestioles and Casa appear when they are useful.
   Saves from before the guide (anything finished) count as done and see the whole menu. */
var TUT_TEAM=['brotet','gotim','xispa'];
var TUT_TIPS=['explorar','mon','equip','run'];
var TUT_GUARD_HP=0.7; /* the enemies of the guided expedition have 70% of their life */
var STARTER_SP=['brotet','gotim','espurnet','xispa'];
/* the scenes of the guided route: one choice each, nothing to pay */
SCENES.tut_cami={n:'El començament',art:'trail',pool:'tut',nodes:{a:{t:'Comença l’aventura! A cada lloc del camí passa alguna cosa.',ch:[{l:'Mira què hi ha',d:'Hi ha alguna cosa entre l’herba.',risk:0,out:{food:1}}]}}};
SCENES.tut_monstre={n:'Un monstre al camí',art:'rocks',pool:'tut',nodes:{a:{t:'Un monstre et barra el pas.',ch:[{l:'Lluita',d:'Si guanyes, monedes.',risk:1,out:{fight:1,win:{coins:20}}}]}}};
SCENES.tut_font={n:'La font',art:'spring',pool:'tut',nodes:{a:{t:'Una font d’aigua fresca. L’equip pot descansar.',ch:[{l:'Descanseu',d:'Tot l’equip es cura.',risk:0,out:{heal:100}}]}}};
function tutRoute(){return [{k:'gen',scene:'tut_cami'},{k:'wild',sp:tutWild()},{k:'gen',scene:'tut_monstre'},{k:'mini'},{k:'spring',scene:'tut_font'},{k:'guardian'}]}
function tutOn(){return !!(G.tut&&!G.tut.done&&!(G.completed&&!G.tut.ran))}
function tutEnd(skipped){if(!G.tut)G.tut={};G.tut.done=1;
  if(skipped)TUT_TIPS.forEach(function(k){delete G.tips[k]});
  tutClear();persist()}
function tutClear(){['coach','tutArrow'].forEach(function(id){var c=$(id);if(c&&c.remove)c.remove()});
  var ph=$('phone');if(ph&&ph.classList){ph.classList.remove('has-coach');ph.classList.remove('coach-top')}}
/* the team for the guided expedition: the first critter of each starter species that can go */
function tutPick(){return TUT_TEAM.map(function(s){var c=G.owned.filter(function(x){return x.sp===s&&!busyWorld(x)&&!x.rest})[0];return c&&c.uid}).filter(Boolean)}
/* the wild critter of the guided expedition: a Water species the player does not have yet */
function tutWild(){var l=speciesOf('aigua').filter(function(s){return !ownsSp(s)});return l.length?pickOne(l):pickOne(speciesOf('aigua'))}

/* ---- the bottom menu: which buttons show ---- */
function navOpen(k){
  if(k==='explorar')return true;
  var old=G.completed>=3;
  if(k==='casa')return old||!!(G.tut&&G.tut.done)||G.completed>0;
  if(k==='motxilla')return old||G.items.length>0||Object.keys(G.equip||{}).some(function(s){return G.equip[s]});
  if(k==='bestioles')return old||allCr().some(function(c){return STARTER_SP.indexOf(c.sp)<0});
  return true;
}
var NAV_NEW={casa:'Nou: la Casa! Aquí descansen les bestioles i hi pots construir.',motxilla:'Nou: la Motxilla! Hi guardes els objectes que trobes.',bestioles:'Nou: Bestioles! Aquí veus totes les que tens.'};
/* a toast the first time a menu button appears */
function navAnnounce(){if(!G.tut)return;G.tut.nav=G.tut.nav||{};
  ['casa','motxilla','bestioles'].forEach(function(k){if(navOpen(k)&&!G.tut.nav[k]){G.tut.nav[k]=1;if(!tutOn())toast(NAV_NEW[k])}})}

/* ---- what the sign says now, and which button the arrow points at ---- */
function tutStep(){
  var r=G.screen==='run'&&run(),e=r&&r.event;
  if(G.detail)return null;
  if(G.tut.ran){
    if(G.screen==='resum'&&G.chest&&!G.chest.open)return {sel:'[data-act="chestTap"]',t:'Has acabat la zona! Toca el cofre per obrir-lo. Cada toc el pot fer millor.'};
    if(G.screen!=='casa')return {sel:'[data-act="nav"][data-to="casa"]',t:'Ara tens una casa. Allà descansen les bestioles i hi construeixes coses amb les monedes. Toca Casa.'};
    return null;
  }
  if(G.screen==='explorar'&&!G.active)return {sel:'[data-act="world"][data-w="aigua"]',t:'Aquest és el mapa. Cada bola és un món. Toca el món de l’Aigua.'};
  if(G.screen==='mon')return G.world==='aigua'?{sel:'[data-act="path"][data-p="0"]',t:'Cada món té 5 zones. Comença per la Zona 1.'}:{sel:'[data-act="world"][data-w="aigua"]',t:'Primer prova el món de l’Aigua.'};
  if(G.screen==='equip')return {sel:'[data-act="go"]',t:'Aquestes són les teves bestioles. Unes ataquen, unes protegeixen i unes curen. Ja te les he triat. Toca Surt a explorar.'};
  if(!r||!e)return null;
  if(e.type==='scene'){var id=r.scene;
    return {sel:'.opt:not([disabled])',t:id==='tut_cami'?'Les boles de dalt són el camí. Ara ets a la primera. Toca l’opció.':id==='tut_monstre'?'Un monstre! Toca Lluita.':id==='tut_font'?'Una font. Aquí l’equip es cura. Toca Descanseu.':'Tria què fas en aquest lloc.'}}
  if(e.type==='battle'){if(e.over==='win')return {sel:'[data-act="bwin"]',t:'Heu guanyat! Toca Continua.'};
    if(e.over==='lose')return {sel:'[data-act="restartNow"]',t:'No passa res. Torna-ho a provar amb tota la vida.'};
    return {sel:null,t:'Les bestioles lluiten soles. Quan la barra groga d’una bestiola s’omple, fa un atac especial.'}}
  if(e.type==='wild')return (G.food[SPECIES[e.sp].el]||0)>0?{sel:'[data-act="wfeed"]',t:'Una bestiola salvatge! Dona-li menjar i serà teva.'}:{sel:'[data-act="wfight"]',t:'Una bestiola salvatge! Guanya-la i serà teva.'};
  if(e.type==='card'&&e.kind==='critter')return document.querySelector('[data-act="join"]')?{sel:'[data-act="join"]',t:'Ja és teva! Afegeix-la a l’equip.'}:{sel:'[data-act="claim"]',t:'Ja és teva! T’esperarà a casa. Toca Envia-la a casa.'};
  if(e.type==='card')return {sel:'[data-act="claim"]',t:e.kind==='food'?'Has trobat menjar. Amb menjar, una bestiola salvatge vindrà amb tu. Toca Continua.':e.kind==='coins'?'Monedes! Amb les monedes construiràs coses a la teva casa. Toca Continua.':e.kind==='item'?'Un objecte! Va a la motxilla i fa més fort l’equip. Toca Continua.':'Toca Continua.'};
  if(e.type==='note')return {sel:'[data-act="next"]',t:'Toca Continua.'};
  if(e.type==='miniPre')return {sel:'[data-act="mfight"]',t:'Un campament amb 2 monstres. Quan en guanyes un, arriba l’altre. Toca Ataca.'};
  if(e.type==='guardianPre')return {sel:'[data-act="gfight"]',t:'El guardià vigila el final de la zona. Guanya’l i acabaràs la zona!'};
  return null;
}
var tutCur=null;
/* after every render: the sign, the arrow and the frame */
function tutUpdate(){try{tutDraw()}catch(x){}}
function tutDraw(){
  var old=document.querySelectorAll('.coach-on');for(var i=0;i<old.length;i++)old[i].classList.remove('coach-on');
  var ph=$('phone');if(!ph)return;
  var s=tutOn()?tutStep():null;
  if(G.tut&&G.tut.ran&&!s&&!G.tut.done){G.tut.done=1;persist();toast('Ja saps jugar! Si tens dubtes, toca el botó ? de dalt.')}
  tutCur=s;
  if(!s){tutClear();return}
  ph.classList.add('has-coach');
  var c=$('coach');
  if(!c){c=document.createElement('div');c.id='coach';c.className='coach';c.setAttribute('role','status');ph.appendChild(c);
    c.addEventListener('click',function(ev){if(ev.target.closest('[data-tut="skip"]')){tutEnd(true);render()}})}
  c.innerHTML='<p>'+esc(s.t)+'</p><button type="button" class="coach-skip" data-tut="skip">Salta la guia</button>';
  var t=s.sel?(document.querySelector('#screen '+s.sel)||document.querySelector(s.sel)):null;
  var a=$('tutArrow');if(!a){a=document.createElement('div');a.id='tutArrow';a.className='tut-arrow';a.setAttribute('aria-hidden','true');
    a.innerHTML='<svg width="44" height="54" viewBox="0 0 44 54"><path d="M22 52 L4 30 H15 V2 H29 V30 H40 Z" fill="#FFD54A" stroke="#1E1B2E" stroke-width="3" stroke-linejoin="round"/></svg>';ph.appendChild(a)}
  if(!t){a.style.display='none';ph.classList.remove('coach-top');return}
  t.classList.add('coach-on');
  try{t.scrollIntoView({block:'center'})}catch(x){}
  tutPlace(t);
}
/* put the arrow just above the button (below it, pointing up, if the button is near the top), and the sign on the other half */
function tutPlace(t){var ph=$('phone'),a=$('tutArrow');if(!ph||!a||!t||!t.getBoundingClientRect)return;
  var P=ph.getBoundingClientRect(),R=t.getBoundingClientRect(),cx=R.left-P.left+R.width/2,top=R.top-P.top,bot=R.bottom-P.top;
  var up=top<120;a.style.display='block';a.style.left=Math.round(cx-22)+'px';
  a.style.top=Math.round(up?bot+6:top-60)+'px';a.classList.toggle('up',up);
  ph.classList.toggle('coach-top',(top+bot)/2>P.height*0.55);
}
/* while the guide leads, a tap anywhere else does nothing */
document.addEventListener('click',function(ev){
  if(!tutCur||!tutOn())return;
  var x=ev.target;if(!x||!x.closest)return;
  if(x.closest('#coach')||x.closest('.st-layer')||x.closest('.mseq')||x.closest('#chat')||x.closest('[data-act="chat"]'))return;
  if(tutCur.sel&&x.closest('.coach-on'))return;
  ev.preventDefault();ev.stopPropagation();
},true);
if(window.addEventListener)window.addEventListener('resize',function(){var t=document.querySelector('.coach-on');if(t)tutPlace(t)});

/* ---- the "next goal" card at the top of Explorar and Casa ---- */
function nextGoal(){
  if(tutOn())return null;
  if(G.chest&&!G.chest.open)return {t:'Tens un cofre per obrir.',b:'Obre’l',a:'nav',d:'resum'};
  var ws=Object.keys(G.runs);if(ws.length)return {t:'Tens una aventura a mitges a '+ELS[ws[0]].mon+'.',b:'Continua',a:'resume',d:ws[0]};
  var ev=G.owned.filter(function(c){var k=evoCheck(c);return k&&k.ok})[0];if(ev&&navOpen('bestioles'))return {t:cName(ev)+' ja pot evolucionar.',b:'Mira-la',a:'detail',d:ev.sp};
  if(!G.owned.some(function(c){return !c.rest&&!busyWorld(c)}))return {t:'Les bestioles estan cansades. Deixa-les descansar una estona.',b:'Casa',a:'nav',d:'casa'};
  if(G.completed<4&&navOpen('bestioles')&&G.owned.some(function(c){return (G.food[sp(c).el]||0)>0&&canXp(c)}))return {t:'Tens menjar: dona’l a una bestiola perquè pugi de nivell.',b:'Bestioles',a:'nav',d:'bestioles'};
  var best=null;ORDER.forEach(function(w){if(!worldOpen(w))return;for(var z=0;z<ZONES[w].length;z++){if(G.done[w+':z'+z])continue;if(!zoneOpen(w,z))break;
    var v=z*10+TIER[w];if(!best||v<best.v)best={w:w,z:z,v:v};break}});
  if(best)return {t:'Objectiu: guanya el guardià de '+ZONES[best.w][best.z]+' ('+ELS[best.w].mon+').',b:'Som-hi',a:'world',d:best.w};
  return null;
}
function goalCard(){var g=nextGoal();if(!g)return '';
  var attr=g.a==='nav'?'data-to="'+g.d+'"':g.a==='detail'?'data-s="'+g.d+'"':'data-w="'+g.d+'"';
  return '<div class="goal"><span>'+esc(g.t)+'</span><button type="button" class="btn sm gold" data-act="'+g.a+'" '+attr+'>'+esc(g.b)+'</button></div>'}
