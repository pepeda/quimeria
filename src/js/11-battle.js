'use strict';
/* ---------- battle ---------- */
/* enemy life, attack and defence for difficulty L and team size ts. The difficulty is FIXED for each world and zone
   (BAL.ZONE): it does not change with the strength of your team. More critters in the team make enemies a bit stronger. */
function enemyStats(L,guardian,ts){var r=run(),w=r?r.world:'foc',z=r?(r.zone||0):0,M=(BAL.ZONE[w]||BAL.ZONE.foc)[z]||[1,1,1];
  var s=1+0.22*Math.max(0,ts-3);
  var st={hp:Math.round((90+54*L)*s*(guardian?1.8:1)),atk:Math.round((8.5+4*L)*(guardian?1.1:1)*(1+0.04*Math.max(0,ts-3))),def:Math.round(5+2.5*L)};
  st.hp=Math.round(st.hp*M[0]);st.atk=Math.round(st.atk*M[1]);st.def=Math.round(st.def*M[2]);return st}
/* forma 4 auras of the team: {element: percent} of more attack and defence for team members of that element */
function teamAura(list){var a={};list.forEach(function(c){if(!c||c.stage<3)return;var e2=cEl2(c);
  if(e2){a[sp(c).el]=(a[sp(c).el]||0)+BAL.AURA_TWO;a[e2]=(a[e2]||0)+BAL.AURA_TWO}else a[sp(c).el]=(a[sp(c).el]||0)+BAL.AURA_ONE});
  Object.keys(a).forEach(function(k){a[k]=Math.min(BAL.AURA_MAX,a[k])});return a}
function auraF(b,c){return 1+((b.aura&&b.aura[sp(c).el])||0)/100}
/* a new battle. o: {el, L (difficulty), n (name), guardian, final, waves, win (reward), wild (species), rare} */
function makeBattle(o){
  var r=run(),L=o.L,b,ts=r?r.team.length:3;
  if(o.wild){var s=SPECIES[o.wild],base=ROLE[s.role],k=0.8+0.3*L;b={n:s.n+' salvatge',el:s.el,hp:Math.round(base.hp*k*1.8),atk:Math.round(base.atk*k),def:Math.round(base.def*k),wild:o.wild}}
  else{var es=enemyStats(L,o.guardian,ts);b={n:o.n||MONSTERS[o.el],el:o.el,hp:es.hp,atk:es.atk,def:es.def}}
  b.max=b.hp;b.L=L;b.guardian=!!o.guardian;b.final=!!o.final;
  if(o.guardian){var others=ORDER.filter(function(e){return e!==b.el&&BEATS[e].indexOf(b.el)<0});/* chosen once per place on the path and kept in the run, so the preview and the battle show the same element */var rk=r?(r.cave?'c'+r.cave.i:'')+'@'+r.i+b.el:null;if(r&&r.gres&&r.gres.k===rk)b.resist=r.gres.v;else{b.resist=pickOne(others);if(r)r.gres={k:rk,v:b.resist}}}
  var ch={};if(r)r.team.forEach(function(u,idx){var c=byUid(u);ch[u]=c?abilities(c).map(function(a){return a.cd+(idx%3)}):[]});
  var bt={type:'battle',enemy:b,waves:o.waves||1,wavesTotal:o.waves||1,turn:0,ch:ch,shield:0,warn:false,over:null,rare:!!o.rare,win:o.win||null,caption:'Comença la batalla!',
    st:{burn:null,poison:null,stun:0,soak:0,weak:0},tm:{buff:0,regen:null,reflect:{}},syn:r?synergies(r.team.map(byUid)):{},aura:r?teamAura(r.team.map(byUid)):{}};
  /* bosses: the final guardian of each world and the cave king are bosses with their own moves (BOSS) */
  var en=b,k=o.final?BOSS_W[o.el]:((o.n==='Rei de la cova'||o.n==='Rei de les Profunditats')?'tricap':null);
  bt.meter=0;
  if(k){en.boss=k;en.n=BOSS[k].n;en.bossD=BOSS[k].d;if(k==='tricap'){en.max=en.hp=Math.round(en.max*0.7);en.atk=Math.round(en.atk*0.85)}bt.minions=0;bt.mhp=Math.round(en.max*0.09);bt.mcur=0;bt.frozen={};bt.charging=0;bt.phase=0;bt.fallen=0;bt.heads=3}
  /* softer enemies (V13_ADJ; the first bosses even softer), and the powers of the equipped gear */
  var ad=V13_ADJ[en.boss?'boss':en.guardian?'guardian':'normal'];en.atk=Math.max(1,Math.round(en.atk*ad.atk*(en.boss&&r&&!r.zone&&!r.cave?0.85:1)));en.max=en.hp=Math.round(en.hp*ad.hp);if(r&&r.tut&&!en.wild){en.max=en.hp=Math.round(en.hp*TUT_GUARD_HP)}bt.P=powerOf(G.equip);if(bt.P.shield0)bt.shield=Math.min(6,bt.shield+bt.P.shield0);bt.megaUsed={};
  /* the first boss of the game was too hard for the starters: the zone-1 final guardian has 15% less life */
  if(o.final&&r&&(r.zone||0)===0&&!r.cave){en.hp=Math.round(en.hp*0.85);en.max=en.hp}
  if(curZone()>=3)en.hard=true;
  return bt;
}
function alive(r){return r.team.map(byUid).filter(function(c){return c&&r.hp[c.uid]>0})}
function lowest(r){return alive(r).sort(function(a,z){return r.hp[a.uid]/stats(a).hp-r.hp[z.uid]/stats(z).hp})[0]}
function sameEl(r,el){return alive(r).filter(function(c){return sp(c).el===el}).length}
function resistF(b,c){return b.enemy.resist&&sp(c).el===b.enemy.resist?0.5:1}
/* damage of critter c hitting the enemy with power pow: {n: damage, m: element multiplier, zap: lightning on a soaked enemy} */
function outDmg(c,pow,b,r){
  var s=stats(c),atk=s.atk*pow*auraF(b,c)*(b.tm.buff>0?1.3:1)*(b.syn.germans&&sameEl(r,sp(c).el)>=2?1.15:1);
  var def=b.enemy.def*(b.st.soak>0?0.5:1),m=effMult(c,b.enemy.el)*resistF(b,c);
  var zap=(sp(c).el==='llamp'||cEl2(c)==='llamp')&&b.st.soak>0?(b.syn.tempesta?1.6:1.3):1;
  var o={n:Math.max(1,Math.round((atk*m-def*0.5)*zap*caveF(r)*huntF(b,c))),m:m,zap:zap>1};
  /* a critter frozen by the ice boss hardly hurts */
  if(b.frozen&&b.frozen[c.uid]>0){o.n=1;o.m=1;o.zap=false}
  /* element bonus of group attacks, gear powers: element damage, crits, status chances, life drain */
  var P=b.P||emptyP(),f=(b._elb||1)*(1+(P.el[sp(c).el]||0)/100);
  if(P.crit&&Math.random()*100<P.crit){f*=2;procAdd(b,'crit')}
  o.n=Math.max(1,Math.round(o.n*f));
  var boss=b.enemy.boss?0.6:1,pw=stats(c).atk*0.35;
  ['poison','burn','slow','dist','dizzy','stun'].forEach(function(k){if(P[k]&&Math.random()*100<P[k]*boss){applyFx(b,k,pw);procAdd(b,k)}});
  if(P.vamp)b._vamp=(b._vamp||0)+o.n*P.vamp/100;return o;
}
/* damage of the enemy hitting critter t (x: strength of the move). Enemies grow stronger every turn (growF); thorns on the gear hurt back */
function inDmg(b,t,x){x=(x||1)*growF(b);var s=stats(t),def=s.def*auraF(b,t)*(b.syn.complet?1.1:1),atk=b.enemy.atk*(b.st.weak>0?0.7:1)*(b.enemy.enraged?1.3:1)*(x||1);
  var d=Math.max(1,Math.round(atk*mult(b.enemy.el,sp(t).el)-def*0.5));if(b.P&&b.P.thorns)b._thorn=(b._thorn||0)+d*b.P.thorns/100;return d}
function danger(enemy){
  var r=run(),team=alive(r);if(!team.length)return {cls:'bad',t:'Perillós'};
  var out=0,hp=0,tank=team.filter(function(c){return sp(c).role==='Defensa'})[0];
  team.forEach(function(c){var s=stats(c);out+=Math.max(1,Math.round(s.atk*1.35*effMult(c,enemy.el)*(enemy.resist===sp(c).el?0.5:1)-enemy.def*0.5));hp+=r.hp[c.uid]});
  var tg=tank||team[0],inc=Math.max(1,Math.round(enemy.atk*mult(enemy.el,sp(tg).el)-stats(tg).def*0.5))*1.4;
  var ratio=(hp/inc)/(enemy.hp/out);
  return ratio>=3.2?{cls:'good',t:'Fàcil per al teu equip'}:ratio>=1.8?{cls:'mid',t:'Ajustat'}:{cls:'bad',t:'Perillós per al teu equip'};
}
function sampleEnemy(e){var r=run(),L=r.L+(e.L||0)+caveL(r),es=enemyStats(L,!!e.guardian,r.team.length);return {el:r.world,hp:es.hp*(e.waves||1),atk:es.atk,def:es.def}}
function statusActive(b,k){return (k==='burn'&&b.st.burn)||(k==='poison'&&b.st.poison)||(k==='soak'&&b.st.soak>0)||(k==='weaken'&&b.st.weak>0)||(k==='stun'&&b.st.stun>0)}
function chooseAbility(c,b,r){
  var list=abilities(c).filter(function(a){return (b.ch[c.uid]||[])[a.i]===0});if(!list.length)return null;
  var low=lowest(r),lowPct=low?r.hp[low.uid]/stats(low).hp:1,ko=r.team.some(function(u){return r.hp[u]<=0}),hurt=alive(r).filter(function(m){return r.hp[m.uid]<stats(m).hp*0.6}).length;
  function pick(k){return list.filter(function(a){return a.kind===k})[0]}
  var a;
  if((ko||hurt>=2)&&(a=pick('healAll')))return a;
  if(lowPct<0.55&&(a=pick('heal')))return a;
  if(hurt>=1&&!(b.tm.regen&&b.tm.regen.t>0)&&(a=pick('regen')))return a;
  if(b.warn&&b.shield<=0&&(a=pick('shield')))return a;
  if(b.warn==='strong'&&!b.tm.reflect[c.uid]&&(a=pick('reflect')))return a;
  if(b.tm.buff<=0&&(a=pick('buff')))return a;
  var off=list.filter(function(x){return OFFENSIVE.indexOf(x.kind)>=0&&!statusActive(b,x.kind)});
  if(off.length)return off.sort(function(x,y){return y.pow-x.pow})[0];
  if(b.turn>=7&&b.shield<=0&&(a=pick('shield')))return a;
  return null;
}
function doAbility(c,a,b,r){
  b.ch[c.uid][a.i]=a.cd;
  var e={t:'special',uid:c.uid,el:sp(c).el,el2:cEl2(c),kind:a.kind,name:a.n+(c.stage?' '+'★'.repeat(c.stage):''),heals:[]},k=a.kind;
  if(OFFENSIVE.indexOf(k)>=0){
    var times=k==='multi'?3:1,total=0;for(var t=0;t<times;t++){var o=outDmg(c,a.pow,b,r);total+=o.n;b.enemy.hp=Math.max(0,b.enemy.hp-o.n)}
    e.n=total;e.after=b.enemy.hp;var extra='';
    if(k==='burn'){b.st.burn={t:3+(b.syn.incendi?2:0),n:Math.max(2,Math.round(stats(c).atk*0.45))};extra=' i el crema'}
    if(k==='poison'){b.st.poison={t:4,n:Math.max(2,Math.round(stats(c).atk*0.4))};extra=' i l’enverina'}
    if(k==='stun'){b.st.stun=1;extra=' i l’atordeix'}
    if(k==='soak'){b.st.soak=3;extra=' i el deixa mullat'}
    if(k==='weaken'){b.st.weak=3;extra=' i el debilita'}
    e.txt=cName(c)+' fa '+e.name+': -'+total+extra+'.';
  }else if(k==='shield'){b.shield=Math.min(4,b.shield+3);e.txt=cName(c)+' fa '+e.name+': escut per a tot l’equip.'}
  else if(k==='reflect'){b.tm.reflect[c.uid]=2;e.txt=cName(c)+' fa '+e.name+': tornarà la meitat del mal que rebi.'}
  else if(k==='buff'){b.tm.buff=3;e.txt=cName(c)+' fa '+e.name+': tot l’equip fa +30% de mal.'}
  else if(k==='regen'){b.tm.regen={t:3,pct:a.pow};e.txt=cName(c)+' fa '+e.name+': l’equip es curarà cada torn.'}
  else if(k==='heal'){var low=lowest(r);if(low){var mx=stats(low).hp,h=Math.round(stats(c).heal*a.pow*1.6*(b.syn.protector?1.3:1)),nh=Math.min(mx,r.hp[low.uid]+h);e.heals.push({uid:low.uid,n:nh-r.hp[low.uid],after:nh});r.hp[low.uid]=nh}e.txt=cName(c)+' fa '+e.name+(low?' i cura '+cName(low):'')+'.'}
  else if(k==='healAll'){var rev=false;r.team.forEach(function(u){var m=byUid(u);if(!m)return;var mx=stats(m).hp,cur=r.hp[u],nh=Math.min(mx,cur>0?cur+Math.round(mx*a.pow*(b.syn.protector?1.3:1)):Math.round(mx*0.3));
      if(nh>cur){e.heals.push({uid:u,n:nh-cur,after:nh,revived:cur===0});if(cur===0)rev=true;r.hp[u]=nh}});e.txt=cName(c)+' fa '+e.name+': cura tothom'+(rev?' i desperta qui estava KO':'')+'.'}
  return e;
}
function foeCheck(r,b,ev){
  if(b.enemy.hp>0&&b.enemy.guardian&&!b.enemy.enraged&&b.enemy.hp<b.enemy.max/2){b.enemy.enraged=true;ev.push({t:'enrage',txt:b.enemy.n+' s’enfada! Ara fa més mal.'})}
  if(b.enemy.hp>0||b.over)return false;
  if(b.waves>1){b.waves--;var es=enemyStats(b.enemy.L,false,r.team.length);
    b.enemy={n:'Reforç: '+MONSTERS[b.enemy.el],el:b.enemy.el,hp:es.hp,max:es.hp,atk:es.atk,def:es.def,L:b.enemy.L};b.st={burn:null,poison:null,stun:0,soak:0,weak:0};
    ev.push({t:'wave',txt:'Arriba un altre monstre! Onada '+(b.wavesTotal-b.waves+1)+' de '+b.wavesTotal+'.',name:b.enemy.n,max:es.hp});return false}
  b.over='win';ev.push({t:'foeDown',txt:b.enemy.n+' ha perdut!'});return true;
}
/* one battle turn; returns the events to show. The order: gear powers, team meter attack, the normal moves,
   the boss moves, a boss ultimate attack, gear powers at the end. A battle never continues with the whole team
   down, and an error in a turn ends the battle instead of freezing the game. */
function battleTick(){var r=run(),b=r&&r.event;
  if(b&&!b.over&&!alive(r).length){b.over='lose';return [{t:'teamDown',txt:'Tot l’equip ha caigut.'}]}
  try{
    gearTurnStart(r,b);
    var ev=[];
    if(!teamMeterAttack(r,b,ev)){var before=b.enemy.hp;ev=bossMoves(r,b,ev.concat(turnMoves()),before)}
    bossUltimate(r,b,ev);
    return gearTurnEnd(r,b,ev);
  }catch(e){if(b){b.over='lose'}return [{t:'teamDown',txt:'Alguna cosa ha fallat en aquest torn. La batalla s’acaba.'}]}}
/* the normal moves of a turn: burn and poison, regeneration, combined attacks, each critter acts, then the enemy */
function turnMoves(){
  var r=run(),b=r.event,ev=[];b.turn++;
  r.team.forEach(function(u){(b.ch[u]||[]).forEach(function(v,i){if(v>0)b.ch[u][i]=v-1})});
  ['burn','poison'].forEach(function(k){var s=b.st[k];if(s&&s.t>0&&b.enemy.hp>0){b.enemy.hp=Math.max(0,b.enemy.hp-s.n);s.t--;ev.push({t:'dot',kind:k,n:s.n,after:b.enemy.hp,txt:b.enemy.n+(k==='burn'?' es crema':' està enverinat')+': -'+s.n});if(s.t<=0)b.st[k]=null}});
  if(foeCheck(r,b,ev))return ev;
  var rp=(b.tm.regen&&b.tm.regen.t>0?b.tm.regen.pct:0)+(b.syn.natura?0.03:0);
  if(rp>0){var hs=[];alive(r).forEach(function(c){var mx=stats(c).hp,nh=Math.min(mx,r.hp[c.uid]+Math.max(1,Math.round(mx*rp)));if(nh>r.hp[c.uid]){hs.push({uid:c.uid,n:nh-r.hp[c.uid],after:nh});r.hp[c.uid]=nh}});
    if(b.tm.regen&&b.tm.regen.t>0)b.tm.regen.t--;if(hs.length)ev.push({t:'regen',hits:hs,txt:'L’equip es cura una mica.'})}
  var acted={},cx=findCombo(r,b);
  if(cx){ev.push(doCombo(cx,r,b));cx.parts.forEach(function(p){acted[p.c.uid]=1});if(foeCheck(r,b,ev))return ev}
  alive(r).forEach(function(c){
    if(b.over||acted[c.uid]||r.hp[c.uid]<=0)return;
    var ab=chooseAbility(c,b,r);
    if(ab){ev.push(doAbility(c,ab,b,r));foeCheck(r,b,ev);return}
    if(sp(c).role==='Curador'){var low=lowest(r);if(low&&r.hp[low.uid]<stats(low).hp*0.65){var hh=Math.min(Math.round(stats(c).heal*(b.syn.protector?1.3:1)),stats(low).hp-r.hp[low.uid]);r.hp[low.uid]+=hh;ev.push({t:'heal',src:c.uid,tgt:low.uid,n:hh,after:r.hp[low.uid],txt:cName(c)+' cura '+cName(low)+' (+'+hh+')'});return}}
    var o=outDmg(c,1,b,r);b.enemy.hp=Math.max(0,b.enemy.hp-o.n);
    ev.push({t:'hit',src:c.uid,n:o.n,after:b.enemy.hp,eff:o.zap?'zap':o.m>1.1?'super':o.m<0.9?'weak':'',txt:cName(c)+' ataca: -'+o.n+(o.zap?' (llamp sobre mullat!)':o.m>1.1?' (molt efectiu!)':o.m<0.9?' (poc efectiu)':'')});
    foeCheck(r,b,ev);
  });
  if(b.over)return ev;
  var al=alive(r),tank=al.filter(function(c){return sp(c).role==='Defensa'})[0];
  if(b.st.stun>0){b.st.stun=0;ev.push({t:'stunned',txt:b.enemy.n+' està atordit i no ataca!'})}else if(foeSkip(b,r,ev)){}
  else if(b.warn==='area'){
    var sh0=b.shield>0,hits=[];
    al.forEach(function(t){var d=inDmg(b,t,0.75);if(sh0)d=Math.ceil(d/2);r.hp[t.uid]=Math.max(0,r.hp[t.uid]-d);hits.push({uid:t.uid,n:d,after:r.hp[t.uid]})});
    if(sh0)b.shield--;b.warn=false;ev.push({t:'aoe',hits:hits,txt:'ATAC A TOTHOM! '+b.enemy.n+' ataca tot l’equip'+(sh0?' (l’escut para la meitat)':'')+'.'});
  }else{
    var tg=tank||pickOne(al),strong=b.warn==='strong',d=inDmg(b,tg,strong?2:1),sh=false;
    if(b.shield>0){d=Math.ceil(d/2);b.shield--;sh=true}
    b.warn=false;r.hp[tg.uid]=Math.max(0,r.hp[tg.uid]-d);var refl=0;
    if(b.tm.reflect[tg.uid]>0){refl=Math.max(1,Math.round(d*0.5));b.enemy.hp=Math.max(0,b.enemy.hp-refl)}
    ev.push({t:'ehit',tgt:tg.uid,n:d,after:r.hp[tg.uid],strong:strong,refl:refl,foeAfter:b.enemy.hp,txt:(strong?'COP FORT! ':'')+b.enemy.n+' ataca '+cName(tg)+(tank?' (el tanc es posa davant)':'')+': -'+d+(sh?' (l’escut para la meitat)':'')+(refl?'. El mirall li torna -'+refl:'')+(r.hp[tg.uid]===0?'. Queda fora de combat.':'')});
    if(alive(r).length&&foeCheck(r,b,ev))return ev;
  }
  if(!alive(r).length){b.over='lose';ev.push({t:'teamDown',txt:'Tot l’equip ha caigut.'});return ev}
  if(b.turn%3===2&&!b.warn){b.warn=Math.random()<0.5?'area':'strong';ev.push({t:'warn',kind:b.warn,txt:b.enemy.n+(b.warn==='area'?' prepara un ATAC A TOTHOM!':' prepara un COP FORT!')})}
  if(b.st.soak>0)b.st.soak--;if(b.st.weak>0)b.st.weak--;if(b.tm.buff>0)b.tm.buff--;
  Object.keys(b.tm.reflect).forEach(function(u){if(b.tm.reflect[u]>0)b.tm.reflect[u]--});
  return ev;
}
var battleTimer=null,playing=false;
/* the next battle turn, about one second from now (a boss first shows its intro comic page) */
function scheduleTick(){
  if(introPlaying)return;
  var r0=run(),b0=r0&&r0.event;
  if(b0&&b0.type==='battle'&&b0.enemy&&b0.enemy.boss&&!b0.introDone&&!b0.over&&G.screen==='run'){b0.introDone=true;persist();introPlaying=true;
    bossIntro(b0,function(){introPlaying=false;scheduleTick()});return}
  if(battleTimer||playing)return;
  battleTimer=setTimeout(function(){battleTimer=null;var r=run();if(!r||G.screen!=='run'||!r.event||r.event.type!=='battle'||r.event.over)return;
    var ev=battleTick();persist();playEvents(ev,function(){var b=r.event;if(b.over){render();var sc=$('screen');if(sc)sc.scrollTop=0}else scheduleTick()})},RM?600:1050);
}
function stopBattle(){clearTimeout(battleTimer);battleTimer=null}
function playEvents(ev,done){
  playing=true;var i=0;
  (function next(){var rr=run();if(!rr||!rr.event||rr.event.type!=='battle'){playing=false;return}if(i>=ev.length){playing=false;done();return}var e=ev[i++];showEvent(e);
    setTimeout(next,(e.t==='ult'||e.mega||e.all)?(RM?500:3700):(e.t==='spell'||e.t==='revive')?(RM?150:900):(e.t==='proc'||e.t==='drain'||e.t==='skip')?(RM?60:550):((e.t==='ehit'&&e.strong)||e.t==='aoe'||e.t==='enrage'||e.t==='boss')?(RM?200:1500):e.t==='combo'?(RM?300:1500):e.t==='special'?(RM?200:750):(RM?60:320))})();
}
/* the chips under the enemy and the team: statuses, shield, team meter, boss state, how much the enemy has grown */
function updateStatus(){
  var r=run(),b=r&&r.event;if(!b||b.type!=='battle')return;var f=$('foe-st'),t=$('team-st');
  if(f){var s=[];if(b.st.burn)s.push('<span class="stchip burn">Cremat '+b.st.burn.t+'</span>');if(b.st.poison)s.push('<span class="stchip poison">Enverinat '+b.st.poison.t+'</span>');
    if(b.st.stun)s.push('<span class="stchip stun">Atordit</span>');if(b.st.soak>0)s.push('<span class="stchip soak">Mullat '+b.st.soak+'</span>');if(b.st.weak>0)s.push('<span class="stchip weak">Debilitat '+b.st.weak+'</span>');
    if(b.enemy.enraged)s.push('<span class="stchip burn">Enfadat</span>');f.innerHTML=s.join('')}
  if(t){var q=[];if(b.shield>0)q.push('<span class="stchip good">Escut '+b.shield+'</span>');if(b.tm.buff>0)q.push('<span class="stchip good">Ànims '+b.tm.buff+'</span>');
    if(b.tm.regen&&b.tm.regen.t>0)q.push('<span class="stchip good">Regeneració '+b.tm.regen.t+'</span>');
    Object.keys(b.tm.reflect).forEach(function(u){if(b.tm.reflect[u]>0&&byUid(u))q.push('<span class="stchip good">Mirall: '+esc(cName(byUid(u)))+'</span>')});Object.keys(b.aura||{}).forEach(function(e){q.push('<span class="stchip good">Aura '+esc(ELS[e].n)+' +'+b.aura[e]+'%</span>')});t.innerHTML=q.join('')}
  var sh=$('shield');if(sh)sh.classList.toggle('on',b.shield>0);
  /* team meter, soldiers, charging, heads, frozen critters */
  var m=$('team-meter');
  if(m){m.style.width=Math.round(Math.min(1,(b.meter||0)/TEAM_METER)*100)+'%';m.parentNode.classList.toggle('full',(b.meter||0)>=TEAM_METER-1)}
  if(f){var bs='';if(b.minions>0)bs+='<span class="stchip weak">Soldats '+b.minions+'</span>';if(b.charging>0)bs+='<span class="stchip stun">Carregant '+b.charging+'</span>';if(b.enemy.boss==='tricap')bs+='<span class="stchip burn">Caps '+b.heads+'</span>';f.innerHTML+=bs}
  if(t&&b.frozen){var q='';Object.keys(b.frozen).forEach(function(u){if(b.frozen[u]>0&&byUid(u))q+='<span class="stchip soak">Congelat: '+esc(cName(byUid(u)))+' '+b.frozen[u]+'</span>'});t.innerHTML+=q}
  /* statuses from gear powers and how much the enemy has grown */
  if(!f)return;var gs='';
  if(b.st.slow>0)gs+='<span class="stchip soak">Lent '+b.st.slow+'</span>';if(b.st.dist>0)gs+='<span class="stchip weak">Distret '+b.st.dist+'</span>';if(b.st.dizzy>0)gs+='<span class="stchip stun">Marejat '+b.st.dizzy+'</span>';
  var g=growF(b);if(g>=1.01&&b.enemy.hp>0)gs+='<span class="stchip burn">Més fort ×'+g.toFixed(2).replace('.',',')+'</span>';f.innerHTML+=gs
}
function updateAbilities(){
  var r=run(),b=r&&r.event;if(!b||b.type!=='battle')return;
  r.team.forEach(function(u){var c=byUid(u);if(!c)return;var ko=r.hp[u]<=0;
    abilities(c).forEach(function(a){var m=$('ch-'+u+'-'+a.i);if(!m)return;var ch=Math.min(a.cd,(b.ch[u]||[])[a.i]||0),pct=ko?0:Math.round((a.cd-ch)/a.cd*100);m.style.width=pct+'%';m.parentNode.classList.toggle('full',!ko&&ch===0)})});
  updateStatus();
}
function showEventNow(e){
  var r=run(),b=r&&r.event;if(!b||b.type!=='battle'||!$('caption'))return;$('caption').textContent=e.txt;
  var fa=$('foe-art');
  if(e.t==='hit'){anim($('m-'+e.src),'lunge');anim(fa,'shake');anim(fa,'flash');floatNum(fa,'-'+e.n,'dmg'+(e.eff==='super'||e.eff==='zap'?' big':''));if(e.eff==='super')floatNum(fa,'SUPER!','tagtxt');if(e.eff==='zap')floatNum(fa,'DESCÀRREGA!','tagtxt');if(e.eff==='weak')floatNum(fa,'poc efectiu','tagtxt');setBar('foe-hp',e.after,b.enemy.max)}
  else if(e.t==='dot'){floatNum(fa,'-'+e.n,'dmg');var ic=document.createElement('span');ic.className='rise';ic.innerHTML=elIcon(e.kind==='burn'?'foc':'planta',22,e.kind==='burn'?'#FF8A00':'#3DDC84');if(fa){fa.appendChild(ic);setTimeout(function(){ic.remove()},1000)}setBar('foe-hp',e.after,b.enemy.max)}
  else if(e.t==='heal'){anim($('m-'+e.tgt),'healglow');floatNum($('m-'+e.tgt),'+'+e.n,'heal');setBar('hp-'+e.tgt,e.after,stats(byUid(e.tgt)).hp)}
  else if(e.t==='regen'){e.hits.forEach(function(h){floatNum($('m-'+h.uid),'+'+h.n,'heal');setBar('hp-'+h.uid,h.after,stats(byUid(h.uid)).hp)})}
  else if(e.t==='ehit'){anim(fa,'lungeDown');anim($('m-'+e.tgt),'shake');floatNum($('m-'+e.tgt),'-'+e.n,'dmg'+(e.strong?' big':''));setBar('hp-'+e.tgt,e.after,stats(byUid(e.tgt)).hp);if(e.after===0&&$('m-'+e.tgt))$('m-'+e.tgt).classList.add('ko');
    if(e.refl){floatNum(fa,'-'+e.refl,'dmg');floatNum(fa,'MIRALL!','tagtxt');setBar('foe-hp',e.foeAfter,b.enemy.max)}$('warn').classList.remove('on')}
  else if(e.t==='aoe'){anim(fa,'lungeDown');anim($('squad'),'shake');e.hits.forEach(function(h){var m=$('m-'+h.uid);floatNum(m,'-'+h.n,'dmg');setBar('hp-'+h.uid,h.after,stats(byUid(h.uid)).hp);if(h.after===0&&m)m.classList.add('ko')});$('warn').classList.remove('on')}
  else if(e.t==='warn'){$('warn').textContent=e.kind==='area'?'Prepara un ATAC A TOTHOM!':'Prepara un COP FORT!';$('warn').classList.add('on')}
  else if(e.t==='stunned'){floatNum(fa,'ATORDIT','tagtxt');anim(fa,'shake')}
  else if(e.t==='enrage'){floatNum(fa,'S’ENFADA!','tagtxt');anim(fa,'flash')}
  else if(e.t==='wave'){var nm=$('foe-name');if(nm)nm.textContent=e.name;setBar('foe-hp',e.max,e.max);anim(fa,'lungeDown')}
  else if(e.t==='special')showSpecial(e);
  else if(e.t==='combo')showCombo(e);
  updateAbilities();
}
function particles(host,els,n){if(!host)return;for(var k=0;k<n;k++){(function(k){var pe=els[k%els.length],p=document.createElement('span');p.className='particle';p.style.animationDelay=(k*60)+'ms';p.innerHTML=elIcon(pe,28,ELS[pe].c);host.appendChild(p);setTimeout(function(){p.remove()},1000)})(k)}}
function showSpecial(e){
  var st=$('stage'),c=byUid(e.uid);if(!st||!c)return;
  var ci=document.createElement('div');ci.className='cutin';ci.style.setProperty('--cc',ELS[e.el].c);
  ci.innerHTML='<div class="lines"></div><div class="side">EL TEU EQUIP</div><div class="who">'+cArt(c,100)+'</div><div class="sname">'+esc(e.name.toUpperCase())+'!</div>';
  anim($('m-'+e.uid),'lunge');floatNum($('m-'+e.uid),e.name,'tagtxt');
  setTimeout(function(){ci.remove();var fa=$('foe-art'),rr=run();
    if(OFFENSIVE.indexOf(e.kind)>=0){particles(fa,e.el2?[e.el,e.el2]:[e.el],e.kind==='multi'?9:6);
      setTimeout(function(){anim(fa,'shake');anim(fa,'flash');anim(st,'flash');floatNum(fa,'-'+e.n,'dmg big');
        var tag={burn:'CREMAT!',poison:'ENVERINAT!',stun:'ATORDIT!',soak:'MULLAT!',weaken:'DEBILITAT!'}[e.kind];if(tag)floatNum(fa,tag,'tagtxt');
        if(rr&&rr.event&&rr.event.enemy)setBar('foe-hp',e.after,rr.event.enemy.max)},RM?0:430)}
    else if(e.kind==='shield'){$('shield').classList.add('on');anim($('shield'),'flash')}
    else if(e.kind==='reflect'){var m=$('m-'+e.uid);anim(m,'healglow');floatNum(m,'MIRALL','tagtxt')}
    else if(e.kind==='buff'||e.kind==='regen'){rr&&rr.team.forEach(function(u){var m=$('m-'+u);if(m){anim(m,'healglow');floatNum(m,e.kind==='buff'?'+30%':'+','heal')}})}
    else e.heals.forEach(function(h){var m=$('m-'+h.uid);if(!m)return;if(h.revived)m.classList.remove('ko');anim(m,'healglow');floatNum(m,'+'+h.n,'heal');setBar('hp-'+h.uid,h.after,stats(byUid(h.uid)).hp)});
    updateStatus();
  },RM?60:250);
}
function abandonRun(w){var r=G.runs[w];if(!r)return;stopBattle();G.coins+=Math.floor(r.coins/2);delete G.runs[w];if(G.active===w)G.active=null;G.world=w;G.screen='mon';toast('Aventura abandonada. Pots tornar a començar quan vulguis.')}
function restartRun(){var r=run();if(!r)return;var w=r.world,z=r.zone||0,team=r.team.slice();stopBattle();G.coins+=Math.floor(r.coins/2);delete G.runs[w];G.active=null;G.world=w;G.zone=z;G.pick=team.filter(function(u){return byUid(u)});startRun();toast('Torneu a començar la zona amb tota la vida.')}
/* the battle is won: the reward card (or the next step of the scene) */
function battleWon(){
  var r=run(),b=r.event,en=b.enemy,P=b.P||emptyP(),L=b.enemy.L||1;
  if(b.enemy.final){r.coins+=60+20*Math.round(L);r.event={type:'card',kind:'item',item:pickOne(RELICS),why:'El guardià deixa caure un tresor rar. +'+(60+20*Math.round(L))+' monedes.',last:true}}
  else if(b.enemy.wild)recruitCard(b.enemy.wild,b.rare);
  else{
    if(b.enemy.guardian)r.coins+=60;
    if(b.win)applyEffect(b.win);
    else r.event={type:'card',kind:'coins',n:Math.round((15+10*L)*(teamTalent('tresor')?1.5:1)),why:'Has guanyat la batalla!'};
  }
  /* gear with the coins power gives more coins; a boss treasure is a legend set piece 5% of the times */
  var ev=r.event;
  if(ev&&ev.type==='card'&&ev.kind==='coins'&&P.coins)ev.n=Math.round(ev.n*(1+P.coins/100));
  var ch=en.boss?0.05:0;
  if(ch&&ev&&ev.type==='card'&&ev.kind==='item'&&Math.random()<ch){var miss=missingPieces(r.world);if(miss.length){ev.item=pickOne(miss);ev.why='Una peça d’un SET DE LLEGENDA! '+ev.why}}
  /* never leave the whole team down after a win (a mirror can win while the last critter falls) */
  var r2=run();if(r2&&r2.team&&!r2.team.some(function(u){return r2.hp[u]>0}))r2.team.forEach(function(u){r2.hp[u]=1});
}
function finishRun(ok,keepAll){
  var r=run();if(!r)return;if(r.tut&&G.tut)G.tut.done=1;
  var team=r.team.slice(),c0=G.coins;stopBattle();
  var z=r.zone||0,bonus=ok?ZONE_BONUS[z]:0,coins=ok||keepAll?r.coins+bonus:Math.floor(r.coins/2);
  G.coins+=coins;
  var spa=G.built.spa?2:1,tired=[];
  G.owned.forEach(function(c){
    if(r.team.indexOf(c.uid)>=0){c.fat++;if(c.fat>=maxFat(c)){c.fat=maxFat(c);c.rest=maxFat(c);tired.push(cName(c))}}
    else if(!busyWorld(c)){if(c.rest>0){c.rest=Math.max(0,c.rest-spa);if(!c.rest)c.fat=0}else c.fat=Math.max(0,c.fat-spa)}
  });
  /* experience for every critter of the team (less if the expedition was not finished) */
  var levels=[],xp=ok?BAL.XP_RUN_WON:BAL.XP_RUN_LOST;
  r.team.forEach(function(u){var c=byUid(u);if(!c)return;var up=addXp(c,xp);if(up)levels.push(cName(c)+' puja al nivell '+lvl(c)+'!')});
  var tennis=null;
  if(G.built.tennis){var home=G.owned.filter(function(c){return r.team.indexOf(c.uid)<0&&!busyWorld(c)&&canXp(c)});if(home.length){var t=pickOne(home);if(addXp(t,BAL.XP_TENNIS))levels.push(cName(t)+' puja al nivell '+lvl(t)+'!');tennis=cName(t)}}
  var unlocked=false,before=maxTeam();
  if(ok){G.completed++;G.done[r.world+':z'+z]=true;if(G.completed>=3&&!G.psiquic){G.psiquic=true;unlocked=true}}
  G.summary={ok:ok,keepAll:!!keepAll,coins:coins,bonus:bonus,world:r.world,zone:z,tired:tired,unlocked:unlocked,tennis:tennis,pct:0,bigger:maxTeam()>before?maxTeam():0,xp:xp,levels:levels};
  /* a won expedition gives a chest (an older chest that was never opened opens now by itself) */
  if(G.chest&&!G.chest.open)openChest();
  G.chest=ok?{tier:0,world:r.world,taps:0,open:false,got:null}:null;
  delete G.runs[r.world];G.active=null;G.screen='resum';G.summary.pct=worldPct(r.world);
  houseAfterRun(ok,team,r.world,c0);
}
function worldPct(w){
  var sps=speciesOf(w),own=sps.filter(ownsSp).length,sc=worldScenes(w),seen=sc.filter(function(id){return G.seen[w]&&G.seen[w][id]}).length,z=ZONES[w].filter(function(n,i){return G.done[w+':z'+i]}).length;
  return Math.round(40*own/sps.length+30*z/ZONES[w].length+30*seen/sc.length);
}

