'use strict';
/* ---------- screens ---------- */
function scMon(){
  var w=G.world,A=ELS[w],r=G.runs[w],pct=worldPct(w),sps=speciesOf(w),sc=worldScenes(w),seen=sc.filter(function(id){return G.seen[w]&&G.seen[w][id]}).length;
  var spsH=sps.map(function(s){var own=ownsSp(s);return '<div class="box'+(own?'':' off')+'">'+spArt(s,'',44,!own)+(own?esc(SPECIES[s].n):'???')+'</div>'}).join('');
  var body;
  if(r)body='<div class="flat"><h3>Tens una aventura a mitges aquí</h3><p class="muted">'+esc(ZONES[w][r.zone||0])+' · lloc '+(r.i+1)+' de '+r.slots.length+(r.cave?', dins una cova':'')+'.</p><div class="row"><button type="button" class="btn green" data-act="resume" data-w="'+w+'">Continua</button><button type="button" class="btn light sm" data-act="abandon" data-w="'+w+'">'+(abandonArm===w?'Segur? Toca un altre cop':'Abandona-la')+'</button></div></div>';
  else body=ZONES[w].map(function(zn,i){var open=zoneOpen(w,i),done=G.done[w+':z'+i];
    return '<button type="button" class="opt" data-act="path" data-p="'+i+'"'+(open?'':' disabled')+'><b>Zona '+(i+1)+': '+esc(zn)+(done?' ✓':'')+'</b><span class="d">'+starStr(starsN(zoneL(w,i)))+' · '+ZONE_ROUTES[i].length+' llocs</span><span class="d">'+esc(ZONE_INFO[i])+'</span>'+(i===2?'<span class="need">Cal portar: '+esc(TALENT[ZONE_NEED[w]].n)+'</span>':i===1?'<span class="d">Recomanat: '+esc(TALENT[ZONE_REC[w]].n)+'</span>':'')+(open?'':'<span class="need">Tancada: acaba primer la zona '+i+'</span>')+'</button>'}).join('');
  return '<div class="flat" style="background:'+A.c+';color:'+(w==='llamp'?'#1E1B2E':'#fff')+'"><div class="row"><button type="button" class="btn sm light" data-act="nav" data-to="explorar">Enrere</button><h1>'+esc(A.mon)+'</h1></div>'+
    '<p>Explorat: <b>'+pct+'%</b> · Llocs vistos '+seen+' de '+sc.length+' · Bestioles '+sps.filter(ownsSp).length+' de '+sps.length+'</p><p>Aquí hi viuen bestioles de '+esc(A.n.toLowerCase())+'. Els monstres resisteixen el seu propi element. Consell: porta bestioles de '+esc(goodAgainst(w))+'.</p></div>'+
    tip('mon','Cada món té 3 zones. Quan acabes una zona, s’obre la següent. Les estrelles ★ diuen com és de difícil.')+
    '<h3>Bestioles d’aquest món</h3><div class="grid4">'+spsH+'</div>'+body;
}
function teamSummary(){
  var list=G.pick.map(byUid),n=roleCounts(list),miss=['Atac','Defensa','Curador'].filter(function(r){return !n[r]}),on=synergies(list),chips=synChips(on);
  var act=SYN.filter(function(s){return on[s.k]});
  return '<div class="flat" style="gap:6px"><div class="row" style="gap:6px"><b>El teu equip:</b>'+['Atac','Defensa','Curador'].map(function(r){return roleTag(r,true)+'<b>'+n[r]+'</b>'}).join(' ')+'</div>'+
    (G.pick.length&&miss.length?'<p class="muted small">Consell: un equip amb un de cada rol aguanta més. Et falta: '+esc(miss.map(function(r){return ROLE_LABEL[r]}).join(', '))+'.</p>':'')+
    '<div class="row" style="gap:6px"><b>Sinergies:</b>'+(chips||'<span class="muted small">cap encara</span>')+'</div>'+
    (act.length?act.map(function(s){return '<p class="small"><b>'+esc(s.n)+':</b> '+esc(s.d)+'</p>'}).join(''):'<p class="muted small">Prova de portar Aigua i Llamp, Foc i Planta, o un tanc i un curador junts.</p>')+'</div>';
}
function scEquip(){
  var w=G.world,z=G.zone||0,mx=maxTeam(),nx=nextTeamAt();
  var rows=G.owned.map(function(c){
    var bw=busyWorld(c),blocked=!!bw||c.rest>0,on=G.pick.indexOf(c.uid)>=0,m=mult(sp(c).el,w),adv=m>1?'<span class="tag good">Avantatge aquí</span>':m<1?'<span class="tag bad">'+(m===0.75?'Resisteixen el seu element':'Desavantatge aquí')+'</span>':'';
    var left=c.rest>0?0:Math.round((maxFat(c)-c.fat)*100/maxFat(c));
    return '<button type="button" class="tap'+(on?' sel':'')+'" data-act="pick" data-u="'+c.uid+'"'+(blocked?' disabled':'')+' aria-pressed="'+on+'" style="flex-direction:row;justify-content:flex-start;gap:10px;padding:8px">'+cArt(c,48)+
      '<span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:3px;text-align:left"><span class="row" style="gap:6px"><b style="font-size:15px">'+esc(cName(c))+'</b>'+adv+'</span><span class="row" style="gap:6px">'+roleTag(sp(c).role)+'<span class="muted small">'+esc(ELS[sp(c).el].n+' · nivell '+lvl(c)+' · '+abilities(c).length+' habilitats')+'</span>'+talentTag(sp(c).talent)+'</span>'+bar(left,hpColor(left))+'<span class="muted small">'+esc(fatigueText(c))+'</span></span>'+(on?'<b style="color:var(--accent)">✓</b>':'')+'</button>'}).join('');
  return '<div class="row"><button type="button" class="btn sm light" data-act="world" data-w="'+w+'">Enrere</button><div><div class="muted small">'+esc(ELS[w].mon)+' · '+esc(ZONES[w][z])+' '+starStr(starsN(zoneL(w,z)))+'</div><h1>Tria l’equip</h1></div></div>'+
    tip('equip','El teu personatge sempre hi va. Toca les bestioles per triar-les. Algunes combinacions tenen sinergies i atacs combinats.')+
    '<p class="muted">Triades: <b>'+G.pick.length+' de '+mx+'</b>'+(nx?' · Quan facis '+nx+' expedicions en podràs portar '+(mx+1):'')+'</p><div style="display:flex;flex-direction:column;gap:10px">'+rows+'</div>'+
    teamSummary()+needBlock()+'<button type="button" class="btn green" data-act="go"'+(G.pick.length&&needOk()?'':' disabled')+'>Surt a explorar</button>';
}
function routeStrip(r){
  return '<div class="route" aria-label="El camí: lloc '+(r.i+1)+' de '+r.slots.length+'">'+r.slots.map(function(s,i){
    var cls=i<r.i?'node done':i===r.i?'node cur':'node',bg=i<=r.i?' style="background:'+ELS[r.world].c+(r.world==='llamp'?';color:#1E1B2E':'')+'"':'';
    var show=i<=r.i||i<=(r.reveal||0)||(teamTalent('volador')&&i<=r.i+2)||s.k==='guardian'||s.k==='spring'||s.k==='mini';
    return (i?'<span class="link'+(i<=r.i?' done':'')+'"></span>':'')+'<span class="'+cls+'"'+bg+'>'+(show?NODE_ICON[s.k]||'·':'?')+'</span>'}).join('')+'</div>';
}
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
function battleStage(r,b){
  var en=b.enemy,p=Math.round(en.hp*100/en.max),d=danger(en);
  var art=en.wild?spArt(en.wild,'',76):monster(en.el,76,en.guardian);
  var weak=Object.keys(BEATS).filter(function(k){return BEATS[k].indexOf(en.el)>=0}).map(function(k){return ELS[k].n}).join(', ');
  var res='';
  if(playing){}
  else if(b.over==='win')res='<div class="event result" style="color:var(--ink)"><h2>Heu guanyat!</h2><button type="button" class="btn green" data-act="bwin">Continua</button></div>';
  else if(b.over==='lose')res=en.wild?'<div class="event result" style="color:var(--ink)"><h2>Heu perdut</h2><p>La bestiola salvatge marxa corrents. Les bestioles KO es desperten amb una mica de vida i seguiu el camí.</p><button type="button" class="btn" data-act="blose">Continua</button></div>':
    '<div class="event result" style="color:var(--ink)"><h2>Heu perdut</h2><p>Podeu tornar a començar la zona amb tota la vida, o tornar a casa amb la meitat de les monedes.</p><button type="button" class="btn green" data-act="restartNow">Torna a començar la zona</button><button type="button" class="btn light" data-act="blose">Torna a casa</button></div>';
  var order=r.team.slice().sort(function(a,z){var ra=byUid(a),rz=byUid(z);return (ra&&sp(ra).role==='Defensa'?0:1)-(rz&&sp(rz).role==='Defensa'?0:1)});
  return tip('battle','La batalla va sola. Cada bestiola té 2 o 3 habilitats que es carreguen a velocitats diferents (les barres grogues) i les fa soles. Si dues bestioles d’elements diferents tenen un atac a punt alhora, fan un ATAC COMBINAT.')+
    '<div class="stage" id="stage"><div class="banner" id="banner"></div>'+
    '<div class="foe"><div class="foe-art" id="foe-art">'+art+'</div><div class="foe-info"><h2 id="foe-name">'+esc(en.n)+'</h2><div>'+starStr(starsN(en.L))+' <span class="tag" style="background:'+ELS[en.el].c+';color:'+(en.el==='llamp'?'#1E1B2E':'#fff')+'">'+esc(ELS[en.el].n)+'</span>'+(b.wavesTotal>1?' <span class="tag">Onada '+(b.wavesTotal-b.waves+1)+' de '+b.wavesTotal+'</span>':'')+'</div>'+
    '<span class="small">Feble a: <b>'+esc(weak)+'</b>'+(en.resist?' · Resisteix: <b>'+esc(ELS[en.resist].n)+'</b>':'')+'</span><span class="tag '+d.cls+'" style="align-self:flex-start">'+esc(d.t)+'</span>'+bar(p,hpColor(p),'foe-hp')+'<span class="small" id="foe-hpt">'+en.hp+'/'+en.max+'</span><div class="stchips" id="foe-st"></div><span class="warn" id="warn">'+(b.warn==='area'?'Prepara un ATAC A TOTHOM!':'Prepara un COP FORT!')+'</span></div></div>'+
    '<div class="caption" id="caption" aria-live="polite">'+esc(b.caption||'')+'</div>'+
    '<div class="row" style="gap:6px">'+synChips(b.syn)+'</div><div class="ab-row"><span style="color:#fff">Atac de tot l\u2019equip</span><div class="charge"><i id="team-meter"></i></div></div><div class="stchips" id="team-st"></div>'+
    '<div class="squad" id="squad" style="grid-template-columns:repeat('+Math.min(3,order.length)+',minmax(0,1fr))"><div class="shield" id="shield"></div>'+order.map(function(u){var c=byUid(u);if(!c)return '';var mx=stats(c).hp,pp=Math.round(r.hp[u]*100/mx),front=sp(c).role==='Defensa';
      return '<div class="mem'+(r.hp[u]<=0?' ko':'')+'" id="m-'+u+'"'+(front?' style="outline:3px solid #2E6BC6"':'')+'>'+(front?'<span class="tag" style="background:#2E6BC6;color:#fff">Davant</span>':'')+cArt(c,36)+'<span>'+esc(cName(c))+'</span>'+roleTag(sp(c).role,true)+bar(pp,hpColor(pp),'hp-'+u)+'<span class="small" id="hp-'+u+'t">'+r.hp[u]+'/'+mx+'</span>'+
        abilities(c).map(function(a){return '<div class="ab-row"><span>'+esc(a.n)+'</span><div class="charge"><i id="ch-'+u+'-'+a.i+'"></i></div></div>'}).join('')+'</div>'}).join('')+'</div>'+res+'</div>';
}
function detailSheet(){
  var s=G.detail,S=SPECIES[s],mine=G.owned.filter(function(c){return c.sp===s}),own=mine.length>0;
  var evoOwned={};mine.forEach(function(c){if(c.stage)evoOwned[c.evo]=true});
  function node(i){var e=i<0?{n:S.n,el2:''}:S.evos[i],ok=i<0?own:!!evoOwned[i];
    return '<div class="box'+(ok?'':' off')+'" style="padding:8px">'+spArt(s,e.el2,52,!ok,i>=0)+(ok?esc(e.n):'???')+'<span class="muted small" style="text-align:center">'+(i<0?'Nivell 1':i===0?'Nivell 2':'Nivell 3')+' · '+esc(ELS[S.el].n+(e.el2?' + '+ELS[e.el2].n:''))+'</span></div>'}
  var line='<svg width="40" height="20" viewBox="0 0 40 20" aria-hidden="true"><path d="M20 0 V20" stroke="#B9B3C6" stroke-width="3"/></svg>';
  var fork='<svg width="200" height="22" viewBox="0 0 200 22" aria-hidden="true" style="max-width:70%"><path d="M100 0 V8 M50 8 H150 M50 8 V22 M150 8 V22" stroke="#B9B3C6" stroke-width="3" fill="none"/></svg>';
  var evos='<div class="tree"><div class="lvl">'+node(-1)+'</div>'+line+'<div class="lvl">'+node(0)+'</div>'+fork+'<div class="lvl">'+node(1)+node(2)+'</div></div>';
  var best=mine.sort(function(a,z){return z.stage-a.stage})[0],have=best?abilities(best).length:0;
  var abil='<div class="flat" style="background:var(--soft);gap:6px"><h3>Habilitats</h3>'+(ABIL[s]||[]).map(function(a,i){var open=own&&i<have;
    return '<div style="display:flex;flex-direction:column;gap:1px;'+(open?'':'opacity:.6')+'"><b>'+esc(a[0])+' <span class="muted small">· cada '+a[1]+' torns</span></b><span class="small">'+esc(KIND_DESC[a[2]])+'</span>'+(open?'':'<span class="muted small">'+(i===2?'S’obre al nivell 2 (primera evolució).':'S’obre quan la tinguis.')+'</span>')+'</div>'}).join('')+'<p class="muted small">Al nivell 3, les habilitats fan més efecte.</p></div>';
  var inst=mine.map(function(c){var st=stats(c),full=c.mill>=5;
    var foods=Object.keys(G.food).filter(function(k){return G.food[k]>0}).map(function(k){return '<button type="button" class="btn sm light" data-act="feed" data-u="'+c.uid+'" data-el="'+k+'"'+(full?' disabled':'')+'>'+esc(FOOD[k])+' ('+G.food[k]+') '+(k===S.el?'+2':'+1')+'</button>'}).join('');
    var opts=c.stage===0?[0]:c.stage===1?[1,2]:[];
    var evoBtns=full&&opts.length?'<p><b>'+(opts.length>1?'Pot evolucionar! Tria la branca:':'Pot evolucionar!')+'</b></p><div class="grid2">'+opts.map(function(i){var e=S.evos[i];return '<button type="button" class="tap" data-act="evolve" data-u="'+c.uid+'" data-i="'+i+'">'+spArt(s,e.el2,52,false,true)+esc(e.n)+'<span class="muted small" style="text-align:center">'+(e.el2?'70% '+esc(ELS[S.el].n)+' + 30% '+esc(ELS[e.el2].n):esc(ELS[S.el].n))+'</span></button>'}).join('')+'</div>':'';
    return '<div class="flat" style="background:var(--soft)"><div class="row" style="gap:10px">'+cArt(c,58)+'<div style="flex:1;min-width:0"><b style="font-size:16px">'+esc(cName(c))+'</b> <span class="muted small">nivell '+lvl(c)+'</span><div class="muted small">Vida '+st.hp+' · Atac '+st.atk+' · Defensa '+st.def+(st.heal?' · Cura '+st.heal:'')+'</div><div class="muted small">'+esc(fatigueText(c))+'</div></div></div>'+
      '<div class="row between small" style="font-weight:800"><span>Estrelles de força</span><span>'+Math.min(c.mill,5)+' de 5</span></div>'+bar(Math.min(c.mill,5)*20,ELS[S.el].c)+
      (full?(c.stage>=2?'<p class="muted small">Ja té totes les estrelles.</p>':''):(foods?'<p class="muted small">Dona-li menjar per guanyar estrelles. El menjar del seu element en dona 2.</p><div class="row">'+foods+'</div>':'<p class="muted small">No tens menjar. En trobaràs pel camí.</p>'))+evoBtns+'</div>'}).join('');
  var adopt='';
  if(!own){var open=worldOpen(S.el);
    adopt=open?'<button type="button" class="btn gold" data-act="adopt" data-s="'+s+'"'+(G.coins<S.price||G.owned.length>=cap()?' disabled':'')+'>Adopta-la · '+S.price+' monedes</button>'+(G.owned.length>=cap()?'<p class="muted">La casa és plena.</p>':G.coins<S.price?'<p class="muted">No tens prou monedes (en tens '+G.coins+').</p>':''):'<p class="flat" style="background:var(--soft)">Primer has de descobrir aquest món.</p>';}
  return '<div class="modal" data-act="closeBg"><div class="sheet" role="dialog" aria-label="Fitxa de la bestiola" data-s="'+s+'"><div class="row" style="gap:12px;align-items:flex-start"><div style="background:'+(own?ELS[S.el].soft:'#E9E5F0')+';border-radius:20px;padding:6px">'+spArt(s,'',90,!own)+'</div><div style="flex:1;min-width:0"><h1>'+(own?esc(S.n):'???')+'</h1><div class="muted">'+(own?esc(ELS[S.el].n):'Encara no l’has trobada')+'</div><div class="muted">Viu al '+esc(worldOpen(S.el)?ELS[S.el].mon.replace('Món ','món '):'món desconegut')+'</div></div><button type="button" class="btn sm light" data-act="close">Tanca</button></div>'+
    '<div class="row" style="gap:8px;align-items:flex-start">'+roleTag(S.role)+'<p class="small" style="flex:1;min-width:0">'+esc(ROLE_DESC[S.role])+'</p></div>'+'<div class="row" style="gap:8px;align-items:flex-start">'+talentTag(S.talent)+'<p class="small" style="flex:1;min-width:0">'+esc(TALENT[S.talent].d)+'</p></div>'+
    inst+adopt+abil+'<h3>Arbre d’evolucions</h3>'+evos+megaBlock(s)+'</div></div>';
}

