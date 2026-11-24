'use strict';
/* ================= COMIC EFFECTS AND SHOWING BATTLE EVENTS ================= */
var SFX_EL={foc:'FSSSHH!',aigua:'SPLAAASH!',planta:'KRAC-KRAC!',llamp:'ZZZAAP!',psiquic:'VUUUMMM!'};
function sfx(host,text,tone,big){if(!host)return;var e=document.createElement('span');e.className='sfx '+(tone||'')+(big?' big':'');e.textContent=text;
  e.style.setProperty('--rot',(Math.random()*24-12).toFixed(0)+'deg');e.style.left=(30+Math.random()*40)+'%';host.appendChild(e);setTimeout(function(){e.remove()},RM?900:1100)}
function impact(){var st=$('stage');if(!st||RM)return;st.classList.remove('impact');void st.offsetWidth;st.classList.add('impact');setTimeout(function(){st.classList.remove('impact')},200)}
function mangaFx(e){
  var fa=$('foe-art'),late=RM?0:760;
  if(e.t==='hit')sfx(fa,pickOne(['PAM!','ZAS!','POF!','TOC!']),e.eff==='super'||e.eff==='zap'?'r':'',0);
  else if(e.t==='special'){if(OFFENSIVE.indexOf(e.kind)>=0)setTimeout(function(){sfx($('foe-art'),SFX_EL[e.el]||'BUM!','r',1);impact()},late);
    else setTimeout(function(){sfx($('squad'),e.kind==='shield'?'KLANG!':e.kind==='reflect'?'TZING!':'BRIIILL!','b',1)},late)}
  else if(e.t==='combo')setTimeout(function(){sfx($('foe-art'),'KA-BOOOM!','r',1);impact()},RM?0:950);
  else if(e.t==='ehit')sfx($('m-'+e.tgt),e.strong?'KRAAAAK!':'BAM!','w',e.strong?1:0);
  else if(e.t==='aoe'){sfx($('squad'),'BOOOOM!','w',1);impact()}
  else if(e.t==='dot')sfx(fa,e.kind==='burn'?'FSSS!':'BLURP!','g',0);
  else if(e.t==='stunned')sfx(fa,'@#*!','',0);
  else if(e.t==='foeDown'){sfx(fa,'K.O.!','r',1);impact()}
  else if(e.t==='enrage'){sfx(fa,'GRRRAAAH!','w',1);impact()}
  else if(e.t==='heal')sfx($('m-'+e.tgt),'GLUP!','g',0);
}

/* shows one battle event: sound, caption, animations, cut-ins and comic pages */
function showEvent(e){
  try{
  if(e.mega||e.all||e.t==='ult'){snd('big');buzz([60,40,120])}else if(e.t==='combo')snd('combo');
  else if(e.t==='hit')snd(e.eff==='super'||e.crit?'crit':'hit');else if(e.t==='heal'||e.t==='regen')snd('heal');
  else if(e.t==='foeDown')snd('win');else if(e.t==='teamDown')snd('lose');}catch(x){}
  if(v13Show(e))return;
  if(e.t==='ult'){var c0=$('caption');if(c0){c0.classList.add('them');c0.classList.remove('us');c0.textContent=e.txt}mangaUlt(e,function(){bossFx(e);impact();sfx($('squad'),'KRAAAAK!','w',1);anim($('squad'),'shake')});return}
  var cap=$('caption');if(cap){cap.classList.toggle('them',THEM_EV.indexOf(e.t)>=0);cap.classList.toggle('us',US_EV.indexOf(e.t)>=0)}
  var big=(e.t==='ehit'&&e.strong)||e.t==='aoe'||e.t==='enrage'||e.t==='boss';
  if(big){enemyCut(e);setTimeout(function(){showEventNow(e);mangaFx(e);bossFx(e)},RM?100:950);return}
  showEventNow(e);mangaFx(e);bossFx(e);
  if(e.t==='ehit'){var fa=$('foe-art');floatNum(fa,'ATACA!','tagtxt')}
}
function enemyCut(e){
  var r=run(),b=r&&r.event,st=$('stage');if(!st||!b||!b.enemy)return;var en=b.enemy;
  var ci=document.createElement('div');ci.className='cutin enemy';ci.style.setProperty('--cc',ELS[en.el].c);
  ci.innerHTML='<div class="lines"></div><div class="side">ENEMIC</div><div class="who foeIn">'+(en.wild?spArt(en.wild,'',118):monster(en.el,118,en.guardian))+'</div><div class="sname">'+(e.label?e.label:e.t==='aoe'?'ATAC A TOTHOM!':e.t==='enrage'?'S’ENFADA!':'COP FORT!')+'</div>';
  st.appendChild(ci);anim(st,'shake');setTimeout(function(){ci.remove();anim($('squad'),'shake')},RM?100:950);
}
