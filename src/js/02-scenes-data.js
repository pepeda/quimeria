'use strict';
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

