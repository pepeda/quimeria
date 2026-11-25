'use strict';
/* ================= SCREEN: a critter's card (overlay sheet) ================= */
/* level and experience bar of one critter: "Forma 2 · nivell 7" and how much XP it has for the next level */
function xpBar(c,col){var L=lvl(c),need=xpNeed(L),cap=L>=levelCap(c),x=Math.min(c.xp||0,need);
  return '<div class="row between small" style="font-weight:800"><span>Forma '+form(c)+' · nivell '+L+'</span><span>'+(cap?(L>=BAL.LEVEL_MAX?'Nivell màxim':'Màxim de la forma '+form(c)):x+' / '+need+' XP')+'</span></div>'+bar(x*100/need,col||'#F2B90F')}
/* the evolve buttons of one critter, or what is missing: level and copies */
function evoBlock(c,S){var R=evoRule(c);if(!R&&S.legend)return '<p class="muted small">És llegendària: no evoluciona més. Només n’hi ha una.</p>';if(!R)return '<p class="muted small">Forma 4: és la forma final. Té una aura que fa més forts els companys del seu element.</p>';
  var chk=evoCheck(c),opts=c.stage===1?[1,2]:[c.stage===0?0:c.evo],to=c.stage+2;
  var head='<p class="small"><b>Per evolucionar a forma '+to+'</b>: nivell '+R.level+' i '+R.copies+(R.copies>1?' còpies':' còpia')+' (una altra '+esc(S.n)+(R.copyForm>1?' de forma '+R.copyForm+' o més':'')+'). Les còpies desapareixen.</p>';
  var miss=chk.missing.length?'<p class="small" style="color:#9E2B1F;font-weight:800">'+chk.missing.map(esc).join('<br>')+'</p>':busyWorld(c)?'<p class="muted small">Ara és d’aventura.</p>':'';
  var btns='<div class="grid2">'+opts.map(function(i){var e=S.evos[i],nm=e.n+(to===4?' '+FORM4_WORD:'');
    return '<button type="button" class="tap" data-act="evolve" data-u="'+c.uid+'" data-i="'+i+'"'+(chk.ok?'':' disabled')+'>'+spArt(c.sp,e.el2,52,false,to-1)+esc(nm)+'<span class="muted small" style="text-align:center">'+(e.el2?'70% '+esc(ELS[S.el].n)+' + 30% '+esc(ELS[e.el2].n):esc(ELS[S.el].n))+'</span>'+(chk.ok?'<span class="tag good">Evoluciona!</span>':'')+'</button>'}).join('')+'</div>';
  return head+miss+btns}
function detailSheet(){
  var s=G.detail,S=SPECIES[s],mine=allCr().filter(function(c){return c.sp===s}),own=mine.length>0;
  var evoOwned={};mine.forEach(function(c){if(c.stage)evoOwned[c.stage+':'+c.evo]=true});
  /* node of the evolution tree: forma f (1-4) of branch i (-1 for forma 1) */
  function node(f,i){var e=i<0?{n:S.n,el2:''}:S.evos[i],ok=f===1?own:!!evoOwned[(f-1)+':'+i],nm=e.n+(f===4?' '+FORM4_WORD:'');
    return '<div class="box'+(ok?'':' off')+'" style="padding:8px">'+spArt(s,e.el2,52,!ok,f-1)+(ok?esc(nm):'???')+'<span class="muted small" style="text-align:center">Forma '+f+' · '+esc(ELS[S.el].n+(e.el2?' + '+ELS[e.el2].n:''))+'</span></div>'}
  var line='<svg width="40" height="20" viewBox="0 0 40 20" aria-hidden="true"><path d="M20 0 V20" stroke="#B9B3C6" stroke-width="3"/></svg>';
  var fork='<svg width="200" height="22" viewBox="0 0 200 22" aria-hidden="true" style="max-width:70%"><path d="M100 0 V8 M50 8 H150 M50 8 V22 M150 8 V22" stroke="#B9B3C6" stroke-width="3" fill="none"/></svg>';
  var two='<svg width="200" height="20" viewBox="0 0 200 20" aria-hidden="true" style="max-width:70%"><path d="M50 0 V20 M150 0 V20" stroke="#B9B3C6" stroke-width="3"/></svg>';
  var evos='<div class="tree"><div class="lvl">'+node(1,-1)+'</div>'+line+'<div class="lvl">'+node(2,0)+'</div>'+fork+'<div class="lvl">'+node(3,1)+node(3,2)+'</div>'+two+'<div class="lvl">'+node(4,1)+node(4,2)+'</div></div>';
  var best=mine.slice().sort(function(a,z){return z.stage-a.stage})[0],have=best?abilities(best).length:0;
  var abil='<div class="flat" style="background:var(--soft);gap:6px"><h3>Habilitats</h3>'+(ABIL[s]||[]).map(function(a,i){var open=own&&i<have;
    return '<div style="display:flex;flex-direction:column;gap:1px;'+(open?'':'opacity:.6')+'"><b>'+esc(a[0])+' <span class="muted small">· cada '+a[1]+' torns</span></b><span class="small">'+esc(KIND_DESC[a[2]])+'</span>'+(open?'':'<span class="muted small">'+(i===2?'S’obre a la forma 2 (primera evolució).':'S’obre quan la tinguis.')+'</span>')+'</div>'}).join('')+'<p class="muted small">A cada forma, les habilitats fan més efecte.</p></div>';
  var copies=mine.length>1?'<p class="small">En tens <b>'+mine.length+'</b>'+(mine.filter(inNiu).length?' ('+mine.filter(inNiu).length+' al Niu)':'')+'. Les còpies serveixen per evolucionar.</p>':'';
  var inst=mine.slice().sort(function(a,z){return z.stage-a.stage||z.lvl-a.lvl}).map(function(c){var st=stats(c),nest=inNiu(c),fed=canXp(c);
    var foods=Object.keys(G.food).filter(function(k){return G.food[k]>0}).map(function(k){return '<button type="button" class="btn sm light" data-act="feed" data-u="'+c.uid+'" data-el="'+k+'"'+(fed?'':' disabled')+'>'+esc(FOOD[k])+' ('+G.food[k]+') +'+(k===S.el?BAL.XP_FOOD_OWN:BAL.XP_FOOD)+' XP</button>'}).join('');
    var move=nest?'<button type="button" class="btn sm" data-act="niuHome" data-u="'+c.uid+'"'+(G.owned.length<cap()?'':' disabled')+'>Porta-la a casa</button>'+(G.owned.length<cap()?'':'<span class="muted small"> La casa és plena: al Niu pots canviar-la per una de casa.</span>')
      :(!busyWorld(c)&&G.owned.length>1?'<button type="button" class="btn sm light" data-act="toNiu" data-u="'+c.uid+'">Envia-la al Niu</button>':'');
    return '<div class="flat" style="background:var(--soft)"><div class="row" style="gap:10px">'+cArt(c,58)+'<div style="flex:1;min-width:0"><b style="font-size:16px">'+esc(cName(c))+'</b>'+(nest?' <span class="tag">Al Niu</span>':'')+'<div class="muted small">Vida '+st.hp+' · Atac '+st.atk+' · Defensa '+st.def+(st.heal?' · Cura '+st.heal:'')+'</div><div class="muted small">'+esc(nest?'Descansa al Niu':fatigueText(c))+'</div></div></div>'+
      xpBar(c,ELS[S.el].c)+
      (fed?(foods?'<p class="muted small">Dona-li menjar per guanyar experiència (XP). El menjar del seu element en dona més.</p><div class="row">'+foods+'</div>':'<p class="muted small">No tens menjar. En trobaràs pel camí i als cofres.</p>'):'')+
      evoBlock(c,S)+(move?'<div class="row" style="gap:6px;align-items:center">'+move+'</div>':'')+'</div>'}).join('');
  var adopt='';
  if(!own){var open=worldOpen(S.el);
    adopt=open?'<button type="button" class="btn gold" data-act="adopt" data-s="'+s+'"'+(G.coins<S.price||G.owned.length>=cap()?' disabled':'')+'>Adopta-la · '+S.price+' monedes</button>'+(G.owned.length>=cap()?'<p class="muted">La casa és plena.</p>':G.coins<S.price?'<p class="muted">No tens prou monedes (en tens '+G.coins+').</p>':''):'<p class="flat" style="background:var(--soft)">Primer has de descobrir aquest món.</p>';}
  return '<div class="modal" data-act="closeBg"><div class="sheet" role="dialog" aria-label="Fitxa de la bestiola" data-s="'+s+'"><div class="row" style="gap:12px;align-items:flex-start"><div style="background:'+(own?ELS[S.el].soft:'#E9E5F0')+';border-radius:20px;padding:6px">'+spArt(s,'',90,!own)+'</div><div style="flex:1;min-width:0"><h1>'+(own?esc(S.n):'???')+'</h1><div class="muted">'+(own?esc(S.all?'Tots els elements':ELS[S.el].n):'Encara no l’has trobada')+'</div><div class="muted">'+esc(worldOpen(S.el)?''+(S.all?'Ve de tots els mons':'Viu a '+ELS[S.el].mon):'Viu en un món desconegut')+'</div></div><button type="button" class="btn sm light" data-act="close">Tanca</button></div>'+
    '<div class="row" style="gap:8px;align-items:flex-start">'+roleTag(S.role)+'<p class="small" style="flex:1;min-width:0">'+esc(S.legend?'La bestiola més forta del joc: fa molt de mal i aguanta més que les altres.':ROLE_DESC[S.role])+'</p></div>'+'<div class="row" style="gap:8px;align-items:flex-start">'+talentTag(S.talent)+'<p class="small" style="flex:1;min-width:0">'+esc(TALENT[S.talent].d)+'</p></div>'+
    copies+inst+adopt+abil+(S.legend?'':'<h3>Arbre d’evolucions</h3>'+evos)+megaBlock(s)+'</div></div>';
}
function megaBlock(s){var mine=MEGA.filter(function(m){return m.sp.indexOf(s)>=0});if(!mine.length)return '';var found=G.megas||{},nf=mine.filter(function(m){return found[m.id]}).length;
  return '<h3>Combos secrets ('+nf+' de '+mine.length+')</h3><div class="flat" style="background:var(--soft);gap:8px">'+mine.map(function(m){
    if(found[m.id])return '<div style="display:flex;flex-direction:column;gap:2px"><b>'+esc(m.n)+'</b><div class="row" style="gap:4px">'+m.sp.map(function(x){return spArt(x,'',30,false)}).join('')+'</div><span class="small">'+esc(m.sp.map(function(x){return SPECIES[x].n}).join(' + '))+'</span><span class="small">'+esc(m.d)+'</span></div>';
    return '<div style="display:flex;flex-direction:column;gap:2px;opacity:.7"><b>??? Combo secret de '+m.sp.length+' bestioles</b><span class="small">Pista: posa-la a l’equip amb '+(m.sp.length-1)+' bestiola'+(m.sp.length>2?'es':'')+' de '+esc(m.sp.filter(function(x){return x!==s}).map(function(x){return ELS[SPECIES[x].el].n}).join(' i '))+'.</span></div>'}).join('')+'</div>'}
