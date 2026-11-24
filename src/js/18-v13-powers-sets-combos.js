'use strict';
/* ================= V13: item powers, legendary sets, secret combos, new statuses, enemies that grow ================= */
/* --- powers that forged items gain (one more each time an item is forged) --- */
var AFFIX={
  vamp:{n:'Xucla vida',d:'L’equip recupera el 4% del mal que fa.',p:{vamp:4}},
  escut:{n:'Escut',d:'Comences cada batalla amb 1 escut.',p:{shield0:1}},
  conjur:{n:'Encanteri',d:'Cada 5 torns llança una bola màgica.',p:{spells:[{n:'Bola màgica',every:5,pow:0.7}]}},
  veri:{n:'Verí',d:'10% de probabilitat d’enverinar quan pega.',p:{poison:10}},
  brasa:{n:'Brasa',d:'10% de probabilitat de cremar quan pega.',p:{burn:10}},
  gebre:{n:'Gebre',d:'10% de probabilitat de deixar l’enemic lent.',p:{slow:10}},
  lluentor:{n:'Lluentor',d:'10% de probabilitat de distreure l’enemic.',p:{dist:10}},
  remoli:{n:'Remolí',d:'10% de probabilitat de marejar l’enemic.',p:{dizzy:10}},
  crit:{n:'Cop crític',d:'8% de probabilitat de fer el doble de mal.',p:{crit:8}},
  espines:{n:'Espines',d:'L’enemic rep el 8% del mal que us fa.',p:{thorns:8}},
  rosada:{n:'Rosada',d:'L’equip es cura un 1% cada torn.',p:{regen:1}},
  rapid:{n:'Rapidesa',d:'Les habilitats es carreguen una mica més de pressa.',p:{haste:10}},
  sort:{n:'Sort',d:'+15% de monedes a les batalles.',p:{coins:15}}};
var AFF_KEYS=Object.keys(AFFIX);
function affOf(id){var p=String(id).split('~')[1];return p?p.split('.').filter(function(a){return AFFIX[a]}):[]}
/* --- legendary sets: 2 per element, 5 pieces each, always Superèpica --- */
var SLOT_N={casc:'Casc',espasa:'Arma',escut:'Escut',collaret:'Collaret',anell:'Anell',capa:'Capa',botes:'Botes'};
var SLOT_BASE={casc:{def:2,hp:1,atk:0},espasa:{atk:3,def:0,hp:0},escut:{def:3,atk:0,hp:0},collaret:{hp:3,atk:1,def:0},anell:{atk:1,def:1,hp:1},capa:{def:1,hp:2,atk:0},botes:{hp:2,def:1,atk:0}};
var SETS={
  drac:{n:'Armadura del Drac Roig',suf:'del Drac Roig',el:'foc',slots:['casc','espasa','escut','capa','botes'],b:[
    {d:'Atac +15%',p:{atk:15}},{d:'Els cops poden cremar (25%)',p:{burn:25}},
    {d:'Encanteri cada 4 torns: Alè de drac (mal de foc i cremada)',p:{spells:[{n:'Alè de drac',every:4,pow:1.3,el:'foc',fx:['burn']}]}},
    {d:'Fúria del drac: les bestioles de Foc fan +40% i 20% de cops crítics',p:{el:{foc:40},crit:20}}]},
  fenix:{n:'Plomes del Fènix',suf:'del Fènix',el:'foc',slots:['collaret','anell','capa','botes','casc'],b:[
    {d:'Vida +15%',p:{hp:15}},{d:'L’equip es cura un 3% cada torn',p:{regen:3}},
    {d:'Xucla vida: l’equip recupera el 10% del mal que fa',p:{vamp:10}},
    {d:'Renaixement: un cop per batalla, les bestioles KO tornen amb la meitat de la vida',p:{phoenix:1}}]},
  marea:{n:'Corona de les Marees',suf:'de les Marees',el:'aigua',slots:['casc','escut','collaret','anell','botes'],b:[
    {d:'Defensa +15%',p:{def:15}},{d:'Comences cada batalla amb 2 escuts',p:{shield0:2}},
    {d:'Encanteri cada 4 torns: Onada (mullat i lent)',p:{spells:[{n:'Onada',every:4,pow:1,el:'aigua',fx:['soak','slow']}]}},
    {d:'Tsunami: Aigua +30% i cada 6 torns una onada gegant (molt de mal, lent i 2 escuts)',p:{el:{aigua:30},spells:[{n:'Tsunami',every:6,pow:2.6,el:'aigua',fx:['soak','slow'],shield:2}]}}]},
  levia:{n:'Escates del Leviatan',suf:'del Leviatan',el:'aigua',slots:['espasa','capa','anell','collaret','casc'],b:[
    {d:'Vida +15%',p:{hp:15}},{d:'Espines: l’enemic rep el 20% del mal que us fa',p:{thorns:20}},
    {d:'Xucla vida: l’equip recupera el 10% del mal que fa',p:{vamp:10}},
    {d:'Abraçada de l’abisme: cada 5 torns cura un 20% a tothom i mareja l’enemic',p:{spells:[{n:'Abraçada de l’abisme',every:5,pow:0.8,el:'aigua',fx:['dizzy'],heal:20}]}}]},
  bosc:{n:'Arrels del Bosc Antic',suf:'del Bosc Antic',el:'planta',slots:['casc','escut','capa','botes','anell'],b:[
    {d:'Defensa +15%',p:{def:15}},{d:'Els cops poden enverinar (25%)',p:{poison:25}},
    {d:'L’equip es cura un 3% cada torn',p:{regen:3}},
    {d:'Cor del bosc: Planta +40% i cada 5 torns unes arrels atrapen l’enemic (atordit i enverinat)',p:{el:{planta:40},spells:[{n:'Arrels que atrapen',every:5,pow:1.2,el:'planta',fx:['stun','poison']}]}}]},
  rosa:{n:'Espines de la Rosa Negra',suf:'de la Rosa Negra',el:'planta',slots:['espasa','collaret','anell','capa','botes'],b:[
    {d:'Atac +15%',p:{atk:15}},{d:'Espines: l’enemic rep el 25% del mal que us fa',p:{thorns:25}},
    {d:'Els cops poden marejar (20%)',p:{dizzy:20}},
    {d:'Jardí de verí: cada 4 torns pluja de pètals (mal, enverinat i marejat) i 30% d’enverinar',p:{poison:30,spells:[{n:'Pluja de pètals',every:4,pow:1.4,el:'planta',fx:['poison','dizzy']}]}}]},
  tro:{n:'Tro del Gegant del Cel',suf:'del Gegant del Cel',el:'llamp',slots:['casc','espasa','escut','collaret','capa'],b:[
    {d:'Atac +15%',p:{atk:15}},{d:'15% de cops crítics (doble de mal)',p:{crit:15}},
    {d:'Encanteri cada 4 torns: Llamp del cel (atordeix)',p:{spells:[{n:'Llamp del cel',every:4,pow:1.2,el:'llamp',fx:['stun']}]}},
    {d:'Tempesta eterna: Llamp +40% i la barra de tot l’equip es carrega el doble',p:{el:{llamp:40},meter:1}}]},
  vent:{n:'Botes del Vent Ràpid',suf:'del Vent Ràpid',el:'llamp',slots:['botes','anell','capa','collaret','espasa'],b:[
    {d:'Vida +10% i Defensa +10%',p:{hp:10,def:10}},{d:'Els cops poden deixar l’enemic lent (25%)',p:{slow:25}},
    {d:'Les habilitats es carreguen més de pressa',p:{haste:35}},
    {d:'Velocitat del llamp: habilitats encara més ràpides i barra de l’equip +50%',p:{haste:40,meter:0.5}}]},
  ull:{n:'Mantell de l’Ull Etern',suf:'de l’Ull Etern',el:'psiquic',slots:['casc','collaret','anell','capa','escut'],b:[
    {d:'Defensa +15%',p:{def:15}},{d:'Els cops poden distreure (25%)',p:{dist:25}},
    {d:'Els cops poden marejar (20%)',p:{dizzy:20}},
    {d:'Mirada eterna: Psíquic +40% i cada 4 torns la Mirada (distret, marejat i debilitat)',p:{el:{psiquic:40},spells:[{n:'Mirada eterna',every:4,pow:1.2,el:'psiquic',fx:['dist','dizzy','weaken']}]}}]},
  somnia:{n:'Joies del Somni Profund',suf:'del Somni Profund',el:'psiquic',slots:['collaret','anell','botes','espasa','capa'],b:[
    {d:'Vida +15%',p:{hp:15}},{d:'L’equip es cura un 3% cada torn',p:{regen:3}},
    {d:'Encanteri cada 5 torns: Son profund (atordeix)',p:{spells:[{n:'Son profund',every:5,pow:0.9,el:'psiquic',fx:['stun']}]}},
    {d:'Somni compartit: cada 6 torns cura un 30% a tothom i desperta qui està KO; habilitats més ràpides',p:{haste:25,spells:[{n:'Somni compartit',every:6,pow:0.6,el:'psiquic',heal:30,revive:1}]}}]}};
var SET_KEYS=Object.keys(SETS);
SET_KEYS.forEach(function(k){var S=SETS[k];S.slots.forEach(function(sl){var bs=SLOT_BASE[sl];ITEMS['set_'+k+'_'+sl]={n:SLOT_N[sl]+' '+S.suf,slot:sl,atk:bs.atk,def:bs.def,hp:bs.hp,rar:'Set',set:k}})});
function pieceId(k,sl){return 'set_'+k+'_'+sl+'#4'}
function allMine(){var l=G.items.slice();Object.keys(G.equip).forEach(function(s){if(G.equip[s])l.push(G.equip[s])});return l}
function ownsPiece(id){return allMine().some(function(x){return baseOf(x)===baseOf(id)})}
function piecesOfEl(el){var l=[];SET_KEYS.forEach(function(k){if(SETS[k].el===el)SETS[k].slots.forEach(function(sl){l.push(pieceId(k,sl))})});return l}
function missingPieces(el){return piecesOfEl(el).filter(function(id){return !ownsPiece(id)})}
var LEGEND_COST=900;
function legendOpen(){return !!G.superForged||allMine().some(function(id){var b=ITEMS[baseOf(id)];return b&&!b.set&&tierOf(id)>=4})}
/* --- total powers from what is equipped --- */
function emptyP(){return {atk:0,def:0,hp:0,vamp:0,shield0:0,spells:[],poison:0,burn:0,slow:0,dist:0,dizzy:0,stun:0,crit:0,thorns:0,regen:0,haste:0,meter:0,coins:0,el:{},phoenix:0}}
function addP(P,p){Object.keys(p).forEach(function(k){
  if(k==='spells')p.spells.forEach(function(s){var same=P.spells.filter(function(x){return x.n===s.n})[0];if(same)same.pow+=s.pow;else P.spells.push(Object.assign({},s))});
  else if(k==='el')Object.keys(p.el).forEach(function(e){P.el[e]=(P.el[e]||0)+p.el[e]});else P[k]+=p[k]})}
function setCounts(eq){var n={};Object.keys(eq).forEach(function(s){var b=eq[s]&&ITEMS[baseOf(eq[s])];if(b&&b.set)n[b.set]=(n[b.set]||0)+1});return n}
var pCache={k:null,P:null};
function powerOf(eq){eq=eq||{};var key=SLOTS.map(function(x){return eq[x[0]]||''}).join('|');if(pCache.k===key)return pCache.P;
  var P=emptyP();Object.keys(eq).forEach(function(s){affOf(eq[s]).forEach(function(a){addP(P,AFFIX[a].p)})});
  var n=setCounts(eq);Object.keys(n).forEach(function(k){SETS[k].b.forEach(function(x,i){if(n[k]>=i+2)addP(P,x.p)})});
  P.haste=Math.min(75,P.haste);['poison','burn','slow','dist','dizzy','crit'].forEach(function(k){P[k]=Math.min(60,P[k])});
  pCache={k:key,P:P};return P}
function powerText(P){var l=[];
  if(P.vamp)l.push('Xucla vida '+P.vamp+'%');if(P.shield0)l.push('Escuts a l’inici '+P.shield0);if(P.crit)l.push('Crític '+P.crit+'%');
  [['poison','Enverinar'],['burn','Cremar'],['slow','Alentir'],['dist','Distreure'],['dizzy','Marejar']].forEach(function(x){if(P[x[0]])l.push(x[1]+' '+P[x[0]]+'%')});
  if(P.thorns)l.push('Espines '+P.thorns+'%');if(P.regen)l.push('Cura '+P.regen+'% cada torn');if(P.haste)l.push('Habilitats més ràpides');if(P.meter)l.push('Barra d’equip més ràpida');
  if(P.coins)l.push('Monedes +'+P.coins+'%');Object.keys(P.el).forEach(function(e){l.push(ELS[e].n+' +'+P.el[e]+'%')});if(P.phoenix)l.push('Renaixement');
  P.spells.forEach(function(s){l.push(s.n+' (cada '+s.every+' torns)')});return l}
/* --- statuses on the enemy --- */
var FX_TAG={burn:'CREMAT!',poison:'ENVERINAT!',stun:'ATORDIT!',soak:'MULLAT!',weaken:'DEBILITAT!',slow:'LENT!',dist:'DISTRET!',dizzy:'MAREJAT!',crit:'CRÍTIC!'};
var FX_N={burn:'Cremat',poison:'Enverinat',stun:'Atordit',soak:'Mullat',weaken:'Debilitat',slow:'Lent',dist:'Distret',dizzy:'Marejat',crit:'Cop crític'};
function applyFx(b,k,pw){var s=b.st;pw=Math.max(2,Math.round(pw||4));
  if(k==='burn')s.burn={t:Math.max(s.burn?s.burn.t:0,3),n:Math.max(pw,s.burn?s.burn.n:0)};
  else if(k==='poison')s.poison={t:Math.max(s.poison?s.poison.t:0,4),n:Math.max(pw,s.poison?s.poison.n:0)};
  else if(k==='stun')s.stun=1;else if(k==='soak')s.soak=Math.max(s.soak||0,3);else if(k==='weaken')s.weak=Math.max(s.weak||0,3);
  else if(k==='slow')s.slow=Math.max(s.slow||0,3);else if(k==='dist')s.dist=Math.max(s.dist||0,3);else if(k==='dizzy')s.dizzy=Math.max(s.dizzy||0,2)}
function foeSkip(b,r,ev){var en=b.enemy,f=en.boss?0.6:1;
  if(b.st.slow>0&&Math.random()<0.4*f){ev.push({t:'skip',tag:'LENT!',txt:en.n+' va lent i no arriba a atacar.'});return true}
  if(b.st.dist>0&&Math.random()<0.35*f){ev.push({t:'skip',tag:'DISTRET!',txt:en.n+' està distret i falla l’atac.'});return true}
  if(b.st.dizzy>0&&Math.random()<0.35*f){var d=Math.max(1,Math.round(en.atk*0.8));en.hp=Math.max(1,en.hp-d);ev.push({t:'skip',tag:'MAREJAT!',n:d,after:en.hp,txt:en.n+' està marejat i es pega a si mateix: -'+d+'.'});return true}
  return false}
/* --- enemies grow stronger every turn: bosses 5% (×1,05 each turn), guardians 3%, the rest 2% --- */
function growRate(en){return en.boss?1.05:en.guardian?1.03:1.02}
function growF(b){return Math.pow(growRate(b.enemy),Math.max(0,(b.turn||0)-1))}
function procAdd(b,k){b._procs=b._procs||[];if(b._procs.indexOf(k)<0)b._procs.push(k)}
/* --- secret combos: specific critters together. Once found, they stay written in the critter's card --- */
var MEGA=[
  {id:'vapor',n:'Drac de vapor bullent',sp:['espurnet','petxina'],pow:2.4,fx:['soak','burn'],d:'Foc i aigua alhora: mal enorme, mullat i cremat.'},
  {id:'somnielec',n:'Somni elèctric',sp:['trona','somni'],pow:2.3,fx:['stun','dizzy'],d:'Un tro dins d’un somni: atordit i marejat.'},
  {id:'jardtro',n:'Jardí del tro',sp:['brotet','xispa'],pow:2.2,fx:['poison','slow'],d:'Lianes elèctriques: enverinat i lent.'},
  {id:'lluna',n:'Llum de lluna',sp:['guspira','mentoli'],pow:1.2,fx:['dist'],team:{heal:40},d:'Cura un 40% a tothom i distreu l’enemic.'},
  {id:'bolets',n:'Bosc encantat',sp:['molsa','ullet'],pow:2.2,fx:['poison','dizzy'],d:'Bolets que fan veure coses: enverinat i marejat.'},
  {id:'festa',n:'Festa de llumetes',sp:['cucafera','cuquet'],pow:2.2,fx:['slow','dist'],d:'Mil llumetes ballant: lent i distret.'},
  {id:'nit',n:'Ulls de la nit',sp:['mussolet','fantasmet'],pow:2.3,fx:['dist','dizzy'],d:'Un mussol i un fantasma: distret i marejat.'},
  {id:'trident',n:'Trident de les tempestes',sp:['petxina','trona','bufa'],pow:2.8,fx:['soak','stun'],team:{shield:3},d:'Mal enorme, mullat, atordit i 3 escuts per a l’equip.'},
  {id:'volca',n:'Volcà viu',sp:['espurnet','brasa','fumet'],pow:2.8,fx:['burn','weaken'],team:{buff:1},d:'Lava per tot arreu: cremat, debilitat i +30% de mal per a l’equip.'},
  {id:'selva',n:'Selva salvatge',sp:['brotet','pinyol','arrel'],pow:2.8,fx:['poison','slow','stun'],d:'La selva sencera ataca: enverinat, lent i atordit.'},
  {id:'ment',n:'Ment de cristall',sp:['ullet','somni','mentoli'],pow:2.6,fx:['dist','dizzy','weaken'],d:'Tres ments juntes: distret, marejat i debilitat.'},
  {id:'aurora',n:'Aurora boreal',sp:['xispa','guspira','gotim'],pow:2.2,fx:['stun'],team:{heal:50},d:'El cel s’encén: atordit i cura un 50% a tothom.'},
  {id:'quatre',n:'Els quatre vents',sp:['espurnet','gotim','brotet','xispa'],pow:3.2,fx:['burn','soak','poison','stun'],d:'Els quatre primers amics junts: cremat, mullat, enverinat i atordit.'},
  {id:'cor',n:'Cor del món',sp:['fumet','molsa','guspira','mentoli'],pow:1.6,fx:['weaken'],team:{heal:100,shield:3,revive:1},d:'Quatre curadors: cura tothom del tot, desperta qui està KO i 3 escuts.'},
  {id:'muralla',n:'Muralla eterna',sp:['brasa','bufa','arrel','somni'],pow:2,fx:['slow','weaken'],team:{shield:4,reflect:1},d:'Quatre tancs: 4 escuts, miralls i l’enemic lent i debilitat.'},
  {id:'exercit',n:'Exèrcit de la nit',sp:['dragonet','fantasmet','nuvolet','popet'],pow:3.4,fx:['burn','dizzy','dist'],d:'Quatre atacants de nit: cremat, marejat i distret.'}];
function megaReady(r,b){var al=alive(r);b.megaUsed=b.megaUsed||{};if(b.turn<3)return null;
  for(var i=0;i<MEGA.length;i++){var m=MEGA[i];if(b.megaUsed[m.id])continue;var parts=[],ok=true;
    m.sp.forEach(function(s){var c=al.filter(function(x){return x.sp===s})[0];if(!c){ok=false;return}var a=abilities(c).filter(function(x){return (b.ch[c.uid]||[])[x.i]===0})[0]||bestOff(c);parts.push({c:c,a:a})});
    if(ok)return {parts:parts,mega:m}}
  return null}
function elsOf(parts){var l=[];parts.forEach(function(p){var e=sp(p.c).el;if(l.indexOf(e)<0)l.push(e)});return l}
function elBonus(n){return 1+0.1*Math.max(0,n-1)}
function doMega(x,r,b){var m=x.mega;b.megaUsed[m.id]=1;
  x.parts.forEach(function(p){if(p.a.i>=0)b.ch[p.c.uid][p.a.i]=p.a.cd});
  var els=elsOf(x.parts),eb=elBonus(els.length),n=0;b._elb=eb;x.parts.forEach(function(p){n+=outDmg(p.c,m.pow*0.75,b,r).n});b._elb=1;
  b.enemy.hp=Math.max(0,b.enemy.hp-n);var pw=x.parts.reduce(function(a,p){return a+stats(p.c).atk},0)*0.3;
  (m.fx||[]).forEach(function(k){applyFx(b,k,pw)});var heals=[],T=m.team||{};
  if(T.shield)b.shield=Math.min(6,b.shield+T.shield);if(T.buff)b.tm.buff=3;if(T.reflect)alive(r).forEach(function(c){b.tm.reflect[c.uid]=2});
  if(T.heal)r.team.forEach(function(u){var c=byUid(u);if(!c)return;var mx=stats(c).hp,cur=r.hp[u];if(cur<=0&&!T.revive)return;var nh=Math.min(mx,cur<=0?Math.round(mx*0.5):cur+Math.round(mx*T.heal/100));if(nh>cur){heals.push({uid:u,n:nh-cur,after:nh,revived:cur<=0});r.hp[u]=nh}});
  G.megas=G.megas||{};var isNew=!G.megas[m.id];if(isNew)G.megas[m.id]=Date.now();
  return {t:'combo',mega:true,isNew:isNew,ids:x.parts.map(function(p){return p.c.uid}),els:els,elb:eb,nEl:els.length,name:m.n,n:n,after:b.enemy.hp,heals:heals,group:true,fx:m.fx||[],
    txt:'COMBO SECRET! '+x.parts.map(function(p){return cName(p.c)}).join(', ')+' fan '+m.n+': -'+n+'. '+m.d+(isNew?' Nou combo descobert: queda apuntat a la fitxa!':'')}}
/* --- battle start and each turn --- */
var V13_ADJ={boss:{atk:0.78,hp:0.85},guardian:{atk:0.85,hp:0.9},normal:{atk:0.92,hp:1}};
function battleTick3(){
  var r=run(),b=r.event;if(!b.P)b.P=powerOf(G.equip);var P=b.P;b._procs=[];b._vamp=0;b._thorn=0;
  if(P.haste)r.team.forEach(function(u){(b.ch[u]||[]).forEach(function(v,i){if(v>1&&Math.random()*100<P.haste)b.ch[u][i]=v-1})});
  if(P.meter)b.meter=(b.meter||0)+P.meter;
  var ev=battleTick2(),en=b.enemy;
  if(b.over==='lose'&&P.phoenix&&!b.phoenixUsed){ev=ev.filter(function(x){return x.t!=='teamDown'});b.over=null}
  if(b.over==='win')return ev;
  if(!b.over){
    P.spells.forEach(function(s){if(b.over||en.hp<=0||(b.turn%s.every)!==0)return;var al=alive(r);if(!al.length&&!s.revive)return;
      var src=al.length?al:r.team.map(byUid).filter(Boolean),atk=src.reduce(function(a,c){return a+stats(c).atk},0)/src.length;
      var d=Math.max(1,Math.round((atk*s.pow*(s.el?mult(s.el,en.el):1)-en.def*0.5)*(s.el&&P.el[s.el]?1+P.el[s.el]/100:1)));en.hp=Math.max(0,en.hp-d);
      (s.fx||[]).forEach(function(k){applyFx(b,k,atk*0.35)});if(s.shield)b.shield=Math.min(6,b.shield+s.shield);
      var heals=[];if(s.heal)r.team.forEach(function(u){var c=byUid(u);if(!c)return;var mx=stats(c).hp,cur=r.hp[u];if(cur<=0&&!s.revive)return;var nh=Math.min(mx,cur<=0?Math.round(mx*0.3):cur+Math.round(mx*s.heal/100));if(nh>cur){heals.push({uid:u,n:nh-cur,after:nh,revived:cur<=0});r.hp[u]=nh}});
      ev.push({t:'spell',el:s.el||'psiquic',name:s.n,n:d,after:en.hp,fx:s.fx||[],heals:heals,txt:'Encanteri dels objectes: '+s.n+'! -'+d+'.'+(heals.length?' L’equip es cura.':'')});
      foeCheck(r,b,ev)});
    if(b.over==='win')return ev;
    var hs=[];
    if(b._vamp>=1){var low=lowest(r);if(low){var mx=stats(low).hp,nh=Math.min(mx,r.hp[low.uid]+Math.round(b._vamp));if(nh>r.hp[low.uid]){hs.push({uid:low.uid,n:nh-r.hp[low.uid],after:nh});r.hp[low.uid]=nh}}}
    if(P.regen)alive(r).forEach(function(c){var mx=stats(c).hp,cur=r.hp[c.uid],nh=Math.min(mx,cur+Math.max(1,Math.round(mx*P.regen/100)));if(nh>cur){hs.push({uid:c.uid,n:nh-cur,after:nh});r.hp[c.uid]=nh}});
    var th=Math.round(b._thorn||0);if(th>=1&&en.hp>0)en.hp=Math.max(0,en.hp-th);else th=0;
    if(hs.length||th)ev.push({t:'drain',hits:hs,thorn:th,after:en.hp,txt:(hs.length?'Els objectes curen l’equip'+(b._vamp>=1?' (xucla vida)':'')+'.':'')+(th?' Les espines fan -'+th+' a '+en.n+'.':'')});
    if(th)foeCheck(r,b,ev);if(b.over==='win')return ev;
  }
  if(P.phoenix&&!b.phoenixUsed&&r.team.some(function(u){return byUid(u)&&r.hp[u]<=0})){b.phoenixUsed=true;var rv=[];
    r.team.forEach(function(u){var c=byUid(u);if(c&&r.hp[u]<=0){var nh=Math.round(stats(c).hp*0.5);r.hp[u]=nh;rv.push({uid:u,n:nh,after:nh,revived:true})}});
    if(b.over==='lose')b.over=null;ev.push({t:'revive',heals:rv,txt:'RENAIXEMENT! Les plomes del Fènix fan tornar '+rv.length+' bestioles amb la meitat de la vida.'})}
  if(b._procs.length)ev.push({t:'proc',tags:b._procs.slice(),txt:'Efectes dels objectes: '+b._procs.map(function(k){return FX_N[k]}).join(', ')+'.'});
  ['slow','dist','dizzy'].forEach(function(k){if(b.st[k]>0)b.st[k]--});
  return ev}
/* --- legend workshop --- */
function buyLegend(el){var miss=missingPieces(el);if(!miss.length){toast('Ja tens totes les peces de '+ELS[el].n+'.');return}
  if(!legendOpen()){toast('Primer has de forjar un objecte fins a Superèpica.');return}if(G.coins<LEGEND_COST){toast('Necessites '+LEGEND_COST+' monedes.');return}
  G.coins-=LEGEND_COST;var id=pickOne(miss);G.items.push(id);toast('Nova peça de llegenda: '+IT(id).n+'!')}
/* special powers of the gear that is equipped */
function powersBlock(){
  var P=powerOf(G.equip),pw=powerText(P);
  return '<div class="flat" style="gap:6px;background:#F3ECFF"><h2>Poders especials</h2>'+(pw.length?'<p class="small">'+esc(pw.join(' · '))+'</p>':'<p class="muted small">Encara cap. Els objectes forjats i els sets de llegenda en donen.</p>')+'</div>';
}
/* legend sets: what you have, what each set does, and the legend workshop. Short text; the details are behind the "?" */
function setsBlock(){
  var mine={},n=setCounts(G.equip),total=0;allMine().forEach(function(id){var b=ITEMS[baseOf(id)];if(b&&b.set){mine[b.set]=mine[b.set]||{};mine[b.set][b.slot]=1}});
  Object.keys(mine).forEach(function(k){total+=Object.keys(mine[k]).length});
  var list=SET_KEYS.filter(function(k){return mine[k]}).map(function(k){var S=SETS[k],on=n[k]||0;
    return '<div class="flat" style="background:var(--soft);gap:4px;outline:3px solid '+ELS[S.el].c+'"><div class="row between"><b>'+esc(S.n)+'</b><span class="tag" style="background:'+ELS[S.el].c+';color:#fff">'+on+' de 5 posades</span></div>'+
      '<span class="small">Peces: '+S.slots.map(function(sl){return (mine[k][sl]?'✓ ':'· ')+SLOT_N[sl]}).join(' · ')+'</span>'+
      S.b.map(function(x,i){var act=on>=i+2;return '<span class="small" style="'+(act?'font-weight:800;color:#1E7B3A':'opacity:.65')+'">'+(i===3?'5 peces · SUPER: ':(i+2)+' peces: ')+esc(x.d)+(act?' ✓':'')+'</span>'}).join('')+'</div>'}).join('');
  var shop=ORDER.filter(worldOpen).map(function(el){var m=missingPieces(el).length;
    return '<button type="button" class="btn sm" style="background:'+ELS[el].c+';color:#fff" data-act="legend" data-el="'+el+'"'+(m&&legendOpen()&&G.coins>=LEGEND_COST?'':' disabled')+'>'+esc(ELS[el].n)+(m?'':' (complet)')+'</button>'}).join(' ');
  var long='Hi ha 10 sets (2 de cada element) de 5 peces Superèpiques. Amb 2 peces del mateix set posades tens 1 habilitat, amb 3 en tens 2, amb 4 en tens 3, i amb les 5 la super habilitat. Els caps en deixen caure una molt poques vegades (5%). Al Taller de llegendes en pots comprar una per '+LEGEND_COST+' monedes, però només quan has forjat un objecte fins a Superèpica.';
  return '<div class="flat" style="gap:6px;background:#FFF6D6">'+qHead('Sets de llegenda','Peces Superèpiques que, juntes, donen habilitats. Molt difícils d’aconseguir. En tens '+total+' de 50.',long)+
    '<p class="small" style="margin-top:6px"><b>Taller de llegendes</b>'+(legendOpen()?' · '+LEGEND_COST+' monedes per peça':' · tancat fins que forgis una Superèpica')+'</p><div class="row" style="gap:6px;flex-wrap:wrap">'+shop+'</div></div>'+list;
}
function megaBlock(s){var mine=MEGA.filter(function(m){return m.sp.indexOf(s)>=0});if(!mine.length)return '';var found=G.megas||{},nf=mine.filter(function(m){return found[m.id]}).length;
  return '<h3>Combos secrets ('+nf+' de '+mine.length+')</h3><div class="flat" style="background:var(--soft);gap:8px">'+mine.map(function(m){
    if(found[m.id])return '<div style="display:flex;flex-direction:column;gap:2px"><b>'+esc(m.n)+'</b><div class="row" style="gap:4px">'+m.sp.map(function(x){return spArt(x,'',30,false)}).join('')+'</div><span class="small">'+esc(m.sp.map(function(x){return SPECIES[x].n}).join(' + '))+'</span><span class="small">'+esc(m.d)+'</span></div>';
    return '<div style="display:flex;flex-direction:column;gap:2px;opacity:.7"><b>??? Combo secret de '+m.sp.length+' bestioles</b><span class="small">Pista: posa-la a l’equip amb '+(m.sp.length-1)+' bestiola'+(m.sp.length>2?'es':'')+' de '+esc(m.sp.filter(function(x){return x!==s}).map(function(x){return ELS[SPECIES[x].el].n}).join(' i '))+'.</span></div>'}).join('')+'</div>'}
function megaCount(){var f=G.megas||{};return MEGA.filter(function(m){return f[m.id]}).length}
/* --- showing the new events: light for small things, a full comic page for "all together" and secret combos --- */
function v13Show(e){
  var cap=$('caption'),fa=$('foe-art'),r=run(),b=r&&r.event;
  function setCap(us){if(cap){cap.classList.toggle('us',us);cap.classList.toggle('them',!us);cap.textContent=e.txt}}
  if(e.t==='combo'&&(e.mega||e.all)){setCap(true);teamPage(e,function(){comboHit(e)});return true}
  if(e.t==='spell'){setCap(true);particles(fa,[e.el],6);setTimeout(function(){anim(fa,'shake');floatNum(fa,'-'+e.n,'dmg big');sfx(fa,SFX_EL[e.el]||'BUM!','r',0);
      (e.fx||[]).forEach(function(k){floatNum(fa,FX_TAG[k],'tagtxt')});healFx(e.heals);var rr=run();if(rr&&rr.event&&rr.event.enemy)setBar('foe-hp',e.after,rr.event.enemy.max);updateStatus()},RM?0:350);return true}
  if(e.t==='proc'){setCap(true);e.tags.forEach(function(k){floatNum(fa,FX_TAG[k],'tagtxt')});updateStatus();return true}
  if(e.t==='skip'){setCap(true);floatNum(fa,e.tag,'tagtxt');anim(fa,'shake');if(e.n){floatNum(fa,'-'+e.n,'dmg');if(b&&b.enemy)setBar('foe-hp',e.after,b.enemy.max)}updateStatus();return true}
  if(e.t==='drain'){setCap(true);healFx(e.hits);if(e.thorn){floatNum(fa,'-'+e.thorn,'dmg');floatNum(fa,'ESPINES!','tagtxt');if(b&&b.enemy)setBar('foe-hp',e.after,b.enemy.max)}return true}
  if(e.t==='revive'){setCap(true);healFx(e.heals);sfx($('squad'),'FÈNIX!','g',1);return true}
  return false}
function healFx(l){(l||[]).forEach(function(h){var m=$('m-'+h.uid);if(!m)return;if(h.revived)m.classList.remove('ko');anim(m,'healglow');floatNum(m,'+'+h.n,'heal');setBar('hp-'+h.uid,h.after,stats(byUid(h.uid)).hp)})}
function comboHit(e){var st=$('stage'),fa=$('foe-art'),rr=run();particles(fa,e.els,14);
  setTimeout(function(){anim(fa,'shake');anim(fa,'flash');anim(st,'flash');impact();floatNum(fa,'-'+e.n,'dmg big');sfx(fa,'KA-BOOOM!','r',1);
    (e.fx||[]).forEach(function(k){floatNum(fa,FX_TAG[k],'tagtxt')});healFx(e.heals);
    if(rr&&rr.event&&rr.event.enemy)setBar('foe-hp',e.after,rr.event.enemy.max);updateStatus()},RM?0:400)}
function teamPage(e,done){
  var r=run(),b=r&&r.event;if(!b||!b.enemy){done();return}var en=b.enemy,ids=e.ids||[],px=ids.length<=2?70:ids.length<=4?52:42;
  var stripes=e.els.map(function(x,i){return ELS[x].c+' '+(i*100/e.els.length)+'% '+((i+1)*100/e.els.length)+'%'}).join(',');
  var team=ids.map(function(u){var c=byUid(u);return c?'<span class="mfoe" style="display:inline-block">'+cArt(c,px)+'</span>':''}).join('');
  var title=e.mega?(e.isNew?'NOU COMBO SECRET!':'COMBO SECRET!'):'TOTS JUNTS!';
  var bonus=e.nEl>1?'+'+Math.round((e.elb-1)*100)+'%':'';
  comicPage([
    {wide:1,at:0,bg:'linear-gradient(100deg,'+stripes+')',html:'<div class="mbox">'+title+'</div><div class="mteam" style="margin-top:22px">'+team+'</div>'},
    {at:650,bg:'repeating-conic-gradient(from 0deg at 50% 50%,#111 0deg 5deg,'+ELS[e.els[0]].c+' 5deg 12deg)',html:'<div class="mname" style="font-size:28px">'+esc(e.name.toUpperCase())+'!</div>'},
    {at:1200,bg:'#fff',html:'<div class="row" style="gap:4px;z-index:2;position:relative">'+e.els.map(function(x){return elIcon(x,26,ELS[x].c)}).join('')+'</div>'+(bonus?'<div class="mname" style="font-size:40px">'+bonus+'</div><div class="mdesc">Bonus de '+e.nEl+' elements</div>':'<div class="mdesc">Tots a la vegada!</div>')},
    {wide:1,at:1800,bg:'#fff',html:'<svg class="mcrack" viewBox="0 0 300 120" preserveAspectRatio="none" aria-hidden="true"><path d="M150 60 L20 10 M150 60 L60 115 M150 60 L280 20 M150 60 L250 118 M150 60 L150 0 M150 60 L0 70 M150 60 L300 75" stroke="#111" stroke-width="4" fill="none"/></svg><div class="mscared" style="z-index:2">'+foeSvg(en,90)+'</div><span class="sfx r big" style="left:50%;top:20%;animation-delay:'+(RM?0:1900)+'ms">KA-BOOOOM!</span>'}
  ],RM?900:3300,done)}
/* --- old forged items get their powers too (save from before this version) --- */
function fkey(id){return baseOf(id)+'#'+tierOf(id)}
function fcount(id){var k=fkey(id);return G.items.filter(function(x){return fkey(x)===k}).length}
function forgeReady(){var seen={},l=[];G.items.forEach(function(id){var it=IT(id);if(!it||it.set||tierOf(id)>=4)return;var k=fkey(id);if(seen[k])return;seen[k]=1;if(fcount(id)>=4)l.push(id)});return l}
function forgeOnce(id,pw){var t=tierOf(id),it=IT(id);if(!it||it.set||t>=4||fcount(id)<4||G.coins<FORGE_COST[t])return false;var k=fkey(id),aff=affOf(id).slice();
  var i=G.items.indexOf(id);G.items.splice(i,1);for(var n=0;n<3;n++){for(var j=0;j<G.items.length;j++)if(fkey(G.items[j])===k){G.items.splice(j,1);break}}
  G.coins-=FORGE_COST[t];aff.push(pw&&AFFIX[pw]?pw:pickOne(AFF_KEYS));var nid=baseOf(id)+'#'+(t+1)+'~'+aff.join('.');G.items.push(nid);G.lastForge=nid;if(t+1>=4&&!G.superForged){G.superForged=1;setTimeout(function(){toast('Has forjat la teva primera Superèpica! El Taller de llegendes ja és obert.')},1600)}return true}
function forgeAll(){var n=0,guard=0,l;while(guard++<200&&(l=forgeReady()).length){if(!forgeOnce(l[0]))break;n++}return n}
(function(){if(!G||G.v13)return;function up(id){var t=tierOf(id);if(!t||affOf(id).length||!ITEMS[baseOf(id)]||ITEMS[baseOf(id)].set)return id;var a=[];for(var i=0;i<t;i++)a.push(pickOne(AFF_KEYS));return baseOf(id)+'#'+t+'~'+a.join('.')}
  G.items=G.items.map(up);Object.keys(G.equip).forEach(function(s){if(G.equip[s])G.equip[s]=up(G.equip[s])});G.megas=G.megas||{};G.v13=1;persist()})();

/* --- collection sort: normal order, by category (role) or by element --- */
function sortBar(){var m=G.sortB||'num';return '<div class="row" style="gap:6px;flex-wrap:wrap;margin:6px 0"><span class="small">Ordena per:</span>'+[['num','Número'],['role','Categoria'],['el','Element']].map(function(x){return '<button type="button" class="btn sm'+(m===x[0]?' green':'')+'" data-act="sortB" data-k="'+x[0]+'" aria-pressed="'+(m===x[0])+'">'+x[1]+'</button>'}).join('')+'</div>'}
function spGrid(tileOf){var m=G.sortB||'num';
  if(m==='role')return ['Atac','Defensa','Curador'].map(function(r){var l=SP_ORDER.filter(function(s){return SPECIES[s].role===r});return l.length?'<h3 style="margin:10px 0 4px">'+roleTag(r)+' '+l.filter(ownsSp).length+' de '+l.length+'</h3><div class="grid4">'+l.map(tileOf).join('')+'</div>':''}).join('');
  if(m==='el')return ORDER.map(function(e){var l=SP_ORDER.filter(function(s){return SPECIES[s].el===e});return l.length?'<h3 style="margin:10px 0 4px;color:'+ELS[e].c+'">'+esc(ELS[e].n)+' · '+l.filter(ownsSp).length+' de '+l.length+'</h3><div class="grid4">'+l.map(tileOf).join('')+'</div>':''}).join('');
  return '<div class="grid4">'+SP_ORDER.map(tileOf).join('')+'</div>'}
/* --- collection: how close each critter is to evolving (5 dots = can evolve) --- */
function evoDots(c,S){if(!c)return '';var col=ELS[S.el].c;
  if(c.stage>=2)return '<span class="small" style="display:block;font-weight:800;color:'+col+'" aria-label="Forma final">Forma final ✓</span>';
  var n=Math.min(5,c.mill||0),d='';for(var i=0;i<5;i++)d+='<span style="display:inline-block;width:8px;height:8px;margin:0 1.5px;border-radius:50%;border:1.5px solid '+col+';background:'+(i<n?col:'transparent')+'"></span>';
  return '<span style="display:block;line-height:1;margin-top:3px" aria-label="'+n+' de 5 per evolucionar a la forma '+(c.stage+2)+'">'+d+'<span class="small" style="margin-left:4px;font-weight:800">'+n+'/5</span></span>'}

