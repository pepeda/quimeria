'use strict';
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

