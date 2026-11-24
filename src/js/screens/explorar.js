'use strict';
/* ================= SCREEN: Explorar (the map of the worlds) ================= */
function scExplorar(){
  var pos={foc:[145,0],llamp:[290,118],aigua:[236,300],planta:[54,300],psiquic:[0,118]};
  var lines='<svg width="390" height="460" viewBox="0 0 390 460" aria-hidden="true" style="position:absolute;left:0;top:0"><g stroke="#fff" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round" fill="none"><path d="M195 235 L195 60"/><path d="M195 235 L338 170"/><path d="M195 235 L286 350"/><path d="M195 235 L104 350"/><path d="M195 235 L50 170"/></g></svg>';
  var ws=ORDER.map(function(w){var p=pos[w],open=worldOpen(w),A=ELS[w],pct=open?worldPct(w):0;
    return '<button type="button" class="world" data-act="world" data-w="'+w+'" style="left:'+p[0]+'px;top:'+p[1]+'px"'+(open?'':' aria-label="Món desconegut"')+'><span class="ring" style="background:conic-gradient(#fff '+pct+'%,rgba(255,255,255,.35) 0)"><span class="ball" style="background:'+(open?A.c:'#8E94A8')+'">'+(open?elIcon(w,40,w==='llamp'?'#1E1B2E':'#fff'):'<span style="font-family:var(--display);font-size:40px;color:#fff">?</span>')+(G.runs[w]?'<span class="badge">A mitges</span>':'')+'</span></span>'+(open?esc(A.n)+' · '+pct+'%':'???')+(open?starStr(starsN(TIER[w])):'')+'</button>'}).join('');
  var house='<div style="position:absolute;left:145px;top:190px;width:100px;text-align:center"><svg width="100" height="80" viewBox="0 0 180 150" aria-hidden="true"><ellipse cx="90" cy="120" rx="86" ry="26" fill="#7CC46B"/><rect x="60" y="62" width="62" height="50" rx="4" fill="#FFF4E0" stroke="#8A5A3C" stroke-width="3"/><path d="M52 66 L91 32 L130 66 Z" fill="#E2574C" stroke="#A23A31" stroke-width="3"/></svg></div>';
  var paused=Object.keys(G.runs).map(function(w){var r=G.runs[w];return '<div class="row" style="gap:10px">'+elIcon(w,28,ELS[w].c)+'<div style="flex:1;min-width:0"><b>'+esc(ELS[w].mon)+'</b><div class="muted small">Pas '+(r.i+1)+' de '+r.slots.length+(r.cave?' · dins una cova':'')+'</div></div><button type="button" class="btn sm green" data-act="resume" data-w="'+w+'">Continua</button><button type="button" class="btn sm light" data-act="abandon" data-w="'+w+'">'+(abandonArm===w?'Segur?':'Deixa-la')+'</button></div>'}).join('');
  return tip('explorar','Toca un món per entrar-hi. El número % diu quant n’has explorat. Les estrelles ★ diuen com és de difícil.')+
    goalCard()+
    '<h1>Explorar</h1><p class="muted">Tria a quin món vols entrar.</p><div style="overflow-x:auto"><div class="map">'+lines+house+ws+'</div></div>'+
    (paused?'<div class="flat"><h3>Aventures a mitges</h3><p class="muted small">Les bestioles d’una aventura a mitges no poden anar enlloc més fins que l’acabis o la deixis.</p>'+paused+'</div>':'')+
    (G.psiquic?'':'<p class="muted">Completa 3 expedicions per descobrir el món desconegut ('+G.completed+' de 3).</p>');
}
