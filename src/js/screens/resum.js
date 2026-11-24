'use strict';
/* ================= SCREEN: summary after an expedition ================= */
function scResum(){
  var s=G.summary||{ok:true,coins:0,tired:[]};
  return '<div class="flat" style="align-items:center;text-align:center;gap:10px"><h1>'+(s.ok?'Camí completat!':'Heu tornat a casa')+'</h1>'+
    '<p>'+esc(s.world?ELS[s.world].mon:'')+(s.world?' · explorat '+s.pct+'%':'')+'</p><span class="pill" style="background:#FFF4D6;font-size:20px">'+COIN+'+'+s.coins+'</span>'+
    (s.bonus?'<p class="muted">Inclou '+s.bonus+' monedes per acabar el camí.</p>':s.ok?'':s.keepAll?'<p class="muted">Has tornat abans del guardià: el camí no compta com a acabat.</p>':'<p class="muted">Has perdut la meitat de les monedes que portaves.</p>')+
    (s.tired&&s.tired.length?'<p>Molt cansades, han de descansar a casa: <b>'+esc(s.tired.join(', '))+'</b></p>':'')+
    (s.xp?'<p>L’equip guanya <b>'+s.xp+' XP</b> d’experiència.</p>':'')+(s.levels&&s.levels.length?'<p class="tag good" style="font-size:15px;padding:6px 12px">'+esc(s.levels.join(' '))+'</p>':'')+
    (s.tennis?'<p>'+esc(s.tennis)+' ha jugat a tennis i ha guanyat '+BAL.XP_TENNIS+' XP.</p>':'')+
    (s.bigger?'<p class="tag good" style="font-size:15px;padding:6px 12px">Ara pots portar '+s.bigger+' bestioles a les aventures!</p>':'')+(s.unlocked?'<p class="tag good" style="font-size:15px;padding:6px 12px">Has descobert el Món Psíquic!</p>':'')+
    (s.house&&s.house.length?'<div class="small" style="background:#FFF4D6;border-radius:12px;padding:8px 12px;text-align:left"><b>La casa ajuda:</b> '+esc(s.house.join(' '))+'</div>':'')+
    chestBlock()+
    '<div class="row" style="justify-content:center"><button type="button" class="btn" data-act="nav" data-to="explorar">Explora més</button><button type="button" class="btn light" data-act="nav" data-to="casa">Torna a casa</button></div></div>';
}
