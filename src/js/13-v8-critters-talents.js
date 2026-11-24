'use strict';
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

