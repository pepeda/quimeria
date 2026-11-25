'use strict';
/* ---------- new scenes ---------- */
Object.assign(SCENES,{
  riu:{n:'Riu ràpid',art:'river',pool:'gen',nodes:{a:{t:'Un riu ràpid talla el camí. Hi ha pedres per saltar.',ch:[
    {l:'Salta per les pedres',d:'Potser relliques.',risk:1,out:{rand:[[0.6,{coins:12}],[0.4,{dmgTeam:15}]]}},
    {l:'Busca un gual',d:'Tranquil, però no trobes res.',risk:0,out:{note:'Trobeu un lloc on l’aigua és baixa i passeu.'}},
    {l:'Una bestiola d’Aigua us porta',d:'I pesca de passada.',risk:0,req:{el:'aigua'},out:{food:3}}]}}},
  mercader:{n:'Mercader ambulant',art:'village',pool:'gen',nodes:{a:{t:'Un mercader amb un carro ple de coses.',ch:[
    {l:'Compra 3 de menjar',d:'Pagues 20 monedes i reps 3 de menjar d’aquest món.',risk:0,out:{buyFood:20}},
    {l:'Compra un objecte',d:'Pagues 40 monedes i reps un objecte per a la motxilla.',risk:0,out:{shop:40}},
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
    {l:'Fes una espasa',d:'Pagues 40 monedes i reps una Espasa de llamp.',risk:0,out:{buyItem:'espasaLlamp',price:40}},
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

