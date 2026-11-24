# Consell v13 — Rol: Direcció creativa i noms

Revisor: direcció creativa / noms i disseny de criatures.
Públic: 10-15 anys (jugadora principal de 13) més el pare. To: amb estil i "guai", no infantil, però apte per a tota la família.
Font: `joc-bestioles.html` (SPECIES + l'`Object.assign` de la línia ~1376, el segon `SP_ORDER` de la línia ~1404 amb 40 espècies, ELS, ZONES, BOSS, MEGA, GROUP_NAMES, SETS).

## Criteri general

- **Formes base:** el diminutiu (-et, -eta) hi pot quedar. Són cries i fan gràcia.
- **Nivell 2 i Nivell 3:** res de diminutius. Han de sonar més forts, amb augmentatius (-ot, -às), paraules potents i jocs de paraules.
- **Com evolucionen al codi:** Base → `evos[0]` (Nivell 2) → branca: `evos[1]` (Nivell 3 pur) o `evos[2]` (Nivell 3 híbrid, amb `el2`). Les taules segueixen aquest ordre. El segon element es manté igual que al codi.
- **Cap nom repetit** entre espècies, conjunts, afixos, habilitats ni caps de final. Ara n'hi ha uns quants de repetits (vegeu la secció 0).

## 0. Problemes que he trobat als noms actuals

| Problema | On és |
|---|---|
| Nom repetit **Somiatruites** | Nivell 2 de `mentoli` i Nivell 3 de `dormilega` ("Somiatruites gros") |
| Nom repetit **Cactus** | Híbrid de `pinyol` i Nivell 2 de `punxetes` (més "Cactus de foc") |
| Nom repetit **Rierol** | Nivell 2 de `gotim` i híbrid de `brotet` ("Rierol verd") |
| **Lluerna / Fanal** gairebé repetits | `guspira` (Fanal, Lluerna) i `cuquet` (Lluerna petita, Fanalet) |
| **Drac roig** | Evolució de `dragonet` i també el conjunt "Armadura del Drac Roig" |
| **Brasa** | És una espècie i també un afix de l'equipament |
| **Aurora** | Híbrid de `xispa` i també el combo MEGA "Aurora boreal" |
| **Bolet** | Híbrid de `molsa` i tota la línia de `boleto` |
| **Volcà / Volcanet** | Nivell 2 de `brasa` i Nivell 3 de `fumerol` |
| **Cranc** | Línia de `cranquet` i el monstre "Cranc gegant" |
| **Mag** | `barretmagic` i el cap "Mag de Gel" |
| **Onada** | Nivell 3 de `gotim`, habilitat de `bufa` i encanteri del conjunt Marees |
| Significat estrany | **Trona** vol dir púlpit. **Gotim** és un raïm petit. **Ullal** és una dent, i no lliga amb un ull. **Bufa** farà riure per mal camí a un públic de 13 anys. **Dragó** és un llangardaix petit, i és un pas enrere després de "Dragonet". |
| La progressió baixa | Espurnet → Flamarada → **Caliu** (més feble). Fumerol → Xemeneia → **Volcanet** (diminutiu al nivell 3). Cucafera → … → **Crisàlide** (un estat passiu). Fogonet → Fogoner → **Cuiner** (no és més fort). |
| Context cultural | La **Cucafera** de Tortosa és una bèstia de festa (tortuga i drac), no una eruga. Si s'usa per a una eruga, confon. |

## 1. Nom del joc (8 propostes)

| # | Nom | Per què |
|---|---|---|
| 1 ★ | **Bestiari** | Paraula catalana real (llibre de bèsties). Sona madur i col·leccionista, i lliga amb el pokedex del joc. Es diu fàcil. Un pas endavant respecte de "Bestioles", sense perdre l'arrel. |
| 2 ★ | **Vincles** | Vol dir "lligams": l'equip de 4 i els combos secrets van de lligar criatures. És curt, misteriós i no s'assembla a cap marca de criatures que conegui. |
| 3 ★ | **Quimèria** | El nom d'un món: el lloc on les bèsties es barregen (les branques híbrides són quimeres). Té un toc èpic i fa de bon logotip. |
| 4 | **Cinc Cors** | Els 5 mons, cadascun amb un cor (Cor del volcà, Cor de l'arbre…). Ja surt al joc. |
| 5 | **Esquerda** | Els 5 mons s'han esquerdat. Té to d'aventura i és d'una sola paraula. |
| 6 | **Feràlia** | Ve de "feral", salvatge. Sona a lloc i és fàcil de dir. |
| 7 | **Rastre** | Seguir rastres pels camins. Té un punt d'exploradora. |
| 8 | **Nucli Salvatge** | És més d'acció, i pot servir de subtítol. |

**Top 3 i per què:** *Bestiari* (continuïtat, catalanitat, el sentit de col·leccionar), *Vincles* (el més original i lligat a la mecànica d'equip i combos) i *Quimèria* (el més èpic, i explica les evolucions híbrides). Abans de triar-ne un, cal buscar-lo a les botigues d'aplicacions per comprovar que no hi ha cap joc amb el mateix nom.
Subtítol possible: "**Bestiari** — Els Cinc Mons".

## 2. Noms de les 40 espècies

Format: Base → Nivell 2 → Nivell 3 pur | Nivell 3 híbrid (segon element).

### Foc

| Clau | Rol | Ara | Proposta |
|---|---|---|---|
| espurnet | Atac | Espurnet → Flamarada → Caliu \| Vapor (aigua) | **Espurnet → Flamàs → Infernàs \| Gèiser** (aigua) |
| fumet | Curador | Fumet → Fogueró → Cendra (psíquic)\* \| Brasot | **Fumet → Fogaró → Caliu \| Encens** (psíquic). El caliu és la brasa que dura, i l'encens és fum místic. |
| brasa | Defensa | Brasa → Volcà → Magma (planta)\* \| Tió | **Còdol → Tosca → Volcanàs \| Carbonera** (planta). Una pedra que es fa volcà. La carbonera és un forn de llenya del bosc. Així s'allibera "Brasa" per a l'afix. |
| xurrufet | Atac | Xurrufet → Petardet → Traca \| Bengala (llamp) | **Xurrufet → Petard → Traca \| Bengala**. Ja és molt bona. Només canvio Petardet per Petard. |
| cremallot | Defensa | Cremallot → Cargolava → Fornal \| Cargol de vapor (aigua) | **Cremallot → Cargolava → Fornal \| Locomotora** (aigua). Un cargol de vapor que és un tren: fa gràcia. |
| fogonet | Curador | Fogonet → Fogoner → Cuiner \| Xef màgic (psíquic) | **Fogonet → Fogoner → Gran Xef \| Alquimista** (psíquic) |
| dragonet | Atac | Dragonet → Dragó → Drac roig \| Drac de tempesta (llamp) | **Dragonet → Dracot → Drac Carmesí \| Drac Tempesta** (llamp). Allibera "Drac roig" per al conjunt. |
| fumerol | Atac | Fumerol → Xemeneia → Volcanet \| Fumarola mística (psíquic) | **Fumerol → Xemeneia → Erupció \| Fumarola Mística** (psíquic) |

\*Al codi, el Nivell 3 de `fumet` és `[Fogueró, Cendra(psíquic), Brasot]` i el de `brasa` és `[Volcà, Magma(planta), Tió]`. Aquí la branca híbrida és l'`evos[1]`. Mantinc l'element de cada posició: el nom híbrid va al mateix índex.

### Aigua

| Clau | Rol | Ara | Proposta |
|---|---|---|---|
| gotim | Curador | Gotim → Rierol → Onada \| Boira (psíquic) | **Gota → Brollador → Fontana \| Calitja** (psíquic) |
| bufa | Defensa | Bufa → Closcot → Tempesta (llamp)\* \| Perlina | **Closquet → Closcarra → Tempestuga** (llamp, tempesta + tortuga) **\| Escullera** |
| petxina | Atac | Petxina → Corall → Nacre (psíquic)\* \| Escull | **Gambeta → Llagostot → Irisada** (psíquic, de nacre irisat) **\| Arponer** |
| nedet | Atac | Nedet → Llúdriga → Nedadora \| Llúdriga elèctrica (llamp) | **Nedet → Llúdriga → Torrent \| Voltúdriga** (llamp) |
| medusina | Curador | Medusina → Medusa → Medusa reial \| Medusa de somni (psíquic) | **Medusina → Medusa → Medusa Reial \| Hipnomedusa** (psíquic) |
| cranquet | Defensa | Cranquet → Cranc → Cranc guerrer \| Cranc de corall (planta) | **Cranquet → Pinçot → Gladiador \| Corallot** (planta) |
| bombolli | Curador | Bombolli → Bombollot → Escuma \| Bombolla del temps (psíquic) | **Bombolli → Bombollot → Bombolla Mare \| Cronobombolla** (psíquic) |
| popet | Atac | Popet → Pop → Pop gegant \| Pop llampec (llamp) | **Popet → Pop → Kraken \| Electropop** (llamp; joc de paraules amb l'estil de música) |

### Planta

| Clau | Rol | Ara | Proposta |
|---|---|---|---|
| brotet | Atac | Brotet → Arbrot → Floreta \| Rierol verd (aigua) | **Brotet → Lianer → Fuetàs \| Mangle** (aigua; l'arbre dels manglars, que viu dins l'aigua) |
| molsa | Curador | Molsa → Falguera → Bolet (psíquic)\* \| Liquen | **Molsa → Falguera → Mandràgora** (psíquic) **\| Herbolària** |
| pinyol | Atac | Pinyol → Pinya → Cactus (foc)\* \| Gla | **Pinyol → Pinyot → Pinyafoc** (foc) **\| Magranada** (magrana + granada) |
| arrel | Defensa | Arrel → Soca → Alzina \| Arrel elèctrica (llamp) | **Arrel → Socarrel** (de l'expressió "de soca-rel") **→ Alzinàs \| Parallamps** (llamp; un arbre que és un parallamps) |
| boleto | Curador | Boletó → Rovelló → Bolet gegant \| Bolet somiador (psíquic) | **Boletó → Rovelló → Cep Reial \| Bolet Lunar** (psíquic). Evito "somiador" perquè, amb bolets, té connotacions de droga. |
| cucafera | Atac | Cucafera → Eruga → Crisàlide \| Papallona de llum (llamp) | **Eruguet → Eruga → Arna Reial \| Papallona Llampec** (llamp). Deixo "Cucafera" per a una bèstia futura semblant a la de la festa. |
| punxetes | Defensa | Punxetes → Cactus → Nopal \| Cactus de foc (foc) | **Punxetes → Cactus → Saguaro \| Xili** (foc; un pebrot picant, planta i foc alhora) |
| bavos | Defensa | Bavós → Cargol → Cargol bover \| Cargol de mar (aigua) | **Bavós → Cargolot → Cargol Blindat \| Cargol de Mar** (aigua) |

\*Al codi, la branca híbrida és l'`evos[1]` en `molsa` i `pinyol`. Mantinc l'índex.

### Llamp

| Clau | Rol | Ara | Proposta |
|---|---|---|---|
| xispa | Defensa | Xispa → Llampec → Tro \| Aurora (psíquic) | **Xispa → Dínamo → Altatensió \| Halo** (psíquic). Allibera "Aurora" per al MEGA. |
| trona | Atac | Trona → Tronada → Calamarsa (aigua)\* \| Centella | **Voltet → Voltor** (voltor + volt) **→ Calamarsa** (aigua) **\| Fulminant** |
| guspira | Curador | Guspira → Estel → Fanal (foc)\* \| Lluerna | **Guspira → Fotó → Far** (foc) **\| Zenit** |
| endollet | Atac | Endollet → Endoll → Bateria \| Robot de somni (psíquic) | **Endollet → Bateria → Ciborg \| Androide Somiador** (psíquic) |
| brunzit | Atac | Brunzit → Colibrí → Falcó tro \| Ocell de foc (foc) | **Brunzit → Colibrí → Falcó Tro \| Ocell Brasa** (foc). "Ocell de foc" xocava amb el conjunt Fènix. |
| cuquet | Curador | Cuquet de llum → Lluerna petita → Fanalet \| Estel del bosc (planta) | **Cuquet de llum → Lluerna → Fanal Viu \| Estel del Bosc** (planta) |
| imantat | Defensa | Imantat → Imant → Gran imant \| Imant calent (foc) | **Imantat → Imant → Electroimant \| Imant Roent** (foc) |
| nuvolet | Atac | Nuvolet → Núvol → Nimbus \| Núvol de pluja (aigua) | **Nuvolet → Núvol → Cumulonimbus \| Diluvi** (aigua). La paraula llarga fa gràcia de dir. |

\*Al codi, la branca híbrida és l'`evos[1]` en `trona` i `guspira`.

### Psíquic

| Clau | Rol | Ara | Proposta |
|---|---|---|---|
| mentoli | Curador | Mentoli → Somiatruites → Endeví \| Lotus (planta) | **Calmet → Mantra → Endeví \| Lotus** (planta) |
| somni | Defensa | Somni → Malson → Lluna \| Miratge (foc) | **Somni → Malson → Eclipsi \| Miratge** (foc) |
| ullet | Atac | Ullet → Ullal → Vident (aigua)\* \| Cristall | **Ullet → Ullerós → Abissal** (aigua) **\| Panòptic** |
| fantasmet | Atac | Fantasmet → Espectre → Fantasma reial \| Fantasma de foc (foc) | **Fantasmet → Espectre → Poltergeist \| Foc Follet** (foc; és el nom català d'aquestes llumetes del bosc) |
| mussolet | Curador | Mussolet → Mussol → Òliba sàvia \| Òliba del bosc (planta) | **Mussolet → Mussol → Gran Duc** (el duc és un mussol gros) **\| Òliba del Bosc** (planta) |
| bolavidre | Defensa | Bolavidre → Bola màgica → Oracle \| Bola de tempesta (llamp) | **Bolavidre → Bola Màgica → Oracle \| Plasma** (llamp) |
| barretmagic | Atac | Barretmàgic → Barret de copa → Mag \| Mag de foc (foc) | **Barretmàgic → Barret de Copa → Il·lusionista \| Mag Pirotècnic** (foc) |
| dormilega | Defensa | Dormilega → Dorment → Somiatruites gros \| Dormilega de llac (aigua) | **Dormilega → Badall → Hibernador \| Somni del Llac** (aigua) |

\*Al codi, la branca híbrida és l'`evos[1]` en `ullet`.

**Si cal ajustar l'arquitectura:** `SPECIAL` i `ABIL` usen les claus internes, no els noms. Canviar `n` a SPECIES i `evos` no trenca les partides desades, perquè `cName` llegeix el nom en directe.

## 3. Mons, zones i caps

### Mons
Proposo un nom propi per a cada món, amb l'element com a subtítol.

| Ara | Proposta | Per què |
|---|---|---|
| Món del Foc | **Brasàlia** | Un lloc que crema |
| Món del Llamp | **Altavolta** | De "volta alta" i d'"alta tensió" |
| Món de l'Aigua | **Mar de Fons** | L'expressió vol dir "problemes amagats sota la superfície": un toc madur |
| Món de la Planta | **Boscúria** | Bosc salvatge i una mica fosc |
| Món Psíquic | **Somnàlia** | El món dels somnis i els miralls |

Les zones (Camp de cendres, Laberint de miralls…) són bones i les mantindria. Un sol canvi: "Bosc del brot" per **"Bosc dels Brots Salvatges"**.

### Caps

| Ara | Proposta |
|---|---|
| Cavaller de Cendra (foc) | **Es manté.** És el millor de tots. |
| Mag de Gel (aigua) | **Glacius, el Bruixot del Gebre**. Allibera "Mag", que usa `barretmagic`. |
| Gegant de Pedra (planta) | **Colós Molsut**. Ara és de pedra en un món de plantes, i no lliga. La mecànica de carregar el cop es manté. |
| Reina de l'Eixam (llamp) | **Reina Vespa Elèctrica**. Fa que l'eixam encaixi amb el món del llamp. |
| Senyor de les Ombres (psíquic) | **Penombra, Senyor dels Miralls**. Lliga amb el Laberint de miralls. |
| Guardià de tres caps / Rei de la cova | **Trícefal, Rei de les Profunditats**. Cal canviar també la comprovació `o.n==='Rei de la cova'` a la línia ~1573. |

## 4. Combos secrets (MEGA) i conjunts

### MEGA (16)

| id | Ara | Proposta |
|---|---|---|
| vapor | Drac de vapor bullent | **Drac de Vapor** (més curt) |
| somnielec | Somni elèctric | Es manté |
| jardtro | Jardí del tro | Es manté |
| lluna | Llum de lluna | Es manté |
| bolets | Bosc encantat | **Bolets Bojos** (el nom actual és genèric) |
| festa | Festa de llumetes | **Discoteca de Lluernes** (humor per a 13 anys) |
| nit | Ulls de la nit | Es manté |
| trident | Trident de les tempestes | Es manté |
| volca | Volcà viu | Es manté |
| selva | Selva salvatge | **Selva Furiosa** |
| ment | Ment de cristall | Es manté |
| aurora | Aurora boreal | Es manté (i trec "Aurora" de `xispa`) |
| quatre | Els quatre vents | **La Colla Original**. Són els 4 primers, no són vents. |
| cor | Cor del món | Es manté |
| muralla | Muralla eterna | Es manté |
| exercit | Exèrcit de la nit | **Esquadró del Caos**. Ni el drac, ni el núvol, ni el pop són de nit. |

GROUP_NAMES: canviaria "Llamp de foc mental" per **"Tempesta Mental"**. La resta es mantenen.

### Conjunts (10)

| Ara | Proposta |
|---|---|
| Armadura del Drac Roig | Es manté |
| Plomes del Fènix | Es manté |
| Corona de les Marees | Es manté |
| Escates del Leviatan | Es manté |
| Arrels del Bosc Antic | Es manté |
| Espines de la Rosa Negra | Es manté (molt bo) |
| Tro del Gegant del Cel | **Armadura del Gegant del Tro**. Un "tro" no es porta posat. |
| Botes del Vent Ràpid | **Ales de l'Huracà**. El conjunt té 5 peces i només una són botes. |
| Mantell de l'Ull Etern | Es manté |
| Joies del Somni Profund | Es manté |

## 5. Espècies noves per cobrir buits

Recompte actual (40 espècies, 8 per element):

| | Atac | Defensa | Curador |
|---|---|---|---|
| Foc | 4 | 2 | 2 |
| Aigua | 3 | 2 | 3 |
| Planta | 3 | 3 | 2 |
| Llamp | 4 | 2 | 2 |
| Psíquic | 3 | 3 | 2 |

Hi ha massa atacants al Foc i al Llamp. Falten curadors a Foc, Planta, Llamp i Psíquic, i falten tancs a Foc, Aigua i Llamp. Les propostes van a aquests buits:

1. **Obsidi** (Foc · Defensa). És un armadillo amb plaques d'obsidiana que brillen per les escletxes. Evoluciona així: Obsidi → Cuirassat → Fortí d'Obsidiana | Vidre Volcànic (psíquic).
2. **Pangolt** (Llamp · Defensa). És un pangolí d'escates metàl·liques: quan s'enrotlla fa de parallamps per a l'equip. Evoluciona així: Pangolt → Blindavolt → Gàbia de Faraday | Pangolí de Coure (foc). El nom ve de pangolí i volt, i "Gàbia de Faraday" és un guinyo de ciència per als de 13 anys.
3. **Ancoret** (Aigua · Defensa). És un cranc ermità que viu dins una àncora rovellada. Evoluciona així: Ancoret → Àncora → Naufragi | Àncora Fantasma (psíquic).
4. **Mandrós** (Planta · Curador). És un peresós cobert d'herbes medicinals que cura sense moure's. Evoluciona així: Mandrós → Herbós → Tisanot | Ronc Verd (psíquic). Té humor i no és infantil.
5. **Batec** (Llamp · Curador). És una granota elèctrica que "reanima" els companys amb una descàrrega. Evoluciona així: Batec → Pols → Desfibril·lador | Cor de Tempesta (aigua). L'atac especial pot fer revivir els KO.

Tots els dissenys són originals, sense personatges de cap franquícia. Encaixen amb les formes `shape` que ja hi ha (blocky, spiky, round, tiny i long).
