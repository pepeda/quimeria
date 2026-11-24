
(function(){
'use strict';
var S_KEY='bestioles-joc-v1', F_KEY='bestioles-comentaris-v1';
var storageOk=true;
function load(k){try{var v=localStorage.getItem(k);return v?JSON.parse(v):null}catch(e){storageOk=false;return null}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){storageOk=false}}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function rnd(n){return Math.floor(Math.random()*n)}
function pickOne(a){return a[rnd(a.length)]}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=rnd(i+1),t=a[i];a[i]=a[j];a[j]=t}return a}
var RM=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ================= DATA ================= */
var ELS={
  foc:{n:'Foc',mon:'Món del Foc',c:'#F26B3A',soft:'#FFE3D6',belly:'#FFD3B8',sky:['#FFB38A','#FFE9DC'],hill:'#E89A72',ground:'#C97B4A',w:{riu:'un riu de lava',arbres:'arbres de carbó'}},
  aigua:{n:'Aigua',mon:'Món de l’Aigua',c:'#2E8BE6',soft:'#DDEEFF',belly:'#CFE6FF',sky:['#8FD0FF','#E3F3FF'],hill:'#7DB8E8',ground:'#F3DDA6',w:{riu:'un riu blau i ràpid',arbres:'palmeres'}},
  planta:{n:'Planta',mon:'Món de la Planta',c:'#3DAA5C',soft:'#DDF3E2',belly:'#D3F2D9',sky:['#A8E6B0','#EAF8EC'],hill:'#6FC07F',ground:'#5BA84E',w:{riu:'un rierol verd',arbres:'arbres molt alts'}},
  llamp:{n:'Llamp',mon:'Món del Llamp',c:'#F2B90F',soft:'#FFF4CC',belly:'#FFF0B3',sky:['#FFE27A','#FFF8DC'],hill:'#D9B44A',ground:'#B89B55',w:{riu:'un riu de núvols',arbres:'pals que espurnegen'}},
  psiquic:{n:'Psíquic',mon:'Món Psíquic',c:'#9B59E0',soft:'#EFE2FF',belly:'#EBD9FF',sky:['#C9A6F2','#F3EAFF'],hill:'#A988D6',ground:'#8E7BB5',w:{riu:'un riu de boira lila',arbres:'arbres de cristall'}}
};
var ORDER=['foc','llamp','aigua','planta','psiquic'];
var TIER={foc:1,aigua:1.2,planta:1.5,llamp:2,psiquic:3};
var BEATS={aigua:['foc','llamp'],foc:['planta','psiquic'],planta:['aigua','llamp'],llamp:['foc','psiquic'],psiquic:['aigua','planta']};
var ROLE={Atac:{hp:32,atk:12,def:5,heal:0},Defensa:{hp:46,atk:7,def:11,heal:0},Curador:{hp:34,atk:6,def:7,heal:9}};
var ROLE_AB={Atac:'Atac fort',Defensa:'Escut',Curador:'Cura tothom'};
var SPECIAL={espurnet:'Bola de foc',fumet:'Escalfor amiga',brasa:'Mur de brases',gotim:'Pluja que cura',bufa:'Bombolla gegant',petxina:'Raig d’aigua',
  brotet:'Fuetada de liana',molsa:'Pols de flors',pinyol:'Pluja de pinyols',arrel:'Arrels protectores',xispa:'Paret elèctrica',trona:'Tro de mil volts',
  guspira:'Llum que cura',mentoli:'Somni tranquil',somni:'Escut de la ment',ullet:'Mirada hipnòtica'};
var SPECIAL_DO={Atac:'fa molt de mal',Defensa:'posa un escut a tot l’equip',Curador:'cura tot l’equip i desperta les KO'};
var ROLE_DESC={Atac:'Fa molt de mal, però té poca vida i poca defensa.',Defensa:'El tanc: es posa davant i rep els cops. Té molta vida i defensa, però poc atac. Quan l’enemic prepara un cop fort o un atac a tothom, posa un escut a tot l’equip.',Curador:'Cada torn cura la bestiola més ferida. El seu atac especial cura tothom i desperta les que estan KO.'};
var ROLE_PATH={Atac:'M19 4 L9 14 M7 12 L12 17 M8 16 L4 20',Defensa:'M12 3 L20 6 V12 C20 17 16 20 12 21 C8 20 4 17 4 12 V6 Z',Curador:'M12 20 C5 15 3 12 3 9 A4 4 0 0 1 12 7 A4 4 0 0 1 21 9 C21 12 19 15 12 20 Z M12 10 V15 M9.5 12.5 H14.5'};
var ROLE_LABEL={Atac:'Atac',Defensa:'Defensa (tanc)',Curador:'Curador'};
function roleTag(role,short){return '<span class="role '+role+'"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+ROLE_PATH[role]+'"/></svg>'+(short?role:ROLE_LABEL[role])+'</span>'}
function roleCounts(list){var n={Atac:0,Defensa:0,Curador:0};list.forEach(function(c){if(c)n[sp(c).role]++});return n}
function itemScore(k){var it=IT(k);return it.atk*3+it.def*3+it.hp*2+(it.set?25:0)+(it.aff?it.aff.length*4:0)}
function bestEquipSet(){
  var pool=G.items.slice();Object.keys(G.equip).forEach(function(s){if(G.equip[s])pool.push(G.equip[s])});
  var bySlot={};pool.forEach(function(k){if(!IT(k))return;var sl=IT(k).slot;(bySlot[sl]=bySlot[sl]||[]).push(k)});
  Object.keys(bySlot).forEach(function(sl){bySlot[sl].sort(function(a,b){return itemScore(b)-itemScore(a)})});
  var eq={};SLOTS.forEach(function(x){var key=x[0].indexOf('anell')===0?'anell':x[0],l=bySlot[key];if(l&&l.length)eq[x[0]]=l.shift()});
  var rest=[];Object.keys(bySlot).forEach(function(sl){rest=rest.concat(bySlot[sl])});
  return {equip:eq,items:rest};
}
function specName(c){return SPECIAL[c.sp]+(c.stage?' '+'★'.repeat(c.stage):'')}
function E(n,el2){return {n:n,el2:el2||''}}
var SPECIES={
  espurnet:{n:'Espurnet',el:'foc',role:'Atac',price:300,evos:[E('Flamarada'),E('Caliu'),E('Vapor','aigua')]},
  fumet:{n:'Fumet',el:'foc',role:'Curador',price:320,evos:[E('Fogueró'),E('Cendra','psiquic'),E('Brasot')]},
  brasa:{n:'Brasa',el:'foc',role:'Defensa',price:400,evos:[E('Volcà'),E('Magma','planta'),E('Tió')]},
  gotim:{n:'Gotim',el:'aigua',role:'Curador',price:320,evos:[E('Rierol'),E('Onada'),E('Boira','psiquic')]},
  bufa:{n:'Bufa',el:'aigua',role:'Defensa',price:380,evos:[E('Closcot'),E('Tempesta','llamp'),E('Perlina')]},
  petxina:{n:'Petxina',el:'aigua',role:'Atac',price:350,evos:[E('Corall'),E('Nacre','psiquic'),E('Escull')]},
  brotet:{n:'Brotet',el:'planta',role:'Atac',price:300,evos:[E('Arbrot'),E('Floreta'),E('Rierol verd','aigua')]},
  molsa:{n:'Molsa',el:'planta',role:'Curador',price:320,evos:[E('Falguera'),E('Bolet','psiquic'),E('Liquen')]},
  pinyol:{n:'Pinyol',el:'planta',role:'Atac',price:300,evos:[E('Pinya'),E('Cactus','foc'),E('Gla')]},
  arrel:{n:'Arrel',el:'planta',role:'Defensa',price:450,evos:[E('Soca'),E('Alzina'),E('Arrel elèctrica','llamp')]},
  xispa:{n:'Xispa',el:'llamp',role:'Defensa',price:380,evos:[E('Llampec'),E('Tro'),E('Aurora','psiquic')]},
  trona:{n:'Trona',el:'llamp',role:'Atac',price:400,evos:[E('Tronada'),E('Calamarsa','aigua'),E('Centella')]},
  guspira:{n:'Guspira',el:'llamp',role:'Curador',price:380,evos:[E('Estel'),E('Fanal','foc'),E('Lluerna')]},
  mentoli:{n:'Mentoli',el:'psiquic',role:'Curador',price:420,evos:[E('Somiatruites'),E('Endeví'),E('Lotus','planta')]},
  somni:{n:'Somni',el:'psiquic',role:'Defensa',price:450,evos:[E('Malson'),E('Lluna'),E('Miratge','foc')]},
  ullet:{n:'Ullet',el:'psiquic',role:'Atac',price:420,evos:[E('Ullal'),E('Vident','aigua'),E('Cristall')]}
};
var SP_ORDER=['espurnet','fumet','brasa','gotim','bufa','petxina','brotet','molsa','pinyol','arrel','xispa','trona','guspira','mentoli','somni','ullet'];
var MONSTERS={foc:'Salamandra de lava',aigua:'Cranc gegant',planta:'Planta carnívora',llamp:'Núvol rabiós',psiquic:'Ombra que parla'};
var FOOD={foc:'Baia picant',aigua:'Alga dolça',planta:'Fulla tendra',llamp:'Fruita elèctrica',psiquic:'Bolet somiador'};
var SLOTS=[['casc','Casc'],['espasa','Arma'],['escut','Escut'],['collaret','Collaret'],['anell1','Anell 1'],['anell2','Anell 2'],['capa','Capa'],['botes','Botes']];
var ITEMS={
  cascPetxina:{n:'Casc de petxina',slot:'casc',def:2,atk:0,hp:0,rar:'Comú'},
  cascCristall:{n:'Casc de cristall',slot:'casc',def:4,atk:0,hp:2,rar:'Rar'},
  espasaFusta:{n:'Espasa de fusta',slot:'espasa',atk:2,def:0,hp:0,rar:'Comú'},
  espasaLlamp:{n:'Espasa de llamp',slot:'espasa',atk:4,def:0,hp:0,rar:'Rar'},
  escutCloska:{n:'Escut de closca',slot:'escut',def:3,atk:0,hp:0,rar:'Comú'},
  collaretPetxina:{n:'Collaret de petxina',slot:'collaret',hp:5,atk:0,def:0,rar:'Comú'},
  anellFoc:{n:'Anell de foc',slot:'anell',atk:1,def:0,hp:2,rar:'Comú'},
  anellMolsa:{n:'Anell de molsa',slot:'anell',hp:4,atk:0,def:1,rar:'Comú'},
  capaFulles:{n:'Capa de fulles',slot:'capa',def:1,hp:3,atk:0,rar:'Comú'},
  botesNuvol:{n:'Botes de núvol',slot:'botes',hp:3,def:1,atk:0,rar:'Comú'},
  ullCristall:{n:'Ull de cristall',slot:'collaret',atk:3,def:3,hp:4,rar:'Tresor rar',relic:true},
  coronaArrels:{n:'Corona d’arrels',slot:'casc',atk:2,def:4,hp:4,rar:'Tresor rar',relic:true},
  anellEstel:{n:'Anell d’estel',slot:'anell',atk:3,def:2,hp:2,rar:'Tresor rar',relic:true},
  capaEstrellada:{n:'Capa estrellada',slot:'capa',atk:1,def:3,hp:5,rar:'Tresor rar',relic:true}
};
var COMMON=['cascPetxina','espasaFusta','escutCloska','collaretPetxina','anellFoc','anellMolsa','capaFulles','botesNuvol','cascCristall','espasaLlamp'];
var RELICS=['ullCristall','coronaArrels','anellEstel','capaEstrellada'];
var BUILD=[
  {k:'habitacio',n:'Habitació',what:'+2 places',price:250,max:3,cap:2},
  {k:'jardi',n:'Jardí',what:'+3 places',price:400,max:1,cap:3},
  {k:'piscina',n:'Piscina',what:'+2 places',price:500,max:1,cap:2},
  {k:'spa',n:'Spa',what:'A casa descansen el doble',price:700,max:1,cap:0},
  {k:'tennis',n:'Pista de tennis',what:'Una bestiola de casa guanya 1 estrella de força a cada expedició',price:350,max:1,cap:0},
  {k:'mobles',n:'Mobles',what:'Decoració',price:80,max:5,cap:0}
];

/* --- SCENES: each scene is a small place with choices. out = what happens. --- */
var SCENES={
  sender:{n:'Sender pel bosc',art:'trail',pool:'gen',nodes:{a:{t:'Un sender entre {arbres}. Se sent un cruixit entre les branques.',ch:[
    {l:'Segueix el sender',d:'Tranquil. Potser trobes alguna cosa.',risk:0,out:{rand:[[0.5,{coins:8}],[0.5,{food:1}]]}},
    {l:'Mira què fa soroll',d:'Pot ser una bestiola o un monstre.',risk:1,out:{rand:[[0.6,{wild:1}],[0.4,{fight:1}]]}},
    {l:'Obre una drecera amb plantes',d:'Una bestiola de Planta fa créixer un pas secret.',risk:0,req:{el:'planta'},out:{loot:'common'}}]}}},
  clariana:{n:'Clariana',art:'meadow',pool:'gen',nodes:{a:{t:'Una clariana amb herba alta. Alguna cosa s’hi amaga i et mira.',ch:[
    {l:'Acosta’t a poc a poc',d:'Una bestiola salvatge.',risk:0,out:{wild:1}},
    {l:'Recull fruita',d:'Menjar per a les bestioles.',risk:0,out:{food:1}},
    {l:'Crida-la ben fort',d:'Potser surt una bestiola rara… o un monstre.',risk:2,out:{rand:[[0.5,{wild:1,rare:1}],[0.5,{fight:1,L:0.5}]]}}]}}},
  monstre:{n:'Camí tallat',art:'rocks',pool:'gen',nodes:{a:{t:'Un monstre dorm al mig del camí.',ch:[
    {l:'Lluita',d:'Si guanyes, monedes.',risk:1,out:{fight:1,win:{coins:20}}},
    {l:'Passa de puntetes',d:'Potser no es desperta.',risk:1,out:{rand:[[0.6,{note:'Has passat sense despertar-lo!'}],[0.4,{fight:1}]]}},
    {l:'Un Defensa el vigila mentre passeu',d:'Passeu segur.',risk:0,req:{role:'Defensa'},out:{note:'La teva bestiola de Defensa us protegeix i passeu sense problemes.'}}]}}},
  llac:{n:'Llac',art:'lake',pool:'gen',nodes:{a:{t:'Un llac tranquil amb una illa al mig.',ch:[
    {l:'Pesca',d:'Menjar segur.',risk:0,out:{food:2}},
    {l:'Neda fins a l’illa',d:'Hi ha coses rares… i perill.',risk:2,out:{rand:[[0.5,{wild:1,rare:1}],[0.5,{fight:1,L:0.5,win:{loot:'common'}}]]}},
    {l:'Una bestiola d’Aigua et porta a l’illa',d:'Sense perill.',risk:0,req:{el:'aigua'},out:{wild:1,rare:1}}]}}},
  ruines:{n:'Ruïnes antigues',art:'ruins',pool:'gen',nodes:{a:{t:'Pedres velles amb dibuixos estranys.',ch:[
    {l:'Remena les pedres',d:'Objecte o monstre.',risk:1,out:{rand:[[0.5,{loot:'common'}],[0.5,{fight:1}]]}},
    {l:'Llegeix els dibuixos',d:'Una bestiola Psíquica els entén.',risk:0,req:{el:'psiquic'},out:{rand:[[0.5,{loot:'relic'}],[0.5,{coins:30}]]}},
    {l:'Passa de llarg',d:'',risk:0,out:{note:'Continues el camí.'}}]}}},
  poble:{n:'Poblet',art:'village',pool:'gen',nodes:{a:{t:'Un poblet petit. La gent saluda les teves bestioles.',ch:[
    {l:'Ajuda el forner',d:'Et regala menjar.',risk:0,out:{food:2}},
    {l:'Botiga: compra un objecte',d:'Costa 40 monedes de les que tens.',risk:0,out:{shop:40}},
    {l:'Descansa a la plaça',d:'L’equip recupera vida.',risk:0,out:{heal:50}}]}}},
  tenda:{n:'Tenda abandonada',art:'tent',pool:'fork',nodes:{a:{t:'Una tenda abandonada. La porta es mou amb el vent.',ch:[
    {l:'Mira dins la tenda',d:'Objectes, menjar o monedes.',risk:0,out:{rand:[[0.4,{loot:'common'}],[0.35,{food:2}],[0.25,{coins:15}]]}},
    {l:'Desperta qui dorm a dins',d:'Una bestiola… o no.',risk:1,out:{rand:[[0.7,{wild:1}],[0.3,{fight:1}]]}}]}}},
  cova:{n:'Entrada d’una cova',art:'cave',pool:'fork',nodes:{a:{t:'La boca d’una cova fosca. Et sembla sentir un soroll a dins.',ch:[
    {l:'Entra a la cova',d:'3 passos a dins: bestioles rares, tresors i monstres.',risk:2,out:{cave:1}},
    {l:'Escolta des de fora',d:'Sense entrar.',risk:0,out:{rand:[[0.5,{coins:6}],[0.5,{wild:1}]]}}]}}},
  pont:{n:'Pont penjant',art:'bridge',pool:'land',nodes:{
    a:{t:'Un pont de cordes sobre {riu}. Grinyola.',ch:[
      {l:'Creua a poc a poc',d:'Segur.',risk:0,out:{coins:10}},
      {l:'Busca sota el pont',d:'Alguna cosa s’hi mou.',risk:2,out:{fight:1,L:0.5,win:{go:'b'}}},
      {l:'Fes créixer una liana',d:'Una bestiola de Planta us fa un pont nou.',risk:0,req:{el:'planta'},out:{coins:25}}]},
    b:{t:'Sota el pont hi havia un niu amagat!',secret:1,ch:[{l:'Mira-t’ho',d:'Una bestiola rara.',risk:0,out:{wild:1,rare:1}}]}}},
  castell:{n:'Castell vell',art:'castle',pool:'land',nodes:{
    a:{t:'Un castell vell amb la porta tancada. Hi ha llum a dalt de tot.',ch:[
      {l:'Truca a la porta',d:'Algu obrirà… i potser no és amable.',risk:1,out:{fight:1,win:{go:'sala'}}},
      {l:'Il·lumina les finestres',d:'Una bestiola de Llamp obre la porta.',risk:0,req:{el:'llamp'},out:{go:'sala'}},
      {l:'Un Defensa empeny la porta',d:'Entreu sense lluitar.',risk:0,req:{role:'Defensa'},out:{go:'sala'}},
      {l:'Fes la volta',d:'No entres.',risk:0,out:{coins:5}}]},
    sala:{t:'Una sala amb un cofre i una escala que puja a la torre.',secret:1,ch:[
      {l:'Obre el cofre',d:'Pot estar buit, ple o tenir sorpresa.',risk:1,out:{rand:[[0.6,{loot:'common'}],[0.4,{fight:1}]]}},
      {l:'Puja a la torre',d:'Un guardià hi vigila un tresor rar.',risk:2,out:{fight:1,L:1,n:'Guardià de la torre',win:{loot:'relic'}}}]}}},
  volca:{n:'Volcà',art:'volcano',pool:'sig',world:'foc',nodes:{a:{t:'Un volcà fumeja. A dalt hi brilla alguna cosa.',ch:[
    {l:'Puja al volcà',d:'Hi viu una salamandra gegant.',risk:2,out:{fight:1,L:1,n:'Salamandra gegant',win:{loot:'relic'}}},
    {l:'Refreda la lava',d:'Una bestiola d’Aigua obre camí.',risk:0,req:{el:'aigua'},out:{coins:30}},
    {l:'Recull pedres calentes',d:'Les pots vendre.',risk:0,out:{coins:12}}]}}},
  vaixell:{n:'Vaixell enfonsat',art:'ship',pool:'sig',world:'aigua',nodes:{a:{t:'Un vaixell vell enfonsat a la platja.',ch:[
    {l:'Busca a la coberta',d:'Objecte o monstre.',risk:1,out:{rand:[[0.5,{loot:'common'}],[0.5,{fight:1}]]}},
    {l:'Busseja fins a la bodega',d:'Una bestiola d’Aigua t’hi porta.',risk:0,req:{el:'aigua'},out:{rand:[[0.5,{loot:'relic'}],[0.5,{coins:30}]]}},
    {l:'Recull petxines',d:'Menjar.',risk:0,out:{food:2}}]}}},
  arbre:{n:'Arbre gegant',art:'bigtree',pool:'sig',world:'planta',nodes:{a:{t:'Un arbre tan alt que no se’n veu la punta.',ch:[
    {l:'Puja a l’arbre',d:'Bestiola rara o monstre.',risk:1,out:{rand:[[0.5,{wild:1,rare:1}],[0.5,{fight:1}]]}},
    {l:'Parla amb l’arbre',d:'Una bestiola de Planta l’entén. Us cura del tot.',risk:0,req:{el:'planta'},out:{heal:100}},
    {l:'Recull fruita',d:'Menjar.',risk:0,out:{food:2}}]}}},
  torre:{n:'Torre dels llamps',art:'tower',pool:'sig',world:'llamp',nodes:{a:{t:'Una torre que rep llamps sense parar.',ch:[
    {l:'Entra a la torre',d:'Un núvol gegant la vigila.',risk:2,out:{fight:1,L:1,n:'Núvol gegant',win:{loot:'relic'}}},
    {l:'Carrega la torre',d:'Una bestiola de Llamp la fa funcionar.',risk:0,req:{el:'llamp'},out:{coins:30}},
    {l:'Amaga’t de la tempesta',d:'L’equip descansa.',risk:0,out:{heal:30}}]}}},
  biblio:{n:'Biblioteca flotant',art:'library',pool:'sig',world:'psiquic',nodes:{a:{t:'Llibres que suren en l’aire i xiuxiuegen.',ch:[
    {l:'Llegeix un llibre',d:'Monedes… o una ombra.',risk:1,out:{rand:[[0.5,{coins:25}],[0.5,{fight:1,n:'Ombra que parla'}]]}},
    {l:'Fes volar els llibres',d:'Una bestiola Psíquica troba el tresor.',risk:0,req:{el:'psiquic'},out:{loot:'relic'}},
    {l:'Surt sense fer soroll',d:'',risk:0,out:{note:'Surts de puntetes.'}}]}}},
  font:{n:'Font d’aigua clara',art:'spring',pool:'spring',nodes:{a:{t:'Una font d’aigua clara. Un bon lloc per descansar.',ch:[
    {l:'Descanseu',d:'Recupereu la meitat de la vida que us falta.',risk:0,out:{heal:50}},
    {l:'Omple l’ampolla i segueix',d:'Menjar per a les bestioles.',risk:0,out:{food:1}}]}}},
  'cova-tunels':{n:'Dos túnels',art:'tunnels',pool:'cave',nodes:{a:{t:'Dos túnels. Del de l’esquerra en surt humitat; el de la dreta brilla.',ch:[
    {l:'Túnel humit',d:'Una cua s’hi amaga.',risk:1,out:{wild:1,rare:1}},
    {l:'Túnel brillant',d:'Un guardià vigila un tresor rar.',risk:2,out:{fight:1,L:1,n:'Guardià de la cova',win:{loot:'relic'}}},
    {l:'Surt de la cova',d:'Tornes al camí.',risk:0,out:{exitCave:1}}]}}},
  'cova-cristalls':{n:'Sala de cristalls',art:'crystals',pool:'cave2',nodes:{a:{t:'Una sala plena de cristalls que fan llum.',ch:[
    {l:'Arrenca un cristall',d:'Monedes o un monstre.',risk:1,out:{rand:[[0.6,{coins:20}],[0.4,{fight:1,L:0.5}]]}},
    {l:'Mira el teu reflex',d:'Una bestiola Psíquica hi veu un secret.',risk:0,req:{el:'psiquic'},out:{loot:'relic'}},
    {l:'Continua',d:'',risk:0,out:{note:'Continues cova endins.'}}]}}},
  'cova-ratpenats':{n:'Niu de ratpenats',art:'bats',pool:'cave2',nodes:{a:{t:'Un niu de ratpenats penja del sostre.',ch:[
    {l:'Passa corrents',d:'Potser es desperten.',risk:1,out:{rand:[[0.5,{note:'No s’han despertat!'}],[0.5,{fight:1,n:'Eixam de ratpenats'}]]}},
    {l:'Un Defensa protegeix el grup',d:'Passeu segurs.',risk:0,req:{role:'Defensa'},out:{note:'Passeu sense problemes.'}},
    {l:'Fes llum amb foc',d:'Una bestiola de Foc els espanta.',risk:0,req:{el:'foc'},out:{coins:15}}]}}},
  'cova-cofre':{n:'Cofre antic',art:'chest',pool:'cave3',nodes:{a:{t:'Al fons de la cova hi ha un cofre antic.',ch:[
    {l:'Obre el cofre',d:'Monedes segures.',risk:0,out:{coins:35}},
    {l:'Busca al voltant',d:'Un tresor rar… o un monstre.',risk:1,out:{rand:[[0.5,{loot:'relic'}],[0.5,{fight:1,L:0.5}]]}}]}}}
};
var ROUTE_SHORT=['gen','fork','gen','spring','land','gen','sig','guardian'];
var ROUTE_LONG=['gen','fork','gen','land','spring','gen','fork2','sig','gen','land','gen','guardian'];

/* ================= DRAWING ================= */
function monster(el,px,guardian){
  var A=ELS[el]||ELS.foc,crest={
    foc:'<path d="M18 22 C16 12 24 10 23 2 C30 8 32 12 31 16 C34 10 40 10 40 4 C47 12 46 20 42 24 Z" fill="#FFB238"/>',
    aigua:'<path d="M14 26 L10 10 L22 20 Z M50 26 L54 10 L42 20 Z" fill="#7CC0FF"/>',
    planta:'<path d="M20 22 Q14 6 28 12 Z M44 22 Q50 6 36 12 Z" fill="#7BD389"/>',
    llamp:'<path d="M12 28 L6 8 L16 16 L18 4 L26 24 Z M52 28 L58 8 L48 16 L46 4 L38 24 Z" fill="#E09A00"/>',
    psiquic:'<circle cx="32" cy="14" r="8" fill="#F0C3FF" stroke="#6B2FB3" stroke-width="2"/><circle cx="32" cy="14" r="3.5" fill="#6B2FB3"/>'}[el]||'';
  var crown=guardian?'<path d="M18 10 L22 0 L28 8 L32 -2 L36 8 L42 0 L46 10 Z" fill="#FFD54A" stroke="#C98A00" stroke-width="1.5"/>':'';
  return '<svg class="cr" width="'+px+'" height="'+px+'" viewBox="0 -4 64 68" aria-hidden="true">'+crest+crown+'<path d="M8 54 L12 26 Q32 10 52 26 L56 54 Q32 64 8 54 Z" fill="'+A.c+'" stroke="#2A1F3D" stroke-width="2"/><path d="M14 54 Q32 62 50 54 L48 46 Q32 52 16 46 Z" fill="#3A3150" opacity=".35"/><circle cx="24" cy="36" r="6" fill="#fff"/><circle cx="40" cy="36" r="6" fill="#fff"/><circle cx="25" cy="37" r="3" fill="#C0392B"/><circle cx="41" cy="37" r="3" fill="#C0392B"/><path d="M22 46 L26 43 L30 46 L34 43 L38 46 L42 43" stroke="#fff" stroke-width="2.5" fill="none" stroke-linejoin="round"/></svg>';
}
function elIcon(el,px,color){
  var c=color||'#fff',d={foc:'<path d="M12 2 C14 6 18 8 18 13 A6 6 0 0 1 6 13 C6 10 8 8 9 6 C10 8 11 9 12 9 C12 6 11 4 12 2 Z" fill="'+c+'"/>',aigua:'<path d="M12 2 C15 7 19 10 19 14 A7 7 0 0 1 5 14 C5 10 9 7 12 2 Z" fill="'+c+'"/>',planta:'<path d="M5 19 C5 9 11 4 20 4 C20 13 15 19 5 19 Z" fill="'+c+'"/>',llamp:'<path d="M13 2 L4 14 H11 L10 22 L20 9 H13 Z" fill="'+c+'"/>',psiquic:'<path d="M2 12 C5 7 8 5 12 5 C16 5 19 7 22 12 C19 17 16 19 12 19 C8 19 5 17 2 12 Z" fill="'+c+'"/><circle cx="12" cy="12" r="3.5" fill="#6B2FB3"/>'};
  return '<svg width="'+px+'" height="'+px+'" viewBox="0 0 24 24" aria-hidden="true">'+(d[el]||'')+'</svg>';
}
var COIN='<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.5" fill="#F7C948" stroke="#C98A00" stroke-width="1.5"/><circle cx="10" cy="10" r="4" fill="none" stroke="#C98A00" stroke-width="1.5"/></svg>';
function hero(px){return '<svg width="'+px+'" height="'+Math.round(px*1.2)+'" viewBox="0 0 50 60" aria-hidden="true"><circle cx="25" cy="17" r="11" fill="#F4C6A0"/><path d="M13 15 Q25 -2 37 15 Z" fill="#6B3E26"/><rect x="13" y="29" width="24" height="22" rx="8" fill="'+heroCol()+'"/><circle cx="21" cy="18" r="2" fill="#1E1B2E"/><circle cx="29" cy="18" r="2" fill="#1E1B2E"/><rect x="15" y="50" width="7" height="8" rx="2" fill="#6B3E26"/><rect x="28" y="50" width="7" height="8" rx="2" fill="#6B3E26"/></svg>'}
var NAV_ICONS={casa:'M3 11 L12 4 L21 11 V20 H15 V14 H9 V20 H3 Z',explorar:'M3 6 L9 4 L15 6 L21 4 V18 L15 20 L9 18 L3 20 Z M9 4 V18 M15 6 V20',bestioles:'M8 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z M16 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z M5 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z M19 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z M12 20c-3 0-5-1.5-5-3.5S9.5 12 12 12s5 2.5 5 4.5-2 3.5-5 3.5Z',motxilla:'M7 8 H17 A2 2 0 0 1 19 10 V20 H5 V10 A2 2 0 0 1 7 8 Z M9 8 V6 A3 3 0 0 1 15 6 V8 M9 14 H15'};
var NODE_ICON={gen:'·',fork:'Y',fork2:'Y',land:'⌂',spring:'≈',sig:'★',guardian:'♛'};

function sceneArt(art,w){
  var A=ELS[w]||ELS.planta,dark=['tunnels','crystals','bats','chest'].indexOf(art)>=0;
  var g='g'+w+art;
  var sky=dark?'<rect width="360" height="160" fill="#1B1830"/><circle cx="180" cy="120" r="140" fill="#2E2650"/>':
    '<defs><linearGradient id="'+g+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+A.sky[0]+'"/><stop offset="1" stop-color="'+A.sky[1]+'"/></linearGradient></defs><rect width="360" height="160" fill="url(#'+g+')"/>'+
    '<path d="M0 110 Q60 70 130 100 T260 92 T360 100 V160 H0 Z" fill="'+A.hill+'" opacity=".7"/><rect y="128" width="360" height="32" fill="'+A.ground+'"/>';
  var p='';
  switch(art){
    case 'trail':p='<path d="M150 160 Q180 130 175 100 Q170 80 200 60" stroke="#F5D9A0" stroke-width="22" fill="none" stroke-linecap="round"/>'+[[40,96],[90,88],[270,92],[320,86],[240,70]].map(function(t){return '<rect x="'+(t[0]-4)+'" y="'+t[1]+'" width="8" height="34" fill="#6B3E26"/><circle cx="'+t[0]+'" cy="'+(t[1]-8)+'" r="22" fill="#2E7D45"/>'}).join('');break;
    case 'meadow':p=Array.apply(null,Array(26)).map(function(_,i){var x=10+i*14;return '<path d="M'+x+' 140 Q'+(x+4)+' 112 '+(x+8)+' 102" stroke="#2E7D45" stroke-width="4" fill="none"/>'}).join('')+'<circle cx="250" cy="112" r="5" fill="#fff"/><circle cx="262" cy="112" r="5" fill="#fff"/><circle cx="251" cy="113" r="2.5" fill="#1E1B2E"/><circle cx="263" cy="113" r="2.5" fill="#1E1B2E"/>';break;
    case 'rocks':p='<ellipse cx="90" cy="126" rx="40" ry="22" fill="#8E8AA0"/><ellipse cx="300" cy="124" rx="44" ry="26" fill="#8E8AA0"/><path d="M180 132 Q215 86 250 132 Z" fill="'+A.c+'" stroke="#2A1F3D" stroke-width="2"/><path d="M200 116 Q205 112 210 116 M222 116 Q227 112 232 116" stroke="#2A1F3D" stroke-width="2.5" fill="none"/><text x="255" y="96" font-size="18" font-weight="800" fill="#2A1F3D">z z</text>';break;
    case 'lake':p='<ellipse cx="200" cy="132" rx="170" ry="26" fill="#2E8BE6"/><ellipse cx="230" cy="124" rx="40" ry="10" fill="'+A.ground+'"/><rect x="226" y="96" width="6" height="28" fill="#6B3E26"/><circle cx="229" cy="92" r="14" fill="#2E7D45"/><path d="M60 136 q10 -6 20 0 M120 142 q10 -6 20 0" stroke="#fff" stroke-width="3" fill="none"/>';break;
    case 'ruins':p='<rect x="70" y="70" width="22" height="62" fill="#B8B2C8"/><rect x="66" y="64" width="30" height="8" fill="#9D97AF"/><rect x="130" y="92" width="22" height="40" fill="#B8B2C8"/><rect x="200" y="76" width="22" height="56" fill="#B8B2C8"/><rect x="196" y="70" width="70" height="8" fill="#9D97AF"/><rect x="250" y="100" width="22" height="32" fill="#B8B2C8"/><path d="M140 110 l6 -8 l6 8 z" fill="#6B2FB3"/>';break;
    case 'village':p=[[60,90,'#E2574C'],[150,80,'#4A3FB5'],[250,92,'#F26B3A']].map(function(h){return '<rect x="'+h[0]+'" y="'+h[1]+'" width="56" height="'+(132-h[1])+'" fill="#FFF4E0" stroke="#8A5A3C" stroke-width="2"/><path d="M'+(h[0]-6)+' '+h[1]+' L'+(h[0]+28)+' '+(h[1]-26)+' L'+(h[0]+62)+' '+h[1]+' Z" fill="'+h[2]+'"/><rect x="'+(h[0]+22)+'" y="'+(h[1]+22)+'" width="12" height="'+(110-h[1])+'" fill="#8A5A3C"/>'}).join('');break;
    case 'tent':p='<path d="M110 132 L170 52 L230 132 Z" fill="#E2574C" stroke="#A23A31" stroke-width="3" stroke-linejoin="round"/><path d="M170 52 L170 132 M156 132 L170 92 L184 132" stroke="#A23A31" stroke-width="3" fill="#7A2A22"/><path d="M228 132 L260 120" stroke="#6B3E26" stroke-width="3"/>';break;
    case 'cave':p='<path d="M60 134 Q90 40 180 36 Q270 40 300 134 Z" fill="#6E6A82"/><path d="M135 134 Q140 76 180 74 Q220 76 225 134 Z" fill="#14111F"/><path d="M236 62 q8 -4 6 -12 M250 76 q10 -2 10 -12" stroke="#1E1B2E" stroke-width="3" fill="none"/>';break;
    case 'bridge':p='<rect y="112" width="360" height="22" fill="'+(w==='foc'?'#FF7A2E':w==='psiquic'?'#C9A6F2':'#2E8BE6')+'"/><path d="M40 104 Q180 140 320 104" stroke="#8A5A3C" stroke-width="5" fill="none"/>'+Array.apply(null,Array(14)).map(function(_,i){var x=50+i*19,y=104+Math.sin(i/13*Math.PI)*28;return '<rect x="'+x+'" y="'+y+'" width="14" height="6" fill="#B5793E"/>'}).join('')+'<path d="M40 84 Q180 116 320 84" stroke="#6B3E26" stroke-width="3" fill="none"/><rect x="34" y="78" width="8" height="56" fill="#6B3E26"/><rect x="318" y="78" width="8" height="56" fill="#6B3E26"/>';break;
    case 'castle':p='<rect x="110" y="56" width="140" height="76" fill="#B8B2C8"/><rect x="90" y="36" width="40" height="96" fill="#A39DB5"/><rect x="230" y="36" width="40" height="96" fill="#A39DB5"/>'+[90,102,114,230,242,254].map(function(x){return '<rect x="'+x+'" y="28" width="8" height="10" fill="#A39DB5"/>'}).join('')+'<path d="M162 132 V100 Q180 84 198 100 V132 Z" fill="#4A3348"/><rect x="246" y="8" width="3" height="30" fill="#4A3348"/><path d="M249 8 L270 14 L249 20 Z" fill="'+A.c+'"/><rect x="104" y="60" width="10" height="14" fill="#FFE08A"/>';break;
    case 'volcano':p='<path d="M60 134 L160 40 L200 40 L300 134 Z" fill="#6B4A3C"/><path d="M160 40 Q180 28 200 40 L190 60 Q180 54 170 60 Z" fill="#FF7A2E"/><path d="M175 30 q-6 -12 4 -22 M188 28 q8 -12 0 -22" stroke="#8E8AA0" stroke-width="4" fill="none" opacity=".7"/><path d="M172 60 Q168 90 150 120" stroke="#FF7A2E" stroke-width="6" fill="none"/>';break;
    case 'ship':p='<ellipse cx="180" cy="136" rx="180" ry="14" fill="#2E8BE6"/><path d="M90 104 L270 92 L250 132 L110 136 Z" fill="#8A5A3C" transform="rotate(-6 180 114)"/><rect x="170" y="40" width="6" height="64" fill="#6B3E26" transform="rotate(-10 173 72)"/><path d="M176 44 L224 70 L180 86 Z" fill="#FFF4E0" transform="rotate(-10 173 72)"/>';break;
    case 'bigtree':p='<rect x="160" y="40" width="40" height="94" fill="#6B3E26"/><circle cx="180" cy="34" r="56" fill="#2E7D45"/><circle cx="130" cy="54" r="32" fill="#3DAA5C"/><circle cx="232" cy="54" r="32" fill="#3DAA5C"/><path d="M176 96 q4 -6 8 0" stroke="#1E1B2E" stroke-width="2.5" fill="none"/><circle cx="172" cy="86" r="3" fill="#1E1B2E"/><circle cx="188" cy="86" r="3" fill="#1E1B2E"/>';break;
    case 'tower':p='<rect x="155" y="30" width="50" height="104" fill="#6E6A82"/><path d="M148 30 L180 6 L212 30 Z" fill="#4A4660"/><rect x="172" y="104" width="16" height="30" fill="#2A1F3D"/><path d="M230 0 L214 36 H226 L212 70 L246 26 H232 Z" fill="#FFE27A" stroke="#E09A00" stroke-width="2"/><rect x="172" y="50" width="16" height="16" fill="#FFE27A"/>';break;
    case 'library':p=[[90,60,-14,'#E2574C'],[150,40,8,'#4A3FB5'],[220,66,-6,'#3DAA5C'],[280,44,14,'#F2B90F']].map(function(b){return '<g transform="rotate('+b[2]+' '+(b[0]+15)+' '+(b[1]+20)+')"><rect x="'+b[0]+'" y="'+b[1]+'" width="30" height="40" rx="3" fill="'+b[3]+'"/><rect x="'+(b[0]+4)+'" y="'+(b[1]+4)+'" width="22" height="32" fill="#FFF4E0"/></g>'}).join('')+'<path d="M80 132 L80 110 L280 110 L280 132" stroke="#6B2FB3" stroke-width="4" fill="none"/>';break;
    case 'spring':p='<ellipse cx="180" cy="128" rx="70" ry="14" fill="#9D97AF"/><ellipse cx="180" cy="124" rx="56" ry="9" fill="#7CC0FF"/><rect x="172" y="76" width="16" height="48" fill="#B8B2C8"/><path d="M180 76 Q160 60 150 90 M180 76 Q200 60 210 90" stroke="#7CC0FF" stroke-width="5" fill="none"/>';break;
    case 'tunnels':p='<path d="M40 150 Q50 60 110 60 Q170 60 170 150 Z" fill="#0B0914"/><path d="M190 150 Q190 60 250 60 Q310 60 320 150 Z" fill="#0B0914"/><path d="M80 90 q4 8 0 12 M96 80 q4 8 0 12" stroke="#7CC0FF" stroke-width="4" fill="none"/><path d="M240 110 L250 80 L260 110 Z" fill="#C084FC"/><path d="M262 116 L274 74 L286 116 Z" fill="#C084FC"/>';break;
    case 'crystals':p=[[60,150,30],[110,150,50],[170,150,70],[230,150,44],[290,150,58]].map(function(c){return '<path d="M'+(c[0]-14)+' '+c[1]+' L'+c[0]+' '+(c[1]-c[2]*1.4)+' L'+(c[0]+14)+' '+c[1]+' Z" fill="#C084FC" opacity=".9"/>'}).join('')+'<circle cx="180" cy="90" r="70" fill="#C084FC" opacity=".15"/>';break;
    case 'bats':p=[[90,40],[150,60],[210,36],[270,58],[180,24]].map(function(b){return '<path d="M'+b[0]+' '+b[1]+' q-14 -10 -26 4 q10 -2 14 6 q6 -8 12 -2 q6 -6 12 2 q4 -8 14 -6 q-12 -14 -26 -4 Z" fill="#0B0914"/><circle cx="'+(b[0]-4)+'" cy="'+(b[1]+2)+'" r="1.5" fill="#FF5A4E"/><circle cx="'+(b[0]+4)+'" cy="'+(b[1]+2)+'" r="1.5" fill="#FF5A4E"/>'}).join('');break;
    case 'chest':p='<rect x="140" y="96" width="80" height="46" rx="4" fill="#8A5A3C" stroke="#F7C948" stroke-width="3"/><path d="M140 100 Q180 70 220 100 Z" fill="#B5793E" stroke="#F7C948" stroke-width="3"/><rect x="174" y="104" width="12" height="14" fill="#F7C948"/><circle cx="180" cy="110" r="70" fill="#F7C948" opacity=".12"/>';break;
    case 'river':p='<rect y="110" width="360" height="26" fill="#2E8BE6"/><path d="M20 122 q10 -6 20 0 M120 128 q10 -6 20 0 M240 120 q10 -6 20 0" stroke="#fff" stroke-width="3" fill="none"/>'+[[80,118],[150,124],[220,116],[290,124]].map(function(q){return '<ellipse cx="'+q[0]+'" cy="'+q[1]+'" rx="13" ry="6" fill="#9D97AF"/>'}).join('');break;
    case 'waterfall':p='<rect x="110" y="8" width="140" height="124" fill="#8E8AA0"/><rect x="158" y="8" width="44" height="124" fill="#7CC0FF"/><ellipse cx="180" cy="134" rx="90" ry="12" fill="#2E8BE6"/><path d="M168 26 V122 M180 16 V126 M192 30 V120" stroke="#fff" stroke-width="3" opacity=".7"/>';break;
    case 'balloon':p='<ellipse cx="200" cy="54" rx="40" ry="46" fill="#E2574C"/><path d="M180 14 Q200 54 180 96 M220 14 Q200 54 220 96" stroke="#F7C948" stroke-width="5" fill="none"/><path d="M176 96 L188 120 M224 96 L212 120" stroke="#6B3E26" stroke-width="2"/><rect x="186" y="118" width="28" height="18" rx="3" fill="#B5793E"/>';break;
    case 'guardian':p='<ellipse cx="180" cy="134" rx="150" ry="16" fill="#3A3150" opacity=".5"/><rect x="40" y="40" width="10" height="94" fill="#6E6A82"/><rect x="310" y="40" width="10" height="94" fill="#6E6A82"/><circle cx="45" cy="34" r="8" fill="#FFB238"/><circle cx="315" cy="34" r="8" fill="#FFB238"/>';break;
  }
  return '<svg width="100%" viewBox="0 0 360 160" aria-hidden="true" style="display:block">'+sky+p+'</svg>';
}

/* ================= STATE ================= */
function mk(sp){return {uid:'c'+Date.now().toString(36)+Math.random().toString(36).slice(2,7),sp:sp,stage:0,evo:-1,mill:0,fat:0,rest:0}}
function newGame(){
  return {v:2,coins:150,built:{},owned:[mk('brotet'),mk('gotim'),mk('espurnet'),mk('xispa')],food:{planta:1,aigua:1},items:[],equip:{},runs:{},active:null,done:{},completed:0,psiquic:false,
    screen:'explorar',world:null,path:null,pick:[],detail:null,summary:null,seen:{},tips:{},restClock:Date.now(),started:new Date().toISOString()};
}
function migrate(g){
  if(!g)return newGame();
  if(g.v===2)return g;
  if(g.v===1){var n=newGame();['coins','built','owned','food','items','equip','done','completed','psiquic'].forEach(function(k){if(g[k]!==undefined)n[k]=g[k]});
    if(n.equip&&n.equip.anell){n.equip.anell1=n.equip.anell;delete n.equip.anell}return n}
  return newGame();
}
var G=(function(){var raw=null,g=null;try{raw=localStorage.getItem(S_KEY)}catch(e){storageOk=false}
  try{g=raw?JSON.parse(raw):null}catch(e){g=null}
  if(raw&&(!g||typeof g!=='object'||(g.v!==1&&g.v!==2))){try{localStorage.setItem(S_KEY+'.bak-'+Date.now(),raw)}catch(e){}g=null}
  g=migrate(g);var d=newGame();Object.keys(d).forEach(function(k){if(g[k]===undefined||g[k]===null)g[k]=d[k]});
  if(!Array.isArray(g.owned))g.owned=[];g.owned=g.owned.filter(function(c){return c&&SPECIES[c.sp]});if(!g.owned.length)g.owned=d.owned;
  if(!Array.isArray(g.items))g.items=[];['equip','built','food','runs','done','seen','tips'].forEach(function(k){if(typeof g[k]!=='object'||Array.isArray(g[k]))g[k]={}});
  return g})();
G.seen=G.seen||{};G.tips=G.tips||{};G.restClock=G.restClock||Date.now();
if(!G.evoTree){G.owned.forEach(function(c){if(c.stage===1&&c.evo>0)c.stage=2});G.evoTree=1}
function persist(){save(S_KEY,G)}

function sp(c){return SPECIES[c.sp]}
function byUid(u){for(var i=0;i<G.owned.length;i++)if(G.owned[i].uid===u)return G.owned[i];return null}
function cName(c){return c.stage?sp(c).evos[c.evo].n:sp(c).n}
function cEl2(c){return c.stage?(sp(c).evos[c.evo].el2||''):''}
function lvl(c){return c.stage+1}
function maxFat(c){return [0,3,5,8][lvl(c)]}
function cap(){var n=6;BUILD.forEach(function(b){n+=(G.built[b.k]||0)*b.cap});return n}
function bonusPct(eq){var b={atk:0,def:0,hp:0};Object.keys(eq).forEach(function(s){var it=IT(eq[s]);if(it){b.atk+=it.atk*3;b.def+=it.def*3;b.hp+=it.hp*2}});var P=powerOf(eq);return {atk:Math.round(b.atk+P.atk),def:Math.round(b.def+P.def),hp:Math.round(b.hp+P.hp)}}
function stats(c,eq){var b=ROLE[sp(c).role],k=(1+0.08*c.mill)*[1,1.35,1.75][c.stage],q=bonusPct(eq||G.equip);
  return {hp:Math.round(b.hp*k*(1+q.hp/100)),atk:Math.round(b.atk*k*(1+q.atk/100)),def:Math.round(b.def*k*(1+q.def/100)),heal:Math.round(b.heal*k)}}
function busyWorld(c){for(var w in G.runs)if(G.runs[w].team.indexOf(c.uid)>=0)return w;return null}
function run(){return G.active?G.runs[G.active]:null}
function effMult(c,d){var a=sp(c).el,b=cEl2(c);return b?0.7*mult(a,d)+0.3*mult(b,d):mult(a,d)}
function dmg(atk,m,def){return Math.max(1,Math.round(atk*m-def*0.5))}
function worldOpen(w){return w!=='psiquic'||G.psiquic}
function ownsSp(s){return G.owned.some(function(c){return c.sp===s})}
function speciesOf(w){return SP_ORDER.filter(function(s){return SPECIES[s].el===w})}
function formsOwned(){var f={};G.owned.forEach(function(c){if(c.stage)f[c.sp+':'+c.evo]=1});return Object.keys(f).length}
function starsN(L){return Math.max(1,Math.min(5,Math.round(L)))}
function starStr(n){var s='';for(var i=0;i<5;i++)s+=i<n?'★':'☆';return '<span class="stars" aria-label="Dificultat '+n+' de 5">'+s+'</span>'}
function pathL(w,path){return TIER[w]+(path==='llarg'?1:0)}
function worldScenes(w){return Object.keys(SCENES).filter(function(id){var s=SCENES[id];return (s.pool==='gen'||s.pool==='land'||s.pool==='fork'||(s.pool==='sig'&&s.world===w))})}
/* real-time rest: 1 point every 10 minutes at home (2 with the spa) */
function applyRestClock(){
  var now=Date.now();if(!(G.restClock<=now))G.restClock=now;var steps=Math.floor((now-G.restClock)/600000);
  if(steps<=0)return;G.restClock+=steps*600000;
  var per=(G.built.spa?2:1)*Math.min(steps,20);
  G.owned.forEach(function(c){if(busyWorld(c))return;if(c.rest>0){c.rest=Math.max(0,c.rest-per);if(!c.rest)c.fat=0}else c.fat=Math.max(0,c.fat-per)});
}
function available(c){return !busyWorld(c)&&c.rest===0}
var toastTimer=null;
function toast(m){var s=document.getElementById('toastSlot');s.innerHTML='<div class="toast" role="status">'+esc(m)+'</div>';clearTimeout(toastTimer);toastTimer=setTimeout(function(){s.innerHTML=''},2800)}

/* ================= ROUTE & SCENES ================= */
function pickScene(pool,w,used){
  var c=Object.keys(SCENES).filter(function(id){var s=SCENES[id];return s.pool===pool&&(!s.world||s.world===w)&&used.indexOf(id)<0});
  if(!c.length)c=Object.keys(SCENES).filter(function(id){return SCENES[id].pool===pool&&(!SCENES[id].world||SCENES[id].world===w)});
  var id=pickOne(c);used.push(id);return id;
}
/* ================= BATTLE ================= */

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
/* ================= RENDER ================= */
function bar(pct,color,id){return '<div class="bar"'+(id?' id="'+id+'"':'')+'><i class="ghost" style="width:'+Math.max(0,Math.min(100,pct))+'%"></i><i style="width:'+Math.max(0,Math.min(100,pct))+'%;background:'+color+'"></i></div>'}
function hpColor(p){return p>60?'#3DAA5C':p>30?'#F2A20F':'#E0483B'}
function fatigueText(c){
  var w=busyWorld(c);if(w)return 'D’aventura a '+ELS[w].mon;
  if(c.rest>0)return 'Cansada: ha de descansar '+c.rest+' expedici'+(c.rest>1?'ons':'ó')+' (o una estona)';
  var left=maxFat(c)-c.fat;return 'Pot fer '+left+' expedici'+(left>1?'ons':'ó')+' més';
}
function tip(key,text){if(G.tips[key])return '';return '<div class="tip"><p>'+text+'</p><button type="button" class="btn sm" data-act="tip" data-k="'+key+'">Entesos</button></div>'}
function riskHtml(n){var s='<span class="risk" aria-label="Risc '+n+' de 2">';for(var i=0;i<2;i++)s+='<i class="'+(i<n?'on':'')+'"></i>';return s+' '+(n===0?'Segur':n===1?'Una mica arriscat':'Arriscat')+'</span>'}
function topBar(){
  var r=G.screen==='run'&&run();
  return (r?'<span class="pill">'+esc(ELS[r.world].mon)+'</span><span class="pill">'+COIN+'+'+r.coins+'</span>':'<span class="pill">'+COIN+G.coins+'</span><span class="pill">Places '+G.owned.length+'/'+cap()+'</span>')+
    '<button type="button" class="btn sm light mob" style="margin-left:auto;min-height:40px" data-act="chat">Comentaris ('+(F.items.length)+')</button>';
}
function render(){
  applyRestClock();
  $('top').innerHTML=topBar();
  var s=G.screen,h='';
  if(s==='casa')h=scCasa();else if(s==='explorar')h=scExplorar();else if(s==='mon')h=scMon();else if(s==='equip')h=scEquip();
  else if(s==='run')h=scRun();else if(s==='resum')h=scResum();else if(s==='bestioles')h=scBestioles();else if(s==='motxilla')h=scMotxilla();
  if(!storageOk)h='<p class="tip">Aquest navegador no deixa guardar la partida: si tanques la pàgina, es perd.</p>'+h;
  $('screen').innerHTML=h;
  var navOn=s!=='run';$('nav').hidden=!navOn;
  if(navOn){
    var cur=s==='mon'||s==='equip'||s==='resum'?'explorar':s;
    $('nav').innerHTML=['casa','explorar','bestioles','motxilla'].map(function(k){var lbl={casa:'Casa',explorar:'Explorar',bestioles:'Bestioles',motxilla:'Motxilla'}[k];
      var hint=k==='explorar'&&G.completed===0&&cur!=='explorar';
      return '<button type="button" class="navb'+(cur===k?' on':'')+(hint?' hint':'')+'" data-act="nav" data-to="'+k+'"'+(cur===k?' aria-current="page"':'')+'><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="'+NAV_ICONS[k]+'"/></svg>'+lbl+'</button>'}).join('');
  }
  var oldSheet=document.querySelector('#overlay .sheet'),keep=oldSheet&&oldSheet.dataset.s===G.detail?oldSheet.scrollTop:0;
  $('overlay').innerHTML=G.detail?detailSheet():'';
  var newSheet=document.querySelector('#overlay .sheet');if(newSheet&&keep)newSheet.scrollTop=keep;
  $('fbCtx').textContent='S’apuntarà on ets: '+contextText();
  var r=run();
  if(s==='run'&&r&&r.event&&r.event.type==='battle'&&!r.event.over){updateAbilities();$('shield').classList.toggle('on',r.event.shield>0);$('warn').classList.toggle('on',!!r.event.warn);scheduleTick()}else stopBattle();
  persist();
}

function scCasa(){
  var b=G.built,home=G.owned.filter(function(c){return !busyWorld(c)}),none=G.owned.filter(available).length===0&&!Object.keys(G.runs).length;
  var svg=houseSvg(b,home);
  var list=home.map(function(c){var left=c.rest>0?0:Math.round((maxFat(c)-c.fat)*100/maxFat(c));return '<div class="row" style="gap:10px">'+cArt(c,40)+'<div style="flex:1;min-width:0"><b>'+esc(cName(c))+'</b> '+roleTag(sp(c).role,true)+' <span class="muted small">niv. '+lvl(c)+'</span>'+bar(left,hpColor(left))+'<div class="muted small">'+esc(fatigueText(c))+'</div></div></div>'}).join('');
  var builds=BUILD.map(function(x){var n=G.built[x.k]||0,full=n>=x.max,poor=G.coins<x.price;
    return '<button type="button" class="tap" data-act="build" data-k="'+x.k+'"'+(full||poor?' disabled':'')+' style="min-height:110px"><span style="font-size:14px">'+esc(x.n)+(x.max>1&&n?' ('+n+')':'')+'</span><span class="muted small" style="text-align:center;font-weight:700">'+esc(x.what)+'</span><span class="tag mid">'+(full?'Fet':x.price+' monedes')+'</span></button>'}).join('');
  return tip('casa','Aquesta és la teva casa. Aquí descansen les bestioles. Toca <b>Explorar</b> (a baix) per sortir d’aventura!')+
    '<h1>La teva casa</h1>'+svg+'<h2>Construir i decorar</h2><div class="grid3">'+builds+'</div>'+
    (none?'<div class="flat" style="background:#FFF1C2"><h3>Totes les bestioles estan cansades</h3><p>Feu una migdiada i tornaran a estar a punt.</p><button type="button" class="btn gold" data-act="nap">Fes la migdiada</button></div>':'')+
    '<div class="flat"><div class="row between"><h3>Places per a bestioles</h3><b>'+G.owned.length+' de '+cap()+'</b></div>'+bar(G.owned.length*100/cap(),'#3DAA5C')+'<p class="muted small">Les bestioles es cansen per expedicions. A casa descansen: 1 punt per cada expedició que no fan, i també 1 punt cada 10 minuts.</p>'+list+'</div>'+
    '<div class="flat"><h3>Partida</h3><p class="muted">La partida es guarda en aquest mòbil o ordinador.</p><button type="button" class="btn light sm" data-act="reset">'+(resetArm?'Segur? Toca un altre cop':'Comença una partida nova')+'</button></div>';
}
var resetArm=false,abandonArm=null,restartArm=false;
/* places the critters that are at home inside the rooms of the house drawing (366x230 coordinates) */
function houseCrew(home){
  var b=G.built,spots=[[62,139],[102,139],[158,139],[198,139],[62,191],[102,191],[158,191],[198,191]];
  for(var k=0;k<(b.habitacio||0);k++){var y=196-40*k;spots.push([248,y-2],[278,y-2])}
  if(b.jardi)spots.push([318,196],[346,196],[332,182]);
  if(b.piscina)spots.push([262,244],[306,244]);
  return home.slice(0,spots.length).map(function(c,i){var s=spots[i];
    return '<div class="in" style="left:'+(s[0]/366*100)+'%;top:'+(s[1]/270*100)+'%">'+(c.rest>0?'<div style="color:#34405A">z z</div>':'')+cArt(c,30)+'</div>'}).join('');
}
/* the house drawing grows with every purchase */
function houseSvg(b,home){
  var m=b.mobles||0,h=b.habitacio||0,o='';
  o+='<rect x="0" y="196" width="366" height="74" fill="#7CC46B"/><path d="M0 196 H366" stroke="#5BA84E" stroke-width="3"/>';
  if(b.tennis)o+='<rect x="12" y="212" width="130" height="50" rx="4" fill="#E8743B"/><path d="M14 214 H140 V260 H14 Z M77 214 V260 M14 237 H140" stroke="#fff" stroke-width="2" fill="none"/><path d="M77 208 V266" stroke="#1E1B2E" stroke-width="3"/><circle cx="110" cy="228" r="4" fill="#E6F55A"/><text x="16" y="208" font-size="9" font-weight="800" fill="#1E1B2E">Pista de tennis</text>';
  if(b.spa)o+='<ellipse cx="190" cy="240" rx="34" ry="14" fill="#B58BE6" stroke="#6B2FB3" stroke-width="3"/><ellipse cx="190" cy="238" rx="26" ry="8" fill="#7CC0FF"/><circle cx="180" cy="236" r="2.5" fill="#fff"/><circle cx="196" cy="239" r="2" fill="#fff"/><circle cx="203" cy="235" r="2.5" fill="#fff"/><path d="M178 222 q-4 -6 0 -12 M190 220 q4 -6 0 -12 M202 222 q-4 -6 0 -12" stroke="#fff" stroke-width="2.5" fill="none"/><text x="168" y="266" font-size="9" font-weight="800" fill="#1E1B2E">Spa</text>';
  if(b.piscina)o+='<rect x="236" y="216" width="110" height="38" rx="12" fill="#2E8BE6" stroke="#fff" stroke-width="4"/><path d="M246 236 q8 -5 16 0 t16 0 t16 0 t16 0 t16 0" stroke="#BFE3F7" stroke-width="2.5" fill="none"/><path d="M336 210 V236 M344 210 V236 M336 218 H344 M336 226 H344" stroke="#9AA3B5" stroke-width="2.5"/><circle cx="300" cy="230" r="7" fill="none" stroke="#F26B3A" stroke-width="4"/><text x="240" y="266" font-size="9" font-weight="800" fill="#1E1B2E">Piscina</text>';
  for(var k=0;k<h;k++){var y=156-40*k;o+='<rect x="228" y="'+y+'" width="66" height="40" fill="#C98A5A" stroke="#8A5A3C" stroke-width="2"/><rect x="236" y="'+(y+6)+'" width="50" height="28" fill="#FFF1DA"/><rect x="254" y="'+(y+10)+'" width="14" height="10" fill="#BFE3F7" stroke="#8A5A3C" stroke-width="1.5"/>'}
  if(h)o+='<path d="M222 '+(156-40*(h-1))+' L261 '+(130-40*(h-1))+' L300 '+(156-40*(h-1))+' Z" fill="#E2574C" stroke="#A23A31" stroke-width="3" stroke-linejoin="round"/><text x="232" y="'+(150-40*(h-1)-10)+'" font-size="9" font-weight="800" fill="#fff">Habitacions</text>';
  if(b.jardi)o+='<path d="M300 186 H364 M300 196 H364" stroke="#fff" stroke-width="2.5"/>'+[304,316,328,340,352,362].map(function(x){return '<rect x="'+x+'" y="180" width="3" height="18" fill="#fff"/>'}).join('')+'<rect x="318" y="140" width="6" height="40" fill="#6B3E26"/><circle cx="321" cy="132" r="20" fill="#3B7D32"/><rect x="346" y="156" width="5" height="26" fill="#6B3E26"/><circle cx="348" cy="150" r="13" fill="#4E9A43"/>'+[[308,190,'#F26B3A'],[336,192,'#F7C948'],[356,190,'#9B59E0']].map(function(f){return '<circle cx="'+f[0]+'" cy="'+f[1]+'" r="3.5" fill="'+f[2]+'"/>'}).join('')+'<text x="304" y="176" font-size="9" font-weight="800" fill="#1E1B2E">Jardí</text>';
  o+='<path d="M20 86 L130 20 L240 86 Z" fill="#E2574C" stroke="#A23A31" stroke-width="3" stroke-linejoin="round"/><rect x="30" y="86" width="200" height="110" fill="#8A5A3C"/>'+
    '<rect x="38" y="94" width="88" height="46" fill="#FDE7C8"/><rect x="134" y="94" width="88" height="46" fill="#E8F1FF"/><rect x="38" y="146" width="88" height="46" fill="#FFF7E8"/><rect x="134" y="146" width="88" height="46" fill="#F1E3FF"/>'+
    '<g font-size="9" font-weight="800" font-family="Nunito,sans-serif"><text x="42" y="104" fill="#6B3E26">Dormitori</text><text x="138" y="104" fill="#1A5FA3">Bany</text><text x="42" y="156" fill="#6B3E26">Sala</text><text x="138" y="156" fill="#5B2A96">Racó de jocs</text></g>';
  if(m>=1)o+='<rect x="74" y="178" width="46" height="12" rx="4" fill="#C0392B"/><rect x="74" y="170" width="46" height="9" rx="4" fill="#E2574C"/>';
  if(m>=2)o+='<rect x="84" y="126" width="38" height="12" rx="3" fill="#fff" stroke="#9AA3B5"/><rect x="86" y="124" width="10" height="6" rx="2" fill="#BFE3F7"/>';
  if(m>=3)o+='<path d="M212 190 V164" stroke="#6B3E26" stroke-width="2"/><path d="M204 166 L212 154 L220 166 Z" fill="#F7C948"/>';
  if(m>=4)o+='<ellipse cx="82" cy="191" rx="34" ry="3" fill="#9B59E0"/>';
  if(m>=5)o+='<rect x="206" y="128" width="10" height="10" fill="#B5793E"/><circle cx="211" cy="122" r="8" fill="#3DAA5C"/>';
  return '<div class="house"><svg viewBox="0 0 366 270" aria-hidden="true" style="background:#BFE3F7">'+o+'</svg>'+houseCrew(home)+'</div>';
}
function scExplorar(){
  var pos={foc:[145,0],llamp:[290,118],aigua:[236,300],planta:[54,300],psiquic:[0,118]};
  var lines='<svg width="390" height="460" viewBox="0 0 390 460" aria-hidden="true" style="position:absolute;left:0;top:0"><g stroke="#fff" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round" fill="none"><path d="M195 235 L195 60"/><path d="M195 235 L338 170"/><path d="M195 235 L286 350"/><path d="M195 235 L104 350"/><path d="M195 235 L50 170"/></g></svg>';
  var ws=ORDER.map(function(w){var p=pos[w],open=worldOpen(w),A=ELS[w],pct=open?worldPct(w):0;
    return '<button type="button" class="world" data-act="world" data-w="'+w+'" style="left:'+p[0]+'px;top:'+p[1]+'px"'+(open?'':' aria-label="Món desconegut"')+'><span class="ring" style="background:conic-gradient(#fff '+pct+'%,rgba(255,255,255,.35) 0)"><span class="ball" style="background:'+(open?A.c:'#8E94A8')+'">'+(open?elIcon(w,40,w==='llamp'?'#1E1B2E':'#fff'):'<span style="font-family:var(--display);font-size:40px;color:#fff">?</span>')+(G.runs[w]?'<span class="badge">A mitges</span>':'')+'</span></span>'+(open?esc(A.n)+' · '+pct+'%':'???')+(open?starStr(starsN(TIER[w])):'')+'</button>'}).join('');
  var house='<div style="position:absolute;left:145px;top:190px;width:100px;text-align:center"><svg width="100" height="80" viewBox="0 0 180 150" aria-hidden="true"><ellipse cx="90" cy="120" rx="86" ry="26" fill="#7CC46B"/><rect x="60" y="62" width="62" height="50" rx="4" fill="#FFF4E0" stroke="#8A5A3C" stroke-width="3"/><path d="M52 66 L91 32 L130 66 Z" fill="#E2574C" stroke="#A23A31" stroke-width="3"/></svg></div>';
  var paused=Object.keys(G.runs).map(function(w){var r=G.runs[w];return '<div class="row" style="gap:10px">'+elIcon(w,28,ELS[w].c)+'<div style="flex:1;min-width:0"><b>'+esc(ELS[w].mon)+'</b><div class="muted small">Pas '+(r.i+1)+' de '+r.slots.length+(r.cave?' · dins una cova':'')+'</div></div><button type="button" class="btn sm green" data-act="resume" data-w="'+w+'">Continua</button><button type="button" class="btn sm light" data-act="abandon" data-w="'+w+'">'+(abandonArm===w?'Segur?':'Deixa-la')+'</button></div>'}).join('');
  return tip('explorar','Toca un món per entrar-hi. El número % diu quant n’has explorat. Les estrelles ★ diuen com és de difícil.')+
    '<h1>Explorar</h1><p class="muted">Tria a quin món vols entrar.</p><div style="overflow-x:auto"><div class="map">'+lines+house+ws+'</div></div>'+
    (paused?'<div class="flat"><h3>Aventures a mitges</h3><p class="muted small">Les bestioles d’una aventura a mitges no poden anar enlloc més fins que l’acabis o la deixis.</p>'+paused+'</div>':'')+
    (G.psiquic?'':'<p class="muted">Completa 3 expedicions per descobrir el món desconegut ('+G.completed+' de 3).</p>');
}
function goodAgainst(w){return Object.keys(BEATS).filter(function(k){return BEATS[k].indexOf(w)>=0}).map(function(k){return ELS[k].n}).join(' o ')}
function crew(r){return '<div class="crew">'+hero(34)+r.team.map(function(u){var c=byUid(u);return c?cArt(c,34,false):''}).join('')+'</div>'}
function teamMini(r){
  return '<div class="grid3">'+r.team.map(function(u){var c=byUid(u);if(!c)return '';var mx=stats(c).hp,p=Math.round(r.hp[u]*100/mx);
    return '<div class="box" style="'+(r.hp[u]<=0?'opacity:.5':'')+'">'+cArt(c,32)+'<span>'+esc(cName(c))+'</span>'+roleTag(sp(c).role,true)+'<div style="width:100%">'+bar(p,hpColor(p))+'</div><span class="muted small">'+r.hp[u]+'/'+mx+'</span></div>'}).join('')+'</div>';
}
function bigCard(e){
  var art='',title='',sub='',btns='<button type="button" class="btn gold" data-act="claim">Continua</button>',border='var(--accent)',bg='#F4F1FA',rar='',muted=false;
  if(e.kind==='critter'){var s=SPECIES[e.sp];art=spArt(e.sp,'',120);title=s.n;sub=ELS[s.el].n+' · '+s.role+' · '+(TALENT[s.talent]?TALENT[s.talent].n:'');bg=ELS[s.el].soft;border=e.rare?'#9B59E0':ELS[s.el].c;rar=e.rare?'Rara':'Nova';
    var r=run(),ko=r?r.team.filter(function(u){return r.hp[u]<=0})[0]:null,canJoin=r&&(r.team.length<3||ko);
    btns=(canJoin?'<button type="button" class="btn gold" data-act="join">'+(r.team.length<3?'Afegeix-la a l’equip':'Substitueix '+esc(cName(byUid(ko)))+' (KO)')+'</button>':'')+'<button type="button" class="btn light" data-act="claim">Envia-la a casa</button>';}
  else if(e.kind==='dup'||e.kind==='full'){var s2=SPECIES[e.sp];art=spArt(e.sp,'',130);title=s2.n;sub=e.kind==='dup'?'Repetida':'No hi cap a casa';bg=ELS[s2.el].soft;muted=e.kind==='full'}
  else if(e.kind==='item'){var it=IT(e.item);art='<svg class="cr" width="110" height="110" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 L15 9 L22 9 L16.5 13.5 L18.5 21 L12 16.5 L5.5 21 L7.5 13.5 L2 9 L9 9 Z" fill="'+(it.relic?'#9B59E0':'#F7C948')+'" stroke="#1E1B2E" stroke-width=".8"/></svg>';title=it.n;rar=it.rar;border=it.relic?'#9B59E0':'#C98A00';
    sub=itemStats(it)+' · per a la motxilla';}
  else if(e.kind==='food'){art=elIcon(e.el,100,ELS[e.el].c);title=FOOD[e.el]+' ×'+e.n;sub='Menjar per a bestioles de '+ELS[e.el].n.toLowerCase();bg=ELS[e.el].soft;border=ELS[e.el].c}
  else if(e.kind==='coins'){art='<svg class="cr" width="100" height="100" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.5" fill="#F7C948" stroke="#C98A00" stroke-width="1.5"/><circle cx="10" cy="10" r="4" fill="none" stroke="#C98A00" stroke-width="1.5"/></svg>';title='+'+e.n+' monedes';border='#C98A00'}
  var head=e.kind==='critter'?'Bestiola nova!':e.kind==='item'?(IT(e.item).relic?'Tresor rar!':'Has trobat un objecte!'):e.kind==='food'?'Menjar!':e.kind==='coins'?'Monedes!':e.kind==='dup'?'Repetida!':'Vaja…';
  return '<div class="reveal'+(muted?' muted-panel':'')+'"><h2>'+esc(head)+'</h2>'+
    '<div class="bigcard" style="border-color:'+border+'"><div class="art" style="background:'+bg+'"><span class="sfx stay">'+(e.kind==='critter'?'NOVA!':e.kind==='item'?'TXAN!':e.kind==='coins'?'DING!':e.kind==='food'?'ÑAM!':e.kind==='dup'?'REPE!':'OH!')+'</span>'+(rar?'<span class="rar" style="background:'+border+'">'+esc(rar)+'</span>':'')+art+'</div><h2 style="color:var(--ink)">'+esc(title)+'</h2><div class="muted" style="text-align:center;padding:0 12px">'+esc(sub)+'</div><div class="muted" style="text-align:center;padding:0 12px">'+esc(e.why||'')+'</div></div>'+
    '<div style="display:flex;flex-direction:column;gap:10px;width:min(300px,100%)">'+btns+'</div></div>';
}
function scResum(){
  var s=G.summary||{ok:true,coins:0,tired:[]};
  return '<div class="flat" style="align-items:center;text-align:center;gap:10px"><h1>'+(s.ok?'Camí completat!':'Heu tornat a casa')+'</h1>'+
    '<p>'+esc(s.world?ELS[s.world].mon:'')+(s.world?' · explorat '+s.pct+'%':'')+'</p><span class="pill" style="background:#FFF4D6;font-size:20px">'+COIN+'+'+s.coins+'</span>'+
    (s.bonus?'<p class="muted">Inclou '+s.bonus+' monedes per acabar el camí.</p>':s.ok?'':s.keepAll?'<p class="muted">Has tornat abans del guardià: el camí no compta com a acabat.</p>':'<p class="muted">Has perdut la meitat de les monedes que portaves.</p>')+
    (s.tired&&s.tired.length?'<p>Molt cansades, han de descansar a casa: <b>'+esc(s.tired.join(', '))+'</b></p>':'')+
    (s.tennis?'<p>'+esc(s.tennis)+' ha jugat a tennis i ha guanyat 1 estrella de força.</p>':'')+
    (s.bigger?'<p class="tag good" style="font-size:15px;padding:6px 12px">Ara pots portar '+s.bigger+' bestioles a les aventures!</p>':'')+(s.unlocked?'<p class="tag good" style="font-size:15px;padding:6px 12px">Has descobert el Món Psíquic!</p>':'')+
    '<div class="row" style="justify-content:center"><button type="button" class="btn" data-act="nav" data-to="explorar">Explora més</button><button type="button" class="btn light" data-act="nav" data-to="casa">Torna a casa</button></div></div>';
}
function scBestioles(){
  var owned=SP_ORDER.filter(ownsSp).length,ready=G.owned.filter(function(c){return c.stage<2&&c.mill>=5});
  var tileOf=function(s){var own=ownsSp(s),S=SPECIES[s],ev=G.owned.some(function(c){return c.sp===s&&c.stage<2&&c.mill>=5});
    var best=G.owned.filter(function(c){return c.sp===s}).sort(function(a,z){return z.stage-a.stage})[0];
    var art=best?cArt(best,50):spArt(s,'',50,true),name=best?esc(cName(best))+(best.stage?'<span class="muted" style="font-size:11px">('+esc(S.n)+')</span>':''):'???';
    return '<button type="button" class="tap'+(own?'':' off')+'" data-act="detail" data-s="'+s+'" style="min-height:118px;position:relative'+(own?';border-color:'+ELS[S.el].c+';box-shadow:0 4px 0 '+ELS[S.el].c:'')+'" aria-label="'+(own?esc(best?cName(best):S.n):'Bestiola que encara no tens')+'">'+art+name+roleTag(S.role,true)+evoDots(best,S)+(ev?'<span class="badge" style="right:-6px;top:-6px">Evoluciona!</span>':'')+'</button>'};var tiles=spGrid(tileOf);
  return '<h1>Bestioles</h1>'+tip('bestioles','Les ombres grises són bestioles que encara no tens. Toca una bestiola per veure-la, donar-li menjar i fer-la evolucionar.')+
    '<div class="row between"><span>Bestioles <b>'+owned+' de '+SP_ORDER.length+'</b></span><span>Evolucions <b>'+formsOwned()+' de '+SP_ORDER.length*3+'</b></span></div><div class="row between"><span>Combos secrets descoberts <b>'+megaCount()+' de '+MEGA.length+'</b></span></div>'+
    (function(){var n=roleCounts(G.owned);return '<div class="row" style="gap:6px"><span class="small">En tens:</span>'+['Atac','Defensa','Curador'].map(function(r){return roleTag(r)+'<b>'+n[r]+'</b>'}).join(' ')+'</div>'})()+bar(owned*100/SP_ORDER.length,'#9B59E0')+
    (ready.length?'<p class="tag mid" style="font-size:14px;padding:6px 10px">'+esc(ready.map(cName).join(', '))+' ja pot evolucionar!</p>':'')+sortBar()+tiles;
}
function deltaChips(eqNew){
  var a=bonusPct(G.equip),b=bonusPct(eqNew),out=[];
  [['atk','Atac'],['def','Defensa'],['hp','Vida']].forEach(function(k){var d=b[k[0]]-a[k[0]];if(d!==0)out.push('<span class="delta '+(d>0?'up':'down')+'">'+(d>0?'▲ ':'▼ ')+k[1]+' '+(d>0?'+':'−')+Math.abs(d)+'%</span>')});
  return out.length?out.join(' '):'<span class="muted small">Igual que el que portes</span>';
}
function bestBlock(){
  if(!G.items.length&&!Object.keys(G.equip).length)return '';
  var best=bestEquipSet(),same=SLOTS.every(function(x){return (best.equip[x[0]]||'')===(G.equip[x[0]]||'')});
  return '<div class="flat" style="gap:6px"><button type="button" class="btn green" data-act="bestEquip"'+(same?' disabled':'')+'>'+(same?'Ja portes el millor':'Equipa el millor')+'</button>'+
    (same?'':'<div class="row" style="gap:4px">'+deltaChips(best.equip)+'</div>')+'<p class="muted small">Tria per a cada lloc l’objecte que dona més en total (atac + defensa + vida).</p></div>';
}
/* ================= ACTIONS ================= */
function act0(a,d){
  var r=run();
  if(a!=='reset')resetArm=false;if(a!=='abandon')abandonArm=null;if(a!=='restart')restartArm=false;
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
    case 'build':var bd=BUILD.filter(function(x){return x.k===d.k})[0];if(bd&&G.coins>=bd.price&&(G.built[bd.k]||0)<bd.max){G.coins-=bd.price;G.built[bd.k]=(G.built[bd.k]||0)+1;toast(bd.n+': fet!')}break;
    case 'detail':G.detail=d.s;break;
    case 'close':G.detail=null;break;
    case 'adopt':var Sp=SPECIES[d.s];if(G.coins>=Sp.price&&G.owned.length<cap()&&worldOpen(Sp.el)){G.coins-=Sp.price;G.owned.push(mk(d.s));toast(Sp.n+' viu ara a casa teva!')}break;
    case 'feed':var c=byUid(d.u);if(c&&G.food[d.el]>0&&c.mill<5){G.food[d.el]--;c.mill=Math.min(5,c.mill+(d.el===sp(c).el?2:1));toast(cName(c)+' ha menjat: '+c.mill+' de 5 estrelles.')}break;
    case 'evolve':var c2=byUid(d.u),ei=+d.i;if(c2&&c2.stage<2&&c2.mill>=5&&((c2.stage===0&&ei===0)||(c2.stage===1&&ei>0))){c2.stage++;c2.evo=ei;c2.mill=0;toast('Ara és '+cName(c2)+'!')}break;
    case 'equip':var ix=G.items.indexOf(d.id);if(ix<0||!IT(d.id))break;var sl=d.slot;G.items.splice(ix,1);if(G.equip[sl])G.items.push(G.equip[sl]);G.equip[sl]=d.id;toast(IT(d.id).n+' equipat.');break;
    case 'forge':var nid=baseOf(d.id)+'#'+(tierOf(d.id)+1);if(forgeOnce(d.id)){var lf=IT(G.lastForge);toast('Forjat: '+lf.n+' ('+TIER_N[lf.tier]+'). Nou poder: '+AFFIX[lf.aff[lf.aff.length-1]].n+'!')}break;
    case 'forgeAll':var nf=forgeAll();toast(nf?'Has forjat '+nf+' objecte'+(nf>1?'s':'')+'!':'No hi ha res per forjar.');break;
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

/* ================= V7: zones, abilities, combos, synergies ================= */
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

/* ---------- route ---------- */
function buildRoute(w,z){
  var used=[];
  return ZONE_ROUTES[z].map(function(k){
    if(k==='fork')return {k:'fork',opts:['tenda','cova'],scene:null};
    if(k==='fork2'){var a=pickScene('gen',w,used),b=pickScene('land',w,used);return {k:'fork',opts:[a,b],scene:null}}
    if(k==='guardian'||k==='mini'||k==='cave')return {k:k};
    if(k==='spring')return {k:'spring',scene:'font'};
    return {k:k,scene:pickScene(k,w,used)};
  });
}
function startRun(){
  var w=G.world,z=G.zone||0,hp={};
  G.pick.forEach(function(u){hp[u]=stats(byUid(u)).hp});
  G.runs[w]={world:w,zone:z,L:zoneL(w,z),i:0,slots:buildRoute(w,z),team:G.pick.slice(),hp:hp,coins:0,cave:null,scene:null,node:'a',event:null,reveal:0,bless:0};
  G.active=w;G.pick=[];G.screen='run';arrive();
}
function arrive(){
  var r=run();if(!r)return;
  if(r.i>=r.slots.length){finishRun(true);return}
  var s=r.slots[r.i];
  if(s.k==='fork'&&!s.scene){r.event={type:'fork'};return}
  if(s.k==='guardian'){r.event={type:'guardianPre'};return}
  if(s.k==='mini'){r.event={type:'miniPre'};return}
  if(s.k==='cave'){r.cave=newCave(1);enterScene(r.cave.list[0]);return}
  enterScene(s.scene);
}
function newCave(lvl){return {lvl:lvl,i:0,list:['cova-tunels',pickOne(['cova-cristalls','cova-ratpenats','cova-bolets','cova-llac']),pickOne(['cova-ratpenats','cova-mina','cova-cristalls','cova-bolets']),lvl>=3?'cova-rei':'cova-escala']}}
function enterScene(id){
  var r=run();r.scene=id;r.node='a';r.event={type:'scene'};
  G.seen[r.world]=G.seen[r.world]||{};G.seen[r.world][id]=1;
}
function advance(){
  var r=run();if(!r)return;
  if(r.cave){r.cave.i++;if(r.cave.i<r.cave.list.length){enterScene(r.cave.list[r.cave.i]);return}r.cave=null;toast('Surts de la cova i tornes al camí.')}
  r.i++;arrive();
}
function caveL(r){return r.cave?0.5+0.6*(r.cave.lvl-1):0}
function startBattle(o){var r=run(),b=makeBattle(o);if(r.bless){b.tm.buff=3;r.bless=0;b.caption='La benedicció us dona +30% de mal!'}r.event=b}
function applyEffect(e){
  var r=run();if(!e){advance();return}
  if(e.shop||e.buyFood||e.price){var disc=teamTalent('mercat')?0.5:1;e=Object.assign({},e);if(e.shop)e.shop=Math.ceil(e.shop*disc);if(e.buyFood)e.buyFood=Math.ceil(e.buyFood*disc);if(e.price)e.price=Math.ceil(e.price*disc)}
  if(e.rand){var x=Math.random(),acc=0;for(var i=0;i<e.rand.length;i++){acc+=e.rand[i][0];if(x<acc){applyEffect(e.rand[i][1]);return}}applyEffect(e.rand[e.rand.length-1][1]);return}
  if(e.go){r.node=e.go;r.event={type:'scene'};return}
  if(e.exitCave){if(e.coins)r.coins+=e.coins;r.cave=null;r.i++;toast('Surts de la cova'+(e.coins?' amb '+e.coins+' monedes':'')+'.');arrive();return}
  if(e.deeper){var lv=r.cave.lvl+1;r.cave=newCave(lv);enterScene(r.cave.list[0]);toast('Baixeu al nivell '+lv+' de la cova. Ara és més perillós!');return}
  if(e.coins){var tr=teamTalent('tresor');r.event={type:'card',kind:'coins',n:Math.round(e.coins*(tr?1.5:1)),why:tr?'L\u2019Ensumatresors n\u2019ha trobat m\u00e9s!':'Has trobat monedes.'};return}
  if(e.food){r.event={type:'card',kind:'food',el:r.world,n:e.food+(teamTalent('bosc')&&!r.cave?1:0),why:'Menjar per a les bestioles.'};return}
  if(e.loot){r.event={type:'card',kind:'item',item:pickOne(e.loot==='relic'?RELICS:COMMON),why:e.loot==='relic'?'Un tresor rar!':'Un objecte per a la motxilla.'};return}
  if(e.heal){var ko=0;r.team.forEach(function(u){var c=byUid(u);if(!c)return;var mx=stats(c).hp;if(r.hp[u]<=0)ko++;r.hp[u]=Math.min(mx,Math.max(1,Math.round(r.hp[u]+(mx-r.hp[u])*e.heal/100)))});
    r.event={type:'note',title:'Descanseu',text:'L’equip recupera vida.'+(ko?' Les bestioles que estaven KO es desperten.':'')};return}
  if(e.dmgTeam){alive(r).forEach(function(c){var mx=stats(c).hp;r.hp[c.uid]=Math.max(1,r.hp[c.uid]-Math.round(mx*e.dmgTeam/100))});r.event={type:'note',title:'Ai!',text:'L’equip perd una mica de vida.'};return}
  if(e.bless){r.bless=1;r.event={type:'note',title:'Benedicció',text:'A la propera batalla, tot l’equip farà +30% de mal durant 3 torns.'};return}
  if(e.reveal){r.reveal=Math.min(r.slots.length-1,r.i+5);r.event={type:'note',title:'Des de dalt',text:'Veus els propers llocs del camí (mira les boles de dalt).'};return}
  if(e.skip){var to=Math.min(r.i+e.skip,r.slots.length-2),n=to-r.i;r.i=to;r.event={type:'note',title:'Drecera!',text:n>0?'Us salteu '+n+' llocs del camí.':'Ja sou a prop del final.'};return}
  if(e.wild){r.event={type:'wild',sp:pickOne(speciesOf(r.world)),rare:!!e.rare};return}
  if(e.fight){startBattle({el:r.world,L:r.L+(e.L||0)+caveL(r),n:e.n,win:e.win,waves:e.waves,guardian:!!e.guardian});return}
  if(e.cave){r.cave=newCave(1);enterScene(r.cave.list[0]);return}
  if(e.shop){if(r.coins>=e.shop){r.coins-=e.shop;r.event={type:'card',kind:'item',item:pickOne(COMMON),why:'L’has comprat.'}}else r.event={type:'note',title:'No tens prou monedes',text:'Necessites '+e.shop+' monedes de les que portes en aquesta aventura (en portes '+r.coins+').'};return}
  if(e.buyFood){if(r.coins>=e.buyFood){r.coins-=e.buyFood;r.event={type:'card',kind:'food',el:r.world,n:3,why:'L’has comprat.'}}else r.event={type:'note',title:'No tens prou monedes',text:'Necessites '+e.buyFood+' monedes de les que portes (en portes '+r.coins+').'};return}
  if(e.buyItem){if(r.coins>=e.price){r.coins-=e.price;r.event={type:'card',kind:'item',item:e.buyItem==='RELIC'?pickOne(RELICS):e.buyItem,why:'L’heu fet a la forja.'}}else r.event={type:'note',title:'No tens prou monedes',text:'Necessites '+e.price+' monedes de les que portes (en portes '+r.coins+').'};return}
  if(e.note){r.event={type:'note',title:'',text:e.note};return}
  advance();
}

/* ---------- new scenes ---------- */
Object.assign(SCENES,{
  riu:{n:'Riu ràpid',art:'river',pool:'gen',nodes:{a:{t:'Un riu ràpid talla el camí. Hi ha pedres per saltar.',ch:[
    {l:'Salta per les pedres',d:'Potser relliques.',risk:1,out:{rand:[[0.6,{coins:12}],[0.4,{dmgTeam:15}]]}},
    {l:'Busca un gual',d:'Tranquil, però no trobes res.',risk:0,out:{note:'Trobeu un lloc on l’aigua és baixa i passeu.'}},
    {l:'Una bestiola d’Aigua us porta',d:'I pesca de passada.',risk:0,req:{el:'aigua'},out:{food:3}}]}}},
  mercader:{n:'Mercader ambulant',art:'village',pool:'gen',nodes:{a:{t:'Un mercader amb un carro ple de coses.',ch:[
    {l:'Compra menjar (20 monedes)',d:'3 de menjar d’aquest món.',risk:0,out:{buyFood:20}},
    {l:'Compra un objecte (40 monedes)',d:'Un objecte per a la motxilla.',risk:0,out:{shop:40}},
    {l:'Saluda i segueix',d:'',risk:0,out:{note:'El mercader us desitja bon viatge.'}}]}}},
  trampa:{n:'Pas de pedres',art:'rocks',pool:'gen',nodes:{a:{t:'Un pas estret. Des de dalt cauen pedres de tant en tant.',ch:[
    {l:'Corre!',d:'Potser us cau alguna pedra.',risk:1,out:{rand:[[0.5,{note:'Passeu sense que us caigui res!'}],[0.5,{dmgTeam:20}]]}},
    {l:'Un tanc aguanta les pedres',d:'La teva Defensa us protegeix.',risk:0,req:{role:'Defensa'},out:{coins:10}},
    {l:'Busca un altre camí',d:'Més llarg i cansat.',risk:0,out:{dmgTeam:5}}]}}},
  niu:{n:'Niu d’ous',art:'meadow',pool:'gen',nodes:{a:{t:'Un niu amb ous de colors. Un d’ells es mou.',ch:[
    {l:'Espera que surti',d:'Potser és una bestiola rara.',risk:0,out:{rand:[[0.5,{wild:1,rare:1}],[0.5,{note:'Encara no surt. Seguiu el camí.'}]]}},
    {l:'Agafa un ou',d:'La mare el defensa!',risk:2,out:{fight:1,L:0.5,n:'Mare protectora',win:{wild:1,rare:1}}},
    {l:'Deixa’l tranquil',d:'La mare us dona les gràcies.',risk:0,out:{bless:1}}]}}},
  altar:{n:'Altar antic',art:'ruins',pool:'gen',nodes:{a:{t:'Un altar de pedra amb una gemma que brilla.',ch:[
    {l:'Fes una reverencia',d:'Una benedicció per a la propera batalla.',risk:0,out:{bless:1}},
    {l:'Agafa la gemma',d:'Tresor rar… o un guardià enfadat.',risk:2,out:{rand:[[0.3,{loot:'relic'}],[0.7,{fight:1,L:0.8,n:'Guardià de l’altar',win:{loot:'relic'}}]]}},
    {l:'Passa de llarg',d:'',risk:0,out:{note:'Continueu el camí.'}}]}}},
  campament:{n:'Campament de monstres',art:'tent',pool:'gen',nodes:{a:{t:'Un campament de monstres. N’hi ha més d’un!',ch:[
    {l:'Ataca el campament',d:'2 monstres, un després de l’altre.',risk:2,out:{fight:1,waves:2,win:{rand:[[0.6,{loot:'common'}],[0.4,{coins:40}]]}}},
    {l:'Passa d’amagat',d:'Si et veuen, n’has de lluitar contra un.',risk:1,out:{rand:[[0.6,{note:'No us han vist!'}],[0.4,{fight:1}]]}},
    {l:'Un Psíquic els adorm',d:'Passeu i agafeu les seves monedes.',risk:0,req:{el:'psiquic'},out:{coins:30}}]}}},
  cascada:{n:'Cascada',art:'waterfall',pool:'gen',nodes:{a:{t:'Una cascada molt alta. Darrere l’aigua sembla que hi ha un forat.',ch:[
    {l:'Banyeu-vos',d:'L’equip recupera vida.',risk:0,out:{heal:40}},
    {l:'Mira darrere l’aigua',d:'Una cova amagada!',risk:2,out:{cave:1}}]}}},
  mina:{n:'Mina abandonada',art:'cave',pool:'gen',nodes:{a:{t:'Una mina vella amb vagonetes i pics.',ch:[
    {l:'Pica la paret',d:'Monedes… o una esllavissada.',risk:1,out:{rand:[[0.6,{coins:30}],[0.4,{dmgTeam:20}]]}},
    {l:'Busca a les vagonetes',d:'',risk:0,out:{coins:10}},
    {l:'Una bestiola de Llamp encén els llums',d:'Ara es veu tot.',risk:0,req:{el:'llamp'},out:{loot:'common'}}]}}},
  guaita:{n:'Torre de guaita',art:'tower',pool:'gen',nodes:{a:{t:'Una torre de fusta des d’on es veu lluny.',ch:[
    {l:'Puja a dalt',d:'Veuràs els propers llocs del camí.',risk:0,out:{reveal:1}},
    {l:'Descansa a l’ombra',d:'L’equip recupera una mica de vida.',risk:0,out:{heal:25}}]}}},
  globus:{n:'Globus aerostàtic',art:'balloon',pool:'gen',nodes:{a:{t:'Un globus lligat a un arbre. La cistella té lloc per a tots.',ch:[
    {l:'Puja al globus',d:'Us salteu 2 llocs del camí.',risk:0,out:{skip:2}},
    {l:'Busca a la cistella',d:'',risk:0,out:{food:1}}]}}},
  petita:{n:'Bestiola perduda',art:'trail',pool:'gen',nodes:{a:{t:'Una bestiola petita plora al costat del camí. S’ha perdut.',ch:[
    {l:'Acompanya-la a casa',d:'La seva família us ho agraïrà.',risk:0,out:{rand:[[0.5,{bless:1}],[0.5,{coins:20}]]}},
    {l:'Juga amb ella',d:'Potser vol venir amb tu.',risk:0,out:{wild:1}}]}}},
  forja:{n:'Forja antiga',art:'castle',pool:'sig',world:'foc',nodes:{a:{t:'Una forja que encara crema. Hi ha eines i metall.',ch:[
    {l:'Fes una espasa (40 monedes)',d:'Una Espasa de llamp.',risk:0,out:{buyItem:'espasaLlamp',price:40}},
    {l:'Escalfa’t',d:'L’equip recupera vida.',risk:0,out:{heal:30}},
    {l:'Una bestiola de Foc aviva el foc',d:'Fa un tresor.',risk:0,req:{el:'foc'},out:{loot:'relic'}}]}}},
  tortugues:{n:'Illa de les tortugues',art:'lake',pool:'sig',world:'aigua',nodes:{a:{t:'Tortugues gegants dormen a la platja d’una illa.',ch:[
    {l:'Puja a una tortuga',d:'Us porta 2 llocs més endavant.',risk:0,out:{skip:2}},
    {l:'Busca perles',d:'Monedes… o un cranc enfadat.',risk:1,out:{rand:[[0.6,{coins:25}],[0.4,{fight:1,n:'Cranc enfadat'}]]}}]}}},
  pantà:{n:'Pantà',art:'lake',pool:'sig',world:'planta',nodes:{a:{t:'Un pantà ple de fang i bolets estranys.',ch:[
    {l:'Creua pel fang',d:'Hi ha coses que piquen.',risk:1,out:{rand:[[0.5,{dmgTeam:15}],[0.5,{wild:1,rare:1}]]}},
    {l:'Recull bolets',d:'Menjar.',risk:0,out:{food:2}},
    {l:'Una bestiola de Planta fa un pont d’arrels',d:'Passeu i trobeu un tresor.',risk:0,req:{el:'planta'},out:{loot:'relic'}}]}}},
  nuvol:{n:'Núvol elèctric',art:'balloon',pool:'sig',world:'llamp',nodes:{a:{t:'Un núvol baix que fa espurnes. Si el toques, et carrega d’energia.',ch:[
    {l:'Toca el núvol',d:'Benedicció… o una descarrega.',risk:1,out:{rand:[[0.6,{bless:1}],[0.4,{dmgTeam:20}]]}},
    {l:'Una bestiola de Llamp hi parla',d:'Us porta volant.',risk:0,req:{el:'llamp'},out:{skip:2}},
    {l:'Passa de llarg',d:'',risk:0,out:{note:'Continueu el camí.'}}]}}},
  miralls:{n:'Sala de miralls',art:'crystals',pool:'sig',world:'psiquic',nodes:{a:{t:'Miralls per tot arreu. No saps quin és el camí bo.',ch:[
    {l:'Segueix el teu reflex',d:'Bestiola rara o monstre.',risk:1,out:{rand:[[0.5,{wild:1,rare:1}],[0.5,{fight:1,L:0.5,n:'Reflex dolent'}]]}},
    {l:'Una bestiola Psíquica veu el camí',d:'Drecera i monedes.',risk:0,req:{el:'psiquic'},out:{skip:2}}]}}},
  'cova-bolets':{n:'Bolets brillants',art:'crystals',pool:'cave2',nodes:{a:{t:'Bolets que fan llum a les parets de la cova.',ch:[
    {l:'Menja’n un',d:'Cura… o fa mal de panxa.',risk:1,out:{rand:[[0.6,{heal:40}],[0.4,{dmgTeam:15}]]}},
    {l:'Recull-ne per a les bestioles',d:'Menjar.',risk:0,out:{food:2}},
    {l:'Una bestiola Psíquica els entén',d:'Benedicció.',risk:0,req:{el:'psiquic'},out:{bless:1}}]}}},
  'cova-llac':{n:'Llac subterrani',art:'lake',pool:'cave2',nodes:{a:{t:'Un llac fosc dins la cova. Alguna cosa neda.',ch:[
    {l:'Neda',d:'Bestiola rara o monstre.',risk:2,out:{rand:[[0.5,{wild:1,rare:1}],[0.5,{fight:1,L:0.5}]]}},
    {l:'Beu aigua',d:'L’equip recupera vida.',risk:0,out:{heal:30}},
    {l:'Busca a la riba',d:'',risk:0,out:{coins:15}}]}}},
  'cova-mina':{n:'Vagonetes velles',art:'chest',pool:'cave2',nodes:{a:{t:'Vies i vagonetes velles plenes de pedres que brillen.',ch:[
    {l:'Puja a una vagoneta',d:'Monedes… o un cop.',risk:1,out:{rand:[[0.6,{coins:30}],[0.4,{dmgTeam:20}]]}},
    {l:'Un tanc empeny la vagoneta',d:'Sense perill.',risk:0,req:{role:'Defensa'},out:{coins:30}},
    {l:'Deixa-ho estar',d:'',risk:0,out:{note:'Continueu cova endins.'}}]}}},
  'cova-escala':{n:'Escales cap avall',art:'tunnels',pool:'cave3',nodes:{a:{t:'Unes escales baixen encara més endins. Es fa més fosc i se senten sorolls.',ch:[
    {l:'Baixa al nivell següent',d:'Més perill, més tresors. Al fons de tot hi ha el Rei de les Profunditats.',risk:2,out:{deeper:1}},
    {l:'Obre el cofre de l’escala i surt',d:'25 monedes i tornes al camí.',risk:0,out:{exitCave:1,coins:25}}]}}},
  'cova-rei':{n:'Sala del rei',art:'guardian',pool:'cave3',nodes:{a:{t:'Al fons de tot de la cova, el Rei de les Profunditats seu en un tron de pedra.',ch:[
    {l:'Lluita contra el Rei de les Profunditats',d:'Molt difícil. Guanya un tresor rar i 60 monedes.',risk:2,out:{fight:1,L:0.5,guardian:1,n:'Rei de les Profunditats',win:{loot:'relic'}}},
    {l:'Surt corrents',d:'Tornes al camí.',risk:0,out:{exitCave:1}}]}}}
});

/* ---------- battle ---------- */
function teamPow(r){if(!r)return 1;var l=r.team.map(byUid).filter(Boolean);if(!l.length)return 1;var st=l.reduce(function(a,c){return a+c.stage},0)/l.length,ml=l.reduce(function(a,c){return a+c.mill},0)/l.length;var q=bonusPct(G.equip);return (1+0.55*st+0.04*ml)*(1+(q.atk+q.def+q.hp)/400)}
function enemyStats(L,guardian,ts,tp){tp=tp||1;var s=(1+0.22*Math.max(0,ts-3))*tp;
  return {hp:Math.round((90+54*L)*s*(guardian?1.8:1)),atk:Math.round((8.5+4*L)*(guardian?1.1:1)*(1+0.04*Math.max(0,ts-3))*(1+(tp-1)*0.3)),def:Math.round(5+2.5*L)}}
function makeBattle0(o){
  var r=run(),L=o.L,b,ts=r?r.team.length:3;
  if(o.wild){var s=SPECIES[o.wild],base=ROLE[s.role],k=0.8+0.3*L;b={n:s.n+' salvatge',el:s.el,hp:Math.round(base.hp*k*1.8),atk:Math.round(base.atk*k),def:Math.round(base.def*k),wild:o.wild}}
  else{var es=enemyStats(L,o.guardian,ts,teamPow(r));b={n:o.n||MONSTERS[o.el],el:o.el,hp:es.hp,atk:es.atk,def:es.def}}
  b.max=b.hp;b.L=L;b.guardian=!!o.guardian;b.final=!!o.final;
  if(o.guardian){var others=ORDER.filter(function(e){return e!==b.el&&BEATS[e].indexOf(b.el)<0});b.resist=pickOne(others)}
  var ch={};if(r)r.team.forEach(function(u,idx){var c=byUid(u);ch[u]=c?abilities(c).map(function(a){return a.cd+(idx%3)}):[]});
  return {type:'battle',enemy:b,waves:o.waves||1,wavesTotal:o.waves||1,turn:0,ch:ch,shield:0,warn:false,over:null,rare:!!o.rare,win:o.win||null,caption:'Comença la batalla!',
    st:{burn:null,poison:null,stun:0,soak:0,weak:0},tm:{buff:0,regen:null,reflect:{}},syn:r?synergies(r.team.map(byUid)):{}};
}
function alive(r){return r.team.map(byUid).filter(function(c){return c&&r.hp[c.uid]>0})}
function lowest(r){return alive(r).sort(function(a,z){return r.hp[a.uid]/stats(a).hp-r.hp[z.uid]/stats(z).hp})[0]}
function sameEl(r,el){return alive(r).filter(function(c){return sp(c).el===el}).length}
function resistF(b,c){return b.enemy.resist&&sp(c).el===b.enemy.resist?0.5:1}
function outDmg0(c,pow,b,r){
  var s=stats(c),atk=s.atk*pow*(b.tm.buff>0?1.3:1)*(b.syn.germans&&sameEl(r,sp(c).el)>=2?1.15:1);
  var def=b.enemy.def*(b.st.soak>0?0.5:1),m=effMult(c,b.enemy.el)*resistF(b,c);
  var zap=(sp(c).el==='llamp'||cEl2(c)==='llamp')&&b.st.soak>0?(b.syn.tempesta?1.6:1.3):1;
  return {n:Math.max(1,Math.round((atk*m-def*0.5)*zap*caveF(r)*huntF(b,c))),m:m,zap:zap>1};
}
function inDmg0(b,t,x){var s=stats(t),def=s.def*(b.syn.complet?1.1:1),atk=b.enemy.atk*(b.st.weak>0?0.7:1)*(b.enemy.enraged?1.3:1)*(x||1);
  return Math.max(1,Math.round(atk*mult(b.enemy.el,sp(t).el)-def*0.5))}
function danger(enemy){
  var r=run(),team=alive(r);if(!team.length)return {cls:'bad',t:'Perillós'};
  var out=0,hp=0,tank=team.filter(function(c){return sp(c).role==='Defensa'})[0];
  team.forEach(function(c){var s=stats(c);out+=Math.max(1,Math.round(s.atk*1.35*effMult(c,enemy.el)*(enemy.resist===sp(c).el?0.5:1)-enemy.def*0.5));hp+=r.hp[c.uid]});
  var tg=tank||team[0],inc=Math.max(1,Math.round(enemy.atk*mult(enemy.el,sp(tg).el)-stats(tg).def*0.5))*1.4;
  var ratio=(hp/inc)/(enemy.hp/out);
  return ratio>=3.2?{cls:'good',t:'Fàcil per al teu equip'}:ratio>=1.8?{cls:'mid',t:'Ajustat'}:{cls:'bad',t:'Perillós per al teu equip'};
}
function sampleEnemy(e){var r=run(),L=r.L+(e.L||0)+caveL(r),es=enemyStats(L,!!e.guardian,r.team.length,teamPow(r));return {el:r.world,hp:es.hp*(e.waves||1),atk:es.atk,def:es.def}}
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
  if(b.waves>1){b.waves--;var es=enemyStats(b.enemy.L,false,r.team.length,teamPow(r));
    b.enemy={n:'Reforç: '+MONSTERS[b.enemy.el],el:b.enemy.el,hp:es.hp,max:es.hp,atk:es.atk,def:es.def,L:b.enemy.L};b.st={burn:null,poison:null,stun:0,soak:0,weak:0};
    ev.push({t:'wave',txt:'Arriba un altre monstre! Onada '+(b.wavesTotal-b.waves+1)+' de '+b.wavesTotal+'.',name:b.enemy.n,max:es.hp});return false}
  b.over='win';ev.push({t:'foeDown',txt:b.enemy.n+' ha perdut!'});return true;
}
function battleTick0(){
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
function scheduleTick0(){
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
function updateStatus0(){
  var r=run(),b=r&&r.event;if(!b||b.type!=='battle')return;var f=$('foe-st'),t=$('team-st');
  if(f){var s=[];if(b.st.burn)s.push('<span class="stchip burn">Cremat '+b.st.burn.t+'</span>');if(b.st.poison)s.push('<span class="stchip poison">Enverinat '+b.st.poison.t+'</span>');
    if(b.st.stun)s.push('<span class="stchip stun">Atordit</span>');if(b.st.soak>0)s.push('<span class="stchip soak">Mullat '+b.st.soak+'</span>');if(b.st.weak>0)s.push('<span class="stchip weak">Debilitat '+b.st.weak+'</span>');
    if(b.enemy.enraged)s.push('<span class="stchip burn">Enfadat</span>');f.innerHTML=s.join('')}
  if(t){var q=[];if(b.shield>0)q.push('<span class="stchip good">Escut '+b.shield+'</span>');if(b.tm.buff>0)q.push('<span class="stchip good">Ànims '+b.tm.buff+'</span>');
    if(b.tm.regen&&b.tm.regen.t>0)q.push('<span class="stchip good">Regeneració '+b.tm.regen.t+'</span>');
    Object.keys(b.tm.reflect).forEach(function(u){if(b.tm.reflect[u]>0&&byUid(u))q.push('<span class="stchip good">Mirall: '+esc(cName(byUid(u)))+'</span>')});t.innerHTML=q.join('')}
  var sh=$('shield');if(sh)sh.classList.toggle('on',b.shield>0);
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
function battleWon0(){
  var r=run(),b=r.event,L=b.enemy.L||1;
  if(b.enemy.final){r.coins+=60+20*Math.round(L);r.event={type:'card',kind:'item',item:pickOne(RELICS),why:'El guardià deixa caure un tresor rar. +'+(60+20*Math.round(L))+' monedes.',last:true};return}
  if(b.enemy.wild){recruitCard(b.enemy.wild,b.rare);return}
  if(b.enemy.guardian)r.coins+=60;
  if(b.win){applyEffect(b.win);return}
  r.event={type:'card',kind:'coins',n:Math.round((15+10*L)*(teamTalent('tresor')?1.5:1)),why:'Has guanyat la batalla!'};
}
function finishRun(ok,keepAll){
  var r=run();if(!r)return;stopBattle();
  var z=r.zone||0,bonus=ok?ZONE_BONUS[z]:0,coins=ok||keepAll?r.coins+bonus:Math.floor(r.coins/2);
  G.coins+=coins;
  var spa=G.built.spa?2:1,tired=[];
  G.owned.forEach(function(c){
    if(r.team.indexOf(c.uid)>=0){c.fat++;if(c.fat>=maxFat(c)){c.fat=maxFat(c);c.rest=maxFat(c);tired.push(cName(c))}}
    else if(!busyWorld(c)){if(c.rest>0){c.rest=Math.max(0,c.rest-spa);if(!c.rest)c.fat=0}else c.fat=Math.max(0,c.fat-spa)}
  });
  var tennis=null;
  if(G.built.tennis){var home=G.owned.filter(function(c){return r.team.indexOf(c.uid)<0&&!busyWorld(c)&&c.mill<5});if(home.length){var t=pickOne(home);t.mill++;tennis=cName(t)}}
  var unlocked=false,before=maxTeam();
  if(ok){G.completed++;G.done[r.world+':z'+z]=true;if(G.completed>=3&&!G.psiquic){G.psiquic=true;unlocked=true}}
  G.summary={ok:ok,keepAll:!!keepAll,coins:coins,bonus:bonus,world:r.world,zone:z,tired:tired,unlocked:unlocked,tennis:tennis,pct:0,bigger:maxTeam()>before?maxTeam():0};
  delete G.runs[r.world];G.active=null;G.screen='resum';G.summary.pct=worldPct(r.world);
}
function worldPct(w){
  var sps=speciesOf(w),own=sps.filter(ownsSp).length,sc=worldScenes(w),seen=sc.filter(function(id){return G.seen[w]&&G.seen[w][id]}).length,z=[0,1,2].filter(function(i){return G.done[w+':z'+i]}).length;
  return Math.round(40*own/sps.length+10*z+30*seen/sc.length);
}

/* ---------- screens ---------- */
function scMon(){
  var w=G.world,A=ELS[w],r=G.runs[w],pct=worldPct(w),sps=speciesOf(w),sc=worldScenes(w),seen=sc.filter(function(id){return G.seen[w]&&G.seen[w][id]}).length;
  var spsH=sps.map(function(s){var own=ownsSp(s);return '<div class="box'+(own?'':' off')+'">'+spArt(s,'',44,!own)+(own?esc(SPECIES[s].n):'???')+'</div>'}).join('');
  var body;
  if(r)body='<div class="flat"><h3>Tens una aventura a mitges aquí</h3><p class="muted">'+esc(ZONES[w][r.zone||0])+' · lloc '+(r.i+1)+' de '+r.slots.length+(r.cave?', dins una cova':'')+'.</p><div class="row"><button type="button" class="btn green" data-act="resume" data-w="'+w+'">Continua</button><button type="button" class="btn light sm" data-act="abandon" data-w="'+w+'">'+(abandonArm===w?'Segur? Toca un altre cop':'Abandona-la')+'</button></div></div>';
  else body=ZONES[w].map(function(zn,i){var open=zoneOpen(w,i),done=G.done[w+':z'+i];
    return '<button type="button" class="opt" data-act="path" data-p="'+i+'"'+(open?'':' disabled')+'><b>Zona '+(i+1)+': '+esc(zn)+(done?' ✓':'')+'</b><span class="d">'+starStr(starsN(zoneL(w,i)))+' · '+ZONE_ROUTES[i].length+' llocs</span><span class="d">'+esc(ZONE_INFO[i])+'</span>'+(i===2?'<span class="need">Cal portar: '+esc(TALENT[ZONE_NEED[w]].n)+'</span>':i===1?'<span class="d">Recomanat: '+esc(TALENT[ZONE_REC[w]].n)+'</span>':'')+(open?'':'<span class="need">Tancada: acaba primer la zona '+i+'</span>')+'</button>'}).join('');
  return '<div class="flat" style="background:'+A.c+';color:'+(w==='llamp'?'#1E1B2E':'#fff')+'"><div class="row"><button type="button" class="btn sm light" data-act="nav" data-to="explorar">Enrere</button><h1>'+esc(A.mon)+'</h1></div>'+
    '<p>Explorat: <b>'+pct+'%</b> · Llocs vistos '+seen+' de '+sc.length+' · Bestioles '+sps.filter(ownsSp).length+' de '+sps.length+'</p><p>Aquí hi viuen bestioles de '+esc(A.n.toLowerCase())+'. Els monstres resisteixen el seu propi element. Consell: porta bestioles de '+esc(goodAgainst(w))+'.</p></div>'+
    tip('mon','Cada món té 3 zones. Quan acabes una zona, s’obre la següent. Les estrelles ★ diuen com és de difícil.')+
    '<h3>Bestioles d’aquest món</h3><div class="grid4">'+spsH+'</div>'+body;
}
function teamSummary(){
  var list=G.pick.map(byUid),n=roleCounts(list),miss=['Atac','Defensa','Curador'].filter(function(r){return !n[r]}),on=synergies(list),chips=synChips(on);
  var act=SYN.filter(function(s){return on[s.k]});
  return '<div class="flat" style="gap:6px"><div class="row" style="gap:6px"><b>El teu equip:</b>'+['Atac','Defensa','Curador'].map(function(r){return roleTag(r,true)+'<b>'+n[r]+'</b>'}).join(' ')+'</div>'+
    (G.pick.length&&miss.length?'<p class="muted small">Consell: un equip amb un de cada rol aguanta més. Et falta: '+esc(miss.map(function(r){return ROLE_LABEL[r]}).join(', '))+'.</p>':'')+
    '<div class="row" style="gap:6px"><b>Sinergies:</b>'+(chips||'<span class="muted small">cap encara</span>')+'</div>'+
    (act.length?act.map(function(s){return '<p class="small"><b>'+esc(s.n)+':</b> '+esc(s.d)+'</p>'}).join(''):'<p class="muted small">Prova de portar Aigua i Llamp, Foc i Planta, o un tanc i un curador junts.</p>')+'</div>';
}
function scEquip(){
  var w=G.world,z=G.zone||0,mx=maxTeam(),nx=nextTeamAt();
  var rows=G.owned.map(function(c){
    var bw=busyWorld(c),blocked=!!bw||c.rest>0,on=G.pick.indexOf(c.uid)>=0,m=mult(sp(c).el,w),adv=m>1?'<span class="tag good">Avantatge aquí</span>':m<1?'<span class="tag bad">'+(m===0.75?'Resisteixen el seu element':'Desavantatge aquí')+'</span>':'';
    var left=c.rest>0?0:Math.round((maxFat(c)-c.fat)*100/maxFat(c));
    return '<button type="button" class="tap'+(on?' sel':'')+'" data-act="pick" data-u="'+c.uid+'"'+(blocked?' disabled':'')+' aria-pressed="'+on+'" style="flex-direction:row;justify-content:flex-start;gap:10px;padding:8px">'+cArt(c,48)+
      '<span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:3px;text-align:left"><span class="row" style="gap:6px"><b style="font-size:15px">'+esc(cName(c))+'</b>'+adv+'</span><span class="row" style="gap:6px">'+roleTag(sp(c).role)+'<span class="muted small">'+esc(ELS[sp(c).el].n+' · nivell '+lvl(c)+' · '+abilities(c).length+' habilitats')+'</span>'+talentTag(sp(c).talent)+'</span>'+bar(left,hpColor(left))+'<span class="muted small">'+esc(fatigueText(c))+'</span></span>'+(on?'<b style="color:var(--accent)">✓</b>':'')+'</button>'}).join('');
  return '<div class="row"><button type="button" class="btn sm light" data-act="world" data-w="'+w+'">Enrere</button><div><div class="muted small">'+esc(ELS[w].mon)+' · '+esc(ZONES[w][z])+' '+starStr(starsN(zoneL(w,z)))+'</div><h1>Tria l’equip</h1></div></div>'+
    tip('equip','El teu personatge sempre hi va. Toca les bestioles per triar-les. Algunes combinacions tenen sinergies i atacs combinats.')+
    '<p class="muted">Triades: <b>'+G.pick.length+' de '+mx+'</b>'+(nx?' · Quan facis '+nx+' expedicions en podràs portar '+(mx+1):'')+'</p><div style="display:flex;flex-direction:column;gap:10px">'+rows+'</div>'+
    teamSummary()+needBlock()+'<button type="button" class="btn green" data-act="go"'+(G.pick.length&&needOk()?'':' disabled')+'>Surt a explorar</button>';
}
function routeStrip(r){
  return '<div class="route" aria-label="El camí: lloc '+(r.i+1)+' de '+r.slots.length+'">'+r.slots.map(function(s,i){
    var cls=i<r.i?'node done':i===r.i?'node cur':'node',bg=i<=r.i?' style="background:'+ELS[r.world].c+(r.world==='llamp'?';color:#1E1B2E':'')+'"':'';
    var show=i<=r.i||i<=(r.reveal||0)||(teamTalent('volador')&&i<=r.i+2)||s.k==='guardian'||s.k==='spring'||s.k==='mini';
    return (i?'<span class="link'+(i<=r.i?' done':'')+'"></span>':'')+'<span class="'+cls+'"'+bg+'>'+(show?NODE_ICON[s.k]||'·':'?')+'</span>'}).join('')+'</div>';
}
function scRun(){
  var r=run();if(!r){G.screen='explorar';return scExplorar()}
  var head='<div class="flat"><div class="row between"><h3>'+esc(ZONES[r.world][r.zone||0])+' · lloc '+(r.i+1)+' de '+r.slots.length+'</h3>'+starStr(starsN(r.L))+'</div>'+
    (r.cave?'<p class="small"><b>Dins la cova · nivell '+r.cave.lvl+' de 3 · sala '+(r.cave.i+1)+' de '+r.cave.list.length+'</b> '+(teamTalent('cova')?'<span class="tag good">L\u2019Espele\u00f2leg fa llum: +20% de mal</span>':'<span class="tag bad">Fa fosc: \u221220% de mal. Porta un Espele\u00f2leg!</span>')+'</p>':'')+(r.bless?'<span class="syn">Benedicció activa</span>':'')+routeStrip(r)+'</div>';
  var e=r.event,body='',showTeam=true;
  if(e&&e.type==='battle')head='<div class="row between small" style="font-weight:800"><span>'+esc(ZONES[r.world][r.zone||0])+' \u00b7 lloc '+(r.i+1)+' de '+r.slots.length+'</span>'+starStr(starsN(r.L))+'</div>';
  if(!e)body='';
  else if(e.type==='battle'){showTeam=false;body=battleStage(r,e)}
  else if(e.type==='scene'){var S=SCENES[r.scene],N=S.nodes[r.node],txt=N.t.replace('{riu}',ELS[r.world].w.riu).replace('{arbres}',ELS[r.world].w.arbres);
    body='<div class="scene">'+sceneArt(S.art,r.world)+'<span class="label">'+esc(S.n)+(N.secret?' · secret!':'')+'</span>'+crew(r)+'</div>'+
      '<div class="event"><p style="font-size:16px">'+esc(txt)+'</p><p class="muted small">Què fas? Toca una opció.</p>'+N.ch.map(function(ch,i){
        var ok=!ch.req||teamHas(ch.req),dg='',fo=ch.out&&(ch.out.fight?ch.out:ch.out.rand?null:null);
        if(fo){var d0=danger(sampleEnemy(fo));dg=' <span class="tag '+d0.cls+'">'+esc(d0.t)+'</span>'}
        if(ch.out&&(ch.out.shop||ch.out.buyFood||ch.out.price)&&teamTalent('mercat'))dg+=' <span class="tag good">Regatejador: meitat de preu</span>';
        return '<button type="button" class="opt" data-act="choice" data-i="'+i+'"'+(ok?'':' disabled')+'><b>'+esc(ch.l)+'</b>'+(ch.d?'<span class="d">'+esc(ch.d)+'</span>':'')+'<span>'+riskHtml(ch.risk)+dg+'</span>'+(ok?'':'<span class="need">'+esc(reqText(ch.req))+'</span>')+'</button>'}).join('')+'</div>';}
  else if(e.type==='fork'){var s=r.slots[r.i];
    body='<div class="event"><h2>Una cruïla</h2><p>El camí es divideix. On vols anar?</p><div class="grid2">'+s.opts.map(function(id){var S=SCENES[id];return '<button type="button" class="tap" data-act="fork" data-s="'+id+'" style="padding:6px;gap:6px"><span style="width:100%;border-radius:12px;overflow:hidden;line-height:0">'+sceneArt(S.art,r.world)+'</span><span style="font-size:15px">'+esc(S.n)+'</span></button>'}).join('')+'</div></div>';}
  else if(e.type==='guardianPre'||e.type==='miniPre'){var fin=e.type==='guardianPre',gname=fin?'Guardià de '+ZONES[r.world][r.zone||0]:'Campament de monstres',
      ge=makeBattle({el:r.world,L:r.L+(fin?0.6:0.3),guardian:fin,final:fin,n:gname,waves:fin?1:2}).enemy,d1=danger(fin?ge:{el:ge.el,hp:ge.hp*2,atk:ge.atk,def:ge.def});
    body='<div class="scene">'+sceneArt(fin?'guardian':'tent',r.world)+'<span class="label">'+(fin?'Final de la zona':'Campament de monstres')+'</span><div style="position:absolute;right:20px;bottom:6px;line-height:0">'+monster(r.world,96,fin)+'</div>'+crew(r)+'</div>'+
      '<div class="event"><h2>'+esc(gname)+'</h2><p>'+starStr(starsN(ge.L))+' <span class="tag '+d1.cls+'">'+esc(d1.t)+'</span>'+(ge.resist?' <span class="tag">Resisteix '+esc(ELS[ge.resist].n)+'</span>':'')+'</p>'+
      (ge.bossD?'<p><b>Habilitats:</b> '+esc(ge.bossD)+'</p>':'')+(fin?'<p class="muted">Si el guanyes, acabes la zona i guanyes un tresor rar. A la meitat de la vida s’enfada i fa més mal.</p><button type="button" class="opt" data-act="gfight"><b>Lluita contra el guardià</b><span>'+riskHtml(2)+'</span></button><button type="button" class="opt" data-act="gleave"><b>Torna a casa ara</b><span class="d">Et quedes totes les monedes, però la zona no compta com a acabada.</span><span>'+riskHtml(0)+'</span></button>':
        '<p class="muted">Hi ha 2 monstres: quan en guanyes un, arriba l’altre.</p><button type="button" class="opt" data-act="mfight"><b>Ataca el campament</b><span class="d">Si guanyes: 40 monedes i un objecte.</span><span>'+riskHtml(2)+'</span></button><button type="button" class="opt" data-act="mleave"><b>Fes una volta llarga</b><span class="d">L’equip es cansa i perd una mica de vida.</span><span>'+riskHtml(0)+'</span></button>')+'</div>';}
  else if(e.type==='wild'){var sw=SPECIES[e.sp],own=ownsSp(e.sp),hasFood=(G.food[sw.el]||0)>0,we=makeBattle({wild:e.sp,L:r.L+(e.rare?1:0)}).enemy,d2=danger(we);
    body='<div class="scene">'+sceneArt(r.cave?'tunnels':'meadow',r.world)+'<span class="label">'+(e.rare?'Una bestiola rara!':'Una bestiola salvatge')+'</span><div style="position:absolute;right:30px;bottom:8px;line-height:0">'+spArt(e.sp,'',90,!own)+'</div>'+crew(r)+'</div>'+
      '<div class="event"><p>'+(own?'És una '+esc(sw.n)+'. Ja en tens una.':'No l’has vista mai.')+' '+roleTag(sw.role)+' '+talentTag(sw.talent)+' Vols que vingui amb tu?</p>'+
      '<button type="button" class="opt" data-act="wfight"><b>Lluita per fer-te’n amic</b><span class="d">Si guanyes, s’uneix a tu.</span><span>'+riskHtml(1)+' <span class="tag '+d2.cls+'">'+esc(d2.t)+'</span></span></button>'+
      '<button type="button" class="opt" data-act="wfeed"'+(hasFood?'':' disabled')+'><b>Dona-li '+esc(FOOD[sw.el])+'</b><span class="d">S’uneix segur, sense lluitar.</span><span>'+riskHtml(0)+'</span>'+(hasFood?'<span class="d">En tens '+G.food[sw.el]+'</span>':'<span class="need">No en tens. En trobaràs pel camí.</span>')+'</button>'+
      '<button type="button" class="opt" data-act="skip"><b>Deixa-la tranquil·la</b><span>'+riskHtml(0)+'</span></button></div>';}
  else if(e.type==='note')body='<div class="event"><h2>'+esc(e.title||'D’acord')+'</h2><p>'+esc(e.text)+'</p><button type="button" class="btn green" data-act="next">Continua</button></div>';
  else if(e.type==='card'){body=bigCard(e);showTeam=false}
  var leave=e&&e.type==='battle'?'':'<div class="row"><button type="button" class="btn light sm" data-act="pause">Surt i guarda</button><button type="button" class="btn light sm" data-act="restart">'+(restartArm?'Segur? Toca un altre cop':'Torna a començar la zona')+'</button><button type="button" class="btn light sm" data-act="abandon" data-w="'+r.world+'">'+(abandonArm===r.world?'Segur? Toca un altre cop':'Abandona')+'</button></div>';
  return head+tip('run','Les boles de dalt són el camí: la que es mou és on ets. Les opcions amb fletxa ▸ es poden tocar. Els punts vermells diuen el risc.')+body+(showTeam?teamMini(r):'')+leave;
}
function battleStage(r,b){
  var en=b.enemy,p=Math.round(en.hp*100/en.max),d=danger(en);
  var art=en.wild?spArt(en.wild,'',76):monster(en.el,76,en.guardian);
  var weak=Object.keys(BEATS).filter(function(k){return BEATS[k].indexOf(en.el)>=0}).map(function(k){return ELS[k].n}).join(', ');
  var res='';
  if(playing){}
  else if(b.over==='win')res='<div class="event result" style="color:var(--ink)"><h2>Heu guanyat!</h2><button type="button" class="btn green" data-act="bwin">Continua</button></div>';
  else if(b.over==='lose')res=en.wild?'<div class="event result" style="color:var(--ink)"><h2>Heu perdut</h2><p>La bestiola salvatge marxa corrents. Les bestioles KO es desperten amb una mica de vida i seguiu el camí.</p><button type="button" class="btn" data-act="blose">Continua</button></div>':
    '<div class="event result" style="color:var(--ink)"><h2>Heu perdut</h2><p>Podeu tornar a començar la zona amb tota la vida, o tornar a casa amb la meitat de les monedes.</p><button type="button" class="btn green" data-act="restartNow">Torna a començar la zona</button><button type="button" class="btn light" data-act="blose">Torna a casa</button></div>';
  var order=r.team.slice().sort(function(a,z){var ra=byUid(a),rz=byUid(z);return (ra&&sp(ra).role==='Defensa'?0:1)-(rz&&sp(rz).role==='Defensa'?0:1)});
  return tip('battle','La batalla va sola. Cada bestiola té 2 o 3 habilitats que es carreguen a velocitats diferents (les barres grogues) i les fa soles. Si dues bestioles d’elements diferents tenen un atac a punt alhora, fan un ATAC COMBINAT.')+
    '<div class="stage" id="stage"><div class="banner" id="banner"></div>'+
    '<div class="foe"><div class="foe-art" id="foe-art">'+art+'</div><div class="foe-info"><h2 id="foe-name">'+esc(en.n)+'</h2><div>'+starStr(starsN(en.L))+' <span class="tag" style="background:'+ELS[en.el].c+';color:'+(en.el==='llamp'?'#1E1B2E':'#fff')+'">'+esc(ELS[en.el].n)+'</span>'+(b.wavesTotal>1?' <span class="tag">Onada '+(b.wavesTotal-b.waves+1)+' de '+b.wavesTotal+'</span>':'')+'</div>'+
    '<span class="small">Feble a: <b>'+esc(weak)+'</b>'+(en.resist?' · Resisteix: <b>'+esc(ELS[en.resist].n)+'</b>':'')+'</span><span class="tag '+d.cls+'" style="align-self:flex-start">'+esc(d.t)+'</span>'+bar(p,hpColor(p),'foe-hp')+'<span class="small" id="foe-hpt">'+en.hp+'/'+en.max+'</span><div class="stchips" id="foe-st"></div><span class="warn" id="warn">'+(b.warn==='area'?'Prepara un ATAC A TOTHOM!':'Prepara un COP FORT!')+'</span></div></div>'+
    '<div class="caption" id="caption" aria-live="polite">'+esc(b.caption||'')+'</div>'+
    '<div class="row" style="gap:6px">'+synChips(b.syn)+'</div><div class="ab-row"><span style="color:#fff">Atac de tot l\u2019equip</span><div class="charge"><i id="team-meter"></i></div></div><div class="stchips" id="team-st"></div>'+
    '<div class="squad" id="squad" style="grid-template-columns:repeat('+Math.min(3,order.length)+',minmax(0,1fr))"><div class="shield" id="shield"></div>'+order.map(function(u){var c=byUid(u);if(!c)return '';var mx=stats(c).hp,pp=Math.round(r.hp[u]*100/mx),front=sp(c).role==='Defensa';
      return '<div class="mem'+(r.hp[u]<=0?' ko':'')+'" id="m-'+u+'"'+(front?' style="outline:3px solid #2E6BC6"':'')+'>'+(front?'<span class="tag" style="background:#2E6BC6;color:#fff">Davant</span>':'')+cArt(c,36)+'<span>'+esc(cName(c))+'</span>'+roleTag(sp(c).role,true)+bar(pp,hpColor(pp),'hp-'+u)+'<span class="small" id="hp-'+u+'t">'+r.hp[u]+'/'+mx+'</span>'+
        abilities(c).map(function(a){return '<div class="ab-row"><span>'+esc(a.n)+'</span><div class="charge"><i id="ch-'+u+'-'+a.i+'"></i></div></div>'}).join('')+'</div>'}).join('')+'</div>'+res+'</div>';
}
function detailSheet(){
  var s=G.detail,S=SPECIES[s],mine=G.owned.filter(function(c){return c.sp===s}),own=mine.length>0;
  var evoOwned={};mine.forEach(function(c){if(c.stage)evoOwned[c.evo]=true});
  function node(i){var e=i<0?{n:S.n,el2:''}:S.evos[i],ok=i<0?own:!!evoOwned[i];
    return '<div class="box'+(ok?'':' off')+'" style="padding:8px">'+spArt(s,e.el2,52,!ok,i>=0)+(ok?esc(e.n):'???')+'<span class="muted small" style="text-align:center">'+(i<0?'Nivell 1':i===0?'Nivell 2':'Nivell 3')+' · '+esc(ELS[S.el].n+(e.el2?' + '+ELS[e.el2].n:''))+'</span></div>'}
  var line='<svg width="40" height="20" viewBox="0 0 40 20" aria-hidden="true"><path d="M20 0 V20" stroke="#B9B3C6" stroke-width="3"/></svg>';
  var fork='<svg width="200" height="22" viewBox="0 0 200 22" aria-hidden="true" style="max-width:70%"><path d="M100 0 V8 M50 8 H150 M50 8 V22 M150 8 V22" stroke="#B9B3C6" stroke-width="3" fill="none"/></svg>';
  var evos='<div class="tree"><div class="lvl">'+node(-1)+'</div>'+line+'<div class="lvl">'+node(0)+'</div>'+fork+'<div class="lvl">'+node(1)+node(2)+'</div></div>';
  var best=mine.sort(function(a,z){return z.stage-a.stage})[0],have=best?abilities(best).length:0;
  var abil='<div class="flat" style="background:var(--soft);gap:6px"><h3>Habilitats</h3>'+(ABIL[s]||[]).map(function(a,i){var open=own&&i<have;
    return '<div style="display:flex;flex-direction:column;gap:1px;'+(open?'':'opacity:.6')+'"><b>'+esc(a[0])+' <span class="muted small">· cada '+a[1]+' torns</span></b><span class="small">'+esc(KIND_DESC[a[2]])+'</span>'+(open?'':'<span class="muted small">'+(i===2?'S’obre al nivell 2 (primera evolució).':'S’obre quan la tinguis.')+'</span>')+'</div>'}).join('')+'<p class="muted small">Al nivell 3, les habilitats fan més efecte.</p></div>';
  var inst=mine.map(function(c){var st=stats(c),full=c.mill>=5;
    var foods=Object.keys(G.food).filter(function(k){return G.food[k]>0}).map(function(k){return '<button type="button" class="btn sm light" data-act="feed" data-u="'+c.uid+'" data-el="'+k+'"'+(full?' disabled':'')+'>'+esc(FOOD[k])+' ('+G.food[k]+') '+(k===S.el?'+2':'+1')+'</button>'}).join('');
    var opts=c.stage===0?[0]:c.stage===1?[1,2]:[];
    var evoBtns=full&&opts.length?'<p><b>'+(opts.length>1?'Pot evolucionar! Tria la branca:':'Pot evolucionar!')+'</b></p><div class="grid2">'+opts.map(function(i){var e=S.evos[i];return '<button type="button" class="tap" data-act="evolve" data-u="'+c.uid+'" data-i="'+i+'">'+spArt(s,e.el2,52,false,true)+esc(e.n)+'<span class="muted small" style="text-align:center">'+(e.el2?'70% '+esc(ELS[S.el].n)+' + 30% '+esc(ELS[e.el2].n):esc(ELS[S.el].n))+'</span></button>'}).join('')+'</div>':'';
    return '<div class="flat" style="background:var(--soft)"><div class="row" style="gap:10px">'+cArt(c,58)+'<div style="flex:1;min-width:0"><b style="font-size:16px">'+esc(cName(c))+'</b> <span class="muted small">nivell '+lvl(c)+'</span><div class="muted small">Vida '+st.hp+' · Atac '+st.atk+' · Defensa '+st.def+(st.heal?' · Cura '+st.heal:'')+'</div><div class="muted small">'+esc(fatigueText(c))+'</div></div></div>'+
      '<div class="row between small" style="font-weight:800"><span>Estrelles de força</span><span>'+Math.min(c.mill,5)+' de 5</span></div>'+bar(Math.min(c.mill,5)*20,ELS[S.el].c)+
      (full?(c.stage>=2?'<p class="muted small">Ja té totes les estrelles.</p>':''):(foods?'<p class="muted small">Dona-li menjar per guanyar estrelles. El menjar del seu element en dona 2.</p><div class="row">'+foods+'</div>':'<p class="muted small">No tens menjar. En trobaràs pel camí.</p>'))+evoBtns+'</div>'}).join('');
  var adopt='';
  if(!own){var open=worldOpen(S.el);
    adopt=open?'<button type="button" class="btn gold" data-act="adopt" data-s="'+s+'"'+(G.coins<S.price||G.owned.length>=cap()?' disabled':'')+'>Adopta-la · '+S.price+' monedes</button>'+(G.owned.length>=cap()?'<p class="muted">La casa és plena.</p>':G.coins<S.price?'<p class="muted">No tens prou monedes (en tens '+G.coins+').</p>':''):'<p class="flat" style="background:var(--soft)">Primer has de descobrir aquest món.</p>';}
  return '<div class="modal" data-act="closeBg"><div class="sheet" role="dialog" aria-label="Fitxa de la bestiola" data-s="'+s+'"><div class="row" style="gap:12px;align-items:flex-start"><div style="background:'+(own?ELS[S.el].soft:'#E9E5F0')+';border-radius:20px;padding:6px">'+spArt(s,'',90,!own)+'</div><div style="flex:1;min-width:0"><h1>'+(own?esc(S.n):'???')+'</h1><div class="muted">'+(own?esc(ELS[S.el].n):'Encara no l’has trobada')+'</div><div class="muted">Viu al '+esc(worldOpen(S.el)?ELS[S.el].mon.replace('Món ','món '):'món desconegut')+'</div></div><button type="button" class="btn sm light" data-act="close">Tanca</button></div>'+
    '<div class="row" style="gap:8px;align-items:flex-start">'+roleTag(S.role)+'<p class="small" style="flex:1;min-width:0">'+esc(ROLE_DESC[S.role])+'</p></div>'+'<div class="row" style="gap:8px;align-items:flex-start">'+talentTag(S.talent)+'<p class="small" style="flex:1;min-width:0">'+esc(TALENT[S.talent].d)+'</p></div>'+
    inst+adopt+abil+'<h3>Arbre d’evolucions</h3>'+evos+megaBlock(s)+'</div></div>';
}

/* ================= V8: 40 critters, shapes, explorer talents ================= */
function critter(el,el2,px,locked,evolved,shape){
  var A=ELS[el]||ELS.foc,B=ELS[el2];
  function on(k){return k===el||k===el2}
  var o='',ex1=25,ex2=39,ey=38,er=5.5,pr=2.8,body,mouth;
  if(evolved)o+='<ellipse cx="32" cy="41" rx="29" ry="24" fill="none" stroke="#FFD54A" stroke-width="2.5" stroke-dasharray="3 4"/>';
  if(on('foc'))o+='<path d="M22 24 C19 14 27 12 26 3 C33 8 35 12 34 17 C37 13 41 13 41 7 C47 15 45 21 41 25 Z" fill="#FFB238"/>';
  if(on('aigua'))o+='<path d="M24 25 Q32 3 42 25 Z" fill="#7CC0FF"/>';
  if(on('planta'))o+='<path d="M32 24 L32 11" stroke="#2E7D45" stroke-width="3" stroke-linecap="round"/><path d="M32 13 Q21 4 18 12 Q25 18 32 13 Z" fill="#7BD389"/><path d="M32 13 Q43 4 46 12 Q39 18 32 13 Z" fill="#7BD389"/>';
  if(on('llamp'))o+='<path d="M17 30 L11 9 L20 17 L22 6 L29 24 Z" fill="#E09A00"/><path d="M47 30 L53 9 L44 17 L42 6 L35 24 Z" fill="#E09A00"/>';
  if(on('psiquic'))o+='<path d="M32 24 L32 10" stroke="#6B2FB3" stroke-width="2.5" stroke-linecap="round"/><circle cx="32" cy="8" r="5" fill="#F0C3FF" stroke="#6B2FB3" stroke-width="2"/>';
  var round='<ellipse cx="32" cy="41" rx="23" ry="19" fill="'+A.c+'"/><ellipse cx="32" cy="48" rx="13" ry="9" fill="'+A.belly+'"/>';
  switch(shape){
    case 'tall':body='<ellipse cx="32" cy="40" rx="17" ry="23" fill="'+A.c+'"/><ellipse cx="32" cy="51" rx="10" ry="9" fill="'+A.belly+'"/>';ex1=26;ex2=38;ey=34;break;
    case 'long':body='<path d="M52 48 Q63 40 60 28" stroke="'+A.c+'" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="30" cy="46" rx="26" ry="14" fill="'+A.c+'"/><ellipse cx="30" cy="52" rx="15" ry="6" fill="'+A.belly+'"/>';ex1=20;ex2=33;ey=42;break;
    case 'spiky':body='<path d="M9 42 L3 31 L14 33 L11 20 L22 26 L25 13 L32 23 L39 13 L42 26 L53 20 L50 33 L61 31 L55 42 Z" fill="'+A.c+'" stroke="#2A1F3D" stroke-width="1.5" opacity=".8"/>'+round;break;
    case 'tiny':body='<ellipse cx="32" cy="46" rx="17" ry="15" fill="'+A.c+'"/><ellipse cx="32" cy="52" rx="9" ry="6" fill="'+A.belly+'"/>';ex1=25;ex2=39;ey=43;er=7;pr=3.6;break;
    case 'blocky':body='<rect x="10" y="22" width="44" height="38" rx="11" fill="'+A.c+'"/><rect x="20" y="44" width="24" height="12" rx="6" fill="'+A.belly+'"/>';break;
    case 'wing':body='<ellipse cx="10" cy="36" rx="10" ry="17" fill="'+A.belly+'" stroke="'+A.c+'" stroke-width="2" transform="rotate(-25 10 36)"/><ellipse cx="54" cy="36" rx="10" ry="17" fill="'+A.belly+'" stroke="'+A.c+'" stroke-width="2" transform="rotate(25 54 36)"/>'+round;break;
    case 'snail':body='<ellipse cx="28" cy="52" rx="24" ry="9" fill="'+A.c+'"/><circle cx="40" cy="36" r="16" fill="'+A.belly+'" stroke="'+A.c+'" stroke-width="3"/><path d="M40 36 m-2 0 a2 2 0 1 1 4 0 a5 5 0 1 1 -9 0 a8 8 0 1 1 16 0" stroke="'+A.c+'" stroke-width="2.5" fill="none"/><path d="M14 46 L10 32 M22 46 L22 31" stroke="'+A.c+'" stroke-width="3" stroke-linecap="round"/>';ex1=10;ex2=22;ey=31;er=4.5;pr=2.3;break;
    default:body=round;
  }
  var spots=B?'<circle cx="14" cy="38" r="4" fill="'+B.c+'"/><circle cx="50" cy="44" r="4.5" fill="'+B.c+'"/><circle cx="45" cy="29" r="3" fill="'+B.c+'"/>':'';
  var horns=evolved?'<path d="M16 30 L10 22 L20 27 Z M48 30 L54 22 L44 27 Z" fill="'+A.c+'"/>':'';
  var mx=(ex1+ex2)/2;mouth='<path d="M'+(mx-3)+' '+(ey+8)+' Q'+mx+' '+(ey+11)+' '+(mx+3)+' '+(ey+8)+'" stroke="#1E1B2E" stroke-width="2" fill="none" stroke-linecap="round"/>';
  return '<svg class="cr" width="'+px+'" height="'+px+'" viewBox="0 0 64 64" aria-hidden="true"'+(locked?' style="filter:brightness(0) opacity(.22)"':'')+'>'+(shape==='snail'?'':o)+horns+body+spots+
    '<circle cx="'+ex1+'" cy="'+ey+'" r="'+er+'" fill="#fff"/><circle cx="'+ex2+'" cy="'+ey+'" r="'+er+'" fill="#fff"/><circle cx="'+(ex1+1)+'" cy="'+(ey+1)+'" r="'+pr+'" fill="#1E1B2E"/><circle cx="'+(ex2+1)+'" cy="'+(ey+1)+'" r="'+pr+'" fill="#1E1B2E"/>'+mouth+'</svg>';
}
function cArt(c,px,locked){return critter(sp(c).el,cEl2(c),px,locked,!!c.stage,sp(c).shape)}
function spArt(s,el2,px,locked,evolved){var S=SPECIES[s];return critter(S.el,el2,px,locked,evolved,S.shape)}

Object.assign(SPECIES,{
  xurrufet:{n:'Xurrufet',el:'foc',role:'Atac',price:340,shape:'tiny',talent:'tresor',evos:[E('Petardet'),E('Traca'),E('Bengala','llamp')]},
  cremallot:{n:'Cremallot',el:'foc',role:'Defensa',price:420,shape:'snail',talent:'cova',evos:[E('Cargolava'),E('Fornal'),E('Cargol de vapor','aigua')]},
  fogonet:{n:'Fogonet',el:'foc',role:'Curador',price:360,shape:'blocky',talent:'mercat',evos:[E('Fogoner'),E('Cuiner'),E('Xef màgic','psiquic')]},
  dragonet:{n:'Dragonet',el:'foc',role:'Atac',price:480,shape:'wing',talent:'volador',evos:[E('Dragó'),E('Drac roig'),E('Drac de tempesta','llamp')]},
  fumerol:{n:'Fumerol',el:'foc',role:'Atac',price:400,shape:'tall',talent:'cacador',evos:[E('Xemeneia'),E('Volcanet'),E('Fumarola mística','psiquic')]},
  nedet:{n:'Nedet',el:'aigua',role:'Atac',price:360,shape:'long',talent:'nedador',evos:[E('Llúdriga'),E('Nedadora'),E('Llúdriga elèctrica','llamp')]},
  medusina:{n:'Medusina',el:'aigua',role:'Curador',price:400,shape:'tall',talent:'cova',evos:[E('Medusa'),E('Medusa reial'),E('Medusa de somni','psiquic')]},
  cranquet:{n:'Cranquet',el:'aigua',role:'Defensa',price:380,shape:'blocky',talent:'castell',evos:[E('Cranc'),E('Cranc guerrer'),E('Cranc de corall','planta')]},
  bombolli:{n:'Bombolli',el:'aigua',role:'Curador',price:340,shape:'tiny',talent:'volador',evos:[E('Bombollot'),E('Escuma'),E('Bombolla del temps','psiquic')]},
  popet:{n:'Popet',el:'aigua',role:'Atac',price:420,shape:'spiky',talent:'tresor',evos:[E('Pop'),E('Pop gegant'),E('Pop llampec','llamp')]},
  boleto:{n:'Boletó',el:'planta',role:'Curador',price:340,shape:'tall',talent:'bosc',evos:[E('Rovelló'),E('Bolet gegant'),E('Bolet somiador','psiquic')]},
  cucafera:{n:'Cucafera',el:'planta',role:'Atac',price:360,shape:'long',talent:'cova',evos:[E('Eruga'),E('Crisàlide'),E('Papallona de llum','llamp')]},
  punxetes:{n:'Punxetes',el:'planta',role:'Defensa',price:380,shape:'spiky',talent:'mercat',evos:[E('Cactus'),E('Nopal'),E('Cactus de foc','foc')]},
  bavos:{n:'Bavós',el:'planta',role:'Defensa',price:320,shape:'snail',talent:'tresor',evos:[E('Cargol'),E('Cargol bover'),E('Cargol de mar','aigua')]},
  endollet:{n:'Endollet',el:'llamp',role:'Atac',price:400,shape:'blocky',talent:'castell',evos:[E('Endoll'),E('Bateria'),E('Robot de somni','psiquic')]},
  brunzit:{n:'Brunzit',el:'llamp',role:'Atac',price:440,shape:'wing',talent:'volador',evos:[E('Colibrí'),E('Falcó tro'),E('Ocell de foc','foc')]},
  cuquet:{n:'Cuquet de llum',el:'llamp',role:'Curador',price:360,shape:'tiny',talent:'cova',evos:[E('Lluerna petita'),E('Fanalet'),E('Estel del bosc','planta')]},
  imantat:{n:'Imantat',el:'llamp',role:'Defensa',price:400,shape:'round',talent:'tresor',evos:[E('Imant'),E('Gran imant'),E('Imant calent','foc')]},
  nuvolet:{n:'Nuvolet',el:'llamp',role:'Atac',price:380,shape:'round',talent:'cacador',evos:[E('Núvol'),E('Nimbus'),E('Núvol de pluja','aigua')]},
  fantasmet:{n:'Fantasmet',el:'psiquic',role:'Atac',price:420,shape:'tall',talent:'castell',evos:[E('Espectre'),E('Fantasma reial'),E('Fantasma de foc','foc')]},
  mussolet:{n:'Mussolet',el:'psiquic',role:'Curador',price:400,shape:'wing',talent:'bosc',evos:[E('Mussol'),E('Òliba sàvia'),E('Òliba del bosc','planta')]},
  bolavidre:{n:'Bolavidre',el:'psiquic',role:'Defensa',price:440,shape:'round',talent:'mercat',evos:[E('Bola màgica'),E('Oracle'),E('Bola de tempesta','llamp')]},
  barretmagic:{n:'Barretmàgic',el:'psiquic',role:'Atac',price:460,shape:'blocky',talent:'tresor',evos:[E('Barret de copa'),E('Mag'),E('Mag de foc','foc')]},
  dormilega:{n:'Dormilega',el:'psiquic',role:'Defensa',price:400,shape:'long',talent:'nedador',evos:[E('Dorment'),E('Somiatruites gros'),E('Dormilega de llac','aigua')]}
});
[['espurnet','round','cacador'],['fumet','tall','tresor'],['brasa','spiky','cova'],['gotim','round','nedador'],['bufa','tiny','volador'],['petxina','snail','tresor'],
 ['brotet','round','bosc'],['molsa','round','bosc'],['pinyol','tiny','cacador'],['arrel','tall','castell'],['xispa','spiky','cova'],['trona','round','cacador'],
 ['guspira','tiny','mercat'],['mentoli','round','tresor'],['somni','tall','castell'],['ullet','round','cova']].forEach(function(x){SPECIES[x[0]].shape=x[1];SPECIES[x[0]].talent=x[2]});
SP_ORDER=['espurnet','fumet','brasa','xurrufet','cremallot','fogonet','dragonet','fumerol',
  'gotim','bufa','petxina','nedet','medusina','cranquet','bombolli','popet',
  'brotet','molsa','pinyol','arrel','boleto','cucafera','punxetes','bavos',
  'xispa','trona','guspira','endollet','brunzit','cuquet','imantat','nuvolet',
  'mentoli','somni','ullet','fantasmet','mussolet','bolavidre','barretmagic','dormilega'];
Object.assign(ABIL,{
  xurrufet:[['Petard',3,'hit',1.6],['Traca',5,'multi',0.8],['Castell de focs',8,'burn',2.0]],
  cremallot:[['Closca roent',4,'shield',1],['Bava calenta',5,'weaken',0.8],['Pell de magma',7,'reflect',1]],
  fogonet:[['Sopa calenta',3,'heal',1.6],['Torrades',5,'regen',0.07],['Banquet',8,'healAll',0.5]],
  dragonet:[['Alè de foc',3,'burn',1.4],['Picada en picat',5,'hit',1.9],['Tempesta de flames',8,'multi',1.0]],
  fumerol:[['Columna de fum',3,'weaken',1.2],['Guèiser',5,'hit',1.8],['Erupció',8,'burn',2.2]],
  nedet:[['Cua d’aigua',3,'hit',1.6],['Esquitxada',5,'soak',1.1],['Remolí veloc',7,'multi',0.9]],
  medusina:[['Llum de medusa',3,'heal',1.5],['Picada de medusa',5,'stun',0.9],['Marea calma',8,'healAll',0.5]],
  cranquet:[['Pinça forta',4,'shield',1],['Pessic',5,'stun',1.0],['Closca de perla',7,'reflect',1]],
  bombolli:[['Bombolla curativa',3,'heal',1.5],['Pluja de bombolles',5,'regen',0.08],['Bombolla escut',8,'shield',1]],
  popet:[['Tinta',3,'weaken',1.2],['Vuit braços',5,'multi',0.9],['Abraçada de pop',8,'stun',2.0]],
  boleto:[['Espores que curen',3,'heal',1.5],['Barret tou',5,'shield',1],['Cercle de bolets',8,'healAll',0.5]],
  cucafera:[['Mossegada',3,'hit',1.5],['Seda enganxosa',5,'stun',1.0],['Metamorfosi',8,'buff',1]],
  punxetes:[['Punxes',4,'reflect',1],['Pell gruixuda',5,'shield',1],['Pluja de punxes',7,'multi',0.8]],
  bavos:[['Closca',4,'shield',1],['Bava',5,'weaken',0.8],['Rodolada',7,'hit',2.0]],
  endollet:[['Calambre',3,'stun',1.1],['Curtcircuit',5,'hit',1.8],['Apagada',8,'weaken',1.8]],
  brunzit:[['Bec llamp',3,'hit',1.5],['Vol ràpid',5,'multi',0.85],['Llamp del cel',8,'stun',2.0]],
  cuquet:[['Llumeta',3,'heal',1.5],['Eixam de llum',5,'buff',1],['Nit estelada',8,'healAll',0.5]],
  imantat:[['Camp d’imants',4,'shield',1],['Atracció',5,'stun',0.9],['Rebot',7,'reflect',1]],
  nuvolet:[['Pluja elèctrica',3,'soak',1.2],['Tro',5,'hit',1.8],['Tempesta',8,'multi',1.0]],
  fantasmet:[['Esglai',3,'weaken',1.2],['Travessa parets',5,'hit',1.8],['Udol',8,'stun',2.0]],
  mussolet:[['Cançó de nit',3,'heal',1.5],['Mirada sàvia',5,'weaken',0.8],['Lluna plena',8,'healAll',0.5]],
  bolavidre:[['Vidre màgic',4,'shield',1],['Visió del futur',5,'buff',1],['Mirall trencat',7,'reflect',1]],
  barretmagic:[['Conill sorpresa',3,'hit',1.5],['Mocadors',5,'multi',0.8],['Truc final',8,'stun',2.0]],
  dormilega:[['Badall',4,'weaken',1.0],['Coixí',5,'shield',1],['Somni profund',7,'stun',1.5]]
});

var TALENT={
  cova:{n:'Espeleòleg',d:'Fa llum a les coves: allà, l’equip fa +20% de mal (sense llum, −20%), i hi ha opcions noves.'},
  bosc:{n:'Rastrejador',d:'Bo als boscos i prats: troba més menjar i nius de bestioles.'},
  castell:{n:'Clauer',d:'Bo als castells, ruïnes i altars: obre portes i cofres sense lluitar.'},
  mercat:{n:'Regatejador',d:'Amb els mercaders i botigues, tot costa la meitat.'},
  nedador:{n:'Nedador',d:'Bo als rius, llacs, cascades i vaixells: hi passa sense perill i troba tresors.'},
  volador:{n:'Volador',d:'Vola per sobre de trampes i ponts, i veu els 2 llocs següents del camí.'},
  tresor:{n:'Ensumatresors',d:'Troba més monedes: +50% a totes les monedes que trobeu.'},
  cacador:{n:'Caçaguardians',d:'Fa +30% de mal als guardians, als reis i als campaments.'}};
var ZONE_NEED={foc:'cova',aigua:'nedador',planta:'bosc',llamp:'volador',psiquic:'castell'};
var ZONE_NEED_WHY={foc:'Per entrar als túnels de lava cal un Espeleòleg.',aigua:'Per baixar a la fossa cal un Nedador.',planta:'Per trobar el camí dins el bosc cal un Rastrejador.',llamp:'La ciutat és als núvols: cal un Volador.',psiquic:'El palau té portes màgiques: cal un Clauer.'};
var ZONE_REC={foc:'castell',aigua:'nedador',planta:'cova',llamp:'tresor',psiquic:'volador'};
function talentTag(t){return t&&TALENT[t]?'<span class="syn" style="background:#6B2FB3" title="'+esc(TALENT[t].d)+'">'+esc(TALENT[t].n)+'</span>':''}
function teamTalent(t){var r=run();if(!r)return false;return alive(r).some(function(c){return sp(c).talent===t})}
function pickTalent(t){return G.pick.some(function(u){var c=byUid(u);return c&&sp(c).talent===t})}
function teamHas(req){
  var r=run();if(!r||!req)return true;
  return r.team.some(function(u){var c=byUid(u);if(!c||r.hp[u]<=0)return false;if(req.el)return sp(c).el===req.el||cEl2(c)===req.el;if(req.role)return sp(c).role===req.role;if(req.talent)return sp(c).talent===req.talent;return true});
}
function reqText(req){if(req.el)return 'Cal una bestiola de '+ELS[req.el].n+' a l’equip';if(req.role)return 'Cal una bestiola de '+req.role+' a l’equip';if(req.talent)return 'Cal una bestiola amb el talent '+TALENT[req.talent].n;return ''}
function needOk(){return (G.zone||0)!==2||pickTalent(ZONE_NEED[G.world])}
function needBlock(){
  var z=G.zone||0,w=G.world;
  if(z===2){var t=ZONE_NEED[w],ok=pickTalent(t);return '<div class="flat" style="background:'+(ok?'#DDF3E2':'#FDE2DE')+'"><b>'+(ok?'✓ ':'')+'Cal portar: '+esc(TALENT[t].n)+'</b><p class="small">'+esc(ZONE_NEED_WHY[w])+(ok?'':' Tria una bestiola amb aquest talent.')+'</p></div>'}
  if(z===1){var t2=ZONE_REC[w];return '<div class="flat"><b>Recomanat: '+esc(TALENT[t2].n)+(pickTalent(t2)?' ✓':'')+'</b><p class="small">'+esc(TALENT[t2].d)+'</p></div>'}
  return '';
}
function caveF(r){return r&&r.cave?(teamTalent('cova')?1.2:0.8):1}
function huntF(b,c){return sp(c).talent==='cacador'&&(b.enemy.guardian||b.wavesTotal>1)?1.3:1}
/* talent-only choices in the scenes */
function addCh(id,node,ch){if(SCENES[id]&&SCENES[id].nodes[node])SCENES[id].nodes[node].ch.push(ch)}
addCh('sender','a',{l:'Segueix les petjades',d:'El Rastrejador troba un niu de bestioles.',risk:0,req:{talent:'bosc'},out:{wild:1,rare:1}});
addCh('clariana','a',{l:'Busca entre l’herba',d:'El Rastrejador troba molt menjar.',risk:0,req:{talent:'bosc'},out:{food:3}});
addCh('petita','a',{l:'Segueix el rastre fins a casa seva',d:'El Rastrejador troba la seva família.',risk:0,req:{talent:'bosc'},out:{wild:1,rare:1}});
addCh('tenda','a',{l:'Obre el bagul tancat',d:'El Clauer obre el pany.',risk:0,req:{talent:'castell'},out:{loot:'common'}});
addCh('castell','a',{l:'Obre el pany de la porta',d:'El Clauer us fa entrar sense lluitar.',risk:0,req:{talent:'castell'},out:{go:'sala'}});
addCh('castell','sala',{l:'Desactiva les trampes del cofre',d:'El Clauer troba un tresor rar.',risk:0,req:{talent:'castell'},out:{loot:'relic'}});
addCh('ruines','a',{l:'Obre la cripta',d:'El Clauer obre la porta de pedra.',risk:0,req:{talent:'castell'},out:{rand:[[0.5,{loot:'relic'}],[0.5,{coins:35}]]}});
addCh('altar','a',{l:'Obre el compartiment secret',d:'El Clauer troba el tresor sense despertar el guardià.',risk:0,req:{talent:'castell'},out:{loot:'relic'}});
addCh('pont','a',{l:'Vola per sobre del riu',d:'El Volador veu el camí des de dalt.',risk:0,req:{talent:'volador'},out:{reveal:1}});
addCh('trampa','a',{l:'Vola per sobre de les pedres',d:'Sense perill.',risk:0,req:{talent:'volador'},out:{coins:12}});
addCh('campament','a',{l:'Passa volant per sobre',d:'I agafes les monedes del campament.',risk:0,req:{talent:'volador'},out:{coins:25}});
addCh('campament','a',{l:'Repta el capità',d:'El Caçaguardians lluita contra el capità sol: tresor rar.',risk:2,req:{talent:'cacador'},out:{fight:1,L:0.8,n:'Capità dels monstres',guardian:1,win:{loot:'relic'}}});
addCh('llac','a',{l:'Busseja fins al fons',d:'El Nedador troba coses enfonsades.',risk:0,req:{talent:'nedador'},out:{rand:[[0.4,{loot:'relic'}],[0.6,{coins:25}]]}});
addCh('riu','a',{l:'Neda i pesca',d:'El Nedador porta molt de menjar.',risk:0,req:{talent:'nedador'},out:{food:3}});
addCh('cascada','a',{l:'Neda fins a la cova amagada',d:'Hi entreu sense mullar-vos.',risk:0,req:{talent:'nedador'},out:{cave:1}});
addCh('vaixell','a',{l:'Busseja a la bodega',d:'El Nedador troba el tresor del capità.',risk:0,req:{talent:'nedador'},out:{loot:'relic'}});
addCh('mina','a',{l:'Segueix la veta brillant',d:'L’Espeleòleg troba la millor pedra.',risk:0,req:{talent:'cova'},out:{coins:40}});
addCh('cova','a',{l:'Busca el pas secret',d:'L’Espeleòleg troba un tresor a l’entrada.',risk:0,req:{talent:'cova'},out:{loot:'common'}});
addCh('cova-tunels','a',{l:'Il·lumina els dos túnels',d:'L’Espeleòleg veu on s’amaga la bestiola rara.',risk:0,req:{talent:'cova'},out:{wild:1,rare:1}});
addCh('cova-cofre','a',{l:'Busca el doble fons del cofre',d:'L’Ensumatresors el troba.',risk:0,req:{talent:'tresor'},out:{loot:'relic'}});
addCh('mercader','a',{l:'Compra un tresor rar (100 monedes)',d:'Un objecte de tresor.',risk:0,out:{buyItem:'RELIC',price:100}});
addCh('poble','a',{l:'Busca monedes perdudes a la plaça',d:'L’Ensumatresors en troba.',risk:0,req:{talent:'tresor'},out:{coins:25}});

/* ================= V9: forge and item tiers, enemy cut-ins, who-is-acting colours ================= */
var TIER_N=['Normal','Refinada','Màgica','Èpica','Superèpica'];
var TIER_M=[1,1.6,2.4,3.4,4.8];
var TIER_C=['#7D8597','#2E8BE6','#9B59E0','#E0572B','#C98A00'];
var FORGE_COST=[30,60,120,240];
function tierOf(id){return Math.min(4,parseInt(String(id).split('#')[1],10)||0)}
function baseOf(id){return String(id).split('#')[0]}
function IT(id){if(id==null)return null;var b=ITEMS[baseOf(id)];if(!b)return null;var t=tierOf(id),m=TIER_M[t];
  return {aff:affOf(id),set:b.set,n:b.n+(t&&!b.set?' '+'★'.repeat(t):''),slot:b.slot,atk:b.atk*m,def:b.def*m,hp:b.hp*m,rar:(b.set?'Set de llegenda · ':b.relic?'Tresor · ':'')+TIER_N[t],relic:b.relic,tier:t,base:baseOf(id)}}
function itemStats0(it){return [it.atk?'Atac +'+Math.round(it.atk*3)+'%':'',it.def?'Defensa +'+Math.round(it.def*3)+'%':'',it.hp?'Vida +'+Math.round(it.hp*2)+'%':''].filter(Boolean).join(' · ')}
function itemGroups(){var g={},order=[];G.items.forEach(function(id){if(!IT(id))return;if(!g[id]){g[id]=0;order.push(id)}g[id]++});
  return order.sort(function(a,b){var A=IT(a),B=IT(b);return (A.slot>B.slot?1:A.slot<B.slot?-1:0)||(A.base>B.base?1:A.base<B.base?-1:0)||tierOf(b)-tierOf(a)}).map(function(id){return {id:id,n:g[id]}})}
function forgeOnceV9(id){var t=tierOf(id);if(t>=4)return false;var cnt=G.items.filter(function(x){return x===id}).length;if(cnt<4||G.coins<FORGE_COST[t])return false;
  for(var k=0;k<4;k++)G.items.splice(G.items.indexOf(id),1);G.coins-=FORGE_COST[t];G.items.push(baseOf(id)+'#'+(t+1));return true}
function forgeAllV9(){var n=0,again=true,guard=0;while(again&&guard++<200){again=false;var gs=itemGroups();for(var i=0;i<gs.length;i++){if(gs[i].n>=4&&forgeOnce(gs[i].id)){n++;again=true;break}}}return n}
function scMotxilla(){
  var q=bonusPct(G.equip);
  var slots=SLOTS.filter(function(x){return x[0]!=='vestit'}).map(function(x){var id=G.equip[x[0]],it=IT(id);return '<div class="box" style="min-height:96px;'+(it?'border:3px solid '+TIER_C[it.tier]:'border:2px dashed #B9B3C6')+'"><span class="muted small">'+x[1]+'</span>'+(it?'<b style="font-size:13px;text-align:center">'+esc(it.n)+'</b><span class="muted small" style="text-align:center">'+esc(itemStats(it))+'</span><button type="button" class="btn sm light" style="min-height:36px" data-act="unequip" data-slot="'+x[0]+'">Treu</button>':'<span class="muted small">buit</span>')+'</div>'}).join('');
  var groups=itemGroups(),ready=forgeReady();
  var forge='<div class="flat" style="gap:8px;background:#FFF1DA">'+qHead('Forja','4 objectes iguals → 1 de la categoria següent, amb un poder especial nou.','Normal → Refinada → Màgica → Èpica → Superèpica. Cada categoria dona molt més: Refinada ×1,6 · Màgica ×2,4 · Èpica ×3,4 · Superèpica ×4,8. Costa '+FORGE_COST.join(', ')+' monedes segons la categoria. Cada vegada que forges, l’objecte guanya un poder especial (Xucla vida, Verí, Encanteri, Espines…). Els 4 objectes han de ser de la mateixa mena i categoria.')+
    (ready.length?'<button type="button" class="btn gold" data-act="forgeAll">Forja-ho tot ('+ready.length+' grups a punt)</button>':'<p class="muted small">Ara no tens 4 objectes iguals de cap mena.</p>')+'</div>';
  var inv=groups.map(function(g){var it=IT(g.id),t=it.tier,sl=it.slot==='anell'?['anell1','anell2']:[it.slot],cost=t<4?FORGE_COST[t]:0;
    return '<div class="flat" style="background:var(--soft);gap:6px;outline:3px solid '+TIER_C[t]+'"><div class="row between"><b>'+esc(it.n)+(g.n>1?' ×'+g.n:'')+'</b><span class="tag" style="background:'+TIER_C[t]+';color:#fff">'+esc(it.rar)+'</span></div><span class="muted small">'+esc(itemStats(it))+'</span>'+
      sl.map(function(s){var eqNew=Object.assign({},G.equip);eqNew[s]=g.id;var cur=G.equip[s];
        return '<div class="row" style="gap:6px"><button type="button" class="btn sm" data-act="equip" data-id="'+esc(g.id)+'" data-slot="'+s+'">'+(cur?'Canvia per aquest':'Equipa')+(sl.length>1?' ('+(s==='anell1'?'Anell 1':'Anell 2')+')':'')+'</button></div><div class="row" style="gap:4px">'+deltaChips(eqNew)+'</div>'}).join('')+
      (t<4?'<div class="row" style="gap:6px"><button type="button" class="btn sm gold" data-act="forge" data-id="'+esc(g.id)+'"'+(fcount(g.id)>=4&&G.coins>=cost?'':' disabled')+'>Forja 4 → 1 '+esc(TIER_N[t+1])+' ('+cost+' monedes)</button><span class="muted small">'+(fcount(g.id)>=4?(G.coins>=cost?'':'Et falten monedes'):'En tens '+fcount(g.id)+' de 4 d’aquesta categoria')+'</span></div>':'<span class="muted small">Ja és Superèpica: la millor categoria.</span>')+'</div>'}).join('');
  var food=Object.keys(ELS).map(function(k){return '<div class="box">'+elIcon(k,26,ELS[k].c)+'<span class="small" style="text-align:center">'+esc(FOOD[k])+'</span><b>'+(G.food[k]||0)+'</b></div>'}).join('');
  return '<h1>Motxilla</h1>'+tip('motxilla','Els objectes que portes fan més forta cada bestiola de l’equip. Abans d’equipar, mira les fletxes: ▲ verd vol dir que millora, ▼ vermell que empitjora. Amb 4 objectes iguals, a la Forja en fas un de millor.')+
    '<div class="flat" style="align-items:center">'+heroOutfit()+'<div class="row" style="justify-content:center"><span class="tag">Atac +'+Math.round(q.atk)+'%</span><span class="tag">Defensa +'+Math.round(q.def)+'%</span><span class="tag">Vida +'+Math.round(q.hp)+'%</span></div></div>'+
    bestBlock()+'<div class="grid4">'+slots+'</div>'+forge+setsBlock()+'<h2>A la motxilla</h2>'+(inv||'<p class="muted">Encara no tens objectes. En trobaràs explorant.</p>')+'<h2>Menjar</h2><div class="grid3">'+food+'</div>';
}
/* who is acting: green for your team, red for the enemy; big enemy moves get their own cut-in */
var US_EV=['hit','heal','regen','special','combo','dot','stunned','foeDown'],THEM_EV=['ehit','aoe','warn','enrage','wave','teamDown','boss','minion'];
function showEvent(e){
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
function makeBattle1(o){
  var bt=makeBattle0(o),en=bt.enemy,k=o.final?BOSS_W[o.el]:((o.n==='Rei de la cova'||o.n==='Rei de les Profunditats')?'tricap':null);
  bt.meter=0;
  if(k){en.boss=k;en.n=BOSS[k].n;en.bossD=BOSS[k].d;if(k==='tricap'){en.max=en.hp=Math.round(en.max*0.7);en.atk=Math.round(en.atk*0.85)}bt.minions=0;bt.mhp=Math.round(en.max*0.09);bt.mcur=0;bt.frozen={};bt.charging=0;bt.phase=0;bt.fallen=0;bt.heads=3}
  return bt;
}
function outDmg1(c,pow,b,r){var o=outDmg0(c,pow,b,r);if(b.frozen&&b.frozen[c.uid]>0){o.n=1;o.m=1;o.zap=false}return o}
function bestOff(c){var l=abilities(c).filter(function(a){return OFFENSIVE.indexOf(a.kind)>=0}).sort(function(x,y){return y.pow-x.pow});var a=l[0]||{kind:'hit',pow:1,cd:0};return {i:-1,cd:0,kind:a.kind,pow:Math.max(1,a.pow)}}
function findCombo0(r,b){
  var ready=alive(r).map(function(c){var a=abilities(c).filter(function(x){return OFFENSIVE.indexOf(x.kind)>=0&&(b.ch[c.uid]||[])[x.i]===0})[0];return a?{c:c,a:a}:null}).filter(Boolean);
  if(ready.length>=3)return {parts:ready,group:true};
  for(var i=0;i<ready.length;i++)for(var j=i+1;j<ready.length;j++){var e1=sp(ready[i].c).el,e2=sp(ready[j].c).el,cb=COMBOS[comboKey(e1,e2)];
    if(e1!==e2&&cb)return {parts:[ready[i],ready[j]],cb:cb}}
  return null;
}
function doCombo0(x,r,b){
  x.parts.forEach(function(p){if(p.a.i>=0)b.ch[p.c.uid][p.a.i]=p.a.cd});
  var k=x.parts.length,n=0,els=[],kinds=[],pow=x.group?1.3*(1+0.15*(k-2)):x.cb[2]*1.3;
  x.parts.forEach(function(p){n+=outDmg(p.c,pow,b,r).n;var e=sp(p.c).el;if(els.indexOf(e)<0)els.push(e);if(kinds.indexOf(p.a.kind)<0)kinds.push(p.a.kind)});
  b.enemy.hp=Math.max(0,b.enemy.hp-n);
  var pw=Math.max(3,Math.round(x.parts.reduce(function(a,p){return a+stats(p.c).atk},0)*0.25));
  (x.group?kinds:[x.cb[1]]).forEach(function(q){if(q==='burn')b.st.burn={t:4+(b.syn.incendi?2:0),n:pw};if(q==='poison')b.st.poison={t:4,n:pw};if(q==='stun')b.st.stun=1;if(q==='weaken')b.st.weak=3;if(q==='soak')b.st.soak=3});
  var name=!x.group?x.cb[0]:x.all?'Atac de tot l’equip':(els.length===3&&GROUP_NAMES[els.slice().sort().join('+')])||(els.length>=4?'Tempesta de '+els.length+' elements':els.length===1?'Triple '+ELS[els[0]].n:'Atac de '+(k===3?'tres':k===4?'quatre':k));
  return {t:'combo',ids:x.parts.map(function(p){return p.c.uid}),els:els,name:name,n:n,after:b.enemy.hp,group:!!x.group,
    txt:(x.group?'ATAC CONJUNT! ':'ATAC COMBINAT! ')+x.parts.map(function(p){return cName(p.c)}).join(', ')+' fan '+name+': -'+n+'.'};
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
function updateStatus1(){
  updateStatus0();var r=run(),b=r&&r.event;if(!b||b.type!=='battle')return;var f=$('foe-st'),t=$('team-st'),m=$('team-meter');
  if(m){m.style.width=Math.round(Math.min(1,(b.meter||0)/TEAM_METER)*100)+'%';m.parentNode.classList.toggle('full',(b.meter||0)>=TEAM_METER-1)}
  if(f){var s='';if(b.minions>0)s+='<span class="stchip weak">Soldats '+b.minions+'</span>';if(b.charging>0)s+='<span class="stchip stun">Carregant '+b.charging+'</span>';if(b.enemy.boss==='tricap')s+='<span class="stchip burn">Caps '+b.heads+'</span>';f.innerHTML+=s}
  if(t&&b.frozen){var q='';Object.keys(b.frozen).forEach(function(u){if(b.frozen[u]>0&&byUid(u))q+='<span class="stchip soak">Congelat: '+esc(cName(byUid(u)))+' '+b.frozen[u]+'</span>'});t.innerHTML+=q}
}

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
function inDmg(b,t,x){var d=inDmg0(b,t,(x||1)*growF(b));if(b.P&&b.P.thorns)b._thorn=(b._thorn||0)+d*b.P.thorns/100;return d}
/* --- our damage: element bonus of group attacks, item powers, crits, status chances --- */
function outDmg(c,pow,b,r){var o=outDmg1(c,pow,b,r),P=b.P||emptyP(),f=(b._elb||1)*(1+(P.el[sp(c).el]||0)/100);
  if(P.crit&&Math.random()*100<P.crit){f*=2;procAdd(b,'crit')}
  o.n=Math.max(1,Math.round(o.n*f));
  var boss=b.enemy.boss?0.6:1,pw=stats(c).atk*0.35;
  ['poison','burn','slow','dist','dizzy','stun'].forEach(function(k){if(P[k]&&Math.random()*100<P[k]*boss){applyFx(b,k,pw);procAdd(b,k)}});
  if(P.vamp)b._vamp=(b._vamp||0)+o.n*P.vamp/100;return o}
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
function findCombo(r,b){return megaReady(r,b)||findCombo0(r,b)}
function elsOf(parts){var l=[];parts.forEach(function(p){var e=sp(p.c).el;if(l.indexOf(e)<0)l.push(e)});return l}
function elBonus(n){return 1+0.1*Math.max(0,n-1)}
function doCombo(x,r,b){
  if(x.mega)return doMega(x,r,b);
  var els=elsOf(x.parts),eb=elBonus(els.length);b._elb=eb;var e=doCombo0(x,r,b);b._elb=1;
  e.elb=eb;e.nEl=els.length;e.all=!!x.all;if(eb>1)e.txt+=' Bonus de '+els.length+' elements: +'+Math.round((eb-1)*100)+'%.';return e}
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
function makeBattle(o){var bt=makeBattle1(o),en=bt.enemy,ad=V13_ADJ[en.boss?'boss':en.guardian?'guardian':'normal'];var rz=run();en.atk=Math.max(1,Math.round(en.atk*ad.atk*(en.boss&&rz&&!rz.zone&&!rz.cave?0.85:1)));en.max=en.hp=Math.round(en.hp*ad.hp);bt.P=powerOf(G.equip);if(bt.P.shield0)bt.shield=Math.min(6,bt.shield+bt.P.shield0);bt.megaUsed={};return bt}
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
function battleWon3(){var r=run(),b=r.event,en=b.enemy,P=b.P||emptyP();battleWon0();var ev=r.event;
  if(ev&&ev.type==='card'&&ev.kind==='coins'&&P.coins)ev.n=Math.round(ev.n*(1+P.coins/100));
  var ch=en.boss?0.05:0;
  if(ch&&ev&&ev.type==='card'&&ev.kind==='item'&&Math.random()<ch){var miss=missingPieces(r.world);if(miss.length){ev.item=pickOne(miss);ev.why='Una peça d’un SET DE LLEGENDA! '+ev.why}}}
/* --- legend workshop --- */
function buyLegend(el){var miss=missingPieces(el);if(!miss.length){toast('Ja tens totes les peces de '+ELS[el].n+'.');return}
  if(!legendOpen()){toast('Primer has de forjar un objecte fins a Superèpica.');return}if(G.coins<LEGEND_COST){toast('Necessites '+LEGEND_COST+' monedes.');return}
  G.coins-=LEGEND_COST;var id=pickOne(miss);G.items.push(id);toast('Nova peça de llegenda: '+IT(id).n+'!')}
function act(a,d){if(a==='sortB'){G.sortB=d.k;persist();render();return}if(a==='legend'){buyLegend(d.el);persist();render();return}return act0(a,d)}
function setsBlock(){
  var mine={},n=setCounts(G.equip),total=0;allMine().forEach(function(id){var b=ITEMS[baseOf(id)];if(b&&b.set){mine[b.set]=mine[b.set]||{};mine[b.set][b.slot]=1}});
  Object.keys(mine).forEach(function(k){total+=Object.keys(mine[k]).length});
  var list=SET_KEYS.filter(function(k){return mine[k]}).map(function(k){var S=SETS[k],on=n[k]||0;
    return '<div class="flat" style="background:var(--soft);gap:4px;outline:3px solid '+ELS[S.el].c+'"><div class="row between"><b>'+esc(S.n)+'</b><span class="tag" style="background:'+ELS[S.el].c+';color:#fff">'+on+' de 5 posades</span></div>'+
      '<span class="small">Peces: '+S.slots.map(function(sl){return (mine[k][sl]?'✓ ':'· ')+SLOT_N[sl]}).join(' · ')+'</span>'+
      S.b.map(function(x,i){var act=on>=i+2;return '<span class="small" style="'+(act?'font-weight:800;color:#1E7B3A':'opacity:.65')+'">'+(i===3?'5 peces · SUPER: ':(i+2)+' peces: ')+esc(x.d)+(act?' ✓':'')+'</span>'}).join('')+'</div>'}).join('');
  var shop=ORDER.filter(worldOpen).map(function(el){var m=missingPieces(el).length;
    return '<button type="button" class="btn sm" style="background:'+ELS[el].c+';color:#fff" data-act="legend" data-el="'+el+'"'+(m&&legendOpen()&&G.coins>=LEGEND_COST?'':' disabled')+'>'+esc(ELS[el].n)+(m?'':' (complet)')+'</button>'}).join(' ');
  var P=powerOf(G.equip),pw=powerText(P);
  return '<div class="flat" style="gap:6px;background:#F3ECFF"><h2>Poders especials</h2>'+(pw.length?'<p class="small">'+esc(pw.join(' · '))+'</p>':'<p class="muted small">Encara cap. Els objectes forjats i els sets de llegenda en donen.</p>')+'</div>'+
    '<div class="flat" style="gap:6px;background:#FFF6D6"><h2>Sets de llegenda</h2><p class="small">Hi ha <b>10 sets</b> (2 de cada element) de 5 peces Superèpiques. Amb 2 peces del mateix set posades s’obre 1 habilitat, amb 3 n’hi ha 2, amb 4 n’hi ha 3, i amb les 5 tens la <b>super habilitat</b>.</p>'+
    '<p class="small">Tens <b>'+total+' de 50</b> peces. Són molt difícils d’aconseguir: els caps en deixen caure una molt poques vegades (5%), i el Taller de llegendes només s’obre quan has forjat un objecte fins a <b>Superèpica</b>.</p>'+
    '<p class="small"><b>Taller de llegendes</b>: una peça a l’atzar de l’element que triïs, que encara no tinguis. Costa <b>'+LEGEND_COST+' monedes</b>.'+(legendOpen()?'':' <b>Tancat:</b> primer forja una Superèpica.')+'</p><div class="row" style="gap:6px;flex-wrap:wrap">'+shop+'</div></div>'+list}
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
function updateStatus(){updateStatus1();var r=run(),b=r&&r.event;if(!b||b.type!=='battle')return;var f=$('foe-st');if(!f)return;var s='';
  if(b.st.slow>0)s+='<span class="stchip soak">Lent '+b.st.slow+'</span>';if(b.st.dist>0)s+='<span class="stchip weak">Distret '+b.st.dist+'</span>';if(b.st.dizzy>0)s+='<span class="stchip stun">Marejat '+b.st.dizzy+'</span>';
  var g=growF(b);if(g>=1.01&&b.enemy.hp>0)s+='<span class="stchip burn">Més fort ×'+g.toFixed(2).replace('.',',')+'</span>';f.innerHTML+=s}
/* --- old forged items get their powers too (save from before this version) --- */
function fkey(id){return baseOf(id)+'#'+tierOf(id)}
function fcount(id){var k=fkey(id);return G.items.filter(function(x){return fkey(x)===k}).length}
function forgeReady(){var seen={},l=[];G.items.forEach(function(id){var it=IT(id);if(!it||it.set||tierOf(id)>=4)return;var k=fkey(id);if(seen[k])return;seen[k]=1;if(fcount(id)>=4)l.push(id)});return l}
function forgeOnce(id,pw){var t=tierOf(id),it=IT(id);if(!it||it.set||t>=4||fcount(id)<4||G.coins<FORGE_COST[t])return false;var k=fkey(id),aff=affOf(id).slice();
  var i=G.items.indexOf(id);G.items.splice(i,1);for(var n=0;n<3;n++){for(var j=0;j<G.items.length;j++)if(fkey(G.items[j])===k){G.items.splice(j,1);break}}
  G.coins-=FORGE_COST[t];aff.push(pw&&AFFIX[pw]?pw:pickOne(AFF_KEYS));var nid=baseOf(id)+'#'+(t+1)+'~'+aff.join('.');G.items.push(nid);G.lastForge=nid;if(t+1>=4&&!G.superForged){G.superForged=1;setTimeout(function(){toast('Has forjat la teva primera Superèpica! El Taller de llegendes ja és obert.')},1600)}return true}
function forgeAll(){var n=0,guard=0,l;while(guard++<200&&(l=forgeReady()).length){if(!forgeOnce(l[0]))break;n++}return n}
function itemStats(it){var s=itemStats0(it);if(it.aff&&it.aff.length)s+=' · Poders: '+it.aff.map(function(a){return AFFIX[a].n}).join(', ');if(it.set)s+=' · '+SETS[it.set].n;return s}
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

/* --- v13.4 safety: a battle never continues with the whole team down, and an error in a turn ends the battle instead of freezing the game --- */
function battleTick(){var r=run(),b=r&&r.event;
  if(b&&!b.over&&!alive(r).length){b.over='lose';return [{t:'teamDown',txt:'Tot l’equip ha caigut.'}]}
  try{return battleTick3()}catch(e){if(b){b.over='lose'}return [{t:'teamDown',txt:'Alguna cosa ha fallat en aquest torn. La batalla s’acaba.'}]}}
function battleWon(){battleWon3();var r=run();if(r&&r.team&&!r.team.some(function(u){return r.hp[u]>0}))r.team.forEach(function(u){r.hp[u]=1})}
try{document.documentElement.style.touchAction='manipulation'}catch(e){}
/* --- v13.5: weapons of different kinds, outfits for the player character, short help with a "?" --- */
(function(){
  var W={arcCaca:{n:'Arc de caça',slot:'espasa',atk:3,def:0,hp:0,rar:'Comú'},bastoMagic:{n:'Bastó màgic',slot:'espasa',atk:2,def:0,hp:2,rar:'Comú'},
    martellPedra:{n:'Martell de pedra',slot:'espasa',atk:5,def:0,hp:0,rar:'Rar'},dagaOmbra:{n:'Daga d’ombra',slot:'espasa',atk:4,def:0,hp:1,rar:'Rar'},
    vestitExplorador:{n:'Vestit d’explorador',slot:'vestit',hp:3,def:1,atk:0,rar:'Comú',col:'#4E7A3A'},tunicaMag:{n:'Túnica de mag',slot:'vestit',atk:2,hp:1,def:0,rar:'Comú',col:'#6A3FB5'},
    armaduraLleugera:{n:'Armadura lleugera',slot:'vestit',def:3,hp:1,atk:0,rar:'Rar',col:'#7A8496'},vestitNinja:{n:'Vestit de ninja',slot:'vestit',atk:3,def:1,hp:0,rar:'Rar',col:'#23202E'},
    jaquetaFoc:{n:'Jaqueta de foc',slot:'vestit',atk:2,def:1,hp:1,rar:'Rar',col:'#C8462B'}};
  Object.keys(W).forEach(function(k){ITEMS[k]=W[k];COMMON.push(k)});
  // set weapons: each set has its own kind of weapon
  var SW={drac:'Espasa',fenix:'Bastó',marea:'Arpó',levia:'Trident',bosc:'Arc',rosa:'Fuet',tro:'Martell',vent:'Daga',ull:'Vareta',somnia:'Ventall'};
  SET_KEYS.forEach(function(k){var it=ITEMS['set_'+k+'_espasa'];if(it)it.n=(SW[k]||'Arma')+' '+SETS[k].suf});
  SLOTS.push(['vestit','Vestit']);SLOT_N.vestit='Vestit';
})();
function heroCol(){var it=G&&G.equip&&ITEMS[baseOf(G.equip.vestit||'')];return it&&it.col?it.col:'#4A3FB5'}
function heroOutfit(){var id=G.equip.vestit,it=IT(id);
  return '<div class="row" style="gap:12px;align-items:center;justify-content:center">'+hero(64)+
    '<div class="box" style="min-height:96px;min-width:130px;'+(it?'border:3px solid '+TIER_C[it.tier]:'border:2px dashed #B9B3C6')+'"><span class="muted small">Vestit</span>'+
    (it?'<b style="font-size:13px;text-align:center">'+esc(it.n)+'</b><span class="muted small" style="text-align:center">'+esc(itemStats(it))+'</span><button type="button" class="btn sm light" style="min-height:40px" data-act="unequip" data-slot="vestit">Treu</button>':'<span class="muted small" style="text-align:center">Sense vestit. En trobaràs explorant.</span>')+'</div></div>'}
/* a heading with a one-line explanation and a "?" that opens the full detail (tap on a phone, hover shows a tooltip on a computer) */
function qHead(title,short,long){return '<div class="qhead"><h2 style="margin:0">'+esc(title)+'</h2><details class="qd"><summary title="'+esc(long)+'" aria-label="Més informació sobre '+esc(title)+'">?</summary><p class="small qdtxt">'+esc(long)+'</p></details></div><p class="small" style="margin:2px 0 0">'+esc(short)+'</p>'}
(function(){try{var st=document.createElement('style');st.textContent='.qhead{display:flex;flex-wrap:wrap;align-items:center;gap:8px}.qd{display:contents}.qd>summary{list-style:none;cursor:pointer;width:28px;height:28px;border-radius:50%;background:#1E1B2E;color:#fff;font-weight:800;display:inline-flex;align-items:center;justify-content:center;font-size:15px}.qd>summary::-webkit-details-marker{display:none}.qd .qdtxt{flex-basis:100%;margin:4px 0 0;background:#fff;border:2px solid #1E1B2E;border-radius:10px;padding:8px 10px}';document.head.appendChild(st)}catch(e){}})();
/* legend sets: short text, details behind the "?" */
var setsBlockV13=setsBlock;
setsBlock=function(){var h=setsBlockV13();
  var a=h.indexOf('<h2>Sets de llegenda</h2>'),b=h.indexOf('<p class="small"><b>Taller de llegendes</b>');
  if(a<0||b<0)return h;
  var long='Hi ha 10 sets (2 de cada element) de 5 peces Superèpiques. Amb 2 peces del mateix set posades tens 1 habilitat, amb 3 en tens 2, amb 4 en tens 3, i amb les 5 la super habilitat. Els caps en deixen caure una molt poques vegades (5%). Al Taller de llegendes en pots comprar una per '+LEGEND_COST+' monedes, però només quan has forjat un objecte fins a Superèpica.';
  var total=(h.match(/Tens <b>(\d+) de 50<\/b>/)||[])[1]||'0';
  return h.slice(0,a)+qHead('Sets de llegenda','Peces Superèpiques que, juntes, donen habilitats. Molt difícils d’aconseguir. En tens '+total+' de 50.',long)+
    '<p class="small" style="margin-top:6px"><b>Taller de llegendes</b>'+(legendOpen()?' · '+LEGEND_COST+' monedes per peça':' · tancat fins que forgis una Superèpica')+'</p>'+h.slice(h.indexOf('<div class="row"',b))};

/* --- council names (the daughter may change them later): critters, worlds, bosses, secret combos, sets --- */
var NAMES_V14={"species":{"espurnet":{"n":"Espurnet","evos":["Flamàs","Infernàs","Gèiser"]},"fumet":{"n":"Fumet","evos":["Fogaró","Encens","Caliu"]},"brasa":{"n":"Còdol","evos":["Tosca","Carbonera","Volcanàs"]},"xurrufet":{"n":"Xurrufet","evos":["Petard","Traca","Bengala"]},"cremallot":{"n":"Cremallot","evos":["Cargolava","Fornal","Locomotora"]},"fogonet":{"n":"Fogonet","evos":["Fogoner","Gran Xef","Alquimista"]},"dragonet":{"n":"Dragonet","evos":["Dracot","Drac Carmesí","Drac Tempesta"]},"fumerol":{"n":"Fumerol","evos":["Xemeneia","Erupció","Fumarola Mística"]},"gotim":{"n":"Gota","evos":["Brollador","Fontana","Calitja"]},"bufa":{"n":"Closquet","evos":["Closcarra","Tempestuga","Escullera"]},"petxina":{"n":"Gambeta","evos":["Llagostot","Irisada","Arponer"]},"nedet":{"n":"Nedet","evos":["Llúdriga","Torrent","Voltúdriga"]},"medusina":{"n":"Medusina","evos":["Medusa","Medusa Reial","Hipnomedusa"]},"cranquet":{"n":"Cranquet","evos":["Pinçot","Gladiador","Corallot"]},"bombolli":{"n":"Bombolli","evos":["Bombollot","Bombolla Mare","Cronobombolla"]},"popet":{"n":"Popet","evos":["Pop","Kraken","Electropop"]},"brotet":{"n":"Brotet","evos":["Lianer","Fuetàs","Mangle"]},"molsa":{"n":"Molsa","evos":["Falguera","Mandràgora","Herbolària"]},"pinyol":{"n":"Pinyol","evos":["Pinyot","Pinyafoc","Magranada"]},"arrel":{"n":"Arrel","evos":["Socarrel","Alzinàs","Parallamps"]},"boleto":{"n":"Boletó","evos":["Rovelló","Cep Reial","Bolet Lunar"]},"cucafera":{"n":"Eruguet","evos":["Eruga","Arna Reial","Papallona Llampec"]},"punxetes":{"n":"Punxetes","evos":["Cactus","Saguaro","Xili"]},"bavos":{"n":"Bavós","evos":["Cargolot","Cargol Blindat","Cargol de Mar"]},"xispa":{"n":"Xispa","evos":["Dínamo","Altatensió","Halo"]},"trona":{"n":"Voltet","evos":["Voltor","Calamarsa","Fulminant"]},"guspira":{"n":"Guspira","evos":["Fotó","Far","Zenit"]},"endollet":{"n":"Endollet","evos":["Bateria","Ciborg","Androide Somiador"]},"brunzit":{"n":"Brunzit","evos":["Colibrí","Falcó Tro","Ocell Brasa"]},"cuquet":{"n":"Cuquet de llum","evos":["Lluerna","Fanal Viu","Estel del Bosc"]},"imantat":{"n":"Imantat","evos":["Imant","Electroimant","Imant Roent"]},"nuvolet":{"n":"Nuvolet","evos":["Núvol","Cumulonimbus","Diluvi"]},"mentoli":{"n":"Calmet","evos":["Mantra","Endeví","Lotus"]},"somni":{"n":"Somni","evos":["Malson","Eclipsi","Miratge"]},"ullet":{"n":"Ullet","evos":["Ullerós","Abissal","Panòptic"]},"fantasmet":{"n":"Fantasmet","evos":["Espectre","Poltergeist","Foc Follet"]},"mussolet":{"n":"Mussolet","evos":["Mussol","Gran Duc","Òliba del Bosc"]},"bolavidre":{"n":"Bolavidre","evos":["Bola Màgica","Oracle","Plasma"]},"barretmagic":{"n":"Barretmàgic","evos":["Barret de Copa","Il·lusionista","Mag Pirotècnic"]},"dormilega":{"n":"Dormilega","evos":["Badall","Hibernador","Somni del Llac"]}},"worlds":{"foc":"Brasàlia","llamp":"Altavolta","aigua":"Mar de Fons","planta":"Boscúria","psiquic":"Somnàlia"},"bosses":{"Mag de Gel":"Glacius, el Bruixot del Gebre","Gegant de Pedra":"Colós Molsut","Reina de l’Eixam":"Reina Vespa Elèctrica","Senyor de les Ombres":"Penombra, Senyor dels Miralls","Guardià de tres caps":"Trícefal, Rei de les Profunditats","Rei de la cova":"Rei de les Profunditats"},"mega":{"vapor":"Drac de Vapor","bolets":"Bolets Bojos","festa":"Discoteca de Lluernes","selva":"Selva Furiosa","quatre":"La Colla Original","exercit":"Esquadró del Caos"},"sets":{"tro":{"n":"Armadura del Gegant del Tro","suf":"del Gegant del Tro"},"vent":{"n":"Ales de l’Huracà","suf":"de l’Huracà"}}};
(function(){var N=NAMES_V14;Object.keys(N.species||{}).forEach(function(k){var S=SPECIES[k],x=N.species[k];if(!S)return;if(x.n)S.n=x.n;(x.evos||[]).forEach(function(n,i){if(S.evos[i]&&n)S.evos[i].n=n})});
  Object.keys(N.worlds||{}).forEach(function(k){if(ELS[k])ELS[k].mon=N.worlds[k]});
  Object.keys(BOSS).forEach(function(k){if(N.bosses[BOSS[k].n])BOSS[k].n=N.bosses[BOSS[k].n]});
  MEGA.forEach(function(m){if(N.mega[m.id])m.n=N.mega[m.id]});
  Object.keys(N.sets||{}).forEach(function(k){var S=SETS[k],x=N.sets[k];if(!S)return;var old=S.suf;S.n=x.n;S.suf=x.suf;Object.keys(ITEMS).forEach(function(id){var it=ITEMS[id];if(it.set===k)it.n=it.n.replace(old,x.suf)})})})();

/* ================= V14: Quimèria. Balance, very hard zone 4, forge choice, backpack tabs, red dots, sounds ================= */
try{document.title='Quimèria'}catch(e){}
function curZone(){var r=run();return r?(r.zone||0):-1}
/* --- balance: a stronger team makes ordinary enemies only a little stronger (square root), so evolving and gear are felt.
   In zone 4 enemies never get weaker for a weak team: they assume at least a team of level-3 critters with Epic gear. --- */
var HARD_TP={foc:3.8,aigua:3.8,planta:3.1,llamp:2.9,psiquic:2.7};
var enemyStatsV13=enemyStats;
enemyStats=function(L,g,ts,tp){tp=tp||1;var hard=curZone()===3,eff=hard?(HARD_TP[(run()||{}).world]||3):Math.pow(tp,0.5);
  var s=enemyStatsV13(L,g,ts,1);s.hp=Math.round(s.hp*eff);s.atk=Math.round(s.atk*(1+(eff-1)*(hard?0.4:0.3)));if(hard)s.def=Math.round(s.def*1.3);return s};
/* first boss of the game was too hard for the starters: zone-1 final guardian has 15% less life */
var makeBattleV13=makeBattle;
makeBattle=function(o){var bt=makeBattleV13(o),r=run();
  if(o&&o.final&&r&&(r.zone||0)===0&&!r.cave&&bt&&bt.enemy){bt.enemy.hp=Math.round(bt.enemy.hp*0.85);bt.enemy.max=bt.enemy.hp}
  if(bt&&bt.enemy&&curZone()===3)bt.enemy.hard=true;
  return bt};
/* --- zone 4 in every world: very hard, opens after zone 3 --- */
(function(){var Z4={foc:'Forja prohibida',aigua:'Abisme sense fons',planta:'Bosc maleït',llamp:'Ull de la tempesta',psiquic:'Malson etern'};
  Object.keys(Z4).forEach(function(w){if(ZONES[w]&&ZONES[w].length===3)ZONES[w].push(Z4[w])});
  if(ZONE_ROUTES.length===3)ZONE_ROUTES.push(['gen','fork','mini','gen','land','sig','gen','cave','mini','gen','fork2','spring','gen','land','mini','guardian']);
  if(ZONE_BONUS.length===3)ZONE_BONUS.push(260);
  if(ZONE_INFO.length===3)ZONE_INFO.push('MOLT DIFÍCIL. Els enemics no s’adapten al teu equip: calen bestioles de nivell 3 i equip Èpic o millor. Tres campaments, una cova i el guardià més fort del món.');})();
/* --- forge: choose 1 power out of 3 --- */
var actV13=act;
act=function(a,d){
  if(a==='forge'){var t=tierOf(d.id);if(t<4&&fcount(d.id)>=4&&G.coins>=FORGE_COST[t]){G.forgeChoice={id:d.id,opts:shuffle(AFF_KEYS).slice(0,3)};G.mtab='obj';snd('tap')}else toast('Et falten objectes o monedes.');render();scrollTop0();return}
  if(a==='forgePick'){var fc=G.forgeChoice;G.forgeChoice=null;if(fc&&fc.opts.indexOf(d.k)>=0&&forgeOnce(fc.id,d.k)){var lf=IT(G.lastForge);snd('forge');toast('Forjat: '+lf.n+' ('+TIER_N[lf.tier]+') amb '+AFFIX[d.k].n+'!')}persist();render();return}
  if(a==='forgeCancel'){G.forgeChoice=null;render();return}
  if(a==='mtab'){G.mtab=d.k;render();scrollTop0();return}
  if(a==='mute'){G.mute=!G.mute;persist();render();if(!G.mute)snd('tap');return}
  if(a==='evolve'){var c=byUid(d.u),before=c&&c.stage;actV13(a,d);if(c&&c.stage!==before){snd('evolve');buzz([40,40,80])}return}
  if(a==='forgeAll'){var n=forgeAll();if(n)snd('forge');toast(n?'Has forjat '+n+' objecte'+(n>1?'s':'')+' (poders a l’atzar).':'No hi ha res per forjar.');persist();render();return}
  return actV13(a,d)};
function scrollTop0(){try{var sc=$('screen');if(sc&&sc.scrollTo)sc.scrollTo(0,0);window.scrollTo&&window.scrollTo(0,0)}catch(e){}}
function forgeChoiceBlock(){var fc=G.forgeChoice;if(!fc)return '';var it=IT(fc.id);if(!it){G.forgeChoice=null;return ''}
  return '<div class="flat" style="gap:8px;background:#1E1B2E;color:#fff;outline:3px solid #F2B705"><h2 style="color:#fff">Tria el poder nou</h2><p class="small">'+esc(it.n)+' → '+esc(TIER_N[it.tier+1])+' · '+FORGE_COST[it.tier]+' monedes</p>'+
    fc.opts.map(function(k){return '<button type="button" class="btn gold" style="text-align:left;display:block" data-act="forgePick" data-k="'+k+'"><b>'+esc(AFFIX[k].n)+'</b>'+(AFFIX[k].d?'<span class="small" style="display:block;font-weight:600">'+esc(AFFIX[k].d)+'</span>':'')+'</button>'}).join('')+
    '<button type="button" class="btn light sm" data-act="forgeCancel">Encara no</button></div>'}
/* --- backpack in 4 tabs: Equip, Objectes i forja, Sets, Menjar --- */
var scMotxillaV13=scMotxilla;
scMotxilla=function(){var h=scMotxillaV13();
  var iF=h.indexOf('<div class="flat" style="gap:8px;background:#FFF1DA">'),iP=h.indexOf('<div class="flat" style="gap:6px;background:#F3ECFF">'),iS=h.indexOf('<div class="flat" style="gap:6px;background:#FFF6D6">'),iI=h.indexOf('<h2>A la motxilla</h2>'),iM=h.indexOf('<h2>Menjar</h2>');
  if(iF<0||iP<0||iS<0||iI<0||iM<0||!(iF<iP&&iP<iS&&iS<iI&&iI<iM))return forgeChoiceBlock()+h;
  var head=h.slice(0,iF),tabs={eq:head+h.slice(iP,iS),obj:h.slice(iF,iP)+h.slice(iI,iM),sets:h.slice(iS,iI),menjar:h.slice(iM)};
  var t=tabs[G.mtab]?G.mtab:'eq',h1='<h1>Motxilla</h1>';
  if(t!=='eq')tabs[t]=h1+tabs[t];
  var dot={obj:forgeReady().length>0,sets:legendOpen()&&G.coins>=LEGEND_COST&&ORDER.filter(worldOpen).some(function(el){return missingPieces(el).length}),eq:betterGear()};
  var bar='<div class="mtabs" role="tablist">'+[['eq','Equip'],['obj','Objectes i forja'],['sets','Sets'],['menjar','Menjar']].map(function(x){return '<button type="button" role="tab" class="mtab'+(t===x[0]?' on':'')+'" aria-selected="'+(t===x[0])+'" data-act="mtab" data-k="'+x[0]+'">'+x[1]+(dot[x[0]]?'<span class="rdot" aria-label="hi ha novetats"></span>':'')+'</button>'}).join('')+'</div>';
  var body=tabs[t],k=body.indexOf(h1);if(k>=0)body=body.slice(0,k+h1.length)+bar+(t==='obj'?forgeChoiceBlock():'')+body.slice(k+h1.length);else body=bar+body;
  return body};
function betterGear(){try{var b=bestEquipSet().equip;return SLOTS.some(function(x){return (b[x[0]]||'')!==(G.equip[x[0]]||'')&&itemScore(b[x[0]]||'')>itemScore(G.equip[x[0]]||'')})}catch(e){return false}}
/* --- red dots on the menu: a critter can evolve, something can be forged, better gear is in the backpack --- */
var renderV13=render;
render=function(){renderV13();try{var nav=$('nav');if(!nav||!nav.querySelector)return;
  var dots={bestioles:G.owned.some(function(c){return c.stage<2&&c.mill>=5}),motxilla:forgeReady().length>0||betterGear()};
  Object.keys(dots).forEach(function(k){if(!dots[k])return;var b=nav.querySelector('[data-to="'+k+'"]');if(b&&!b.querySelector('.rdot')){var s=document.createElement('span');s.className='rdot';s.setAttribute('aria-label','hi ha novetats');b.appendChild(s)}})}catch(e){}};
/* --- short sounds (WebAudio, under 0.2 s), vibration on big moments, a switch to turn them off --- */
var AC=null;
function snd(kind){if(G.mute)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();var t=AC.currentTime;
  var P={tap:[[660,0.05]],hit:[[220,0.06]],crit:[[180,0.05],[360,0.07]],heal:[[523,0.06],[784,0.08]],combo:[[392,0.06],[523,0.06],[784,0.1]],big:[[130,0.12],[98,0.18]],win:[[523,0.08],[659,0.08],[784,0.14]],lose:[[300,0.12],[200,0.18]],evolve:[[392,0.07],[523,0.07],[659,0.07],[1047,0.16]],forge:[[880,0.05],[1320,0.09]]}[kind];if(!P)return;
  P.forEach(function(p,i){var o=AC.createOscillator(),g=AC.createGain();o.type=kind==='big'||kind==='hit'?'square':'triangle';o.frequency.value=p[0];var s0=t+i*0.07;g.gain.setValueAtTime(0.0001,s0);g.gain.exponentialRampToValueAtTime(0.12,s0+0.01);g.gain.exponentialRampToValueAtTime(0.0001,s0+p[1]);o.connect(g);g.connect(AC.destination);o.start(s0);o.stop(s0+p[1]+0.02)})}catch(e){}}
function buzz(p){if(G.mute)return;try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}}
var showEventV13=showEvent;
showEvent=function(e){try{
  if(e.mega||e.all||e.t==='ult'){snd('big');buzz([60,40,120])}else if(e.t==='combo')snd('combo');
  else if(e.t==='hit')snd(e.eff==='super'||e.crit?'crit':'hit');else if(e.t==='heal'||e.t==='regen')snd('heal');
  else if(e.t==='foeDown')snd('win');else if(e.t==='teamDown')snd('lose');}catch(x){}
  return showEventV13(e)};
var scCasaV13=scCasa;
scCasa=function(){var h=scCasaV13();var k=h.indexOf('<div class="flat"><h3>Partida</h3>');var sw='<div class="flat"><div class="row between"><h3>So i vibració</h3><button type="button" class="btn sm '+(G.mute?'light':'green')+'" data-act="mute" aria-pressed="'+(!G.mute)+'">'+(G.mute?'Apagat':'Encès')+'</button></div></div>';return k<0?h+sw:h.slice(0,k)+sw+h.slice(k)};
(function(){try{var st=document.createElement('style');st.textContent='.ab-row span{font-size:12px!important}.mtabs{display:flex;gap:6px;overflow-x:auto;margin:4px 0 10px}.mtab{position:relative;flex:1 0 auto;min-height:44px;border:2px solid #1E1B2E;background:#fff;border-radius:12px;font-weight:800;font-size:13px;padding:6px 10px;color:#1E1B2E}.mtab.on{background:#1E1B2E;color:#fff}.rdot{position:absolute;top:4px;right:6px;width:10px;height:10px;border-radius:50%;background:#E5322D;border:2px solid #fff}.navb{position:relative}';document.head.appendChild(st)}catch(e){}})();

/* ================= V14 ART: one drawing per species and per form (stage 0/1/2) ================= */
/* Overrides critter(), spArt(), cArt() and patches the evolution tree in detailSheet() so each form is drawn apart. */
var ART_DK={foc:'#B8431F',aigua:'#1B5FA8',planta:'#24753C',llamp:'#B5850A',psiquic:'#5E2A9E'};
var ART_AC={foc:'#FFB238',aigua:'#9ED3FF',planta:'#8FE09C',llamp:'#FFE27A',psiquic:'#F0C3FF'};
var NS=' stroke="none"';
function aP(d,f,x){return '<path d="'+d+'" fill="'+f+'"'+(x||'')+'/>'}
function aC(cx,cy,r,f,x){return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+f+'"'+(x||'')+'/>'}
function aE(cx,cy,rx,ry,f,x){return '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="'+f+'"'+(x||'')+'/>'}
function aL(d,c,w){return '<path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="'+w+'"/>'}
/* thick line with dark outline (limbs, tentacles, tails) */
function aT(d,c,w){return aL(d,'#2A1F3D',w+3)+aL(d,c,w)}
function aM(s){return '<g transform="matrix(-1 0 0 1 64 0)">'+s+'</g>'}
/* merged circles with one outline (clouds, puffs) */
function aB(l,f){return l.map(function(c){return aC(c[0],c[1],c[2],'#2A1F3D',' stroke="#2A1F3D" stroke-width="4"')}).join('')+l.map(function(c){return aC(c[0],c[1],c[2],f,NS)}).join('')}
function aEye(x,y,r,role,dir,c){
  var o=aC(x,y,r,'#fff',' stroke-width="1.5"')+aC(x-dir*r*.18,y+r*.14,r*.56,'#1E1B2E',NS)+aC(x-dir*r*.18-r*.22,y-r*.16,r*.22,'#fff',NS);
  if(role==='Atac')o+=aL('M'+(x+dir*r*1.05)+' '+(y-r*1.25)+' L'+(x-dir*r*.95)+' '+(y-r*.45),'#2A1F3D',2.4);
  else if(role==='Defensa')o+=aP('M'+(x-r)+' '+(y-r*.15)+' A'+r+' '+r+' 0 0 1 '+(x+r)+' '+(y-r*.15)+' Z',c,' stroke-width="1.5"');
  else o+=aE(x+dir*r*.2,y+r*1.55,r*.6,r*.35,'#FF8FA3',NS+' opacity=".75"');
  return o;
}
function aMouth(role,x,y){
  if(role==='Atac')return aL('M'+(x-3.5)+' '+y+' Q'+x+' '+(y+3)+' '+(x+3.5)+' '+(y-.5),'#2A1F3D',1.8)+aP('M'+(x+.6)+' '+(y+1.1)+' l1.3 2.6 l1.2 -2.9 Z','#fff',' stroke-width="1"');
  if(role==='Defensa')return aL('M'+(x-3)+' '+(y+1)+' H'+(x+3),'#2A1F3D',1.8);
  return aL('M'+(x-3)+' '+y+' Q'+x+' '+(y+3.5)+' '+(x+3)+' '+y,'#2A1F3D',1.8);
}
function aHy(el,x,y,s){
  var B=ELS[el];if(!B)return '';var d={
    foc:'M0 6 C-6 5 -5 -2 -1 -7 C0 -3 2 -4 2 -6 C7 -1 6 5 0 6 Z',
    aigua:'M0 -7 C3 -3 6 0 6 2.5 A6 6 0 0 1 -6 2.5 C-6 0 -3 -3 0 -7 Z',
    planta:'M-6 6 C-6 -3 0 -7 7 -7 C7 1 2 6 -6 6 Z',
    llamp:'M1.5 -8 L-5.5 1 H-.5 L-1.5 8 L5.5 -1 H.5 Z',
    psiquic:'M0 -6.5 L6 0 L0 6.5 L-6 0 Z'}[el];
  return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')">'+aP(d,B.c,' stroke-width="1.6"')+(el==='psiquic'?aC(0,0,1.8,'#fff',NS):'')+'</g>';
}
/* each species: function(p) -> {b: body svg, e:[x1,x2,y,r] or null, ce: custom eyes, m:[x,y] mouth or null, f: front svg, h:[[x,y],..] hybrid marks, t:[x,y] head top} */
var ART={
espurnet:function(p){var s=p.st,o='';
  if(s>0)o+=aP('M42 52 Q54 54 56 '+(42-s*4)+' Q62 50 56 56 Q50 60 42 57 Z',p.H);
  o+=aP(s<2?'M20 38 C15 26 23 24 23 14 C29 20 31 24 32 28 C33 20 39 18 40 10 C46 20 47 30 44 38 Z':'M18 38 C12 26 20 20 18 6 C27 14 29 20 30 26 C31 14 38 12 38 2 C46 12 47 20 44 26 C48 22 52 20 52 14 C56 26 52 34 46 38 Z',p.H);
  o+=aE(32,45,15,14,p.c)+aE(32,51,8,5.5,p.L,NS);
  if(s>1)o+=aP('M19 40 L12 33 L20 36 Z M45 40 L52 33 L44 36 Z',p.c);
  return {b:o,e:[26,38,43,4.6],m:[32,50],h:[[18,50],[46,50]],t:[32,14]}},
fumet:function(p){var s=p.st,o='';
  if(s>0)o+=aP('M12 60 L52 52 L54 57 L14 64 Z M52 60 L12 52 L10 57 L50 64 Z','#8A5A3C');
  o+=aL('M27 26 q-5 -6 1 -11 q5 -4 1 -9 M37 25 q5 -6 -1 -10','#8E8AA0',3);
  o+=aB([[21,48,10],[43,48,10],[32,40,14],[32,52,12]],p.c)+aE(32,52,9,5,p.L,NS);
  if(s>1)o+=aP('M20 30 L22 22 L26 28 L30 18 L34 28 L38 20 L41 28 L44 22 L45 31 Q32 26 20 30 Z',p.H);
  return {b:o,e:[26,38,42,4.6],m:[32,49],h:[[16,46],[48,46]],t:[32,18]}},
brasa:function(p){var s=p.st,o='';
  if(s>1)o+=aP('M20 24 L22 8 L28 18 L32 4 L36 18 L42 8 L44 24 Z',p.H);
  o+=aP(s?'M8 58 L7 38 L16 24 L32 18 L48 24 L57 38 L56 58 Z':'M12 58 L10 40 L20 26 L36 22 L50 30 L54 44 L50 58 Z',p.D);
  if(s)o+=aP('M7 38 L2 30 L14 28 Z M57 38 L62 30 L50 28 Z',p.D);
  o+=aL('M16 32 L22 38 L18 46 M48 32 L42 40 L47 48',p.H,2);
  o+=aP('M22 58 L24 46 L40 46 L42 58 Z',p.c,' stroke-width="1.5"')+aL('M24 52 H40',p.D,1.5);
  return {b:o,e:[26,38,36,4.6],m:[32,42],h:[[14,50],[50,50]],t:[32,18]}},
xurrufet:function(p){var s=p.st,o='';var top=s>1?20:26;
  if(s>1)o+=aP('M20 46 L10 60 L20 58 Z M44 46 L54 60 L44 58 Z',p.D);
  o+=aL('M32 '+top+' Q34 '+(top-8)+' 40 '+(top-10),'#2A1F3D',2)+aP('M40 '+(top-17)+' l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z','#FFE27A',' stroke-width="1.2"');
  o+='<rect x="20" y="'+top+'" width="24" height="'+(60-top)+'" rx="6" fill="'+p.c+'"/>';
  if(s>1)o+=aP('M20 28 L32 '+(top-2)+' L44 28 Z',p.D);
  if(s>0)o+='<rect x="21" y="50" width="22" height="4" fill="'+p.H+'"'+NS+'/><rect x="21" y="'+(top+5)+'" width="22" height="3" fill="'+p.H+'"'+NS+'/>';
  return {b:o,e:[27,37,38,4.2],m:[32,45],h:[[20,46],[44,46]],t:[32,top-4]}},
cremallot:function(p){var s=p.st,o='';
  o+=aT('M14 48 L10 32 M21 48 L21 30',p.c,3);
  o+=aP('M4 58 Q6 46 18 46 L50 46 Q60 50 58 58 Z',p.c);
  if(s<2){o+=aC(38,36,s?17:15,p.D)+aL('M38 36 m-2 0 a2 2 0 1 1 4 0 a5 5 0 1 1 -9 0 a8 8 0 1 1 16 0',p.H,2.5);
    if(s)o+=aP('M28 24 L26 16 L33 21 Z M40 19 L42 11 L46 20 Z M51 28 L58 24 L54 32 Z',p.H);}
  else o+=aP('M22 50 L32 14 L48 14 L58 50 Z',p.D)+aE(40,14,8,3,p.H)+aL('M36 16 Q34 26 37 34 M44 16 Q47 24 45 30',p.H,2.5);
  return {b:o,ce:aEye(10,30,3.6,'Defensa',-1,p.c)+aEye(21,28,3.6,'Defensa',1,p.c),m:[15,53],h:[[30,40],[46,40]],t:[16,22]}},
fogonet:function(p){var s=p.st,o='';var hy=s>1?6:12;
  o+=aE(32,46,15,14,p.c);
  if(s>1)o+=aP('M22 40 H42 L44 58 H20 Z','#fff',' stroke-width="1.5"');
  o+=aB([[24,hy+8,6],[32,hy+5,7],[40,hy+8,6]],'#fff')+'<rect x="23" y="'+(hy+10)+'" width="18" height="'+(22-hy+4)+'" fill="#fff"/>';
  o+=aP('M32 '+(hy+12)+' c2 3 3 5 0 7 c-3 -2 -2 -4 0 -7 Z',p.c,NS);
  if(s>0)o+=aE(52,48,7,3,'#4A4660')+aL('M46 48 L40 50','#4A4660',3);
  return {b:o,e:[26,38,40,4.4],m:[32,46],h:[[18,50],[46,54]],t:[32,hy]}},
dragonet:function(p){var s=p.st,o='';var k=.75+.17*s;
  var w='<g transform="translate(24 40) scale('+k+') translate(-24 -40)">'+aP('M24 34 L4 16 L8 28 L0 30 L10 38 L4 44 L24 44 Z',p.D)+aL('M22 36 L8 24 M22 40 L6 34',p.H,1.4)+'</g>';
  o+=w+aM(w);
  o+=aT('M42 52 Q56 58 58 44',p.c,4)+aP('M56 44 L62 36 L54 40 Z',p.D);
  o+=aE(32,48,12,11,p.c)+aE(32,51,6.5,6.5,p.L,NS)+aL('M28 48 H36 M28 52 H36',p.D,1);
  o+=aP('M22 24 L'+(18-s*2)+' '+(10-s*3)+' L28 20 Z',p.L)+aM(aP('M22 24 L'+(18-s*2)+' '+(10-s*3)+' L28 20 Z',p.L));
  o+=aE(32,30,13,11,p.c)+aE(32,36,7,4.5,p.L,NS)+aC(29.5,35,.9,'#2A1F3D',NS)+aC(34.5,35,.9,'#2A1F3D',NS);
  if(s>1)o+=aP('M26 20 L28 15 L31 19 L34 14 L36 20 Z',p.D);
  return {b:o,e:[26.5,37.5,28,4],m:[32,39],h:[[10,30],[54,30]],t:[32,14]}},
fumerol:function(p){var s=p.st,o='';
  if(s<2)o+=aB([[29,15,6],[36,8,5],[24,8,4]],'#8E8AA0');
  else o+=aP('M24 24 C20 12 28 10 26 0 C32 6 34 8 34 12 C36 6 40 6 40 0 C46 10 44 18 40 24 Z',p.H);
  o+=aP('M12 60 L21 24 L43 24 L52 60 Z',p.c)+aE(32,24,11,3.5,p.D);
  if(s===1)o+=aL('M18 36 H46 M16 46 H48 M28 24 V36 M38 36 V46 M24 46 V60 M42 46 V60',p.D,1.2);
  if(s>1)o+=aL('M26 26 Q24 34 26 40 M39 26 Q42 34 40 42',p.H,3);
  return {b:o,e:[27,37,40,4.3],m:[32,48],h:[[18,52],[46,52]],t:[32,20]}},
gotim:function(p){var s=p.st,o='';
  if(s>1)o+=aE(32,60,24,4,'none',' stroke="'+p.H+'" stroke-width="2"');
  o+=aP('M32 12 C40 26 50 34 50 45 A18 18 0 0 1 14 45 C14 34 24 26 32 12 Z',p.c)+aE(32,52,9,5,p.L,NS)+aE(22,38,2.5,5,'#fff',NS+' opacity=".7" transform="rotate(25 22 38)"');
  if(s>0)o+=aP('M32 12 C38 4 48 6 46 14 C44 10 38 10 36 16 Z',p.H);
  if(s>1)o+=aP('M14 40 C6 38 6 30 10 26 C10 32 14 34 16 34 Z M50 40 C58 38 58 30 54 26 C54 32 50 34 48 34 Z',p.H);
  return {b:o,e:[26,38,42,4.5],m:[32,49],h:[[20,50],[44,50]],t:[32,10]}},
bufa:function(p){var s=p.st,o='',r=14+s*1.5,sp=[];
  for(var i=0;i<10;i++){var a=-Math.PI+i*Math.PI/9*1.2-0.15,x=32+Math.cos(a)*r,y=40+Math.sin(a)*r;sp.push('M'+(x-2.5)+' '+y.toFixed(1)+' L'+(32+Math.cos(a)*(r+4+s*2)).toFixed(1)+' '+(40+Math.sin(a)*(r+4+s*2)).toFixed(1)+' L'+(x+2.5)+' '+(y+1).toFixed(1)+' Z')}
  o+=aP(sp.join(' '),s>1?p.D:p.H)+aP('M46 40 L60 30 L58 40 L60 50 Z',p.H);
  o+=aC(32,40,r,p.c)+aE(32,48,r*.6,r*.4,p.L,NS);
  if(s>0)o+=aP('M'+(32-r)+' 36 A'+r+' '+r+' 0 0 1 '+(32+r)+' 36 Q32 '+(28-s*2)+' '+(32-r)+' 36 Z',p.D,' stroke-width="1.5"');
  return {b:o,e:[26,37,41,4.4],m:[31,48],h:[[18,46],[46,46]],t:[32,22]}},
petxina:function(p){var s=p.st,o='';
  if(s===1)o+=aT('M18 20 L14 8 M14 14 L8 10 M46 20 L50 8 M50 14 L56 10','#FF7F8E',2.5);
  o+=aP(s>1?'M8 52 L4 36 L10 34 L8 22 L16 22 L18 10 L26 14 L32 4 L38 14 L46 10 L48 22 L56 22 L54 34 L60 36 L56 52 Z':'M10 52 Q6 18 32 12 Q58 18 54 52 Z',p.L)+aL('M32 50 V16 M32 50 L18 20 M32 50 L46 20 M32 50 L11 36 M32 50 L53 36',p.D,1.2);
  o+=aE(32,50,13,9,p.c);
  return {b:o,e:[27,37,48,4],m:[32,54],h:[[16,30],[48,30]],t:[32,12]}},
nedet:function(p){var s=p.st,o='';
  o+=aT('M46 50 Q60 52 60 38',p.c,6);
  if(s>1)o+=aP('M28 38 L36 24 L42 38 Z',p.D);
  o+=aE(32,48,20,11,p.c)+aE(32,54,12,4,p.L,NS);
  if(s>0)o+=aL('M36 40 L40 46 L44 40',p.D,1.5);
  o+=aC(11,27,3.5,p.c)+aC(25,26,3.5,p.c)+aC(18,36,11,p.c)+aE(15,41,6,4,p.L,NS)+aE(15,38.5,1.8,1.3,'#2A1F3D',NS)+aL('M8 41 L2 40 M8 43 L2 45',p.D,1);
  return {b:o,e:[13,23,33,3.5],m:[16,43],h:[[36,44],[50,48]],t:[18,24]}},
medusina:function(p){var s=p.st,o='',n=s?6:4;
  for(var i=0;i<n;i++){var x=16+i*(32/(n-1));o+=aT('M'+x+' 36 q-4 6 0 12 q4 6 0 '+(8+s*2),p.c,2.6)}
  if(s>1)o+=aP('M24 36 q-2 10 4 18 q2 -10 0 -18 Z M40 36 q2 10 -4 18 q-2 -10 0 -18 Z',p.L);
  o+=aP('M10 37 Q10 12 32 12 Q54 12 54 37 Q48 34 43 38 Q38 34 32 38 Q26 34 21 38 Q16 34 10 37 Z',p.c)+aE(24,20,5,3,'#fff',NS+' opacity=".45"');
  if(s>1)o+=aC(20,17,1.6,'#FFD54A',' stroke-width="1"')+aC(32,13,1.8,'#FFD54A',' stroke-width="1"')+aC(44,17,1.6,'#FFD54A',' stroke-width="1"');
  return {b:o,e:[26,38,26,4.2],m:[32,32],h:[[14,26],[50,26]],t:[32,8]}},
cranquet:function(p){var s=p.st,o='',k=1+s*.12;
  o+=aL('M18 48 L8 56 M20 52 L12 60 M46 48 L56 56 M44 52 L52 60','#2A1F3D',2.5);
  var cl='<g transform="translate(10 32) scale('+k+') translate(-10 -32)">'+aT('M20 44 L12 36',p.c,3)+aC(10,32,6.5,p.c)+aP('M5 29 Q1 20 8 16 Q9 23 11 27 Z',p.c)+aP('M14 28 Q18 20 13 17 Q12 23 11 27 Z',p.c)+'</g>';
  o+=cl+(s>1?'<g transform="translate(54 32) scale(1.25) translate(-54 -32)">'+aM(cl)+'</g>':aM(cl));
  o+=aT('M26 38 V28 M38 38 V28',p.c,2);
  if(s>1)o+=aP('M14 44 L10 38 L18 40 L20 34 L26 38 L32 32 L38 38 L44 34 L46 40 L54 38 L50 44 Z',p.D);
  o+=aE(32,46,18,11,p.c)+aP('M14 44 Q32 30 50 44 Q32 40 14 44 Z',p.D,NS)+aE(32,52,9,3.5,p.L,NS);
  return {b:o,e:[26,38,26,4],m:[32,48],h:[[20,46],[44,46]],t:[32,20]}},
bombolli:function(p){var s=p.st,o='',R=17+s*2;
  if(s>0)o+=aC(52,18,4,p.H,' opacity=".7" stroke-width="1.2"')+aC(12,22,3,p.H,' opacity=".7" stroke-width="1.2"');
  if(s>1)o+=aC(8,40,3.5,p.H,' opacity=".7" stroke-width="1.2"')+aC(56,44,3,p.H,' opacity=".7" stroke-width="1.2"');
  o+=aC(32,40,R,p.H,' fill-opacity=".45" stroke="'+p.D+'"')+aE(32,46,11,10,p.c)+aL('M'+(32-R*.7)+' '+(40-R*.3)+' A'+R*.8+' '+R*.8+' 0 0 1 '+(32-R*.1)+' '+(40-R*.8),'#fff',2.5);
  return {b:o,e:[27.5,36.5,44,3.6],m:[32,50],h:[[32-R+2,48],[32+R-2,48]],t:[32,40-R]}},
popet:function(p){var s=p.st,o='',n=s>1?6:4;
  for(var i=0;i<n;i++){var x=14+i*(36/(n-1)),d=i<n/2?-1:1;o+=aT('M'+x+' 40 Q'+(x+d*2)+' 52 '+(x+d*8)+' 56 Q'+(x+d*12)+' 54 '+(x+d*9)+' 50',p.c,4)}
  o+=aP('M12 42 Q10 '+(12-s*2)+' 32 '+(10-s*2)+' Q54 '+(12-s*2)+' 52 42 Z',p.c)+aE(32,42,18,5,p.c,NS);
  if(s>0)o+=aC(18,24,2,p.L,NS)+aC(46,22,2.4,p.L,NS)+aC(40,16,1.6,p.L,NS);
  if(s>1)o+=aP('M24 12 L28 2 L32 10 L36 2 L40 12 Z',p.D);
  return {b:o,e:[26,38,32,4.6],m:[32,40],h:[[16,30],[48,30]],t:[32,8]}},
brotet:function(p){var s=p.st,o='';
  o+=aL('M32 34 V'+(20-s*3),p.D,3);
  var lf=s?'M32 '+(22-s*3)+' Q18 '+(14-s*4)+' 6 '+(18-s*4)+' Q20 28 32 '+(22-s*3)+' Z':'M32 22 Q20 10 12 18 Q22 24 32 22 Z';
  o+=aP(lf,p.H)+aM(aP(lf,p.H));
  if(s>1)o+=aP('M32 18 Q28 6 32 -2 Q36 6 32 18 Z',p.H);
  o+=aE(32,46,14,13,p.c)+aE(32,51,7,5,p.L,NS);
  if(s>1)o+=aP('M20 56 L16 62 L22 60 Z M44 56 L48 62 L42 60 Z',p.D);
  return {b:o,e:[26,38,44,4.4],m:[32,50],h:[[20,50],[44,50]],t:[32,14]}},
molsa:function(p){var s=p.st,o='';
  if(s>0)o+=aL('M18 38 Q14 26 20 22 Q24 24 21 27 M46 38 Q50 24 44 20 Q40 22 43 25',p.D,2.4);
  o+=aP('M4 60 Q4 '+(36-s*2)+' 32 '+(32-s*2)+' Q60 '+(36-s*2)+' 60 60 Z',p.c);
  o+=aC(14,48,2,p.H,NS)+aC(50,50,2.4,p.H,NS)+aC(20,40,1.8,p.H,NS)+aC(44,40,1.8,p.H,NS)+aC(10,56,1.6,p.H,NS)+aC(54,57,1.6,p.H,NS);
  var fl=function(x,y){return aC(x-2,y,1.8,'#fff',NS)+aC(x+2,y,1.8,'#fff',NS)+aC(x,y-2,1.8,'#fff',NS)+aC(x,y+2,1.8,'#fff',NS)+aC(x,y,1.3,'#F7C948',NS)};
  o+=fl(26,34-s*2)+(s>1?fl(38,33)+fl(16,38):'');
  return {b:o,e:[24,40,46,4.6],m:[32,53],h:[[12,52],[52,52]],t:[32,28]}},
pinyol:function(p){var s=p.st,o='';
  if(s>1)o+=aP('M14 38 L6 34 L14 44 Z M50 38 L58 34 L50 44 Z M18 50 L10 52 L18 56 Z M46 50 L54 52 L46 56 Z',p.D);
  o+=aL('M32 22 Q34 14 40 12',p.D,2.5)+aP('M40 12 Q46 8 48 14 Q42 16 40 12 Z',p.H);
  o+=aP('M32 22 Q50 30 46 48 Q42 60 32 60 Q22 60 18 48 Q14 30 32 22 Z',p.c);
  if(s>0)o+=aL('M20 34 L26 30 L32 34 L38 30 L44 34 M18 44 L25 40 L32 44 L39 40 L46 44 M20 54 L26 50 L32 54 L38 50 L44 54',p.D,1.5);
  else o+=aL('M32 26 Q26 40 32 58',p.L,2);
  return {b:o,e:[26.5,37.5,40,4.2],m:[32,47],h:[[18,42],[46,42]],t:[32,10]}},
arrel:function(p){var s=p.st,o='',w='#8A5A3C';
  o+=aT('M20 56 Q14 60 6 60 M44 56 Q50 60 58 60 M26 58 L22 63 M38 58 L42 63','#6B3E26',2.2);
  if(s>1)o+=aB([[18,18,10],[32,12,12],[46,18,10],[32,24,10]],p.c)+aC(24,14,2,p.H,NS)+aC(40,12,2,p.H,NS);
  o+=aP('M16 60 L19 26 L45 26 L48 60 Z',w)+aE(32,26,13,4,'#C9A06A')+aE(32,26,6,1.8,'none',' stroke="#8A5A3C" stroke-width="1"');
  if(s>0)o+=aL('M22 34 V44 M42 36 V50 M26 50 V58 M38 30 V36',w==='#8A5A3C'?'#6B3E26':w,1.3);
  if(s<2)o+=aP('M24 24 Q20 14 28 16 Q30 20 28 24 Z M36 24 Q36 12 44 14 Q42 20 38 24 Z',p.c);
  o+=aE(32,52,9,4,p.c,NS);
  return {b:o,e:[26,38,38,4.4],m:[32,45],h:[[20,48],[44,48]],t:[32,s>1?2:14]}},
boleto:function(p){var s=p.st,o='',W=22+s*3,Y=34-s;
  o+=aP('M22 60 Q20 44 24 '+Y+' L40 '+Y+' Q44 44 42 60 Z','#FFF1DC');
  o+=aP('M'+(32-W)+' '+Y+' Q'+(32-W+2)+' '+(10-s*2)+' 32 '+(8-s*2)+' Q'+(32+W-2)+' '+(10-s*2)+' '+(32+W)+' '+Y+(s>1?' L'+(32+W-6)+' '+(Y-2)+' L'+(32+W-12)+' '+(Y+1)+' L32 '+(Y-1)+' L'+(32-W+12)+' '+(Y+1)+' L'+(32-W+6)+' '+(Y-2):' Q32 '+(Y+6))+' Z',p.c);
  o+=aC(22,20,3,p.L,NS)+aC(38,15,3.5,p.L,NS)+aC(44,26,2.5,p.L,NS)+aC(28,28,2,p.L,NS);
  return {b:o,e:[27,37,44,4.2],m:[32,51],h:[[14,26],[50,26]],t:[32,4]}},
cucafera:function(p){var s=p.st,o='';
  if(s>1){var wg=aP('M30 36 Q10 10 4 22 Q2 34 26 42 Z',p.H)+aC(14,24,3,p.D,NS)+aP('M28 44 Q8 52 10 58 Q20 60 30 48 Z',p.H);o+=wg+aM(wg)}
  var seg=s>1?[[32,54,7],[32,44,9]]:[[10,52,6.5],[20,50,7.5],[31,48,8.5]];
  seg.forEach(function(c,i){o+=aC(c[0],c[1],c[2],i%2?p.L:p.c)});
  if(s===1)o+=aP('M8 46 L10 40 L13 46 Z M18 43 L20 36 L23 43 Z M29 40 L31 32 L34 40 Z',p.H);
  var hx=s>1?32:45,hy=s>1?30:38;
  o+=aL('M'+(hx-4)+' '+(hy-9)+' Q'+(hx-8)+' '+(hy-18)+' '+(hx-12)+' '+(hy-16)+' M'+(hx+4)+' '+(hy-9)+' Q'+(hx+8)+' '+(hy-18)+' '+(hx+12)+' '+(hy-16),'#2A1F3D',1.8)+aC(hx-12,hy-16,2,p.H,' stroke-width="1.2"')+aC(hx+12,hy-16,2,p.H,' stroke-width="1.2"');
  o+=aC(hx,hy,11,p.c);
  return {b:o,e:[hx-5,hx+5,hy-1,3.6],m:[hx,hy+5],h:s>1?[[12,26],[52,26]]:[[10,52],[31,48]],t:[hx,hy-12]}},
punxetes:function(p){var s=p.st,o='';
  if(s>1)o+=aE(10,30,7,10,p.c)+aE(54,30,7,10,p.c);
  o+=aT('M20 42 H12 Q8 42 8 36 V28 M44 36 H52 Q56 36 56 30 V24',p.c,6);
  o+=aP('M19 60 V26 Q19 14 32 14 Q45 14 45 26 V60 Z',p.c)+aL('M26 20 V58 M38 20 V58',p.D,1.2);
  o+=aL('M19 30 h-3 M19 40 h-3 M19 50 h-3 M45 30 h3 M45 46 h3 M32 14 v-3 M8 26 v-3 M56 22 v-3'+(s>1?' M4 28 h-3 M60 28 h3 M10 20 v-3 M54 20 v-3':''),'#2A1F3D',1.5);
  if(s>0)o+=aC(28,13,3,'#FF7FB0',' stroke-width="1.2"')+aC(36,13,3,'#FF7FB0',' stroke-width="1.2"')+aC(32,10,3,'#FF7FB0',' stroke-width="1.2"')+aC(32,13,1.6,'#F7C948',NS);
  return {b:o,e:[27,37,32,4.3],m:[32,39],h:[[24,50],[40,50]],t:[32,6]}},
bavos:function(p){var s=p.st,o='';var R=14+s*2;
  o+=aT('M14 48 L10 32 M21 48 L21 30',p.c,3);
  o+=aP('M4 58 Q6 46 18 46 L50 46 Q60 50 58 58 Z',p.c);
  o+=aP('M30 '+(38-R)+' Q22 '+(30-R)+' 26 '+(22-R+6)+' Q32 '+(28-R)+' 30 '+(38-R)+' Z',p.L)+aP('M44 '+(38-R)+' Q54 '+(28-R)+' 50 '+(22-R+6)+' Q44 '+(28-R)+' 44 '+(38-R)+' Z',p.L);
  o+=aC(38,38,R,s>1?p.D:'#C9E86A')+aL('M38 38 m-2 0 a2 2 0 1 1 4 0 a5 5 0 1 1 -9 0 a8 8 0 1 1 16 0',s>1?p.H:p.D,2.2);
  if(s>1)o+=aP('M26 30 L22 26 L28 26 Z M50 30 L56 26 L52 32 Z M38 '+(38-R)+' l-3 -5 l6 0 Z',p.H);
  return {b:o,ce:aEye(10,30,3.6,'Defensa',-1,p.c)+aEye(21,28,3.6,'Defensa',1,p.c),m:[15,53],h:[[30,44],[48,44]],t:[16,22]}},
xispa:function(p){var s=p.st,o='',e=s*3;
  o+=aP('M10 48 L'+(6-e)+' 36 L14 38 L'+(12-e)+' '+(24-e)+' L22 32 L'+(26)+' '+(18-e)+' L32 28 L'+(38)+' '+(18-e)+' L42 32 L'+(52+e)+' '+(24-e)+' L50 38 L'+(58+e)+' 36 L54 48 Z',p.D);
  if(s>1)o+=aP('M26 '+(18-e)+' l-2 -5 l4 2 Z M38 '+(18-e)+' l2 -5 l-4 2 Z',p.H);
  o+=aE(32,46,18,14,p.c)+aE(32,53,10,5,p.L,NS);
  if(s>0)o+='<rect x="15" y="44" width="34" height="4" fill="'+p.D+'"'+NS+'/>';
  return {b:o,e:[26,38,40,4.4],m:[32,50],h:[[16,52],[48,52]],t:[32,20]}},
trona:function(p){var s=p.st,o='';
  o+=aP('M44 46 L56 34 L52 34 L60 '+(22-s*3)+' L48 32 L52 32 L42 42 Z',p.H);
  o+='<rect x="24" y="52" width="5" height="9" rx="2" fill="'+p.D+'"/><rect x="40" y="52" width="5" height="9" rx="2" fill="'+p.D+'"/>';
  o+=aE(36,48,14,9,p.c)+aE(36,52,8,3,p.L,NS);
  o+=aP('M12 30 L'+(9-s)+' '+(14-s*2)+' L20 24 Z M26 24 L'+(31+s)+' '+(12-s*2)+' L32 28 Z',p.c);
  o+=aP('M20 40 L14 46 L20 46 L16 52 L28 44 Z',p.H);
  o+=aC(22,34,11,p.c)+aE(22,40,6,4,p.L,NS)+aC(22,38.5,1.4,'#2A1F3D',NS);
  if(s>1)o+=aP('M18 24 l-2 -8 l4 3 l1 -5 l3 8 Z',p.H);
  return {b:o,e:[17.5,26.5,33,3.5],m:[22,42],h:[[34,44],[44,44]],t:[22,20]}},
guspira:function(p){var s=p.st,o='',R=20+s*2,r=10+s;
  if(s>0)o+=aL('M32 '+(42-R-6)+' v-4 M'+(32+R+4)+' 36 h4 M'+(32-R-4)+' 36 h-4',p.D,2);
  if(s>1)o+=aC(32,40,R+2,p.H,NS+' opacity=".5"');
  var pt=[];for(var i=0;i<10;i++){var a=-Math.PI/2+i*Math.PI/5,rr=i%2?r:R;pt.push((32+Math.cos(a)*rr).toFixed(1)+' '+(40+Math.sin(a)*rr).toFixed(1))}
  o+=aP('M'+pt.join(' L')+' Z',p.c,' stroke-width="2.5"')+aC(32,44,6,p.L,NS);
  return {b:o,e:[27,37,40,3.8],m:[32,46],h:[[14,34],[50,34]],t:[32,40-R]}},
endollet:function(p){var s=p.st,o='';
  o+=aT('M46 52 Q58 52 56 58 Q54 62 62 62','#4A4660',2);
  if(s===0)o+='<rect x="23" y="14" width="5" height="14" rx="1" fill="#C9C4D6"/><rect x="36" y="14" width="5" height="14" rx="1" fill="#C9C4D6"/>';
  if(s===1)o+='<rect x="26" y="20" width="12" height="7" rx="2" fill="#C9C4D6"/>';
  if(s>1)o+=aL('M32 26 V12','#2A1F3D',2)+aC(32,10,3.5,'#FF5A4E')+'<rect x="10" y="38" width="6" height="14" rx="3" fill="'+p.D+'"/><rect x="48" y="38" width="6" height="14" rx="3" fill="'+p.D+'"/>';
  o+='<rect x="17" y="26" width="30" height="32" rx="'+(s?5:9)+'" fill="'+p.c+'"/>';
  if(s===1)o+='<rect x="22" y="47" width="20" height="7" rx="1.5" fill="#fff" stroke-width="1.2"/><rect x="23.5" y="48.5" width="12" height="4" fill="#3DAA5C"'+NS+'/>';
  if(s>1)o+='<rect x="20" y="32" width="24" height="12" rx="5" fill="#1E1B2E"/>';
  return {b:o,e:s>1?null:[26,38,37,4.2],ce:s>1?aE(26,38,4,2.2,'#7CF0FF',NS)+aE(38,38,4,2.2,'#7CF0FF',NS)+aL('M21 31 L29 34 M43 31 L35 34','#2A1F3D',2):null,m:[32,s===1?44:49],h:[[20,52],[44,30]],t:[32,20]}},
brunzit:function(p){var s=p.st,o='';
  if(s<2){o+=aP('M34 34 Q42 '+(12-s*3)+' 58 '+(12-s*3)+' Q52 28 40 40 Z',p.H)+aL('M38 34 Q46 22 54 18',p.c,1.2)}
  else{var w=aP('M26 38 L2 16 L12 20 L4 8 L18 16 L16 4 L30 30 Z',p.D);o+=w+aM(w)}
  o+=aP('M38 46 L50 62 L44 52 L50 60 L38 52 Z',p.D);
  o+=aP(s>1?'M20 38 L8 42 L20 44 Z':'M20 36 L2 33 L20 41 Z','#4A4660');
  o+=aE(32,42,13,12,p.c)+aE(32,48,7,5,p.L,NS);
  if(s>1)o+=aP('M28 30 L30 22 L33 28 L36 22 L37 31 Z',p.H);
  return {b:o,e:[27,37,39,3.6],m:null,h:[[24,48],[40,48]],t:[32,28]}},
cuquet:function(p){var s=p.st,o='';
  o+=aC(32,48,13+s*3,p.H,NS+' opacity=".55"');
  if(s>0)o+=aL('M22 40 L22 60 M42 40 L42 60 M20 60 H44 M20 40 H44','#4A4660',1.5);
  var w=aE(21,30,7,10,'#fff',' fill-opacity=".7" stroke-width="1.2" transform="rotate(-30 21 30)"');o+=w+aM(w);
  if(s>1){var w2=aE(18,40,6,8,'#fff',' fill-opacity=".7" stroke-width="1.2" transform="rotate(-60 18 40)"');o+=w2+aM(w2)}
  o+=aE(32,49,9,9,'#FFF6B0')+aL('M24 48 H40 M25 53 H39',p.H,1.5);
  o+=aL('M28 24 Q24 14 20 14 M36 24 Q40 14 44 14','#2A1F3D',1.6)+aC(20,14,2,p.H,' stroke-width="1"')+aC(44,14,2,p.H,' stroke-width="1"');
  o+=aC(32,32,10,p.c);
  if(s>1)o+=aP('M10 14 l1.5 3.5 l3.5 1.5 l-3.5 1.5 l-1.5 3.5 l-1.5 -3.5 l-3.5 -1.5 l3.5 -1.5 Z M54 46 l1.2 3 l3 1.2 l-3 1.2 l-1.2 3 l-1.2 -3 l-3 -1.2 l3 -1.2 Z','#FFE27A',' stroke-width="1"');
  return {b:o,e:[27.5,36.5,31,3.4],m:[32,36],h:[[24,50],[40,50]],t:[32,20]}},
imantat:function(p){var s=p.st,o='';
  if(s>0)o+=aL('M4 24 Q0 36 6 46 M60 24 Q64 36 58 46',p.H,2)+aP('M2 14 l2 4 l-3 1 Z M60 12 l2 4 l-3 1 Z','#9AA3B5',' stroke-width="1"');
  if(s>1)o+=aL('M10 8 Q32 -2 54 8',p.H,2);
  o+=aP('M9 16 L9 36 A23 23 0 0 0 55 36 L55 16 L42 16 L42 36 A10 10 0 0 1 22 36 L22 16 Z',p.c);
  o+='<rect x="9" y="'+(10-s)+'" width="13" height="'+(8+s)+'" fill="#E2574C"/><rect x="42" y="'+(10-s)+'" width="13" height="'+(8+s)+'" fill="#C9C4D6"/>';
  if(s>1)o+=aP('M9 30 L3 34 L9 38 Z M55 30 L61 34 L55 38 Z',p.D);
  return {b:o,e:[24.5,39.5,51,3.6],m:null,h:[[15,30],[49,30]],t:[32,6]}},
nuvolet:function(p){var s=p.st,o='',cl=s>1?'#5E5A7A':'#F4F1FA';
  var bolt=function(x,y){return aP('M'+(x+2)+' '+y+' L'+(x-4)+' '+(y+10)+' H'+x+' L'+(x-3)+' '+(y+18)+' L'+(x+6)+' '+(y+6)+' H'+(x+2)+' L'+(x+5)+' '+y+' Z',p.c,' stroke-width="1.6"')};
  o+=bolt(31,42)+(s>0?bolt(16,40):'')+(s>1?bolt(46,40):'');
  o+=aB([[16,36,10],[30,28,14],[46,32,11],[32,40,12],[50,40,8]],cl);
  o+=aE(18,42,3.5,2,p.c,NS+' opacity=".8"')+aE(46,42,3.5,2,p.c,NS+' opacity=".8"');
  return {b:o,e:[26,38,34,4.4],m:[32,41],h:[[14,30],[50,26]],t:[30,14]}},
mentoli:function(p){var s=p.st,o='';
  if(s>0)o+=aE(32,62,12,2,'#2A1F3D',NS+' opacity=".25"')+aL('M12 30 Q8 36 12 42 M52 30 Q56 36 52 42',p.H,2);
  if(s>1)o+=aL('M6 24 Q2 36 6 48 M58 24 Q62 36 58 48',p.H,2);
  var pe=function(a){return '<g transform="rotate('+a+' 32 32)">'+aP('M32 32 Q25 '+(22-s*2)+' 32 '+(12-s*3)+' Q39 '+(22-s*2)+' 32 32 Z','#FFB8E0')+'</g>'};
  o+=pe(-40)+pe(40)+pe(0);
  o+=aE(32,45,14,13-s,p.c)+aE(32,51,8,4.5,p.L,NS)+aC(32,35,1.8,p.H,NS);
  return {b:o,e:[26,38,42,4.5],m:[32,49],h:[[18,48],[46,48]],t:[32,10]}},
somni:function(p){var s=p.st,o='';
  if(s>1)o+=aP('M44 4 A28 28 0 1 0 60 48 A22 22 0 1 1 44 4 Z','#FFE27A');
  if(s===1)o+=aP('M14 36 L6 30 L14 30 L10 22 L20 28 Z M50 36 L58 30 L50 30 L54 22 L44 28 Z',p.D);
  o+=aE(32,45,15,15,p.c)+aE(32,52,8,5,p.L,NS);
  o+=aP('M14 34 Q32 44 50 34 Q50 24 54 14 Q42 30 32 28 Q22 30 10 14 Q14 24 14 34 Z','#FFE27A');
  if(s>1)o+=aP('M8 10 l1.2 3 l3 1.2 l-3 1.2 l-1.2 3 l-1.2 -3 l-3 -1.2 l3 -1.2 Z','#fff',' stroke-width="1"');
  return {b:o,e:[26,38,44,4.5],m:[32,51],h:[[18,52],[46,52]],t:[32,24]}},
ullet:function(p){var s=p.st,o='';
  if(s>1)o+=aP('M12 20 L4 10 L18 14 Z M52 20 L60 10 L46 14 Z M8 40 L0 44 L10 48 Z M56 40 L64 44 L54 48 Z',p.H);
  var f=aP('M14 34 Q2 26 4 40 Q8 36 14 42 Z',p.D);o+=f+aM(f);
  o+=aT('M32 54 Q28 60 34 62',p.c,3);
  o+=aC(32,36,19,p.c);
  if(s>0)o+=aP('M24 52 l2 5 l2 -4 Z M36 52 l2 4 l2 -5 Z','#fff',' stroke-width="1"');
  return {b:o,ce:aC(32,36,12,'#fff',' stroke-width="1.6"')+aC(32,37,7,s>1?'#7CF0FF':'#FFB238',' stroke-width="1"')+aC(32,37,3.6,'#1E1B2E',NS)+aC(29.5,34,1.8,'#fff',NS)+aL('M18 21 L32 27 L46 21','#2A1F3D',2.6),m:null,h:[[16,48],[48,48]],t:[32,16]}},
fantasmet:function(p){var s=p.st,o='',g='#F1E8FF';
  if(s>0)o+=aT('M50 46 Q60 50 58 58',g,4);
  var bot=s>1?' L50 60 L45 52 L40 62 L35 53 L30 62 L25 53 L20 62 L16 52 L14 60':' L50 58 L44 52 L38 58 L32 52 L26 58 L20 52 L14 58';
  o+=aP('M14 '+(s>1?60:58)+' L14 30 Q14 12 32 12 Q50 12 50 30'+bot+' Z',g,' fill-opacity=".95"')+aP('M14 44 Q32 50 50 44 L50 52 Q32 56 14 52 Z',p.L,NS+' opacity=".7"');
  o+=aT('M14 34 Q6 36 8 42',g,4)+aT('M50 34 Q58 30 58 24',g,4);
  if(s>1)o+=aP('M20 14 L22 2 L27 9 L32 0 L37 9 L42 2 L44 14 Q32 10 20 14 Z','#FFD54A');
  var ec=s>1?'#C084FC':'#1E1B2E';
  return {b:o,ce:aE(25,30,4,5.5,ec)+aE(39,30,4,5.5,ec)+aC(24,28.5,1.3,'#fff',NS)+aC(38,28.5,1.3,'#fff',NS)+aL('M19 21 L29 25 M45 21 L35 25','#2A1F3D',2.4),m:[32,40],h:[[20,44],[44,44]],t:[32,10]}},
mussolet:function(p){var s=p.st,o='';
  if(s>1){var w=aP('M18 34 Q0 30 2 50 Q10 44 18 50 Z',p.D)+aC(8,42,1.4,'#FFE27A',NS);o+=w+aM(w)}
  o+=aP('M18 26 L'+(14-s*2)+' '+(10-s*3)+' L26 20 Z M46 26 L'+(50+s*2)+' '+(10-s*3)+' L38 20 Z',p.c);
  o+=aE(32,42,17,18,p.c)+aE(32,50,9,8,p.L,NS)+aL('M28 46 l2 2 l2 -2 M32 52 l2 2 l2 -2 M26 52 l2 2 l2 -2',p.D,1);
  if(s<2){var w1=aP('M16 36 Q10 46 16 56 Q20 48 18 38 Z',p.D);o+=w1+aM(w1)}
  o+=aC(25,34,8,p.L,NS)+aC(39,34,8,p.L,NS)+aP('M30 39 L34 39 L32 44 Z','#F2A33A',' stroke-width="1.2"');
  return {b:o,e:[25,39,34,4.6],m:null,h:[[14,50],[50,50]],t:[32,10]}},
bolavidre:function(p){var s=p.st,o='';
  if(s>1)o+=aE(32,30,28,7,'none',' stroke="'+p.H+'" stroke-width="2"');
  o+=aP(s?'M14 62 L18 52 L22 48 L42 48 L46 52 L50 62 Z':'M18 62 L22 50 L42 50 L46 62 Z','#B5793E')+aL('M20 56 H44',s?'#FFD54A':'#8A5A3C',2);
  o+=aC(32,30,20,p.c,' fill-opacity=".6" stroke="'+p.D+'"')+aL('M20 34 Q28 24 36 32 Q42 38 46 28',p.H,2.5)+aL('M16 24 A17 17 0 0 1 26 13','#fff',3);
  if(s>0)o+=aP('M40 18 l1 2.5 l2.5 1 l-2.5 1 l-1 2.5 l-1 -2.5 l-2.5 -1 l2.5 -1 Z','#fff',NS);
  if(s>1)o+=aP('M8 34 A28 7 0 0 0 56 34','none',' stroke="'+p.H+'" stroke-width="2"');
  return {b:o,e:[25,39,32,4.4],m:[32,40],h:[[14,40],[50,40]],t:[32,8]}},
barretmagic:function(p){var s=p.st,o='',H=14-s*4,hc='#2A2440';
  if(s>1)o+=aP('M14 36 L4 62 L60 62 L50 36 Z',p.D)+aC(10,56,1.4,'#FFE27A',NS)+aC(54,52,1.4,'#FFE27A',NS);
  o+=aE(32,48,14,12,p.c)+aE(32,54,7,4,p.L,NS);
  o+='<g transform="rotate(-8 32 34)"><rect x="20" y="'+H+'" width="24" height="'+(34-H)+'" rx="2" fill="'+hc+'"/><rect x="20" y="28" width="24" height="5" fill="'+p.c+'"'+NS+'/>'+aE(32,35,19,4.5,hc)+aP('M32 '+(H+6)+' l1.5 3.5 l3.8 .4 l-2.9 2.5 l.9 3.7 l-3.3 -2 l-3.3 2 l.9 -3.7 l-2.9 -2.5 l3.8 -.4 Z','#FFD54A',NS)+'</g>';
  if(s>0)o+=aL('M50 56 L60 40','#1E1B2E',2.5)+aL('M59 41.5 L60.5 39','#fff',2.5)+aP('M60 36 l1 2 l2 1 l-2 1 l-1 2 l-1 -2 l-2 -1 l2 -1 Z','#FFE27A',' stroke-width="1"');
  var ec=s>1?'#FFE27A':null;
  return {b:o,e:ec?null:[26,38,45,4.2],ce:ec?aE(26,45,3.8,2.6,ec,' stroke-width="1.4"')+aE(38,45,3.8,2.6,ec,' stroke-width="1.4"')+aL('M21 40 L29 43 M43 40 L35 43','#2A1F3D',2.4):null,m:[32,52],h:[[18,52],[46,52]],t:[32,H-4]}},
dormilega:function(p){var s=p.st,o='';
  if(s>0)o+=aE(30,59,26,5,'#F4F1FA');
  o+=aT('M52 50 Q62 44 58 34 Q54 28 50 34',p.L,5);
  o+=aE(36,48,20,11,p.c)+aE(34,53,12,4,p.L,NS);
  if(s>1)o+=aP('M22 44 Q36 34 56 44 L56 56 Q36 60 22 56 Z',p.D)+aL('M30 40 V58 M40 38 V58 M48 40 V58',p.H,1);
  o+=aC(9,32,4,p.c)+aC(18,40,11,p.c)+aE(16,45,5,3.5,p.L,NS)+aE(15,43,1.6,1.2,'#2A1F3D',NS);
  o+=aP('M8 34 Q10 22 22 22 Q32 22 38 '+(14-s*2)+' Q30 32 28 30 Q20 28 8 34 Z',p.H)+aC(38,14-s*2,3,'#fff',' stroke-width="1.4"');
  return {b:o,ce:aL('M11 39 Q13.5 41.5 16 39 M20 39 Q22.5 41.5 25 39','#2A1F3D',1.8)+aL('M10 37.5 H16 M20 37.5 H26','#2A1F3D',1.2),m:[18,47],h:[[34,44],[46,48]],t:[20,22]}}
};
function artDraw(sp,st,el2,locked,px){
  var S=SPECIES[sp]||SPECIES.espurnet,A=ELS[S.el]||ELS.foc,f=ART[sp]||ART.espurnet;st=Math.max(0,Math.min(2,st||0));
  var r=f({c:A.c,L:A.belly,D:ART_DK[S.el],H:ART_AC[S.el],st:st,role:S.role}),o=r.b;
  if(r.ce)o+=r.ce;else if(r.e)o+=aEye(r.e[0],r.e[2],r.e[3],S.role,-1,A.c)+aEye(r.e[1],r.e[2],r.e[3],S.role,1,A.c);
  if(r.m)o+=aMouth(S.role,r.m[0],r.m[1]);
  if(r.f)o+=r.f;
  if(S.role==='Curador'&&st>0&&r.t)o+=aE(r.t[0],r.t[1]-1,8,2.4,'none',' stroke="#FFD54A" stroke-width="2.2"');
  if(el2&&ELS[el2]&&st>0&&r.h)o+=r.h.map(function(h,i){return aHy(el2,h[0],h[1],i?.8:1)}).join('');
  var sc=[.8,.9,1][st];
  return '<svg class="cr" width="'+px+'" height="'+px+'" viewBox="0 0 64 64" aria-hidden="true"'+(locked?' style="filter:brightness(0) opacity(.22)"':'')+'><g transform="translate(32 63) scale('+sc+') translate(-32 -63)" stroke="#2A1F3D" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">'+o+'</g></svg>';
}
critter=function(el,el2,px,locked,evolved,shape){
  var sp=SP_ORDER.filter(function(s){return SPECIES[s].el===el&&SPECIES[s].shape===shape})[0]||SP_ORDER.filter(function(s){return SPECIES[s].el===el})[0]||'espurnet';
  return artDraw(sp,typeof evolved==='number'?evolved:evolved?(el2?2:1):0,el2,locked,px);
};
spArt=function(s,el2,px,locked,evolved){return artDraw(s,typeof evolved==='number'?evolved:evolved?(el2?2:1):0,el2,locked,px)};
cArt=function(c,px,locked){return artDraw(c.sp,c.stage||0,cEl2(c),locked,px)};
/* the evolution tree only passes evolved=true/false: give it the real stage (0, 1 or 2) */
(function(){try{var src=detailSheet.toString(),n=src.replace('spArt(s,e.el2,52,!ok,i>=0)','spArt(s,e.el2,52,!ok,i<0?0:i===0?1:2)').replace('spArt(s,e.el2,52,false,true)','spArt(s,e.el2,52,false,i===0?1:2)');
  if(n!==src)detailSheet=eval('('+n+')')}catch(e){}})();

/* ================= V14: house — more to build and decorate, grouped by area ================= */
/* Areas for the build list. Old items get an area too. */
var H14_AREAS=[['dorm','Dormitori'],['sala','Sala'],['taller','Taller'],['elem','Sales d’element'],['ext','Exterior']];
var H14_OLD={habitacio:'dorm',mobles:'sala',jardi:'ext',piscina:'ext',spa:'ext',tennis:'ext'};
BUILD.forEach(function(x){if(!x.area)x.area=H14_OLD[x.k]||'ext'});
/* element rooms: one per world, opened when the last zone (guardian) of that world is done */
var H14_EL={foc:'salaFoc',llamp:'salaLlamp',aigua:'salaAigua',planta:'salaPlanta',psiquic:'salaPsiquic'};
BUILD.push(
  {k:'llit',n:'Llit-cabana',what:'A casa descansen +1 per expedició',price:220,max:1,cap:0,area:'dorm'},
  {k:'neo',n:'Rètol de neó',what:'Decoració que brilla',price:120,max:1,cap:0,area:'dorm'},
  {k:'posters',n:'Pòsters de guardians',what:'Un pòster per cada món acabat',price:60,max:1,cap:0,area:'dorm'},
  {k:'hamaca',n:'Hamaca',what:'+1 plaça',price:180,max:1,cap:1,area:'dorm'},
  {k:'consola',n:'Consola i pantalla',what:'Decoració: pantalla gran',price:300,max:1,cap:0,area:'sala'},
  {k:'pufs',n:'Puf de colors',what:'Decoració (fins a 3)',price:60,max:3,cap:0,area:'sala'},
  {k:'pingpong',n:'Taula de ping-pong',what:'Decoració per al racó de jocs',price:250,max:1,cap:0,area:'sala'},
  {k:'trofeus',n:'Estanteria de trofeus',what:'Trofeus dels mons i tresors rars',price:200,max:1,cap:0,area:'sala'},
  {k:'peixera',n:'Peixera',what:'Les d’Aigua descansen +1 per expedició',price:150,max:1,cap:0,area:'sala'},
  {k:'cuina',n:'Cuina de bestioles',what:'+1 menjar del món on acabes un camí',price:400,max:1,cap:0,area:'taller'},
  {k:'forja',n:'Taller de forja',what:'Forjar costa un 20% menys',price:500,max:1,cap:0,area:'taller'},
  {k:'lab',n:'Laboratori',what:'Una de casa guanya +1 estrella per expedició',price:600,max:1,cap:0,area:'taller'},
  {k:'salaFoc',n:'Forja de lava',what:'Les de Foc descansen +1 per expedició',price:450,max:1,cap:0,area:'elem',el:'foc'},
  {k:'salaLlamp',n:'Sala de bobines',what:'+10% de monedes per expedició',price:450,max:1,cap:0,area:'elem',el:'llamp'},
  {k:'salaAigua',n:'Aquari gegant',what:'+2 places',price:450,max:1,cap:2,area:'elem',el:'aigua'},
  {k:'salaPlanta',n:'Hivernacle',what:'+1 Fulla tendra per camí completat',price:450,max:1,cap:0,area:'elem',el:'planta'},
  {k:'salaPsiquic',n:'Observatori',what:'+1 Bolet somiador per camí completat',price:600,max:1,cap:0,area:'elem',el:'psiquic'},
  {k:'skate',n:'Rampa de skate',what:'Decoració per fer salts',price:300,max:1,cap:0,area:'ext'},
  {k:'arbre',n:'Casa a l’arbre',what:'+2 places',price:500,max:1,cap:2,area:'ext'},
  {k:'foguera',n:'Foguera',what:'De nit, a casa descansen el doble',price:150,max:1,cap:0,area:'ext'},
  {k:'hort',n:'Hort de baies',what:'+1 menjar a l’atzar per camí completat',price:250,max:1,cap:0,area:'ext'},
  {k:'antena',n:'Antena de rastreig',what:'Decoració: bandera d’un color cada dia',price:350,max:1,cap:0,area:'ext'},
  {k:'portal',n:'Portal entre mons',what:'+25 monedes per camí completat',price:900,max:1,cap:0,area:'ext'}
);
function h14Item(k){return BUILD.filter(function(x){return x.k===k})[0]}
function h14WorldDone(w){return !!G.done[w+':z2']}
function h14Open(x){return !x.el||h14WorldDone(x.el)}

/* ---------- effects ---------- */
/* forge discount: FORGE_COST is read everywhere, so keep it in step with the build */
var H14_FC=FORGE_COST.slice();
function h14Forge(){for(var i=0;i<H14_FC.length;i++)FORGE_COST[i]=G.built.forja?Math.round(H14_FC[i]*0.8):H14_FC[i]}
var h14Render=render;
render=function(){h14Forge();return h14Render.apply(this,arguments)};

/* after each expedition: extra rest, extra coins and food from the house */
var h14FinishRun=finishRun;
finishRun=function(ok,keepAll){
  var r=run();if(!r)return h14FinishRun.apply(this,arguments);
  var team=r.team.slice(),w=r.world,c0=G.coins;
  var out=h14FinishRun.apply(this,arguments);
  var s=G.summary||{},B=G.built,got=G.coins-c0,notes=[];
  var home=G.owned.filter(function(c){return team.indexOf(c.uid)<0&&!busyWorld(c)});
  function rest1(c){if(c.rest>0){c.rest=Math.max(0,c.rest-1);if(!c.rest)c.fat=0}else c.fat=Math.max(0,c.fat-1)}
  var rested=0;
  home.forEach(function(c){var e=sp(c).el,n=(B.llit?1:0)+(B.peixera&&e==='aigua'?1:0)+(B.salaFoc&&e==='foc'?1:0);if(n&&(c.rest>0||c.fat>0))rested++;for(var i=0;i<n;i++)rest1(c)});
  if(rested)notes.push(rested+(rested>1?' bestioles han':' bestiola ha')+' descansat més gràcies a la casa.');
  function coin(n,why){G.coins+=n;s.coins=(s.coins||0)+n;notes.push(why+': +'+n+' monedes.')}
  if(B.salaLlamp&&got>0){var x=Math.max(1,Math.round(got*0.1));coin(x,'Sala de bobines')}
  if(ok){
    if(B.portal)coin(25,'Portal entre mons');
    var food=function(el,why){G.food[el]=(G.food[el]||0)+1;notes.push(why+': +1 '+FOOD[el]+'.')};
    if(B.cuina&&FOOD[w])food(w,'Cuina');
    if(B.salaPlanta)food('planta','Hivernacle');
    if(B.salaPsiquic)food('psiquic','Observatori');
    if(B.hort)food(pickOne(ORDER),'Hort de baies');
  }
  if(B.lab){var cand=home.filter(function(c){return c.mill<5&&cName(c)!==s.tennis});if(cand.length){var t=pickOne(cand);t.mill++;notes.push(cName(t)+' ha fet experiments al laboratori: +1 estrella de força.')}}
  s.house=notes;
  return out;
};
var h14ScResum=scResum;
scResum=function(){var h=h14ScResum.apply(this,arguments),s=G.summary,m='<div class="row" style="justify-content:center">',i=h.lastIndexOf(m);
  if(!s||!s.house||!s.house.length||i<0)return h;
  return h.slice(0,i)+'<div class="small" style="background:#FFF4D6;border-radius:12px;padding:8px 12px;text-align:left"><b>La casa ajuda:</b> '+esc(s.house.join(' '))+'</div>'+h.slice(i)};

/* campfire: at night the 10-minute rest at home counts double */
var h14Rest=applyRestClock;
applyRestClock=function(){
  var now=Date.now(),before=G.restClock;h14Rest.apply(this,arguments);
  if(!G.built.foguera||!(before<=now))return;
  var steps=Math.round((G.restClock-before)/600000),hr=new Date().getHours();if(steps<=0||(hr>=8&&hr<21))return;
  var per=Math.min(steps,20);
  G.owned.forEach(function(c){if(busyWorld(c))return;if(c.rest>0){c.rest=Math.max(0,c.rest-per);if(!c.rest)c.fat=0}else c.fat=Math.max(0,c.fat-per)});
};

/* locked element rooms cannot be bought; area headings fold */
function h14Folded(a){var f=G.hFold&&G.hFold[a];if(f!==undefined)return !!f;
  return BUILD.filter(function(x){return x.area===a}).every(function(x){return (G.built[x.k]||0)>=x.max})}
var h14Act=act;
act=function(a,d){
  if(a==='build'){var bd=h14Item(d.k);if(bd&&!h14Open(bd)){toast('Primer has d’acabar: '+ELS[bd.el].mon+'.');return}}
  if(a==='hfold'){G.hFold=G.hFold||{};G.hFold[d.k]=!h14Folded(d.k);persist();render();return}
  return h14Act.apply(this,arguments);
};

/* ---------- build list, grouped by area ---------- */
(function(){if(!document.head||!document.head.appendChild)return;var st=document.createElement('style');st.textContent=
  '.h14head{display:flex;align-items:center;gap:8px;width:100%;min-height:44px;margin-top:4px;padding:8px 4px 6px;background:none;border:0;border-bottom:2px solid #E3E0EA;font-family:var(--display);font-weight:800;font-size:17px;color:var(--ink);text-align:left;cursor:pointer}'+
  '.h14head>span:first-child{flex:1}.h14head .h14n{font-family:inherit;font-size:13px;font-weight:700;color:#5E5A72}'+
  '.h14builds .grid3{margin-top:8px}.h14builds{margin-top:-8px}.h14builds .tap{min-height:92px;justify-content:space-between}.h14builds .tap .muted{line-height:1.2;font-size:12.5px}'+
  '.h14builds .tap.h14lock{background:#ECE9F2;border-style:dashed}';
  document.head.appendChild(st)})();
function h14Btn(x){
  var n=G.built[x.k]||0,full=n>=x.max,lock=!h14Open(x),poor=G.coins<x.price,
    stripe=x.el?' border-top:6px solid '+ELS[x.el].c+';':'';
  var tag=full?'<span class="tag good">Fet</span>':lock?'<span class="tag">Tancada</span>':'<span class="tag mid">'+x.price+' monedes</span>';
  var what=lock?'Cal acabar: '+ELS[x.el].mon:x.what;
  return '<button type="button" class="tap'+(lock?' h14lock':'')+'" data-act="build" data-k="'+x.k+'"'+(full||poor||lock?' disabled':'')+' style="'+stripe+'"'+(lock?' aria-label="'+esc(x.n+': tancada. '+what)+'"':'')+'>'+
    '<span style="font-size:14px;text-align:center;line-height:1.15">'+esc(x.n)+(x.max>1&&n?' ('+n+')':'')+'</span><span class="muted small" style="text-align:center;font-weight:700">'+esc(what)+'</span>'+tag+'</button>';
}
function h14Builds(){
  return H14_AREAS.map(function(A){var items=BUILD.filter(function(x){return x.area===A[0]});if(!items.length)return '';
    var done=items.filter(function(x){return (G.built[x.k]||0)>=x.max}).length,fold=h14Folded(A[0]);
    return '<button type="button" class="h14head" data-act="hfold" data-k="'+A[0]+'" aria-expanded="'+(!fold)+'"><span>'+esc(A[1])+'</span><span class="h14n">'+done+' de '+items.length+' fets</span><span aria-hidden="true">'+(fold?'▸':'▾')+'</span></button>'+
      (fold?'':'<div class="grid3">'+items.map(h14Btn).join('')+'</div>')}).join('');
}
var h14ScCasa=scCasa;
scCasa=function(){var h=h14ScCasa.apply(this,arguments),a=h.indexOf('<h2>Construir i decorar</h2>');if(a<0)return h;
  var g=h.indexOf('<div class="grid3">',a),e=g<0?-1:h.indexOf('</div>',g);if(e<0)return h;
  return h.slice(0,g)+'<div class="h14builds">'+h14Builds()+'</div>'+h.slice(e+6)};

/* ---------- house drawing ---------- */
/* the drawing keeps the 366-wide coordinates; it grows downwards: a second garden strip and an underground floor */
function h14Lay(b){var ext=!!(b.skate||b.foguera||b.hort||b.portal),el=ORDER.some(function(w){return b[H14_EL[w]]}),g1=ext?346:270;
  return {ext:ext,el:el,g1:g1,H:el?g1+88:g1}}
function h14RoomX(w){return 6+ORDER.indexOf(w)*72}
houseCrew=function(home){
  var b=G.built,L=h14Lay(b),ham=b.hamaca;
  var spots=[[ham?52:62,139],[ham?88:102,139],[158,139],[198,139],[62,191],[102,191],[158,191],[198,191]];
  for(var k=0;k<(b.habitacio||0);k++){var y=196-40*k;spots.push([248,y-2],[278,y-2])}
  if(b.jardi)spots.push([318,196],[346,196],[332,182]);
  if(b.piscina)spots.push([262,244],[306,244]);
  if(ham)spots.push([110,126]);
  if(b.arbre)spots.push([318,96],[344,96]);
  if(b.salaAigua){var ax=h14RoomX('aigua');spots.push([ax+18,L.g1+82],[ax+48,L.g1+82])}
  return home.slice(0,spots.length).map(function(c,i){var s=spots[i];
    return '<div class="in" style="left:'+(s[0]/366*100)+'%;top:'+(s[1]/L.H*100)+'%">'+(c.rest>0?'<div style="color:#34405A">z z</div>':'')+cArt(c,30)+'</div>'}).join('');
};
var h14HouseSvg=houseSvg;
function h14Txt(x,y,t,fill,size){return '<text x="'+x+'" y="'+y+'" font-size="'+(size||9)+'" font-weight="800" font-family="Nunito,sans-serif" fill="'+(fill||'#1E1B2E')+'">'+t+'</text>'}
function h14Anim(attr,vals,dur){return RM?'':'<animate attributeName="'+attr+'" values="'+vals+'" dur="'+dur+'" repeatCount="indefinite"/>'}
houseSvg=function(b,home){
  var full=h14HouseSvg.apply(this,arguments),s0=full.indexOf('<svg'),s1=full.indexOf('>',s0)+1,s2=full.indexOf('</svg>');
  if(s0<0||s2<0)return full;
  var o=full.slice(s1,s2),L=h14Lay(b),back='',f='',i;
  /* --- behind the house: antenna, tree house --- */
  if(b.antena){var dw=ORDER[Math.floor(Date.now()/86400000)%ORDER.length];
    back+='<g stroke="#5E6678" stroke-width="2" fill="none"><path d="M5 196 L12 62 L19 196"/><path d="M7 160 H17 M8 128 H16 M9 98 H15 M7 160 L16 128 M8 128 L15 98"/></g><path d="M12 62 V54" stroke="#34405A" stroke-width="2"/>'+
      '<path d="M12 56 L1 59 L12 63 Z" fill="'+ELS[dw].c+'" stroke="#1E1B2E" stroke-width="1"/><circle cx="12" cy="53" r="2.6" fill="#E2574C">'+h14Anim('opacity','1;.2;1','1.4s')+'</circle>'}
  if(b.arbre){
    back+='<path d="M326 198 C328 160 326 130 328 98 H338 C338 130 336 160 340 198 Z" fill="#6B3E26"/><path d="M330 140 L312 126 M336 120 L354 108" stroke="#6B3E26" stroke-width="4" stroke-linecap="round"/>'+
      '<circle cx="312" cy="84" r="18" fill="#3B7D32"/><circle cx="356" cy="80" r="16" fill="#4E9A43"/><circle cx="334" cy="60" r="16" fill="#3B7D32"/>'+
      '<rect x="306" y="64" width="50" height="32" fill="#C98A5A" stroke="#8A5A3C" stroke-width="2"/><path d="M300 66 L331 44 L362 66 Z" fill="#3DAA5C" stroke="#2C7A42" stroke-width="2.5" stroke-linejoin="round"/>'+
      '<rect x="324" y="70" width="14" height="12" fill="#BFE3F7" stroke="#8A5A3C" stroke-width="1.5"/><rect x="298" y="96" width="66" height="5" rx="2" fill="#8A5A3C"/>'+
      '<g stroke="#B5793E" stroke-width="1.6"><path d="M302 101 V182 M310 101 V182"/><path d="M302 112 H310 M302 124 H310 M302 136 H310 M302 148 H310 M302 160 H310 M302 172 H310"/></g>'}
  /* --- attic workshop (kitchen, forge, lab) inside the roof --- */
  if(b.cuina||b.forja||b.lab){
    f+='<path d="M90 84 V50 H170 V84 Z" fill="#FFE9C7" stroke="#A23A31" stroke-width="2"/>'+h14Txt(94,58,'Taller','#8A5A3C',7.5);
    if(b.cuina)f+='<rect x="94" y="70" width="22" height="14" rx="1.5" fill="#9AA3B5" stroke="#5E6678" stroke-width="1"/><circle cx="99" cy="77" r="2" fill="#34405A"/><circle cx="111" cy="77" r="2" fill="#34405A"/><rect x="98" y="63" width="14" height="7" rx="2" fill="#34405A"/><path d="M101 61 q-2 -3 0 -6 M106 61 q2 -3 0 -6" stroke="#9AA3B5" stroke-width="1.3" fill="none">'+h14Anim('opacity','1;.3;1','1.6s')+'</path>';
    if(b.forja)f+='<path d="M121 72 H143 L139 76 H135 V80 H139 V84 H125 V80 H129 V76 H124 Z" fill="#4A4F63"/><rect x="127" y="69" width="10" height="3" rx="1" fill="#F7A23A"/><circle cx="141" cy="66" r="1.2" fill="#F7C948">'+h14Anim('opacity','1;0;1','.9s')+'</circle><circle cx="124" cy="64" r="1.2" fill="#F26B3A">'+h14Anim('opacity','0;1;0','.9s')+'</circle><path d="M138 62 L132 68" stroke="#6B3E26" stroke-width="2" stroke-linecap="round"/><rect x="136" y="59" width="6" height="4" fill="#5E6678"/>';
    if(b.lab)f+='<path d="M153 60 h6 v6 l6 16 h-18 l6 -16 z" fill="#E8F7F2" stroke="#34405A" stroke-width="1.3" stroke-linejoin="round"/><path d="M149 78 l2 -5 h10 l2 5 z" fill="#7CE0C0"/><circle cx="155" cy="74" r="1.4" fill="#fff">'+h14Anim('cy','76;66;76','2s')+'</circle><rect x="160" y="54" width="8" height="10" rx="1" fill="#34405A"/><path d="M161 60 l2 -2 l2 3 l2 -3" stroke="#7CE0C0" stroke-width="1" fill="none"/>';
  }
  /* --- dormitori: canopy bed, posters, hammock; neon sign on the bathroom wall --- */
  if(b.llit){f+='<rect x="40" y="128" width="32" height="11" rx="2" fill="#fff" stroke="#9AA3B5"/><rect x="42" y="125" width="10" height="5" rx="2" fill="#BFE3F7"/><rect x="52" y="131" width="20" height="8" rx="2" fill="#9B59E0"/>'+
      '<path d="M38 128 L56 107 L74 128" fill="#F7A8C8" fill-opacity=".55" stroke="#D45C8C" stroke-width="1.5" stroke-linejoin="round"/><path d="M56 107 Q50 120 44 128 M56 107 Q62 120 68 128" stroke="#D45C8C" stroke-width="1" fill="none"/>'+
      [[44,121],[50,114],[56,109],[62,114],[68,121]].map(function(p,j){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="1.6" fill="#F7C948">'+h14Anim('opacity',j%2?'1;.3;1':'.3;1;.3','1.2s')+'</circle>'}).join('')}
  if(b.posters){var nd=ORDER.filter(h14WorldDone);var pl=nd.length?nd:[null];
    pl.forEach(function(w,j){var x=90+j*7;f+='<rect x="'+x+'" y="96" width="6" height="9" fill="'+(w?ELS[w].c:'#D9D4E4')+'" stroke="#fff" stroke-width="1"/>'+(w?'<circle cx="'+(x+3)+'" cy="99.5" r="1.6" fill="#1E1B2E"/><path d="M'+(x+1)+' 104 Q'+(x+3)+' 101 '+(x+5)+' 104 Z" fill="#1E1B2E"/>':'')})}
  if(b.hamaca)f+='<path d="M94 110 L98 120 M126 110 L122 120" stroke="#8A5A3C" stroke-width="1.4"/><circle cx="94" cy="110" r="1.4" fill="#6B3E26"/><path d="M98 120 Q110 133 122 120 Z" fill="#F26B3A" stroke="#C0392B" stroke-width="1"/><path d="M101 123 Q110 131 119 123" stroke="#F7C948" stroke-width="1.6" fill="none"/>';
  if(b.neo)f+='<g font-size="8.5" font-weight="900" font-family="Nunito,sans-serif" letter-spacing=".6"><text x="168" y="105" fill="none" stroke="#FF4FA3" stroke-width="3" stroke-opacity=".45">QUIMÈRIA'+h14Anim('stroke-opacity','.45;.15;.45','2.4s')+'</text><text x="168" y="105" fill="#fff" stroke="#FF4FA3" stroke-width=".6">QUIMÈRIA</text></g>';
  /* --- sala: TV + console, fish tank, poufs --- */
  if(b.consola)f+='<rect x="84" y="149" width="34" height="18" rx="2" fill="#1E1B2E" stroke="#5E6678" stroke-width="1.5"/><path d="M88 152 L96 152 L88 160 Z" fill="#fff" fill-opacity=".18"/><rect x="88" y="152" width="26" height="12" fill="#3B7DE6" fill-opacity=".35"/><circle cx="104" cy="158" r="3" fill="#F7C948"/><rect x="94" y="167" width="14" height="3" rx="1" fill="#34405A"/>';
  if(b.peixera)f+='<rect x="46" y="176" width="18" height="15" fill="#B5793E"/><rect x="42" y="160" width="26" height="16" rx="2" fill="#7CC0FF" fill-opacity=".85" stroke="#fff" stroke-width="1.5"/><path d="M45 175 q2 -5 0 -9 M62 175 q-2 -4 0 -8" stroke="#3DAA5C" stroke-width="1.4" fill="none"/>'+
      '<path d="M50 167 l5 -2.5 v5 z M55 167 l4 -2 v4 z" fill="#F26B3A"><animateTransform attributeName="transform" type="translate" values="0 0;5 1;0 0" dur="'+(RM?'0s':'3s')+'" repeatCount="indefinite"/></path><circle cx="60" cy="164" r="1.2" fill="#fff"/><circle cx="58" cy="168" r=".9" fill="#fff"/>';
  var pc=['#F26B3A','#2E8BE6','#F7C948'];for(i=0;i<(b.pufs||0);i++)f+='<ellipse cx="'+(82+i*16)+'" cy="187" rx="7" ry="5" fill="'+pc[i]+'" stroke="#1E1B2E" stroke-opacity=".35" stroke-width="1"/><ellipse cx="'+(82+i*16)+'" cy="184.5" rx="4" ry="1.5" fill="#fff" fill-opacity=".45"/>';
  /* --- racó de jocs: trophy shelf, ping-pong --- */
  if(b.trofeus){var nd2=ORDER.filter(h14WorldDone).length,rel={};
    G.items.concat(Object.keys(G.equip).map(function(k){return G.equip[k]})).forEach(function(id){var it=IT(id);if(it&&it.relic)rel[baseOf(id)]=1});var nr=Object.keys(rel).length;
    f+='<rect x="146" y="166" width="52" height="2.5" fill="#8A5A3C"/><rect x="146" y="175" width="52" height="2.5" fill="#8A5A3C"/>';
    for(i=0;i<5;i++)f+=i<nd2?'<path d="M'+(149+i*10)+' 159 h6 l-1 4 h-1.3 v2 h1.6 v1 h-4.6 v-1 h1.6 v-2 h-1.3 z" fill="#F7C948" stroke="#C98A00" stroke-width=".6"/>':'';
    for(i=0;i<Math.min(4,nr);i++)f+='<path d="M'+(152+i*12)+' 168.5 l3 3 l-3 3.5 l-3 -3.5 z" fill="#9B59E0" stroke="#5B2A96" stroke-width=".6"/>';}
  if(b.pingpong)f+='<path d="M140 184 L146 178 H196 L202 184 Z" fill="#2C9A5C" stroke="#1E6B3E" stroke-width="1"/><path d="M171 178 V184" stroke="#fff" stroke-width="1"/><path d="M170 173 V181" stroke="#1E1B2E" stroke-width="1.4"/><path d="M146 184 V191 M196 184 V191" stroke="#34405A" stroke-width="2"/><circle cx="148" cy="176" r="2.6" fill="#E2574C"/><circle cx="194" cy="176" r="2.6" fill="#2E8BE6"/><circle cx="160" cy="172" r="1.3" fill="#fff"/>';
  /* --- second garden strip --- */
  if(L.ext){
    f+='<rect x="0" y="270" width="366" height="76" fill="#7CC46B"/><path d="M0 270 H366" stroke="#6CB85C" stroke-width="1.5" stroke-dasharray="3 6"/>';
    if(b.skate)f+='<path d="M8 338 H34 Q74 338 76 296 H84 V338 Z" fill="#B7BED0" stroke="#5E6678" stroke-width="2" stroke-linejoin="round"/><path d="M76 294 H86" stroke="#34405A" stroke-width="3" stroke-linecap="round"/><path d="M40 330 Q62 326 70 304" stroke="#fff" stroke-width="1.5" fill="none" stroke-dasharray="3 3"/><rect x="18" y="331" width="18" height="3" rx="1.5" fill="#E2574C"/><circle cx="21" cy="336" r="1.8" fill="#1E1B2E"/><circle cx="33" cy="336" r="1.8" fill="#1E1B2E"/>'+h14Txt(10,286,'Skate');
    if(b.foguera)f+='<rect x="102" y="330" width="16" height="6" rx="3" fill="#8A5A3C"/><rect x="146" y="330" width="16" height="6" rx="3" fill="#8A5A3C"/><path d="M118 336 L146 326 M118 326 L146 336" stroke="#6B3E26" stroke-width="5" stroke-linecap="round"/>'+
      '<path d="M132 330 C120 322 124 310 130 300 C132 308 138 308 136 296 C146 306 146 322 132 330 Z" fill="#F26B3A"/><path d="M132 330 C126 324 128 316 132 310 C134 316 140 318 132 330 Z" fill="#F7C948">'+h14Anim('opacity','1;.55;1','.7s')+'</path>'+h14Txt(104,286,'Foguera');
    if(b.hort){f+='<rect x="176" y="296" width="82" height="42" rx="4" fill="#8A5A3C"/><path d="M178 310 H256 M178 324 H256" stroke="#6B3E26" stroke-width="2"/>';
      var bc=['#E2574C','#2E8BE6','#9B59E0','#F26B3A','#F7C948'];for(var rw=0;rw<3;rw++)for(var cl=0;cl<5;cl++){var hx=186+cl*16,hy=304+rw*14;f+='<path d="M'+hx+' '+(hy+3)+' q-4 -6 0 -8 q4 2 0 8" fill="#3DAA5C"/><circle cx="'+(hx+3)+'" cy="'+(hy+1)+'" r="2" fill="'+bc[(rw+cl)%5]+'"/>'}
      f+=h14Txt(178,290,'Hort de baies')}
    if(b.portal){f+='<g><circle cx="318" cy="318" r="20" fill="#2B1E4A"/>';
      ORDER.forEach(function(w,j){var rr=18-j*3.4;f+='<circle cx="318" cy="318" r="'+rr+'" fill="none" stroke="'+ELS[w].c+'" stroke-width="2.6" stroke-dasharray="'+(rr*2.2)+' '+(rr*1.4)+'"/>'});
      f+=(RM?'':'<animateTransform attributeName="transform" type="rotate" from="0 318 318" to="360 318 318" dur="6s" repeatCount="indefinite"/>')+'</g>'+
        '<path d="M292 340 V318 A26 26 0 0 1 344 318 V340" fill="none" stroke="#8E94A8" stroke-width="8" stroke-linejoin="round"/><path d="M292 340 V318 A26 26 0 0 1 344 318 V340" fill="none" stroke="#5E6678" stroke-width="8" stroke-dasharray="2 9"/><circle cx="318" cy="290" r="3" fill="#F7C948"/>'+h14Txt(272,286,'Portal')}
  }
  /* --- underground floor with one room per element --- */
  if(L.el){var y0=L.g1;
    f+='<rect x="0" y="'+y0+'" width="366" height="'+(L.H-y0)+'" fill="#8A5A3C"/><path d="M0 '+(y0+1)+' H366" stroke="#5BA84E" stroke-width="3"/>'+
      [[30,y0+84],[120,y0+86],[210,y0+83],[300,y0+85],[358,y0+8]].map(function(p){return '<ellipse cx="'+p[0]+'" cy="'+p[1]+'" rx="4" ry="2" fill="#6B3E26"/>'}).join('');
    ORDER.forEach(function(w){var x=h14RoomX(w),y=y0+10,k=H14_EL[w],A=ELS[w];
      if(!b[k]){var open=h14WorldDone(w);f+='<rect x="'+x+'" y="'+y+'" width="66" height="72" rx="4" fill="#6B3E26" stroke="'+A.c+'" stroke-width="2" stroke-dasharray="5 4"/>'+
        (open?'<path d="M'+(x+33)+' '+(y+28)+' v16 M'+(x+25)+' '+(y+36)+' h16" stroke="'+A.c+'" stroke-width="3" stroke-linecap="round"/>':
          '<rect x="'+(x+26)+'" y="'+(y+33)+'" width="14" height="11" rx="2" fill="#4A2E1C"/><path d="M'+(x+29)+' '+(y+33)+' v-4 a4 4 0 0 1 8 0 v4" stroke="#4A2E1C" stroke-width="2.2" fill="none"/>');return}
      var r='<rect x="'+x+'" y="'+y+'" width="66" height="72" rx="4" fill="BG" stroke="#4A2E1C" stroke-width="3"/>',lbl=function(t,c){return h14Txt(x+5,y+11,t,c||'#fff',8)},fl=y+72;
      if(w==='foc')f+=r.replace('BG','#3A2A2E')+'<path d="M'+(x+10)+' '+(y+16)+' l8 10 l-5 8 l10 12 l-4 9 l12 12" stroke="#F26B3A" stroke-width="4.5" fill="none" stroke-linejoin="round"><animate attributeName="stroke" values="#F26B3A;#FF9A3A;#F26B3A" dur="'+(RM?'0s':'2s')+'" repeatCount="indefinite"/></path><path d="M'+(x+10)+' '+(y+16)+' l8 10 l-5 8 l10 12 l-4 9 l12 12" stroke="#FFE08A" stroke-width="1.5" fill="none" stroke-linejoin="round"/>'+
        '<path d="M'+(x+40)+' '+fl+' h20 l-3 -10 h-14 z" fill="#4A4F63"/><rect x="'+(x+44)+'" y="'+(fl-16)+'" width="12" height="6" rx="1" fill="#F7A23A"/>'+lbl('Lava');
      if(w==='llamp')f+=r.replace('BG','#2B2F4A')+[x+12,x+46].map(function(cx){var s='<rect x="'+(cx-4)+'" y="'+(y+28)+'" width="8" height="'+(fl-y-28)+'" fill="#9AA3B5"/>';for(var q=0;q<6;q++)s+='<rect x="'+(cx-6)+'" y="'+(y+30+q*6)+'" width="12" height="3" rx="1.5" fill="#C98A00"/>';return s+'<circle cx="'+cx+'" cy="'+(y+25)+'" r="5" fill="#C7CCDA"/>'}).join('')+
        '<path d="M'+(x+17)+' '+(y+25)+' l6 -5 l4 7 l5 -6 l4 6 l5 -4" stroke="#FFE27A" stroke-width="2" fill="none" stroke-linejoin="round">'+h14Anim('opacity','1;.1;1;.6;1','.8s')+'</path>'+lbl('Bobines');
      if(w==='aigua'){f+=r.replace('BG','#2E8BE6')+'<rect x="'+(x+3)+'" y="'+(y+14)+'" width="60" height="55" fill="#7CC0FF" fill-opacity=".45"/>';
        [8,20,50,58].forEach(function(dx,j){f+='<path d="M'+(x+dx)+' '+fl+' q-4 -8 0 -14 q4 -6 0 -14" stroke="#3DAA5C" stroke-width="2.4" fill="none">'+(RM?'':'<animateTransform attributeName="transform" type="skewX" values="0;'+(j%2?4:-4)+';0" dur="3s" repeatCount="indefinite"/>')+'</path>'});
        f+='<path d="M'+(x+30)+' '+(y+30)+' l7 -3.5 v7 z M'+(x+37)+' '+(y+30)+' l5 -3 v6 z" fill="#F7C948"/><circle cx="'+(x+44)+'" cy="'+(y+24)+'" r="1.6" fill="#fff"/><circle cx="'+(x+46)+'" cy="'+(y+19)+'" r="1.1" fill="#fff"/>'+lbl('Aquari')}
      if(w==='planta'){f+=r.replace('BG','#DDF3E2')+'<path d="M'+x+' '+(y+30)+' L'+(x+33)+' '+(y+14)+' L'+(x+66)+' '+(y+30)+'" stroke="#9AD3B0" stroke-width="2" fill="#F1FBF3"/><path d="M'+(x+16)+' '+(y+22)+' V'+(y+30)+' M'+(x+33)+' '+(y+14)+' V'+(y+30)+' M'+(x+50)+' '+(y+22)+' V'+(y+30)+'" stroke="#9AD3B0" stroke-width="1.5"/>';
        [10,28,46].forEach(function(dx,j){var px=x+dx;f+='<path d="M'+px+' '+(fl-12)+' h12 l-2 12 h-8 z" fill="#E8743B"/><path d="M'+(px+6)+' '+(fl-12)+' V'+(fl-24-j*3)+'" stroke="#2C7A42" stroke-width="1.8"/><ellipse cx="'+(px+3)+'" cy="'+(fl-20-j*2)+'" rx="4" ry="2.2" fill="#3DAA5C"/><ellipse cx="'+(px+9)+'" cy="'+(fl-24-j*3)+'" rx="4" ry="2.2" fill="#3DAA5C"/>'});
        f+=lbl('Hivernacle','#2C7A42')}
      if(w==='psiquic'){f+=r.replace('BG','#1E1B3E');[[8,20],[20,32],[50,18],[58,36],[30,22],[42,40],[12,46]].forEach(function(p,j){f+='<circle cx="'+(x+p[0])+'" cy="'+(y+p[1])+'" r="'+(j%3?1:1.6)+'" fill="#fff">'+h14Anim('opacity',j%2?'1;.3;1':'.4;1;.4','2s')+'</circle>'});
        f+='<circle cx="'+(x+52)+'" cy="'+(y+24)+'" r="6" fill="#F7E7A1"/><circle cx="'+(x+55)+'" cy="'+(y+22)+'" r="5" fill="#1E1B3E"/>'+
          '<rect x="'+(x+18)+'" y="'+(y+40)+'" width="26" height="8" rx="3" fill="#C9A6F2" stroke="#9B59E0" transform="rotate(-30 '+(x+31)+' '+(y+44)+')"/><path d="M'+(x+31)+' '+(y+46)+' L'+(x+24)+' '+fl+' M'+(x+31)+' '+(y+46)+' L'+(x+38)+' '+fl+'" stroke="#C7CCDA" stroke-width="2"/>'+lbl('Observatori')}
    });
  }
  var head='<svg viewBox="0 0 366 '+L.H+'" aria-hidden="true" style="background:#BFE3F7">';
  return '<div class="house">'+head+back+o+f+'</svg>'+houseCrew(home)+'</div>';
};

window.D={g:function(){return G},render:function(){render()},act:function(a,d){act(a,d)},mk:function(s){return mk(s)},sps:function(){return SP_ORDER},B:function(){return BUILD},ORDER:ORDER,ev:function(s){return eval(s)}};
/* ================= COMMENTS ================= */
var F=load(F_KEY)||{who:'',items:[]};
var TYPES=["M’agrada","No m’agrada","Canviaria","Idea","No quadra"],curType=TYPES[0];
function contextText(){
  var s=G.screen,r=run();
  if(s==='run'&&r){var e=r.event,t=ELS[r.world].mon+', lloc '+(r.i+1)+' de '+r.slots.length+(r.cave?' (dins la cova)':'');
    if(e){if(e.type==='scene'&&r.scene)t+=' · '+SCENES[r.scene].n;else t+=' · '+({battle:'batalla contra '+(e.enemy&&e.enemy.n),wild:'bestiola salvatge',fork:'cruïla',guardianPre:'abans del guardià',note:'avís',card:'carta de troballa'}[e.type]||e.type)}
    return t}
  if(s==='mon'||s==='equip')return (s==='mon'?'Dins el ':'Triant l’equip per al ')+ELS[G.world].mon;
  if(G.detail)return 'Fitxa de '+(ownsSp(G.detail)?SPECIES[G.detail].n:'una bestiola que no tens');
  return {casa:'Casa',explorar:'Mapa dels mons',bestioles:'Pantalla de bestioles',motxilla:'Motxilla',resum:'Resum d’expedició'}[s]||s;
}
function saveF(){save(F_KEY,F)}
function renderTypes(){
  $('types').replaceChildren();
  TYPES.forEach(function(t){var b=document.createElement('button');b.type='button';b.className='chip';b.textContent=t;b.setAttribute('aria-pressed',String(t===curType));b.addEventListener('click',function(){curType=t;renderTypes()});$('types').appendChild(b)});
}
function renderF(){
  var L=$('fbList');L.replaceChildren();
  if(!F.items.length){var p=document.createElement('p');p.className='muted';p.textContent='Encara no hi ha comentaris. Escriu el primer mentre jugues.';L.appendChild(p)}
  F.items.forEach(function(it){
    var d=document.createElement('div');d.className='fb';
    var top=document.createElement('div');top.className='row';top.style.gap='6px';
    var tg=document.createElement('span');tg.className='tag';tg.textContent=it.type;top.appendChild(tg);
    var x=document.createElement('button');x.type='button';x.className='fb-x';x.textContent='Esborra';x.setAttribute('aria-label','Esborra aquest comentari');
    x.addEventListener('click',function(){F.items=F.items.filter(function(z){return z.id!==it.id});saveF();renderF()});top.appendChild(x);
    var tx=document.createElement('div');tx.textContent=it.text;
    var cx=document.createElement('div');cx.className='ctx';cx.textContent=it.ctx;
    d.appendChild(top);d.appendChild(tx);d.appendChild(cx);L.appendChild(d);
  });
  L.scrollTop=L.scrollHeight;
  $('fbWa').href='https://wa.me/?text='+encodeURIComponent(exportText().slice(0,3500));
  var tb=document.querySelector('[data-act="chat"]');if(tb)tb.textContent='Comentaris ('+F.items.length+')';
}
function exportText(){
  var lines=['Comentaris de Quimèria','Qui: '+(F.who||'(sense nom)'),'Data: '+new Date().toLocaleString('ca-ES'),
    'Partida: '+G.completed+' expedicions, '+SP_ORDER.filter(ownsSp).length+' de '+SP_ORDER.length+' bestioles, '+formsOwned()+' evolucions, '+G.coins+' monedes',''];
  F.items.forEach(function(it,i){lines.push((i+1)+'. ['+it.type+'] '+it.text);lines.push('   On: '+it.ctx)});
  if(!F.items.length)lines.push('(Cap comentari)');
  return lines.join('\n');
}
$('who').value=F.who||'';
$('who').addEventListener('input',function(){F.who=$('who').value.slice(0,40);saveF();renderF()});
$('fbForm').addEventListener('submit',function(ev){ev.preventDefault();var t=$('fbText').value.trim();if(!t)return;
  F.items.push({id:Date.now().toString(36),type:curType,text:t.slice(0,1500),ctx:contextText(),at:new Date().toISOString()});saveF();$('fbText').value='';renderF();
  $('fbMsg').textContent='Comentari desat.';if(window.matchMedia('(max-width:840px)').matches)setTimeout(function(){$('chat').classList.remove('open')},600)});
$('fbCopy').addEventListener('click',function(){
  var txt=exportText(),out=$('fbOut'),msg=$('fbMsg');
  function fallback(){out.hidden=false;out.value=txt;out.focus();out.select();msg.textContent='Selecciona el text de dalt i copia’l (Ctrl+C, o mantenint premut al mòbil). Després enganxa’l a Claude o envia’l per WhatsApp.'}
  try{navigator.clipboard.writeText(txt).then(function(){out.hidden=true;msg.textContent='Copiat! Ara enganxa’l a la conversa amb Claude o envia’l per WhatsApp.'},fallback)}catch(e){fallback()}
});
var clearArm=false;
$('fbClear').addEventListener('click',function(){if(!clearArm){clearArm=true;$('fbClear').textContent='Segur? Toca un altre cop per esborrar-los tots';return}clearArm=false;$('fbClear').textContent='Esborra tots els comentaris';F.items=[];saveF();renderF()});
$('chatClose').addEventListener('click',function(){$('chat').classList.remove('open')});

renderTypes();render();renderF();
})();
