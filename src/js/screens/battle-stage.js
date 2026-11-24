'use strict';
/* ================= SCREEN: the battle stage inside an expedition ================= */
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
