'use strict';
/* ================= RENDER ================= */
function bar(pct,color,id){return '<div class="bar"'+(id?' id="'+id+'"':'')+'><i class="ghost" style="width:'+Math.max(0,Math.min(100,pct))+'%"></i><i style="width:'+Math.max(0,Math.min(100,pct))+'%;background:'+color+'"></i></div>'}
function hpColor(p){return p>60?'#3DAA5C':p>30?'#F2A20F':'#E0483B'}
function fatigueText(c){
  var w=busyWorld(c);if(w)return 'D’aventura a '+ELS[w].mon;
  if(c.rest>0)return 'Cansada: ha de descansar '+c.rest+' expedici'+(c.rest>1?'ons':'ó')+' (o una estona)';
  var left=maxFat(c)-c.fat;return 'Pot fer '+left+' expedici'+(left>1?'ons':'ó')+' més';
}
/* "de" before a name: d’Aigua, de Foc */
function deNom(s){return (/^[AEIOUÀÈÉÍÒÓÚaeiouàèéíòóú]/.test(s)?'d’':'de ')+s}
function tip(key,text){if(G.tips[key])return '';return '<div class="tip"><p>'+text+'</p><button type="button" class="btn sm" data-act="tip" data-k="'+key+'">Entesos</button></div>'}
function riskHtml(n){var s='<span class="risk" aria-label="Risc '+n+' de 2">';for(var i=0;i<2;i++)s+='<i class="'+(i<n?'on':'')+'"></i>';return s+' '+(n===0?'Segur':n===1?'Una mica arriscat':'Arriscat')+'</span>'}
function topBar(){
  var r=G.screen==='run'&&run();
  return (r?'<span class="pill">'+esc(ELS[r.world].mon)+'</span><span class="pill">'+COIN+'+'+r.coins+'</span>':'<span class="pill">'+COIN+G.coins+'</span><span class="pill">Places '+G.owned.length+'/'+cap()+'</span>')+
    '<button type="button" class="btn sm light mob" style="margin-left:auto;min-height:40px" data-act="chat">Comentaris ('+(F.items.length)+')</button>';
}
function render(){
  h14Forge();
  applyRestClock();
  $('top').innerHTML=topBar();
  var s=G.screen,h='';
  if(s==='casa')h=scCasa();else if(s==='explorar')h=scExplorar();else if(s==='mon')h=scMon();else if(s==='equip')h=scEquip();
  else if(s==='run')h=scRun();else if(s==='resum')h=scResum();else if(s==='bestioles')h=scBestioles();else if(s==='motxilla')h=scMotxilla();
  if(!storageOk)h='<p class="tip">Aquest navegador no deixa guardar la partida: si tanques la pàgina, es perd.</p>'+h;
  $('screen').innerHTML=h;
  var navOn=s!=='run';$('nav').hidden=!navOn;
  if(navOn){
    var cur=s==='mon'||s==='equip'||s==='resum'?'explorar':s;
    $('nav').innerHTML=['casa','explorar','bestioles','motxilla'].map(function(k){var lbl={casa:'Casa',explorar:'Explorar',bestioles:'Bestioles',motxilla:'Motxilla'}[k];
      var hint=k==='explorar'&&G.completed===0&&cur!=='explorar';
      return '<button type="button" class="navb'+(cur===k?' on':'')+(hint?' hint':'')+'" data-act="nav" data-to="'+k+'"'+(cur===k?' aria-current="page"':'')+'><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="'+NAV_ICONS[k]+'"/></svg>'+lbl+'</button>'}).join('');
  }
  var oldSheet=document.querySelector('#overlay .sheet'),keep=oldSheet&&oldSheet.dataset.s===G.detail?oldSheet.scrollTop:0;
  $('overlay').innerHTML=G.detail?detailSheet():'';
  var newSheet=document.querySelector('#overlay .sheet');if(newSheet&&keep)newSheet.scrollTop=keep;
  $('fbCtx').textContent='S’apuntarà on ets: '+contextText();
  var r=run();
  if(s==='run'&&r&&r.event&&r.event.type==='battle'&&!r.event.over){updateAbilities();$('shield').classList.toggle('on',r.event.shield>0);$('warn').classList.toggle('on',!!r.event.warn);scheduleTick()}else stopBattle();
  persist();
  menuDots();
}
/* red dots on the menu: a critter can evolve, something can be forged, better gear is in the backpack */
function menuDots(){try{var nav=$('nav');if(!nav||!nav.querySelector)return;
  var dots={bestioles:allCr().some(function(c){return evoCheck(c).ok}),motxilla:forgeReady().length>0||betterGear()};
  Object.keys(dots).forEach(function(k){if(!dots[k])return;var b=nav.querySelector('[data-to="'+k+'"]');if(b&&!b.querySelector('.rdot')){var s=document.createElement('span');s.className='rdot';s.setAttribute('aria-label','hi ha novetats');b.appendChild(s)}})}catch(e){}}

var resetArm=false,abandonArm=null,restartArm=false,buildArm=null;
