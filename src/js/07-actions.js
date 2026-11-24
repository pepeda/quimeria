'use strict';
/* ================= ACTIONS ================= */
/* one tap on a button with data-act: a is the action, d its data-* values */
function act(a,d){
  /* house: element rooms stay locked until that world is finished; area headings fold */
  if(a==='build'){var bd=h14Item(d.k);if(bd&&!h14Open(bd)){toast('Primer has d’acabar: '+ELS[bd.el].mon+'.');return}}
  if(a==='hfold'){G.hFold=G.hFold||{};G.hFold[d.k]=!h14Folded(d.k);persist();render();return}
  /* forge: choose 1 power out of 3 */
  if(a==='forge'){var t=tierOf(d.id);if(t<4&&fcount(d.id)>=4&&G.coins>=FORGE_COST[t]){G.forgeChoice={id:d.id,opts:shuffle(AFF_KEYS).slice(0,3)};G.mtab='obj';snd('tap')}else toast('Et falten objectes o monedes.');render();scrollTop0();return}
  if(a==='forgePick'){var fc=G.forgeChoice;G.forgeChoice=null;if(fc&&fc.opts.indexOf(d.k)>=0&&forgeOnce(fc.id,d.k)){var lf=IT(G.lastForge);snd('forge');toast('Forjat: '+lf.n+' ('+TIER_N[lf.tier]+') amb '+AFFIX[d.k].n+'!')}persist();render();return}
  if(a==='forgeCancel'){G.forgeChoice=null;render();return}
  if(a==='forgeAll'){var n=forgeAll();if(n)snd('forge');toast(n?'Has forjat '+n+' objecte'+(n>1?'s':'')+' (poders a l’atzar).':'No hi ha res per forjar.');persist();render();return}
  /* backpack tabs, sound switch, collection order, legend workshop */
  if(a==='mtab'){G.mtab=d.k;render();scrollTop0();return}
  if(a==='mute'){G.mute=!G.mute;persist();render();if(!G.mute)snd('tap');return}
  if(a==='sortB'){G.sortB=d.k;persist();render();return}
  if(a==='legend'){buyLegend(d.el);persist();render();return}
  /* the chest after a won expedition */
  if(a==='chestTap'){chestTap();persist();render();return}
  /* every other action changes the game, then the screen is drawn again */
  var r=run();
  if(a!=='reset')resetArm=false;if(a!=='abandon')abandonArm=null;if(a!=='restart')restartArm=false;if(a!=='build')buildArm=null;
  if(a==='chat'){$('chat').classList.add('open');$('fbText').focus();return}
  switch(a){
    case 'tip':G.tips[d.k]=1;break;
    case 'nav':G.screen=d.to;G.detail=null;break;
    case 'world':if(!worldOpen(d.w)){toast('Aquest món encara és desconegut. Completa 3 expedicions.');break}G.world=d.w;G.screen='mon';break;
    case 'path':G.zone=+d.p;G.pick=[];G.screen='equip';break;
    case 'pick':var i=G.pick.indexOf(d.u);if(i>=0)G.pick.splice(i,1);else if(G.pick.length<maxTeam())G.pick.push(d.u);else toast('Ara nom\u00e9s hi caben '+maxTeam()+' bestioles.');break;
    case 'go':if(G.pick.length&&needOk()){if(G.pick.length<2)toast('Amb poques bestioles és més difícil!');startRun()}break;
    case 'resume':G.active=d.w;G.screen='run';break;
    case 'pause':stopBattle();G.active=null;G.screen='explorar';toast('Aventura guardada. Hi pots tornar quan vulguis.');break;
    case 'abandon':if(abandonArm!==d.w){abandonArm=d.w;break}abandonArm=null;abandonRun(d.w);break;
    case 'restart':if(!restartArm){restartArm=true;break}restartArm=false;restartRun();break;
    case 'restartNow':restartRun();break;
    case 'choice':var S=SCENES[r.scene],ch=S.nodes[r.node].ch[+d.i];if(ch.req&&!teamHas(ch.req))break;applyEffect(ch.out);break;
    case 'fork':r.slots[r.i].scene=d.s;enterScene(d.s);break;
    case 'gfight':startBattle({el:r.world,L:r.L+0.6,guardian:true,final:true,n:'Guardi\u00e0 de '+ZONES[r.world][r.zone||0]});break;
    case 'mfight':startBattle({el:r.world,L:r.L,waves:2,n:'Campament de monstres',win:{rand:[[0.5,{loot:'common'}],[0.5,{coins:40}]]}});break;
    case 'mleave':applyEffect({dmgTeam:15});break;
    case 'gleave':finishRun(false,true);break;
    case 'bwin':battleWon();break;
    case 'blose':if(r.event.enemy.wild){r.team.forEach(function(u){if(r.hp[u]<=0)r.hp[u]=1});advance()}else finishRun(false);break;
    case 'wfight':startBattle({wild:r.event.sp,L:r.L+(r.event.rare?1:0),rare:r.event.rare});break;
    case 'wfeed':var ws=SPECIES[r.event.sp];G.food[ws.el]--;recruitCard(r.event.sp,r.event.rare);break;
    case 'skip':case 'next':advance();break;
    case 'claim':claimCard();if(r.event.last){r.i=r.slots.length;finishRun(true)}else advance();break;
    case 'join':var nu=r.event.uid;if(r.team.length<3){r.team.push(nu)}else{var kou=r.team.filter(function(u){return r.hp[u]<=0})[0];if(kou){r.team[r.team.indexOf(kou)]=nu;delete r.hp[kou]}}if(r.team.indexOf(nu)>=0)r.hp[nu]=stats(byUid(nu)).hp;advance();break;
    case 'nap':G.owned.forEach(function(c){if(!busyWorld(c)){c.rest=0;c.fat=0}});toast('Han fet la migdiada. Ja estan a punt!');break;
    case 'build':if(buildArm!==d.k){buildArm=d.k;break}buildArm=null;var bd=BUILD.filter(function(x){return x.k===d.k})[0];if(bd&&G.coins>=bd.price&&(G.built[bd.k]||0)<bd.max){G.coins-=bd.price;G.built[bd.k]=(G.built[bd.k]||0)+1;toast(bd.n+': fet!')}break;
    case 'detail':G.detail=d.s;break;
    case 'close':G.detail=null;break;
    case 'adopt':var Sp=SPECIES[d.s];if(G.coins>=Sp.price&&G.owned.length<cap()&&worldOpen(Sp.el)){G.coins-=Sp.price;G.owned.push(mk(d.s));toast(Sp.n+' viu ara a casa teva!')}break;
    case 'feed':var c=anyByUid(d.u);if(c&&G.food[d.el]>0&&canXp(c)){G.food[d.el]--;var fx=d.el===sp(c).el?BAL.XP_FOOD_OWN:BAL.XP_FOOD,fup=addXp(c,fx);toast(cName(c)+' ha menjat: +'+fx+' XP'+(fup?'. Puja al nivell '+lvl(c)+'!':'.'))}break;
    /* evolve: needs the level and the copies (evoCheck); the copies are used up. Forma 3 chooses a branch, forma 4 keeps it */
    case 'evolve':var c2=anyByUid(d.u),ei=+d.i,chk=c2&&evoCheck(c2);if(chk&&chk.ok&&((c2.stage===0&&ei===0)||(c2.stage===1&&ei>0)||(c2.stage===2&&ei===c2.evo))){
      chk.copies.forEach(removeCritter);c2.stage++;c2.evo=ei;addXp(c2,0);toast('Ara és '+cName(c2)+'! ('+chk.copies.length+(chk.copies.length>1?' còpies fetes servir)':' còpia feta servir)'));snd('evolve');buzz([40,40,80])}break;
    /* the Niu: bring a critter home, send one to the Niu, or swap one of the Niu with one of the house */
    case 'niuHome':var nh=anyByUid(d.u);if(nh&&inNiu(nh)&&G.owned.length<cap()){G.niu.splice(G.niu.indexOf(nh),1);G.owned.push(nh);G.niuSwap=null;toast(cName(nh)+' ja és a casa.')}break;
    case 'toNiu':var tn=byUid(d.u);if(tn&&!busyWorld(tn)&&G.owned.length>1){G.owned.splice(G.owned.indexOf(tn),1);var pk=G.pick.indexOf(tn.uid);if(pk>=0)G.pick.splice(pk,1);tn.fat=0;tn.rest=0;G.niu.push(tn);toast(cName(tn)+' descansa al Niu.')}break;
    case 'niuPick':G.niuSwap=G.niuSwap===d.u?null:d.u;break;
    case 'niuSwap':var na=anyByUid(d.u),hb=byUid(d.h);if(na&&inNiu(na)&&hb&&!busyWorld(hb)){G.niu[G.niu.indexOf(na)]=hb;G.owned[G.owned.indexOf(hb)]=na;var pk2=G.pick.indexOf(hb.uid);if(pk2>=0)G.pick.splice(pk2,1);hb.fat=0;hb.rest=0;G.niuSwap=null;toast(cName(na)+' va a casa i '+cName(hb)+' al Niu.')}break;
    case 'equip':var ix=G.items.indexOf(d.id);if(ix<0||!IT(d.id))break;var sl=d.slot;G.items.splice(ix,1);if(G.equip[sl])G.items.push(G.equip[sl]);G.equip[sl]=d.id;toast(IT(d.id).n+' equipat.');break;
    case 'bestEquip':var be=bestEquipSet();G.equip=be.equip;G.items=be.items;toast('Ara portes el millor equipament.');break;
    case 'unequip':if(G.equip[d.slot]){G.items.push(G.equip[d.slot]);delete G.equip[d.slot]}break;
    case 'reset':if(!resetArm){resetArm=true;break}resetArm=false;stopBattle();G=newGame();toast('Partida nova!');break;
  }
  render();
  if(['nav','fork','choice','claim','next','skip','bwin','go','wfight','gfight','mfight','mleave','blose','restartNow','join','wfeed','efight'].indexOf(a)>=0){var sc=$('screen');if(sc)sc.scrollTop=0}
}
document.addEventListener('click',function(ev){
  var t=ev.target.closest('[data-act]');if(!t||!$('phone').contains(t))return;
  if(t.dataset.act==='closeBg'){if(ev.target===t){G.detail=null;render()}return}
  if(t.disabled)return;
  act(t.dataset.act,t.dataset);
});

