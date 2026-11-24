'use strict';
/* ================= SCREEN: Casa (the house) ================= */
function scCasa(){
  var b=G.built,home=G.owned.filter(function(c){return !busyWorld(c)}),none=G.owned.filter(available).length===0&&!Object.keys(G.runs).length;
  var svg=houseSvg(b,home);
  var list=home.map(function(c){var left=c.rest>0?0:Math.round((maxFat(c)-c.fat)*100/maxFat(c));return '<div class="row" style="gap:10px">'+cArt(c,40)+'<div style="flex:1;min-width:0"><b>'+esc(cName(c))+'</b> '+roleTag(sp(c).role,true)+' <span class="muted small">forma '+form(c)+' · niv. '+lvl(c)+'</span>'+bar(left,hpColor(left))+'<div class="muted small">'+esc(fatigueText(c))+'</div></div></div>'}).join('');
  return tip('casa','Aquesta és la teva casa. Aquí descansen les bestioles. Toca <b>Explorar</b> (a baix) per sortir d’aventura!')+
    '<h1>La teva casa</h1>'+svg+'<h2>Construir i decorar</h2><div class="h14builds">'+h14Builds()+'</div>'+
    (none?'<div class="flat" style="background:#FFF1C2"><h3>Totes les bestioles estan cansades</h3><p>Feu una migdiada i tornaran a estar a punt.</p><button type="button" class="btn gold" data-act="nap">Fes la migdiada</button></div>':'')+
    '<div class="flat"><div class="row between"><h3>Places per a bestioles</h3><b>'+G.owned.length+' de '+cap()+'</b></div>'+bar(G.owned.length*100/cap(),'#3DAA5C')+'<p class="muted small">Les bestioles es cansen per expedicions. A casa descansen: 1 punt per cada expedició que no fan, i també 1 punt cada 10 minuts.</p>'+list+'</div>'+
    '<div class="flat"><div class="row between"><h3>Vibració</h3><button type="button" class="btn sm '+(G.mute?'light':'green')+'" data-act="mute" aria-pressed="'+(!G.mute)+'">'+(G.mute?'Apagat':'Encès')+'</button></div></div>'+
    '<div class="flat"><h3>Partida</h3><p class="muted">La partida es guarda en aquest mòbil o ordinador.</p><button type="button" class="btn light sm" data-act="reset">'+(resetArm?'Segur? Toca un altre cop':'Comença una partida nova')+'</button></div>';
}
