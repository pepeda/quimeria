'use strict';
/* ================= V11: original bosses, group attacks, team meter ================= */
var BOSS={
  cavaller:{n:'Cavaller de Cendra',d:'Cada 3 torns fa una estocada que travessa l’escut. A la meitat de la vida es treu l’armadura: té menys defensa però ataca dues vegades.'},
  gel:{n:'Mag de Gel',d:'Cada 3 torns congela una bestiola durant 2 torns: gairebé no fa mal. Les bestioles de Foc no es congelen.'},
  gegant:{n:'Gegant de Pedra',d:'Cada 4 torns carrega un cop gegant durant 2 torns. Si l’atordiu mentre carrega, l’atureu.'},
  eixam:{n:'Reina de l’Eixam',d:'Cada 2 torns crida soldats (fins a 4). Els soldats paren gran part del mal que li feu i també ataquen.'},
  ombres:{n:'Senyor de les Ombres',d:'Quan perd vida crida ombres. Al final fa tornar els soldats que heu fet caure.'},
  tricap:{n:'Guardià de tres caps',d:'Té tres caps (Foc, Aigua i Llamp) i cada cap ataca. Cada vegada que perd un terç de la vida, cau un cap.'}};
var BOSS_W={foc:'cavaller',aigua:'gel',planta:'gegant',llamp:'eixam',psiquic:'ombres'};
var TEAM_METER=7;
var GROUP_NAMES={'aigua+foc+llamp':'Tempesta de vapor elèctric','foc+llamp+planta':'Bosc en flames','aigua+planta+psiquic':'Pluja de somnis','foc+llamp+psiquic':'Llamp de foc mental',
  'aigua+llamp+planta':'Tempesta verda','aigua+foc+planta':'Gèiser del bosc','foc+planta+psiquic':'Flor de foc','aigua+llamp+psiquic':'Mar de llamps','llamp+planta+psiquic':'Arbre del tro','aigua+foc+psiquic':'Boira de foc'};
function bestOff(c){var l=abilities(c).filter(function(a){return OFFENSIVE.indexOf(a.kind)>=0}).sort(function(x,y){return y.pow-x.pow});var a=l[0]||{kind:'hit',pow:1,cd:0};return {i:-1,cd:0,kind:a.kind,pow:Math.max(1,a.pow)}}
/* who attacks together this turn: a secret combo, 3 or more critters with an attack ready, or 2 of elements that combine (COMBOS) */
function findCombo(r,b){
  var mega=megaReady(r,b);if(mega)return mega;
  var ready=alive(r).map(function(c){var a=abilities(c).filter(function(x){return OFFENSIVE.indexOf(x.kind)>=0&&(b.ch[c.uid]||[])[x.i]===0})[0];return a?{c:c,a:a}:null}).filter(Boolean);
  if(ready.length>=3)return {parts:ready,group:true};
  for(var i=0;i<ready.length;i++)for(var j=i+1;j<ready.length;j++){var e1=sp(ready[i].c).el,e2=sp(ready[j].c).el,cb=COMBOS[comboKey(e1,e2)];
    if(e1!==e2&&cb)return {parts:[ready[i],ready[j]],cb:cb}}
  return null;
}
/* a combined attack; more different elements give a bonus (+10% for each one after the first) */
function doCombo(x,r,b){
  if(x.mega)return doMega(x,r,b);
  var nEl=elsOf(x.parts).length,eb=elBonus(nEl);b._elb=eb;
  x.parts.forEach(function(p){if(p.a.i>=0)b.ch[p.c.uid][p.a.i]=p.a.cd});
  var k=x.parts.length,n=0,els=[],kinds=[],pow=x.group?1.3*(1+0.15*(k-2)):x.cb[2]*1.3;
  x.parts.forEach(function(p){n+=outDmg(p.c,pow,b,r).n;var e=sp(p.c).el;if(els.indexOf(e)<0)els.push(e);if(kinds.indexOf(p.a.kind)<0)kinds.push(p.a.kind)});
  b.enemy.hp=Math.max(0,b.enemy.hp-n);
  var pw=Math.max(3,Math.round(x.parts.reduce(function(a,p){return a+stats(p.c).atk},0)*0.25));
  (x.group?kinds:[x.cb[1]]).forEach(function(q){if(q==='burn')b.st.burn={t:4+(b.syn.incendi?2:0),n:pw};if(q==='poison')b.st.poison={t:4,n:pw};if(q==='stun')b.st.stun=1;if(q==='weaken')b.st.weak=3;if(q==='soak')b.st.soak=3});
  var name=!x.group?x.cb[0]:x.all?'Atac de tot l’equip':(els.length===3&&GROUP_NAMES[els.slice().sort().join('+')])||(els.length>=4?'Tempesta de '+els.length+' elements':els.length===1?'Triple '+ELS[els[0]].n:'Atac de '+(k===3?'tres':k===4?'quatre':k));
  b._elb=1;
  var e={t:'combo',ids:x.parts.map(function(p){return p.c.uid}),els:els,name:name,n:n,after:b.enemy.hp,group:!!x.group,
    txt:(x.group?'ATAC CONJUNT! ':'ATAC COMBINAT! ')+x.parts.map(function(p){return cName(p.c)}).join(', ')+' fan '+name+': -'+n+'.'};
  e.elb=eb;e.nEl=nEl;e.all=!!x.all;if(eb>1)e.txt+=' Bonus de '+nEl+' elements: +'+Math.round((eb-1)*100)+'%.';return e;
}
function showCombo(e){
  var st=$('stage');if(!st)return;var ids=e.ids||[],px=ids.length<=2?84:ids.length<=4?62:50;
  var cols=e.els.map(function(x){return ELS[x].c}),stops=cols.map(function(c,i){return c+' '+(10+80*i/cols.length)+'% '+(10+80*(i+1)/cols.length)+'%'}).join(',');
  var ci=document.createElement('div');ci.className='cutin combo';
  ci.style.background='linear-gradient(100deg,rgba(0,0,0,.85) 0 10%,'+stops+',rgba(0,0,0,.85) 90%)';
  ci.innerHTML='<div class="lines"></div><div class="side">'+(e.group?'ATAC CONJUNT':'EL TEU EQUIP')+'</div><div class="pair" style="gap:6px">'+ids.map(function(u){var c=byUid(u);return c?'<div class="who">'+cArt(c,px)+'</div>':''}).join('')+'</div><div class="sname">'+esc(e.name.toUpperCase())+'!</div>';
  st.appendChild(ci);
  setTimeout(function(){ci.remove();var fa=$('foe-art'),rr=run();particles(fa,e.els,Math.min(16,6+ids.length*2));
    setTimeout(function(){anim(fa,'shake');anim(fa,'flash');anim(st,'flash');floatNum(fa,'-'+e.n,'dmg big');floatNum(fa,e.group?'CONJUNT!':'COMBO!','tagtxt');if(rr&&rr.event&&rr.event.enemy)setBar('foe-hp',e.after,rr.event.enemy.max);updateStatus()},RM?0:450)},RM?150:950);
}
function battleTick1(){
  var r=run(),b=r.event,ev=[];
  b.meter=(b.meter||0)+1;
  if(b.meter>=TEAM_METER&&alive(r).length>=2&&b.enemy.hp>0){
    b.meter=0;ev.push(doCombo({parts:alive(r).map(function(c){return {c:c,a:bestOff(c)}}),group:true,all:true},r,b));
    if(foeCheck(r,b,ev))return ev;
  }
  var before=b.enemy.hp;ev=ev.concat(battleTick0());
  var en=b.enemy,boss=en.boss;if(!boss)return ev;
  var after=en.hp;
  if(b.minions>0&&before>after){var dealt=before-after,abs=Math.round(dealt*0.5),died=0;en.hp=Math.min(en.max,en.hp+abs);b.mcur-=abs;
    while(b.mcur<=0&&b.minions>0){b.minions--;died++;b.fallen++;if(b.minions>0)b.mcur+=b.mhp}if(!b.minions)b.mcur=0;
    if(b.over==='win'&&en.hp>0){b.over=null;ev=ev.filter(function(x){return x.t!=='foeDown'})}
    ev.push({t:'minion',txt:'Els soldats paren '+abs+' de mal'+(died?' i en cauen '+died:'')+'. En queden '+b.minions+'.',foeAfter:en.hp})}
  if(b.over)return ev;
  var al=alive(r);if(!al.length)return ev;
  var hits=[];function hit(t,mx,pierce){var d=inDmg(b,t,mx);if(!pierce&&b.shield>0)d=Math.ceil(d/2);r.hp[t.uid]=Math.max(0,r.hp[t.uid]-d);hits.push({uid:t.uid,n:d,after:r.hp[t.uid]});return d}
  function front(){var a=alive(r);return a.filter(function(c){return sp(c).role==='Defensa'})[0]||a[0]}
  Object.keys(b.frozen).forEach(function(u){if(b.frozen[u]>0)b.frozen[u]--});
  if(boss==='cavaller'){
    if(b.phase===0&&en.hp<en.max/2){b.phase=1;en.def=Math.round(en.def*0.6);ev.push({t:'boss',label:'SENSE ARMADURA!',txt:en.n+' es treu l’armadura: ara té menys defensa però ataca dues vegades.',hits:[]})}
    var tk=front();if(tk){if(b.turn%3===0){var dd=hit(tk,1.4,true);ev.push({t:'boss',label:'ESTOCADA!',txt:en.n+' fa una estocada que travessa l’escut: -'+dd+' a '+cName(tk)+'.',hits:hits.splice(0)})}
      else if(b.phase===1){var d2=hit(tk,1);ev.push({t:'minion',txt:en.n+' ataca una segona vegada: -'+d2+' a '+cName(tk)+'.',hits:hits.splice(0)})}}
  }
  if(boss==='gel'&&b.turn%3===0){var cand=alive(r).filter(function(c){return sp(c).el!=='foc'&&!(b.frozen[c.uid]>0)});
    if(cand.length){var f=pickOne(cand);b.frozen[f.uid]=2;ev.push({t:'boss',label:'CONGELAT!',txt:en.n+' congela '+cName(f)+' durant 2 torns: gairebé no farà mal.',hits:[]})}}
  if(boss==='gegant'){
    if(b.charging>0){
      if(b.st.stun>0||ev.some(function(x){return x.t==='stunned'})){b.charging=0;ev.push({t:'minion',txt:'Heu atordit el gegant: el cop gegant s’atura!'})}
      else{b.charging--;if(b.charging===0){alive(r).forEach(function(t){hit(t,1.15)});if(b.shield>0)b.shield--;ev.push({t:'boss',label:'COP GEGANT!',txt:en.n+' fa el cop gegant a tot l’equip!',hits:hits.splice(0)})}
        else ev.push({t:'minion',txt:en.n+' segueix carregant el cop gegant. Atordiu-lo ara!'})}
    }else if(b.turn%5===0){b.charging=2;ev.push({t:'boss',label:'CARREGA!',txt:en.n+' comença a carregar un cop gegant (2 torns). Si l’atordiu, l’atureu.',hits:[]})}
  }
  if(boss==='eixam'&&b.turn%2===0&&b.minions<4){var add=Math.min(2,4-b.minions);if(!b.minions)b.mcur=b.mhp;b.minions+=add;ev.push({t:'boss',label:'SOLDATS!',txt:en.n+' crida '+add+' soldats. Ara en té '+b.minions+'.',hits:[]})}
  if(boss==='ombres'){var pct=en.hp/en.max;
    if((b.phase===0&&pct<0.66)||(b.phase===1&&pct<0.33)){b.phase++;if(!b.minions)b.mcur=b.mhp;b.minions+=2;ev.push({t:'boss',label:'OMBRES!',txt:en.n+' crida 2 ombres.',hits:[]})}
    else if(b.phase===2&&pct<0.2&&b.fallen>0){b.phase=3;if(!b.minions)b.mcur=b.mhp;b.minions+=b.fallen;ev.push({t:'boss',label:'AIXEQUEU-VOS!',txt:en.n+' fa tornar '+b.fallen+' soldats caiguts!',hits:[]});b.fallen=0}}
  if(boss==='tricap'){var heads=Math.max(1,Math.ceil(en.hp/en.max*3)),hel=['foc','aigua','llamp'];
    if(heads<b.heads)ev.push({t:'boss',label:'CAU UN CAP!',txt:'Cau un cap! En queden '+heads+'.',hits:[]});b.heads=heads;
    for(var h=1;h<heads;h++){var tt=pickOne(alive(r));if(!tt)break;var keep=en.el;en.el=hel[h];hit(tt,0.35);en.el=keep}
    if(hits.length)ev.push({t:'minion',txt:'Els altres caps també ataquen.',hits:hits.splice(0)})}
  if(b.minions>0){var tm=front();if(tm){for(var m=0;m<b.minions;m++)hit(tm,0.3);ev.push({t:'minion',txt:'Els soldats ataquen '+cName(tm)+': -'+hits.reduce(function(a,x){return a+x.n},0)+'.',hits:hits.splice(0)})}}
  if(!alive(r).length&&!b.over){b.over='lose';ev.push({t:'teamDown',txt:'Tot l’equip ha caigut.'})}
  return ev;
}
function bossFx(e){
  if(e.hits)e.hits.forEach(function(h){var m=$('m-'+h.uid);if(!m)return;anim(m,'shake');floatNum(m,'-'+h.n,'dmg');setBar('hp-'+h.uid,h.after,stats(byUid(h.uid)).hp);if(h.after===0)m.classList.add('ko')});
  var r=run(),b=r&&r.event;if(e.foeAfter!=null&&b&&b.enemy)setBar('foe-hp',e.foeAfter,b.enemy.max);
  if(e.t==='boss'||e.t==='minion')updateStatus();
}

