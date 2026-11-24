'use strict';
/* ================= V10: comic / manga effects ================= */
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

