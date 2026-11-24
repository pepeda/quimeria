'use strict';
/* ================= SCREEN: a world and its zones ================= */
function scMon(){
  var w=G.world,A=ELS[w],r=G.runs[w],pct=worldPct(w),sps=speciesOf(w),sc=worldScenes(w),seen=sc.filter(function(id){return G.seen[w]&&G.seen[w][id]}).length;
  var spsH=sps.map(function(s){var own=ownsSp(s);return '<div class="box'+(own?'':' off')+'">'+spArt(s,'',44,!own)+(own?esc(SPECIES[s].n):'???')+'</div>'}).join('');
  var body;
  if(r)body='<div class="flat"><h3>Tens una aventura a mitges aquí</h3><p class="muted">'+esc(ZONES[w][r.zone||0])+' · lloc '+(r.i+1)+' de '+r.slots.length+(r.cave?', dins una cova':'')+'.</p><div class="row"><button type="button" class="btn green" data-act="resume" data-w="'+w+'">Continua</button><button type="button" class="btn light sm" data-act="abandon" data-w="'+w+'">'+(abandonArm===w?'Segur? Toca un altre cop':'Abandona-la')+'</button></div></div>';
  else body=ZONES[w].map(function(zn,i){var open=zoneOpen(w,i),done=G.done[w+':z'+i];
    return '<button type="button" class="opt" data-act="path" data-p="'+i+'"'+(open?'':' disabled')+'><b>Zona '+(i+1)+': '+esc(zn)+(done?' ✓':'')+'</b><span class="d">'+starStr(starsN(zoneL(w,i)))+' · '+ZONE_ROUTES[i].length+' llocs</span><span class="d">'+esc(ZONE_INFO[i])+'</span>'+(i===2?'<span class="need">Cal portar: '+esc(TALENT[ZONE_NEED[w]].n)+'</span>':i===1?'<span class="d">Recomanat: '+esc(TALENT[ZONE_REC[w]].n)+'</span>':'')+(open?'':'<span class="need">Tancada: acaba primer la zona '+i+'</span>')+'</button>'}).join('');
  return '<div class="flat" style="background:'+A.c+';color:'+(w==='llamp'?'#1E1B2E':'#fff')+'"><div class="row"><button type="button" class="btn sm light" data-act="nav" data-to="explorar">Enrere</button><h1>'+esc(A.mon)+'</h1></div>'+
    '<p>Explorat: <b>'+pct+'%</b> · Llocs vistos '+seen+' de '+sc.length+' · Bestioles '+sps.filter(ownsSp).length+' de '+sps.length+'</p><p>Aquí hi viuen bestioles de '+esc(A.n.toLowerCase())+'. Els monstres resisteixen el seu propi element. Consell: porta bestioles '+esc(deNom(goodAgainst(w)))+'.</p></div>'+
    tip('mon','Cada món té 5 zones. Quan acabes una zona, s’obre la següent. Les estrelles ★ diuen com és de difícil.')+
    '<h3>Bestioles d’aquest món</h3><div class="grid4">'+spsH+'</div>'+body;
}
function goodAgainst(w){return Object.keys(BEATS).filter(function(k){return BEATS[k].indexOf(w)>=0}).map(function(k){return ELS[k].n}).join(' o ')}
