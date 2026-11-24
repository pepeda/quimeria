'use strict';
/* ================= V12: boss intro comic page and ultimate-attack comic page ================= */
var ULT={cavaller:'Tall de les Mil Cendres',gel:'Hivern Etern',gegant:'Terratrèmol Final',eixam:'Pluja de l’Eixam',ombres:'Nit sense Final',tricap:'Triple Alè'};
var introPlaying=false;
function foeSvg(en,px){return en.wild?spArt(en.wild,'',px):monster(en.el,px,en.guardian)}
function comicPage(panels,total,done){
  var ph=$('phone');if(!ph){done();return}
  var pg=document.createElement('div');pg.className='mseq';pg.setAttribute('role','dialog');pg.setAttribute('aria-label','Vinyetes');
  var closed=false;function close(){if(closed)return;closed=true;pg.remove();done()}
  pg.addEventListener('click',close);
  panels.forEach(function(p,i){var d=document.createElement('div');d.className='mp'+(p.wide?' wide':'');d.style.animationDelay=(RM?0:p.at)+'ms';d.style.background=p.bg||'#fff';d.innerHTML=p.html;pg.appendChild(d)});
  var sk=document.createElement('div');sk.className='mskip';sk.textContent='Toca per saltar';pg.appendChild(sk);
  ph.appendChild(pg);setTimeout(close,RM?900:total);
}
function bossIntro(b,done){
  var r=run(),en=b.enemy,c=ELS[en.el].c,zone=ZONES[r.world]?ZONES[r.world][r.zone||0]:'';
  var team=r.team.map(byUid).filter(Boolean).slice(0,4).map(function(m){return cArt(m,44)}).join('');
  comicPage([
    {wide:1,at:0,bg:'linear-gradient(#1B1830,#3A1A1A)',html:'<div class="mbox">'+esc(r.cave?'Al fons de tot de la cova…':'Al final de '+zone+'…')+'</div><div class="msil">'+foeSvg(en,170)+'</div>'},
    {at:700,bg:'#111',html:'<div class="meyes" style="--cc:'+c+'">'+foeSvg(en,300)+'</div><div class="mbox" style="top:auto;bottom:8px">…uns ulls s’obren.</div>'},
    {at:1400,bg:'repeating-conic-gradient(from 0deg at 50% 60%,'+c+' 0deg 6deg,#fff 6deg 14deg)',html:'<div class="mfoe">'+foeSvg(en,130)+'</div>'},
    {wide:1,at:2100,bg:'#fff',html:'<div class="mname">'+esc(en.n.toUpperCase())+'</div><div class="mdesc">'+esc(en.bossD||'')+'</div><div class="mteam">'+team+'</div><span class="sfx stay r" style="left:82%;top:6px">LLUITA!</span>'}
  ],RM?900:4300,done);
}
function mangaUlt(e,done){
  var r=run(),b=r&&r.event;if(!b||!b.enemy){done();return}var en=b.enemy,c=ELS[en.el].c;
  var team=r.team.map(byUid).filter(Boolean).slice(0,4).map(function(m){return '<span class="mscared">'+cArt(m,46)+'<b>!!</b></span>'}).join('');
  comicPage([
    {wide:1,at:0,bg:'#111',html:'<div class="meyes" style="--cc:'+c+'">'+foeSvg(en,320)+'</div><div class="mbox">ATAC DEFINITIU</div>'},
    {at:650,bg:'repeating-conic-gradient(from 0deg at 50% 50%,#111 0deg 5deg,'+c+' 5deg 12deg)',html:'<div class="mname">'+esc(e.name.toUpperCase())+'!</div>'},
    {at:1200,bg:'#fff',html:'<div class="mteam">'+team+'</div><div class="mbox" style="top:auto;bottom:8px">L’equip no ho pot esquivar!</div>'},
    {wide:1,at:1800,bg:'#fff',html:'<svg class="mcrack" viewBox="0 0 300 120" preserveAspectRatio="none" aria-hidden="true"><path d="M150 60 L20 10 M150 60 L60 115 M150 60 L280 20 M150 60 L250 118 M150 60 L150 0 M150 60 L0 70 M150 60 L300 75 M95 38 L80 70 M210 40 L235 70" stroke="#111" stroke-width="4" fill="none"/></svg><span class="sfx r big" style="left:50%;top:30%;animation-delay:'+(RM?0:1900)+'ms">KRA-KA-BOOOM!</span>'}
  ],RM?900:3300,done);
}
function scheduleTick(){
  if(introPlaying)return;
  var r=run(),b=r&&r.event;
  if(b&&b.type==='battle'&&b.enemy&&b.enemy.boss&&!b.introDone&&!b.over&&G.screen==='run'){b.introDone=true;persist();introPlaying=true;
    bossIntro(b,function(){introPlaying=false;scheduleTick0()});return}
  scheduleTick0();
}
function battleTick2(){
  var ev=battleTick1(),r=run(),b=r.event,en=b.enemy;
  if(en&&en.boss&&!b.over&&!b.ultDone&&en.hp>0&&en.hp<en.max*0.35&&alive(r).length){
    b.ultDone=true;var hits=[],sh=b.shield>0;
    alive(r).forEach(function(t){var d=inDmg(b,t,1.1);if(sh)d=Math.ceil(d/2);r.hp[t.uid]=Math.max(0,r.hp[t.uid]-d);hits.push({uid:t.uid,n:d,after:r.hp[t.uid]})});
    if(sh)b.shield--;
    ev.push({t:'ult',name:ULT[en.boss]||'Atac definitiu',hits:hits,txt:en.n+' fa el seu atac definitiu: '+(ULT[en.boss]||'')+'!'+(sh?' L’escut en para la meitat.':'')});
    if(!alive(r).length){b.over='lose';ev.push({t:'teamDown',txt:'Tot l’equip ha caigut.'})}
  }
  return ev;
}

