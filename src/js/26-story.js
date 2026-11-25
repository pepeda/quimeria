'use strict';
/* ================= TITLE SCREEN, INTRO AND HELP =================
   The title screen shows every time the game opens. A new player taps "Comença" and sees the intro
   (3 screens, tap to go on, "Salta" skips it). The "?" button in the top bar opens "Com es juga".
   G.story.intro = 1 once the intro was seen or skipped. */
var STARTERS=['espurnet','gotim','brotet','xispa'];
var INTRO=[
  {bg:'linear-gradient(#1B1530,#5B3C8C)',t:'Fa molt de temps, Quimèria era un sol món. Un dia es va trencar en cinc trossos.',
   art:function(){return '<span class="sfx stay r" style="position:relative;left:auto;top:auto;font-size:52px">CRAC!</span><div class="st-els">'+['foc','aigua','planta','llamp'].map(function(e){return elIcon(e,58,ELS[e].c)}).join('')+'<span class="st-q">?</span></div>'}},
  {bg:'linear-gradient(#A8E6B0,#EAF8EC)',t:'Tu vius a la casa del mig, on els trossos encara es toquen. Quatre bestioles t’han triat.',
   art:function(){return '<svg width="150" height="120" viewBox="0 0 180 150" aria-hidden="true"><ellipse cx="90" cy="120" rx="86" ry="26" fill="#7CC46B"/><rect x="60" y="62" width="62" height="50" rx="4" fill="#FFF4E0" stroke="#8A5A3C" stroke-width="3"/><rect x="82" y="84" width="18" height="28" fill="#8A5A3C"/><path d="M52 66 L91 32 L130 66 Z" fill="#E2574C" stroke="#A23A31" stroke-width="3"/></svg><div class="st-row">'+spArt(STARTERS[0],'',66)+spArt(STARTERS[1],'',66)+hero(72)+spArt(STARTERS[2],'',66)+spArt(STARTERS[3],'',66)+'</div>'}},
  {bg:'linear-gradient(#FFE9DC,#FFB38A)',t:'Explora els mons amb la teva colla. Acaba’ls tots i despertaràs la Quimera, la bestiola de tots els elements.',
   art:function(){return '<div class="st-row">'+spArt(STARTERS[0],'',120)+spArt(STARTERS[1],'',120)+'</div><span class="sfx stay r" style="position:relative;left:auto;top:auto;font-size:46px">VS</span><div style="line-height:0">'+monster('foc',150,true)+'</div>'}}
];
function storyLayer(cls){var ph=$('phone');if(!ph)return null;var old=ph.querySelector('.st-layer');if(old)old.remove();
  /* a battle waits while these screens are open */introPlaying=true;
  var d=document.createElement('div');d.className='st-layer '+cls;d.setAttribute('role','dialog');ph.appendChild(d);return d}
function closeStory(){var ph=$('phone'),d=ph&&ph.querySelector('.st-layer');if(d)d.remove();introPlaying=false;scheduleTick()}
function showTitle(){
  var d=storyLayer('st-title');if(!d)return;d.setAttribute('aria-label','Quimèria');
  var fresh=!G.story.intro&&!G.completed;
  d.innerHTML='<h1 class="st-name">QUIMÈRIA</h1><p class="st-sub">Recull bestioles. Fes-les créixer.<br>Explora cinc mons.</p>'+
    '<div class="st-row st-four">'+STARTERS.map(function(s){return spArt(s,'',100)}).join('')+'</div>'+
    '<button type="button" class="btn gold st-big" data-st="go">'+(fresh?'Comença':'Continua')+'</button>'+
    '<button type="button" class="btn light st-mid" data-st="help">Com es juga?</button>'+
    (fresh?'':'<button type="button" class="st-link" data-st="intro">Torna a veure la història</button>')+
    '<p class="st-foot">Joc per al mòbil, en català. La partida es guarda sola.</p>';
  d.addEventListener('click',function(ev){var b=ev.target.closest('[data-st]');if(!b)return;var k=b.dataset.st;
    if(k==='go'){if(fresh)showIntro(0);else{closeStory();if(quimeraWake()){persist();render();quimeraComic()}}}
    else if(k==='help')showHelp(true);
    else if(k==='intro')showIntro(0)});
}
function showIntro(i){
  var d=storyLayer('st-intro');if(!d)return;d.setAttribute('aria-label','Història');var S=INTRO[i];
  d.style.background=S.bg;
  d.innerHTML='<button type="button" class="st-skip" data-st="skip">Salta</button><div class="st-art">'+S.art()+'</div>'+
    '<div class="st-text">'+esc(S.t)+'</div><div class="st-dots" aria-label="Pantalla '+(i+1)+' de '+INTRO.length+'">'+INTRO.map(function(x,j){return j===i?'●':'○'}).join(' ')+'</div>'+
    '<div class="st-tap">'+(i<INTRO.length-1?'Toca per continuar':'Toca per començar a jugar')+'</div>';
  d.addEventListener('click',function(ev){
    var end=ev.target.closest('[data-st="skip"]')||i>=INTRO.length-1;
    if(end){G.story.intro=1;persist();closeStory();render()}else showIntro(i+1)});
}
function showHelp(fromTitle){
  var d=storyLayer('st-help');if(!d)return;d.setAttribute('aria-label','Com es juga');
  var beats=ORDER.map(function(e){return '<div class="st-beat">'+elIcon(e,26,ELS[e].c)+' <b>'+esc(ELS[e].n)+'</b> guanya a '+BEATS[e].map(function(x){return elIcon(x,20,ELS[x].c)+' '+esc(ELS[x].n)}).join(' i ')+'</div>'}).join('');
  d.innerHTML='<div class="st-sheet"><h2>Com es juga</h2>'+
    '<p><b>L’objectiu.</b> Explora els cinc mons i arriba fins al final de cada un. Pel camí, troba bestioles noves i fes-les créixer.</p>'+
    '<p><b>Explorar.</b> Tria un món, una zona i 3 bestioles. A cada lloc del camí tries què fas.</p>'+
    '<p><b>Batalles.</b> Les bestioles lluiten soles. Tu només mires. Si perds, pots tornar a començar la zona.</p>'+
    '<p><b>Bestioles noves.</b> Quan en trobes una de salvatge, guanya-la en una batalla o dona-li el seu menjar.</p>'+
    '<p><b>Fer-les créixer.</b> Amb menjar i expedicions pugen de nivell. Amb prou nivell i còpies (bestioles repetides de la mateixa espècie) evolucionen.</p>'+
    '<p><b>Elements.</b> Cada bestiola fa més mal als elements que guanya:</p>'+beats+
    '<p><b>La Quimera.</b> Quan guanyis el guardià de la zona 3 dels cinc mons, es despertarà la Quimera: la bestiola llegendària de tots els elements.</p>'+
    '<p><b>La casa.</b> Amb les monedes hi construeixes coses que ajuden les bestioles.</p>'+
    '<div class="st-btns"><button type="button" class="btn light" data-st="tips">Torna a veure els consells</button><button type="button" class="btn light" data-st="intro">Torna a veure la història</button><button type="button" class="btn gold" data-st="close">Tanca</button></div></div>';
  d.addEventListener('click',function(ev){var b=ev.target.closest('[data-st]');if(!b)return;var k=b.dataset.st;
    if(k==='tips'){G.tips={};persist();toast('Els consells tornaran a sortir.')}
    else if(k==='intro')showIntro(0);
    else if(k==='close'){if(fromTitle)showTitle();else{closeStory();render()}}});
}
