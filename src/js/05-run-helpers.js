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
function recruitCard(s,rare){
  var r=run(),have=G.owned.filter(function(c){return c.sp===s}),young=have.filter(function(c){return c.stage<2&&c.mill<5})[0];
  if(young){young.mill=Math.min(5,young.mill+2);r.event={type:'card',kind:'dup',sp:s,why:'Ja tenies '+cName(young)+': guanya 2 estrelles de força.'};return}
  if(G.owned.length>=cap()){r.coins+=20;r.event={type:'card',kind:'full',sp:s,why:'La casa és plena, així que torna al bosc i et deixa 20 monedes. Amplia la casa per tenir-ne més.'};return}
  var n=mk(s);G.owned.push(n);
  r.event={type:'card',kind:'critter',sp:s,uid:n.uid,rare:rare,why:have.length?'Una altra '+SPECIES[s].n+'! Aquesta podrà evolucionar d’una altra manera.':rare?'L’has trobada en un lloc amagat.':'Ara és amiga teva.'};
}
function claimCard(){
  var r=run(),e=r.event;
  if(e.kind==='item')G.items.push(e.item);
  if(e.kind==='food')G.food[e.el]=(G.food[e.el]||0)+e.n;
  if(e.kind==='coins')r.coins+=e.n;
}
