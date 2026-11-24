'use strict';
/* ================= RENDER ================= */
function bar(pct,color,id){return '<div class="bar"'+(id?' id="'+id+'"':'')+'><i class="ghost" style="width:'+Math.max(0,Math.min(100,pct))+'%"></i><i style="width:'+Math.max(0,Math.min(100,pct))+'%;background:'+color+'"></i></div>'}
function hpColor(p){return p>60?'#3DAA5C':p>30?'#F2A20F':'#E0483B'}
function fatigueText(c){
  var w=busyWorld(c);if(w)return 'D’aventura a '+ELS[w].mon;
  if(c.rest>0)return 'Cansada: ha de descansar '+c.rest+' expedici'+(c.rest>1?'ons':'ó')+' (o una estona)';
  var left=maxFat(c)-c.fat;return 'Pot fer '+left+' expedici'+(left>1?'ons':'ó')+' més';
}
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
  var dots={bestioles:G.owned.some(function(c){return c.stage<2&&c.mill>=5}),motxilla:forgeReady().length>0||betterGear()};
  Object.keys(dots).forEach(function(k){if(!dots[k])return;var b=nav.querySelector('[data-to="'+k+'"]');if(b&&!b.querySelector('.rdot')){var s=document.createElement('span');s.className='rdot';s.setAttribute('aria-label','hi ha novetats');b.appendChild(s)}})}catch(e){}}

function scCasa(){
  var b=G.built,home=G.owned.filter(function(c){return !busyWorld(c)}),none=G.owned.filter(available).length===0&&!Object.keys(G.runs).length;
  var svg=houseSvg(b,home);
  var list=home.map(function(c){var left=c.rest>0?0:Math.round((maxFat(c)-c.fat)*100/maxFat(c));return '<div class="row" style="gap:10px">'+cArt(c,40)+'<div style="flex:1;min-width:0"><b>'+esc(cName(c))+'</b> '+roleTag(sp(c).role,true)+' <span class="muted small">niv. '+lvl(c)+'</span>'+bar(left,hpColor(left))+'<div class="muted small">'+esc(fatigueText(c))+'</div></div></div>'}).join('');
  return tip('casa','Aquesta és la teva casa. Aquí descansen les bestioles. Toca <b>Explorar</b> (a baix) per sortir d’aventura!')+
    '<h1>La teva casa</h1>'+svg+'<h2>Construir i decorar</h2><div class="h14builds">'+h14Builds()+'</div>'+
    (none?'<div class="flat" style="background:#FFF1C2"><h3>Totes les bestioles estan cansades</h3><p>Feu una migdiada i tornaran a estar a punt.</p><button type="button" class="btn gold" data-act="nap">Fes la migdiada</button></div>':'')+
    '<div class="flat"><div class="row between"><h3>Places per a bestioles</h3><b>'+G.owned.length+' de '+cap()+'</b></div>'+bar(G.owned.length*100/cap(),'#3DAA5C')+'<p class="muted small">Les bestioles es cansen per expedicions. A casa descansen: 1 punt per cada expedició que no fan, i també 1 punt cada 10 minuts.</p>'+list+'</div>'+
    '<div class="flat"><div class="row between"><h3>So i vibració</h3><button type="button" class="btn sm '+(G.mute?'light':'green')+'" data-act="mute" aria-pressed="'+(!G.mute)+'">'+(G.mute?'Apagat':'Encès')+'</button></div></div>'+
    '<div class="flat"><h3>Partida</h3><p class="muted">La partida es guarda en aquest mòbil o ordinador.</p><button type="button" class="btn light sm" data-act="reset">'+(resetArm?'Segur? Toca un altre cop':'Comença una partida nova')+'</button></div>';
}
var resetArm=false,abandonArm=null,restartArm=false;
/* the first house drawing: four rooms, rooms on top, garden, pool, spa, tennis and furniture (inside of the svg) */
function houseRooms(b){
  var m=b.mobles||0,h=b.habitacio||0,o='';
  o+='<rect x="0" y="196" width="366" height="74" fill="#7CC46B"/><path d="M0 196 H366" stroke="#5BA84E" stroke-width="3"/>';
  if(b.tennis)o+='<rect x="12" y="212" width="130" height="50" rx="4" fill="#E8743B"/><path d="M14 214 H140 V260 H14 Z M77 214 V260 M14 237 H140" stroke="#fff" stroke-width="2" fill="none"/><path d="M77 208 V266" stroke="#1E1B2E" stroke-width="3"/><circle cx="110" cy="228" r="4" fill="#E6F55A"/><text x="16" y="208" font-size="9" font-weight="800" fill="#1E1B2E">Pista de tennis</text>';
  if(b.spa)o+='<ellipse cx="190" cy="240" rx="34" ry="14" fill="#B58BE6" stroke="#6B2FB3" stroke-width="3"/><ellipse cx="190" cy="238" rx="26" ry="8" fill="#7CC0FF"/><circle cx="180" cy="236" r="2.5" fill="#fff"/><circle cx="196" cy="239" r="2" fill="#fff"/><circle cx="203" cy="235" r="2.5" fill="#fff"/><path d="M178 222 q-4 -6 0 -12 M190 220 q4 -6 0 -12 M202 222 q-4 -6 0 -12" stroke="#fff" stroke-width="2.5" fill="none"/><text x="168" y="266" font-size="9" font-weight="800" fill="#1E1B2E">Spa</text>';
  if(b.piscina)o+='<rect x="236" y="216" width="110" height="38" rx="12" fill="#2E8BE6" stroke="#fff" stroke-width="4"/><path d="M246 236 q8 -5 16 0 t16 0 t16 0 t16 0 t16 0" stroke="#BFE3F7" stroke-width="2.5" fill="none"/><path d="M336 210 V236 M344 210 V236 M336 218 H344 M336 226 H344" stroke="#9AA3B5" stroke-width="2.5"/><circle cx="300" cy="230" r="7" fill="none" stroke="#F26B3A" stroke-width="4"/><text x="240" y="266" font-size="9" font-weight="800" fill="#1E1B2E">Piscina</text>';
  for(var k=0;k<h;k++){var y=156-40*k;o+='<rect x="228" y="'+y+'" width="66" height="40" fill="#C98A5A" stroke="#8A5A3C" stroke-width="2"/><rect x="236" y="'+(y+6)+'" width="50" height="28" fill="#FFF1DA"/><rect x="254" y="'+(y+10)+'" width="14" height="10" fill="#BFE3F7" stroke="#8A5A3C" stroke-width="1.5"/>'}
  if(h)o+='<path d="M222 '+(156-40*(h-1))+' L261 '+(130-40*(h-1))+' L300 '+(156-40*(h-1))+' Z" fill="#E2574C" stroke="#A23A31" stroke-width="3" stroke-linejoin="round"/><text x="232" y="'+(150-40*(h-1)-10)+'" font-size="9" font-weight="800" fill="#fff">Habitacions</text>';
  if(b.jardi)o+='<path d="M300 186 H364 M300 196 H364" stroke="#fff" stroke-width="2.5"/>'+[304,316,328,340,352,362].map(function(x){return '<rect x="'+x+'" y="180" width="3" height="18" fill="#fff"/>'}).join('')+'<rect x="318" y="140" width="6" height="40" fill="#6B3E26"/><circle cx="321" cy="132" r="20" fill="#3B7D32"/><rect x="346" y="156" width="5" height="26" fill="#6B3E26"/><circle cx="348" cy="150" r="13" fill="#4E9A43"/>'+[[308,190,'#F26B3A'],[336,192,'#F7C948'],[356,190,'#9B59E0']].map(function(f){return '<circle cx="'+f[0]+'" cy="'+f[1]+'" r="3.5" fill="'+f[2]+'"/>'}).join('')+'<text x="304" y="176" font-size="9" font-weight="800" fill="#1E1B2E">Jardí</text>';
  o+='<path d="M20 86 L130 20 L240 86 Z" fill="#E2574C" stroke="#A23A31" stroke-width="3" stroke-linejoin="round"/><rect x="30" y="86" width="200" height="110" fill="#8A5A3C"/>'+
    '<rect x="38" y="94" width="88" height="46" fill="#FDE7C8"/><rect x="134" y="94" width="88" height="46" fill="#E8F1FF"/><rect x="38" y="146" width="88" height="46" fill="#FFF7E8"/><rect x="134" y="146" width="88" height="46" fill="#F1E3FF"/>'+
    '<g font-size="9" font-weight="800" font-family="Nunito,sans-serif"><text x="42" y="104" fill="#6B3E26">Dormitori</text><text x="138" y="104" fill="#1A5FA3">Bany</text><text x="42" y="156" fill="#6B3E26">Sala</text><text x="138" y="156" fill="#5B2A96">Racó de jocs</text></g>';
  if(m>=1)o+='<rect x="74" y="178" width="46" height="12" rx="4" fill="#C0392B"/><rect x="74" y="170" width="46" height="9" rx="4" fill="#E2574C"/>';
  if(m>=2)o+='<rect x="84" y="126" width="38" height="12" rx="3" fill="#fff" stroke="#9AA3B5"/><rect x="86" y="124" width="10" height="6" rx="2" fill="#BFE3F7"/>';
  if(m>=3)o+='<path d="M212 190 V164" stroke="#6B3E26" stroke-width="2"/><path d="M204 166 L212 154 L220 166 Z" fill="#F7C948"/>';
  if(m>=4)o+='<ellipse cx="82" cy="191" rx="34" ry="3" fill="#9B59E0"/>';
  if(m>=5)o+='<rect x="206" y="128" width="10" height="10" fill="#B5793E"/><circle cx="211" cy="122" r="8" fill="#3DAA5C"/>';
  return o;
}
function scExplorar(){
  var pos={foc:[145,0],llamp:[290,118],aigua:[236,300],planta:[54,300],psiquic:[0,118]};
  var lines='<svg width="390" height="460" viewBox="0 0 390 460" aria-hidden="true" style="position:absolute;left:0;top:0"><g stroke="#fff" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round" fill="none"><path d="M195 235 L195 60"/><path d="M195 235 L338 170"/><path d="M195 235 L286 350"/><path d="M195 235 L104 350"/><path d="M195 235 L50 170"/></g></svg>';
  var ws=ORDER.map(function(w){var p=pos[w],open=worldOpen(w),A=ELS[w],pct=open?worldPct(w):0;
    return '<button type="button" class="world" data-act="world" data-w="'+w+'" style="left:'+p[0]+'px;top:'+p[1]+'px"'+(open?'':' aria-label="Món desconegut"')+'><span class="ring" style="background:conic-gradient(#fff '+pct+'%,rgba(255,255,255,.35) 0)"><span class="ball" style="background:'+(open?A.c:'#8E94A8')+'">'+(open?elIcon(w,40,w==='llamp'?'#1E1B2E':'#fff'):'<span style="font-family:var(--display);font-size:40px;color:#fff">?</span>')+(G.runs[w]?'<span class="badge">A mitges</span>':'')+'</span></span>'+(open?esc(A.n)+' · '+pct+'%':'???')+(open?starStr(starsN(TIER[w])):'')+'</button>'}).join('');
  var house='<div style="position:absolute;left:145px;top:190px;width:100px;text-align:center"><svg width="100" height="80" viewBox="0 0 180 150" aria-hidden="true"><ellipse cx="90" cy="120" rx="86" ry="26" fill="#7CC46B"/><rect x="60" y="62" width="62" height="50" rx="4" fill="#FFF4E0" stroke="#8A5A3C" stroke-width="3"/><path d="M52 66 L91 32 L130 66 Z" fill="#E2574C" stroke="#A23A31" stroke-width="3"/></svg></div>';
  var paused=Object.keys(G.runs).map(function(w){var r=G.runs[w];return '<div class="row" style="gap:10px">'+elIcon(w,28,ELS[w].c)+'<div style="flex:1;min-width:0"><b>'+esc(ELS[w].mon)+'</b><div class="muted small">Pas '+(r.i+1)+' de '+r.slots.length+(r.cave?' · dins una cova':'')+'</div></div><button type="button" class="btn sm green" data-act="resume" data-w="'+w+'">Continua</button><button type="button" class="btn sm light" data-act="abandon" data-w="'+w+'">'+(abandonArm===w?'Segur?':'Deixa-la')+'</button></div>'}).join('');
  return tip('explorar','Toca un món per entrar-hi. El número % diu quant n’has explorat. Les estrelles ★ diuen com és de difícil.')+
    '<h1>Explorar</h1><p class="muted">Tria a quin món vols entrar.</p><div style="overflow-x:auto"><div class="map">'+lines+house+ws+'</div></div>'+
    (paused?'<div class="flat"><h3>Aventures a mitges</h3><p class="muted small">Les bestioles d’una aventura a mitges no poden anar enlloc més fins que l’acabis o la deixis.</p>'+paused+'</div>':'')+
    (G.psiquic?'':'<p class="muted">Completa 3 expedicions per descobrir el món desconegut ('+G.completed+' de 3).</p>');
}
function goodAgainst(w){return Object.keys(BEATS).filter(function(k){return BEATS[k].indexOf(w)>=0}).map(function(k){return ELS[k].n}).join(' o ')}
function crew(r){return '<div class="crew">'+hero(34)+r.team.map(function(u){var c=byUid(u);return c?cArt(c,34,false):''}).join('')+'</div>'}
function teamMini(r){
  return '<div class="grid3">'+r.team.map(function(u){var c=byUid(u);if(!c)return '';var mx=stats(c).hp,p=Math.round(r.hp[u]*100/mx);
    return '<div class="box" style="'+(r.hp[u]<=0?'opacity:.5':'')+'">'+cArt(c,32)+'<span>'+esc(cName(c))+'</span>'+roleTag(sp(c).role,true)+'<div style="width:100%">'+bar(p,hpColor(p))+'</div><span class="muted small">'+r.hp[u]+'/'+mx+'</span></div>'}).join('')+'</div>';
}
function bigCard(e){
  var art='',title='',sub='',btns='<button type="button" class="btn gold" data-act="claim">Continua</button>',border='var(--accent)',bg='#F4F1FA',rar='',muted=false;
  if(e.kind==='critter'){var s=SPECIES[e.sp];art=spArt(e.sp,'',120);title=s.n;sub=ELS[s.el].n+' · '+s.role+' · '+(TALENT[s.talent]?TALENT[s.talent].n:'');bg=ELS[s.el].soft;border=e.rare?'#9B59E0':ELS[s.el].c;rar=e.rare?'Rara':'Nova';
    var r=run(),ko=r?r.team.filter(function(u){return r.hp[u]<=0})[0]:null,canJoin=r&&(r.team.length<3||ko);
    btns=(canJoin?'<button type="button" class="btn gold" data-act="join">'+(r.team.length<3?'Afegeix-la a l’equip':'Substitueix '+esc(cName(byUid(ko)))+' (KO)')+'</button>':'')+'<button type="button" class="btn light" data-act="claim">Envia-la a casa</button>';}
  else if(e.kind==='dup'||e.kind==='full'){var s2=SPECIES[e.sp];art=spArt(e.sp,'',130);title=s2.n;sub=e.kind==='dup'?'Repetida':'No hi cap a casa';bg=ELS[s2.el].soft;muted=e.kind==='full'}
  else if(e.kind==='item'){var it=IT(e.item);art='<svg class="cr" width="110" height="110" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 L15 9 L22 9 L16.5 13.5 L18.5 21 L12 16.5 L5.5 21 L7.5 13.5 L2 9 L9 9 Z" fill="'+(it.relic?'#9B59E0':'#F7C948')+'" stroke="#1E1B2E" stroke-width=".8"/></svg>';title=it.n;rar=it.rar;border=it.relic?'#9B59E0':'#C98A00';
    sub=itemStats(it)+' · per a la motxilla';}
  else if(e.kind==='food'){art=elIcon(e.el,100,ELS[e.el].c);title=FOOD[e.el]+' ×'+e.n;sub='Menjar per a bestioles de '+ELS[e.el].n.toLowerCase();bg=ELS[e.el].soft;border=ELS[e.el].c}
  else if(e.kind==='coins'){art='<svg class="cr" width="100" height="100" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.5" fill="#F7C948" stroke="#C98A00" stroke-width="1.5"/><circle cx="10" cy="10" r="4" fill="none" stroke="#C98A00" stroke-width="1.5"/></svg>';title='+'+e.n+' monedes';border='#C98A00'}
  var head=e.kind==='critter'?'Bestiola nova!':e.kind==='item'?(IT(e.item).relic?'Tresor rar!':'Has trobat un objecte!'):e.kind==='food'?'Menjar!':e.kind==='coins'?'Monedes!':e.kind==='dup'?'Repetida!':'Vaja…';
  return '<div class="reveal'+(muted?' muted-panel':'')+'"><h2>'+esc(head)+'</h2>'+
    '<div class="bigcard" style="border-color:'+border+'"><div class="art" style="background:'+bg+'"><span class="sfx stay">'+(e.kind==='critter'?'NOVA!':e.kind==='item'?'TXAN!':e.kind==='coins'?'DING!':e.kind==='food'?'ÑAM!':e.kind==='dup'?'REPE!':'OH!')+'</span>'+(rar?'<span class="rar" style="background:'+border+'">'+esc(rar)+'</span>':'')+art+'</div><h2 style="color:var(--ink)">'+esc(title)+'</h2><div class="muted" style="text-align:center;padding:0 12px">'+esc(sub)+'</div><div class="muted" style="text-align:center;padding:0 12px">'+esc(e.why||'')+'</div></div>'+
    '<div style="display:flex;flex-direction:column;gap:10px;width:min(300px,100%)">'+btns+'</div></div>';
}
function scResum(){
  var s=G.summary||{ok:true,coins:0,tired:[]};
  return '<div class="flat" style="align-items:center;text-align:center;gap:10px"><h1>'+(s.ok?'Camí completat!':'Heu tornat a casa')+'</h1>'+
    '<p>'+esc(s.world?ELS[s.world].mon:'')+(s.world?' · explorat '+s.pct+'%':'')+'</p><span class="pill" style="background:#FFF4D6;font-size:20px">'+COIN+'+'+s.coins+'</span>'+
    (s.bonus?'<p class="muted">Inclou '+s.bonus+' monedes per acabar el camí.</p>':s.ok?'':s.keepAll?'<p class="muted">Has tornat abans del guardià: el camí no compta com a acabat.</p>':'<p class="muted">Has perdut la meitat de les monedes que portaves.</p>')+
    (s.tired&&s.tired.length?'<p>Molt cansades, han de descansar a casa: <b>'+esc(s.tired.join(', '))+'</b></p>':'')+
    (s.tennis?'<p>'+esc(s.tennis)+' ha jugat a tennis i ha guanyat 1 estrella de força.</p>':'')+
    (s.bigger?'<p class="tag good" style="font-size:15px;padding:6px 12px">Ara pots portar '+s.bigger+' bestioles a les aventures!</p>':'')+(s.unlocked?'<p class="tag good" style="font-size:15px;padding:6px 12px">Has descobert el Món Psíquic!</p>':'')+
    (s.house&&s.house.length?'<div class="small" style="background:#FFF4D6;border-radius:12px;padding:8px 12px;text-align:left"><b>La casa ajuda:</b> '+esc(s.house.join(' '))+'</div>':'')+
    '<div class="row" style="justify-content:center"><button type="button" class="btn" data-act="nav" data-to="explorar">Explora més</button><button type="button" class="btn light" data-act="nav" data-to="casa">Torna a casa</button></div></div>';
}
function scBestioles(){
  var owned=SP_ORDER.filter(ownsSp).length,ready=G.owned.filter(function(c){return c.stage<2&&c.mill>=5});
  var tileOf=function(s){var own=ownsSp(s),S=SPECIES[s],ev=G.owned.some(function(c){return c.sp===s&&c.stage<2&&c.mill>=5});
    var best=G.owned.filter(function(c){return c.sp===s}).sort(function(a,z){return z.stage-a.stage})[0];
    var art=best?cArt(best,50):spArt(s,'',50,true),name=best?esc(cName(best))+(best.stage?'<span class="muted" style="font-size:11px">('+esc(S.n)+')</span>':''):'???';
    return '<button type="button" class="tap'+(own?'':' off')+'" data-act="detail" data-s="'+s+'" style="min-height:118px;position:relative'+(own?';border-color:'+ELS[S.el].c+';box-shadow:0 4px 0 '+ELS[S.el].c:'')+'" aria-label="'+(own?esc(best?cName(best):S.n):'Bestiola que encara no tens')+'">'+art+name+roleTag(S.role,true)+evoDots(best,S)+(ev?'<span class="badge" style="right:-6px;top:-6px">Evoluciona!</span>':'')+'</button>'};var tiles=spGrid(tileOf);
  return '<h1>Bestioles</h1>'+tip('bestioles','Les ombres grises són bestioles que encara no tens. Toca una bestiola per veure-la, donar-li menjar i fer-la evolucionar.')+
    '<div class="row between"><span>Bestioles <b>'+owned+' de '+SP_ORDER.length+'</b></span><span>Evolucions <b>'+formsOwned()+' de '+SP_ORDER.length*3+'</b></span></div><div class="row between"><span>Combos secrets descoberts <b>'+megaCount()+' de '+MEGA.length+'</b></span></div>'+
    (function(){var n=roleCounts(G.owned);return '<div class="row" style="gap:6px"><span class="small">En tens:</span>'+['Atac','Defensa','Curador'].map(function(r){return roleTag(r)+'<b>'+n[r]+'</b>'}).join(' ')+'</div>'})()+bar(owned*100/SP_ORDER.length,'#9B59E0')+
    (ready.length?'<p class="tag mid" style="font-size:14px;padding:6px 10px">'+esc(ready.map(cName).join(', '))+' ja pot evolucionar!</p>':'')+sortBar()+tiles;
}
function deltaChips(eqNew){
  var a=bonusPct(G.equip),b=bonusPct(eqNew),out=[];
  [['atk','Atac'],['def','Defensa'],['hp','Vida']].forEach(function(k){var d=b[k[0]]-a[k[0]];if(d!==0)out.push('<span class="delta '+(d>0?'up':'down')+'">'+(d>0?'▲ ':'▼ ')+k[1]+' '+(d>0?'+':'−')+Math.abs(d)+'%</span>')});
  return out.length?out.join(' '):'<span class="muted small">Igual que el que portes</span>';
}
function bestBlock(){
  if(!G.items.length&&!Object.keys(G.equip).length)return '';
  var best=bestEquipSet(),same=SLOTS.every(function(x){return (best.equip[x[0]]||'')===(G.equip[x[0]]||'')});
  return '<div class="flat" style="gap:6px"><button type="button" class="btn green" data-act="bestEquip"'+(same?' disabled':'')+'>'+(same?'Ja portes el millor':'Equipa el millor')+'</button>'+
    (same?'':'<div class="row" style="gap:4px">'+deltaChips(best.equip)+'</div>')+'<p class="muted small">Tria per a cada lloc l’objecte que dona més en total (atac + defensa + vida).</p></div>';
}
