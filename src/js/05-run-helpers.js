'use strict';
/* ================= RUN HELPERS: picking scenes, recruiting and claiming cards ================= */
function pickScene(pool,w,used){
  var c=Object.keys(SCENES).filter(function(id){var s=SCENES[id];return s.pool===pool&&(!s.world||s.world===w)&&used.indexOf(id)<0});
  if(!c.length)c=Object.keys(SCENES).filter(function(id){return SCENES[id].pool===pool&&(!SCENES[id].world||SCENES[id].world===w)});
  var id=pickOne(c);used.push(id);return id;
}
/* --- small DOM helpers used by the battle animations --- */

function $(id){return document.getElementById(id)}
function floatNum(host,text,cls){if(!host)return;var s=document.createElement('span');s.className='pop-num '+cls;s.textContent=text;host.appendChild(s);setTimeout(function(){s.remove()},RM?1200:950)}
function anim(el,cls){if(!el)return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);setTimeout(function(){el.classList.remove(cls)},400)}
function setBar(id,cur,max){var p=Math.max(0,Math.round(cur*100/max));var e=$(id);if(e){var i=e.querySelector('i:not(.ghost)'),g=e.querySelector('i.ghost');if(i){i.style.width=p+'%';i.style.background=hpColor(p)}if(g)g.style.width=p+'%'}var t=$(id+'t');if(t)t.textContent=cur+'/'+max}
/* automatic special attacks: each species has its own named move */
/* a new friend: it goes home, or to the Niu if the house is full. Another one of a species you have is a copy for evolving */
function recruitCard(s,rare){
  var r=run(),have=allCr().filter(function(c){return c.sp===s}).length,n=mk(s),home=addCritter(n);
  var why=have?'Ja en tenies '+have+'. Les còpies serveixen per fer evolucionar les bestioles de la mateixa espècie.':rare?'L’has trobada en un lloc amagat.':'Ara és amiga teva.';
  if(!home)why='La casa és plena: va al Niu, on espera sense límit. '+(have?'Pots fer-la servir com a còpia per evolucionar.':'Pots portar-la a casa quan hi hagi lloc.');
  r.event={type:'card',kind:home?'critter':'niu',sp:s,uid:n.uid,rare:rare,why:why};
}
function claimCard(){
  var r=run(),e=r.event;
  if(e.kind==='item')G.items.push(e.item);
  if(e.kind==='food')G.food[e.el]=(G.food[e.el]||0)+e.n;
  if(e.kind==='coins')r.coins+=e.n;
}
