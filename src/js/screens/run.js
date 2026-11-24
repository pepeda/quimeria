'use strict';
/* ================= SCREEN: an expedition (route, scenes, cards) ================= */
function scRun(){
  var r=run();if(!r){G.screen='explorar';return scExplorar()}
  var head='<div class="flat"><div class="row between"><h3>'+esc(ZONES[r.world][r.zone||0])+' · lloc '+(r.i+1)+' de '+r.slots.length+'</h3>'+starStr(starsN(r.L))+'</div>'+
    (r.cave?'<p class="small"><b>Dins la cova · nivell '+r.cave.lvl+' de 3 · sala '+(r.cave.i+1)+' de '+r.cave.list.length+'</b> '+(teamTalent('cova')?'<span class="tag good">L\u2019Espele\u00f2leg fa llum: +20% de mal</span>':'<span class="tag bad">Fa fosc: \u221220% de mal. Porta un Espele\u00f2leg!</span>')+'</p>':'')+(r.bless?'<span class="syn">Benedicció activa</span>':'')+routeStrip(r)+'</div>';
  var e=r.event,body='',showTeam=true;
  if(e&&e.type==='battle')head='<div class="row between small" style="font-weight:800"><span>'+esc(ZONES[r.world][r.zone||0])+' \u00b7 lloc '+(r.i+1)+' de '+r.slots.length+'</span>'+starStr(starsN(r.L))+'</div>';
  if(!e)body='';
  else if(e.type==='battle'){showTeam=false;body=battleStage(r,e)}
  else if(e.type==='scene'){var S=SCENES[r.scene],N=S.nodes[r.node],txt=N.t.replace('{riu}',ELS[r.world].w.riu).replace('{arbres}',ELS[r.world].w.arbres);
    body='<div class="scene">'+sceneArt(S.art,r.world)+'<span class="label">'+esc(S.n)+(N.secret?' · secret!':'')+'</span>'+crew(r)+'</div>'+
      '<div class="event"><p style="font-size:16px">'+esc(txt)+'</p><p class="muted small">Què fas? Toca una opció.</p>'+N.ch.map(function(ch,i){
        var ok=!ch.req||teamHas(ch.req),dg='',fo=ch.out&&(ch.out.fight?ch.out:ch.out.rand?null:null);
        if(fo){var d0=danger(sampleEnemy(fo));dg=' <span class="tag '+d0.cls+'">'+esc(d0.t)+'</span>'}
        if(ch.out&&(ch.out.shop||ch.out.buyFood||ch.out.price)&&teamTalent('mercat'))dg+=' <span class="tag good">Regatejador: meitat de preu</span>';
        return '<button type="button" class="opt" data-act="choice" data-i="'+i+'"'+(ok?'':' disabled')+'><b>'+esc(ch.l)+'</b>'+(ch.d?'<span class="d">'+esc(ch.d)+'</span>':'')+'<span>'+riskHtml(ch.risk)+dg+'</span>'+(ok?'':'<span class="need">'+esc(reqText(ch.req))+'</span>')+'</button>'}).join('')+'</div>';}
  else if(e.type==='fork'){var s=r.slots[r.i];
    body='<div class="event"><h2>Una cruïla</h2><p>El camí es divideix. On vols anar?</p><div class="grid2">'+s.opts.map(function(id){var S=SCENES[id];return '<button type="button" class="tap" data-act="fork" data-s="'+id+'" style="padding:6px;gap:6px"><span style="width:100%;border-radius:12px;overflow:hidden;line-height:0">'+sceneArt(S.art,r.world)+'</span><span style="font-size:15px">'+esc(S.n)+'</span></button>'}).join('')+'</div></div>';}
  else if(e.type==='guardianPre'||e.type==='miniPre'){var fin=e.type==='guardianPre',gname=fin?'Guardià de '+ZONES[r.world][r.zone||0]:'Campament de monstres',
      ge=makeBattle({el:r.world,L:r.L+(fin?0.6:0.3),guardian:fin,final:fin,n:gname,waves:fin?1:2}).enemy,d1=danger(fin?ge:{el:ge.el,hp:ge.hp*2,atk:ge.atk,def:ge.def});
    body='<div class="scene">'+sceneArt(fin?'guardian':'tent',r.world)+'<span class="label">'+(fin?'Final de la zona':'Campament de monstres')+'</span><div style="position:absolute;right:20px;bottom:6px;line-height:0">'+monster(r.world,96,fin)+'</div>'+crew(r)+'</div>'+
      '<div class="event"><h2>'+esc(gname)+'</h2><p>'+starStr(starsN(ge.L))+' <span class="tag '+d1.cls+'">'+esc(d1.t)+'</span>'+(ge.resist?' <span class="tag">Resisteix '+esc(ELS[ge.resist].n)+'</span>':'')+'</p>'+
      (ge.bossD?'<p><b>Habilitats:</b> '+esc(ge.bossD)+'</p>':'')+(fin?'<p class="muted">Si el guanyes, acabes la zona i guanyes un tresor rar. A la meitat de la vida s’enfada i fa més mal.</p><button type="button" class="opt" data-act="gfight"><b>Lluita contra el guardià</b><span>'+riskHtml(2)+'</span></button><button type="button" class="opt" data-act="gleave"><b>Torna a casa ara</b><span class="d">Et quedes totes les monedes, però la zona no compta com a acabada.</span><span>'+riskHtml(0)+'</span></button>':
        '<p class="muted">Hi ha 2 monstres: quan en guanyes un, arriba l’altre.</p><button type="button" class="opt" data-act="mfight"><b>Ataca el campament</b><span class="d">Si guanyes: 40 monedes i un objecte.</span><span>'+riskHtml(2)+'</span></button><button type="button" class="opt" data-act="mleave"><b>Fes una volta llarga</b><span class="d">L’equip es cansa i perd una mica de vida.</span><span>'+riskHtml(0)+'</span></button>')+'</div>';}
  else if(e.type==='wild'){var sw=SPECIES[e.sp],own=ownsSp(e.sp),hasFood=(G.food[sw.el]||0)>0,we=makeBattle({wild:e.sp,L:r.L+(e.rare?1:0)}).enemy,d2=danger(we);
    body='<div class="scene">'+sceneArt(r.cave?'tunnels':'meadow',r.world)+'<span class="label">'+(e.rare?'Una bestiola rara!':'Una bestiola salvatge')+'</span><div style="position:absolute;right:30px;bottom:8px;line-height:0">'+spArt(e.sp,'',90,!own)+'</div>'+crew(r)+'</div>'+
      '<div class="event"><p>'+(own?'És una '+esc(sw.n)+'. Ja en tens una.':'No l’has vista mai.')+' '+roleTag(sw.role)+' '+talentTag(sw.talent)+' Vols que vingui amb tu?</p>'+
      '<button type="button" class="opt" data-act="wfight"><b>Lluita per fer-te’n amic</b><span class="d">Si guanyes, s’uneix a tu.</span><span>'+riskHtml(1)+' <span class="tag '+d2.cls+'">'+esc(d2.t)+'</span></span></button>'+
      '<button type="button" class="opt" data-act="wfeed"'+(hasFood?'':' disabled')+'><b>Dona-li '+esc(FOOD[sw.el])+'</b><span class="d">S’uneix segur, sense lluitar.</span><span>'+riskHtml(0)+'</span>'+(hasFood?'<span class="d">En tens '+G.food[sw.el]+'</span>':'<span class="need">No en tens. En trobaràs pel camí.</span>')+'</button>'+
      '<button type="button" class="opt" data-act="skip"><b>Deixa-la tranquil·la</b><span>'+riskHtml(0)+'</span></button></div>';}
  else if(e.type==='note')body='<div class="event"><h2>'+esc(e.title||'D’acord')+'</h2><p>'+esc(e.text)+'</p><button type="button" class="btn green" data-act="next">Continua</button></div>';
  else if(e.type==='card'){body=bigCard(e);showTeam=false}
  var leave=e&&e.type==='battle'?'':'<div class="row"><button type="button" class="btn light sm" data-act="pause">Surt i guarda</button><button type="button" class="btn light sm" data-act="restart">'+(restartArm?'Segur? Toca un altre cop':'Torna a començar la zona')+'</button><button type="button" class="btn light sm" data-act="abandon" data-w="'+r.world+'">'+(abandonArm===r.world?'Segur? Toca un altre cop':'Abandona')+'</button></div>';
  return head+tip('run','Les boles de dalt són el camí: la que es mou és on ets. Les opcions amb fletxa ▸ es poden tocar. Els punts vermells diuen el risc.')+body+(showTeam?teamMini(r):'')+leave;
}
function routeStrip(r){
  return '<div class="route" aria-label="El camí: lloc '+(r.i+1)+' de '+r.slots.length+'">'+r.slots.map(function(s,i){
    var cls=i<r.i?'node done':i===r.i?'node cur':'node',bg=i<=r.i?' style="background:'+ELS[r.world].c+(r.world==='llamp'?';color:#1E1B2E':'')+'"':'';
    var show=i<=r.i||i<=(r.reveal||0)||(teamTalent('volador')&&i<=r.i+2)||s.k==='guardian'||s.k==='spring'||s.k==='mini';
    return (i?'<span class="link'+(i<=r.i?' done':'')+'"></span>':'')+'<span class="'+cls+'"'+bg+'>'+(show?NODE_ICON[s.k]||'·':'?')+'</span>'}).join('')+'</div>';
}
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
  else if(e.kind==='niu'){var s2=SPECIES[e.sp];art=spArt(e.sp,'',130);title=s2.n;sub='Va al Niu';bg=ELS[s2.el].soft}
  else if(e.kind==='item'){var it=IT(e.item);art='<svg class="cr" width="110" height="110" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 L15 9 L22 9 L16.5 13.5 L18.5 21 L12 16.5 L5.5 21 L7.5 13.5 L2 9 L9 9 Z" fill="'+(it.relic?'#9B59E0':'#F7C948')+'" stroke="#1E1B2E" stroke-width=".8"/></svg>';title=it.n;rar=it.rar;border=it.relic?'#9B59E0':'#C98A00';
    sub=itemStats(it)+' · per a la motxilla';}
  else if(e.kind==='food'){art=elIcon(e.el,100,ELS[e.el].c);title=FOOD[e.el]+' ×'+e.n;sub='Menjar per a bestioles de '+ELS[e.el].n.toLowerCase();bg=ELS[e.el].soft;border=ELS[e.el].c}
  else if(e.kind==='coins'){art='<svg class="cr" width="100" height="100" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.5" fill="#F7C948" stroke="#C98A00" stroke-width="1.5"/><circle cx="10" cy="10" r="4" fill="none" stroke="#C98A00" stroke-width="1.5"/></svg>';title='+'+e.n+' monedes';border='#C98A00'}
  var head=e.kind==='critter'?'Bestiola nova!':e.kind==='item'?(IT(e.item).relic?'Tresor rar!':'Has trobat un objecte!'):e.kind==='food'?'Menjar!':e.kind==='coins'?'Monedes!':e.kind==='niu'?'Al Niu!':'Vaja…';
  return '<div class="reveal'+(muted?' muted-panel':'')+'"><h2>'+esc(head)+'</h2>'+
    '<div class="bigcard" style="border-color:'+border+'"><div class="art" style="background:'+bg+'"><span class="sfx stay">'+(e.kind==='critter'?'NOVA!':e.kind==='item'?'TXAN!':e.kind==='coins'?'DING!':e.kind==='food'?'ÑAM!':e.kind==='niu'?'NIU!':'OH!')+'</span>'+(rar?'<span class="rar" style="background:'+border+'">'+esc(rar)+'</span>':'')+art+'</div><h2 style="color:var(--ink)">'+esc(title)+'</h2><div class="muted" style="text-align:center;padding:0 12px">'+esc(sub)+'</div><div class="muted" style="text-align:center;padding:0 12px">'+esc(e.why||'')+'</div></div>'+
    '<div style="display:flex;flex-direction:column;gap:10px;width:min(300px,100%)">'+btns+'</div></div>';
}
