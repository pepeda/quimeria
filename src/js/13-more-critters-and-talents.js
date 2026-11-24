'use strict';
/* ================= 40 CRITTERS: the 24 later species, their shapes and abilities; explorer talents ================= */

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

