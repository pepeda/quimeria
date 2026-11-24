'use strict';
/* ================= ZONES, ABILITIES, COMBOS, SYNERGIES ================= */
function mult(a,d){if(!a||!d)return 1;if(a===d)return 0.75;if(BEATS[a].indexOf(d)>=0)return 1.5;if(BEATS[d].indexOf(a)>=0)return 0.67;return 1}
function maxTeam(){return 3+(G.completed>=2?1:0)+(G.completed>=5?1:0)+(G.completed>=9?1:0)}
function nextTeamAt(){return G.completed<2?2:G.completed<5?5:G.completed<9?9:0}
var ZONES={
  foc:['Camp de cendres','Rius de lava','Cor del volcà'],
  aigua:['Platja dels corals','Llacuna boirosa','Fossa profunda'],
  planta:['Bosc del brot','Pantà de les arrels','Cor de l’arbre gegant'],
  llamp:['Prats elèctrics','Muntanyes de tempesta','Ciutat dels núvols'],
  psiquic:['Jardí dels somnis','Laberint de miralls','Palau de la ment']};
var ZONE_ROUTES=[
  ['gen','fork','gen','spring','land','gen','sig','gen','mini','guardian'],
  ['gen','fork','gen','land','gen','spring','mini','gen','fork2','sig','gen','land','gen','guardian'],
  ['gen','fork','gen','land','gen','spring','gen','mini','fork2','gen','land','sig','gen','cave','spring','gen','land','guardian']];
var ZONE_BONUS=[40,70,110];
var ZONE_INFO=['Una cruïla, una font, llocs especials, un campament de monstres i un guardià.','Més llocs, dues cruïlles, un campament i un guardià més fort.','Una cova profunda, molts llocs i el guardià més fort.'];
function zoneL(w,z){return TIER[w]+z*0.8}
function zoneOpen(w,z){return z===0||!!G.done[w+':z'+(z-1)]}
if(!G.zonesV){Object.keys(G.done).forEach(function(k){if(/:curt$/.test(k))G.done[k.replace(':curt',':z0')]=true;if(/:llarg$/.test(k))G.done[k.replace(':llarg',':z1')]=true});G.runs={};G.active=null;if(G.screen==='run')G.screen='explorar';G.zonesV=1}
NODE_ICON.mini='!';NODE_ICON.cave='∩';

/* abilities: [name, charge turns, kind, power] */
var ABIL={
  espurnet:[['Bola de foc',3,'burn',1.5],['Pluja d’espurnes',5,'multi',0.8],['Explosió solar',8,'hit',2.6]],
  fumet:[['Escalfor amiga',3,'heal',1.6],['Fum calent',5,'weaken',0.7],['Foc de la llar',8,'healAll',0.45]],
  brasa:[['Mur de brases',4,'shield',1],['Cop de roca',5,'stun',1.0],['Pell de lava',6,'reflect',1]],
  gotim:[['Pluja que cura',3,'heal',1.6],['Rosada',5,'regen',0.07],['Font de vida',8,'healAll',0.5]],
  bufa:[['Bombolla gegant',4,'shield',1],['Onada',5,'soak',1.0],['Closca dura',7,'reflect',1]],
  petxina:[['Raig d’aigua',3,'soak',1.3],['Remolí',5,'multi',0.8],['Tsunami',8,'hit',2.5]],
  brotet:[['Fuetada de liana',3,'hit',1.6],['Espores',5,'poison',1.0],['Bosc salvatge',8,'multi',1.0]],
  molsa:[['Pols de flors',3,'heal',1.6],['Saba dolça',5,'regen',0.07],['Primavera',8,'healAll',0.5]],
  pinyol:[['Pluja de pinyols',3,'multi',0.7],['Arrel que estreny',5,'stun',1.1],['Pinya explosiva',7,'hit',2.4]],
  arrel:[['Arrels protectores',4,'shield',1],['Abraçada d’heura',5,'poison',0.8],['Espines',6,'reflect',1]],
  xispa:[['Paret elèctrica',4,'shield',1],['Descàrrega',5,'stun',1.0],['Camp magnètic',7,'reflect',1]],
  trona:[['Tro de mil volts',3,'hit',1.6],['Llamp en cadena',5,'multi',0.85],['Tempesta final',8,'stun',2.2]],
  guspira:[['Llum que cura',3,'heal',1.6],['Energia',5,'buff',1],['Aurora',8,'healAll',0.45]],
  mentoli:[['Somni tranquil',3,'heal',1.6],['Calma',5,'weaken',0.7],['Despertar',8,'healAll',0.5]],
  somni:[['Escut de la ment',4,'shield',1],['Hipnosi',5,'stun',0.8],['Mirall',7,'reflect',1]],
  ullet:[['Mirada hipnòtica',3,'weaken',1.3],['Raig mental',5,'hit',1.9],['Tempesta de pensaments',8,'multi',1.0]]
};
var KIND_DESC={hit:'Un cop molt fort.',multi:'3 cops seguits.',burn:'Cop i cremada: l’enemic perd vida 3 torns.',poison:'Cop i verí: l’enemic perd vida 4 torns.',stun:'Cop i l’enemic queda atordit: perd el seu torn.',
  soak:'Cop i l’enemic queda mullat: té menys defensa i els llamps li fan molt més mal.',weaken:'Cop i l’enemic queda debilitat: fa menys mal 3 torns.',
  shield:'Escut per a tot l’equip: els 3 cops següents fan la meitat de mal.',reflect:'Mirall: 2 torns tornant a l’enemic la meitat del mal que rep.',
  heal:'Cura molt la bestiola més ferida.',regen:'Tot l’equip es cura una mica cada torn, 3 torns.',healAll:'Cura tothom i desperta les que estan KO.',buff:'Tot l’equip fa +30% de mal, 3 torns.'};
var OFFENSIVE=['hit','multi','burn','poison','stun','soak','weaken'];
function abilities(c){var l=ABIL[c.sp]||[],n=c.stage>=1?3:2,p=1+0.25*c.stage;
  return l.slice(0,n).map(function(a,i){return {i:i,n:a[0],cd:a[1],kind:a[2],pow:a[3]*(a[2]==='shield'||a[2]==='reflect'||a[2]==='buff'?1:p)}})}
function comboKey(a,b){return [a,b].sort().join('+')}
var COMBOS={'aigua+llamp':['Tempesta elèctrica','stun',1.4],'foc+planta':['Incendi del bosc','burn',1.4],'aigua+foc':['Núvol de vapor','weaken',1.3],
  'llamp+psiquic':['Llamp mental','stun',1.3],'planta+psiquic':['Jardí dels somnis','poison',1.3],'aigua+planta':['Pluja de llavors','poison',1.3],
  'foc+llamp':['Plasma','hit',1.6],'foc+psiquic':['Foc fantasma','burn',1.3],'aigua+psiquic':['Boira màgica','weaken',1.3],'llamp+planta':['Arrels elèctriques','stun',1.3]};
var SYN=[
  {k:'germans',n:'Germans',d:'2 o més del mateix element: fan +15% de mal.'},
  {k:'protector',n:'Protector i metge',d:'Un tanc i un curador: les cures curen +30%.'},
  {k:'complet',n:'Equip complet',d:'Un de cada rol: +10% de defensa per a tothom.'},
  {k:'tempesta',n:'Tempesta',d:'Aigua i Llamp: els llamps fan +60% als enemics mullats.'},
  {k:'incendi',n:'Incendi',d:'Foc i Planta: les cremades duren 2 torns més.'},
  {k:'natura',n:'Ment i natura',d:'Psíquic i Planta: tothom es cura un 3% cada torn.'}];
function synergies(list){
  list=list.filter(Boolean);var els={},roles={},on={};
  list.forEach(function(c){els[sp(c).el]=(els[sp(c).el]||0)+1;roles[sp(c).role]=1});
  on.germans=Object.keys(els).some(function(k){return els[k]>=2});on.protector=!!(roles.Defensa&&roles.Curador);on.complet=!!(roles.Atac&&roles.Defensa&&roles.Curador);
  on.tempesta=!!(els.aigua&&els.llamp);on.incendi=!!(els.foc&&els.planta);on.natura=!!(els.psiquic&&els.planta);return on;
}
function synChips(on){var l=SYN.filter(function(s){return on[s.k]});return l.length?l.map(function(s){return '<span class="syn" title="'+esc(s.d)+'">'+esc(s.n)+'</span>'}).join(' '):''}

