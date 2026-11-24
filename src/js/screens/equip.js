'use strict';
/* ================= SCREEN: choose the team for a zone ================= */
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
