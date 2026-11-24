# Consell "Primera partida" — Rol: corba d'aprenentatge (onboarding)

Joc revisat: `dist/index.html` (construït a partir de `src/`), obert en un navegador nou (sense partida guardada), mòbil 412×915.
Scripts: `corba-aprenentatge/walk.js` (una jugadora nova que fa el camí més evident) i `corba-aprenentatge/mock.js` (maquetes de les propostes, injectades a la pàgina; no toca `src/` ni `dist/`).
Captures: `corba-aprenentatge/shots/`. Les `01`–`31` són el joc d'ara. Les `M1`–`M4` són maquetes.

La part d'**història, pantalla de títol i intro** la treballa el rol `historia` (`role-historia.md`). Aquí només dic **on encaixa** dins l'ordre d'aprenentatge, i no en repeteixo els textos.

---

## 1. Què passa ara

### 1.1 El recorregut d'una jugadora nova (captures)

1. **Primera pantalla = el mapa** (`01-inici.png`). No hi ha pantalla de títol ni cap frase que digui de què va el joc. A dalt hi ha `150` monedes, `Places 4/6` i un botó gran `Comentaris (0)`. A sota, un consell lila parla de "%" i "estrelles ★". Un món surt com a `???`.
2. **Les 4 pestanyes estan obertes des del primer segon.** Si les toques abans d'explorar:
   - **Casa** (`03-casa.png`): 5 zones per construir i unes 19 construccions amb preu. Amb les 150 monedes inicials ja pots comprar decoració (Rètol de neó, 120) abans d'haver jugat.
   - **Bestioles** (`04-bestioles.png`): 40 ombres, "Formes 0 de 200", "Combos secrets 0 de 16", ordenar per 3 criteris i un paràgraf sobre el Niu.
   - **Motxilla** (`05-motxilla.png`): 4 pestanyes, 9 llocs buits, "Poders especials", la Forja amb multiplicadors (×1,6 ×2,4…) i Sets de llegenda ("0 de 50").
3. **Món** (`06-mon-foc.png`): el mapa diu "Foc", però dins el món es diu "Brasàlia". Dues pantalles i dos noms per a la mateixa cosa. Hi ha "Llocs vistos 0 de 23", 8 ombres, 5 zones i un consell més.
4. **Tria l'equip** (`07-equip.png`, `08-equip-triat.png`). Cada targeta té **8 dades**: nom, avantatge/desavantatge, rol, element, forma, nivell, nombre d'habilitats, talent (lila, sense explicar), barra de cansament i "Pot fer 3 expedicions més". El botó `Surt a explorar` queda **sota la pantalla**. Si tries les 3 primeres de la llista (el que fa una persona nova), te'n queden 2 en desavantatge i deixes fora la que en té.
5. **Expedició** (`09-run-primer.png`). El menú de baix **continua visible** durant l'expedició (això és un error; vegeu 2.4). Hi ha 10 llocs i el consell lila s'hi queda fins que toques "Entesos".
6. **Primera batalla** (`15-batalla-1.png`). Dos consells lila (el del camí i el de la batalla) **empenyen la batalla cap avall**: la batalla ja va sola i gairebé no es veu. El consell de la batalla té 40 paraules i parla de "barres grogues" i "ATAC COMBINAT" quan encara no has vist res.
7. **Guardià** (`25-guardia.png`). La zona té ★ però el guardià en té ★★ i diu "Perillós per al teu equip". Té dues frases de regles (estocada, armadura).
8. **Derrota** (`26-batalla-perduda.png`, `27-resum.png`). En la meva prova **la primera expedició s'ha perdut contra el guardià**: "Heu tornat a casa · Has perdut la meitat de les monedes". No hi ha cofre (només n'hi ha si guanyes). En aquesta expedició **no ha sortit cap bestiola nova** (surt a l'atzar).

Dades del mateix repositori (`tests/expected/sim14.txt`, el guardià de la Zona 1 amb les 3 bestioles inicials a nivell 1):

| Món | Foc | Aigua | Planta | Llamp | Psíquic |
|---|---|---|---|---|---|
| Probabilitat de guanyar | 52% | 76% | 0% | 0% | (tancat) |

El simulador fa servir l'equip Orquí + Aquilet + Lumi. Al mapa, Planta i Llamp semblen igual de bones per començar que les altres, però **amb aquell equip es perden sempre**.

### 1.2 Tots els sistemes i quan te'ls trobes ara

"Explicat?": **Sí** = hi ha un text que ho explica quan surt. **Tard** = s'explica en una altra pantalla o després. **No** = no s'explica enlloc.

| # | Sistema o concepte | Primer contacte avui | Explicat? |
|---|---|---|---|
| 1 | De què va el joc (objectiu) | Mai | **No** |
| 2 | Monedes | Barra de dalt, segon 0 | No |
| 3 | Places (4/6) | Barra de dalt, segon 0 | Tard (Casa) |
| 4 | Comentaris (eina de la família) | Barra de dalt, segon 0 | No (sembla part del joc) |
| 5 | Mons / 5 elements | Mapa, segon 0 | Consell del mapa (només % i ★) |
| 6 | Nom del món ≠ nom de l'element (Foc / Brasàlia) | Entrar al món | No |
| 7 | Món desconegut (Psíquic) | Mapa | Sí ("Completa 3 expedicions") |
| 8 | Dificultat ★ (la mateixa ★ es fa servir per a 3 coses) | Mapa | A mitges |
| 9 | Zones (5 per món) i zones tancades | Pantalla del món | Sí (consell) |
| 10 | Llocs vistos / % explorat | Pantalla del món | No |
| 11 | Avantatge d'element (qui guanya a qui) | Text del món + etiquetes de l'equip | A mitges: no hi ha cap esquema |
| 12 | Rols: Atac / Defensa (tanc) / Curador | Tria l'equip | Tard (fitxa de la bestiola) |
| 13 | Talents (Rastrejador, Nedador…) | Tria l'equip, etiqueta lila | **No** en aquella pantalla |
| 14 | Forma i nivell | Tria l'equip ("forma 1 · nivell 1") | Tard (Bestioles) |
| 15 | Habilitats (2–3 per bestiola) | Tria l'equip ("2 habilitats") | Tard (consell de batalla) |
| 16 | Cansament (expedicions que queden) | Tria l'equip | Tard (Casa) |
| 17 | Mida de l'equip (3 → 4 → 5 → 6) | Tria l'equip | Sí |
| 18 | Personatge (sempre hi va) | Tria l'equip | Sí, una frase |
| 19 | Sinergies | Tria l'equip (sota de tot) | A mitges |
| 20 | Camí amb icones (·, Y, ≈, ⌂, !, ∩) | Expedició | Consell (no diu què vol dir cada icona) |
| 21 | Risc (punts vermells) | Expedició | Sí |
| 22 | Opcions amb requisits (element o talent) | Expedició | A mitges |
| 23 | Cruïlla | Expedició | Sí |
| 24 | Menjar per element | Expedició (carta "Menjar!") | Tard (fitxa) |
| 25 | Bestiola salvatge: lluitar / donar menjar / deixar | Expedició, a l'atzar | Sí |
| 26 | Batalla automàtica, barres de càrrega | 1a batalla | Consell de 40 paraules |
| 27 | Atac de tot l'equip (barra) | 1a batalla | No |
| 28 | Atac combinat, combos secrets (vinyetes) | Batalla, a l'atzar | A mitges |
| 29 | "Davant" (el tanc rep els cops), escut, avís de cop fort | Batalla | No |
| 30 | Estats (cremada, verí, mullat…) | Batalla | No |
| 31 | Campament de monstres (2 onades) | Lloc 9 | Sí |
| 32 | Guardià, regles del cap, vinyetes de còmic | Lloc 10 | Sí (2 frases) |
| 33 | Derrota: perds la meitat de les monedes | Després de perdre | Sí |
| 34 | Pausa / abandonar / aventures a mitges | Expedició | A mitges |
| 35 | Experiència (XP) i pujar de nivell | Resum | Sí |
| 36 | Cofre que puja de categoria | Resum, només si guanyes | Sí |
| 37 | Objectes, 9 llocs, "Equipa el millor" | Motxilla, des del segon 0 | Consell |
| 38 | Categories d'objecte (Normal → Superèpica) | Motxilla | Tard (dins el "?") |
| 39 | Forja (4 iguals → 1 millor, tries un poder) | Motxilla, des del segon 0 | Dins el "?" |
| 40 | Poders especials | Motxilla, des del segon 0 | No |
| 41 | Sets de llegenda i Taller | Motxilla, des del segon 0 | Dins el "?" |
| 42 | Evolució (nivell + còpies) | Bestioles, des del segon 0 | Consell |
| 43 | Còpies | Bestioles | Consell |
| 44 | Branques d'evolució, doble element 70/30 | Fitxa de la bestiola | Sí, curt |
| 45 | Forma 4 i aura | Fitxa | Sí, curt |
| 46 | El Niu | Bestioles, des del segon 0 (paràgraf llarg) | Sí, però massa d'hora |
| 47 | Adoptar (comprar) una bestiola | Fitxa d'una ombra | No |
| 48 | Casa: construir per zones | Casa, des del segon 0 | No |
| 49 | Descans: 1 punt cada 10 min, migdiada, foguera de nit | Casa | A mitges |
| 50 | Sales d'element (es tanquen fins acabar el món) | Casa | Missatge en tocar |
| 51 | Cova i llum (Zona 3) | Zona 3 | Sí |
| 52 | Zones 4–5 (requisits alts) | Pantalla del món | Sí |

**Resultat:** abans d'haver jugat una sola batalla, una persona que mira les 4 pestanyes veu **uns 35 dels 52 conceptes**. Els 8 consells sumen unes 210 paraules, i cada un surt **una sola vegada** (`G.tips`).

---

## 2. Problemes (del més greu al menys greu)

1. **El joc no diu mai quin és l'objectiu.** No hi ha cap frase com "fes-te amic de bestioles i guanya els guardians". Per això la Sandra pensava que era un joc de manualitats. (Títol i intro: rol `historia`.)
2. **La primera expedició es pot perdre, i la jugadora no té cap culpa.** El mapa no diu per quin món començar. Si tria Planta o Llamp, perd segur (0%). Si tria Foc amb les 3 primeres de la llista, té menys d'1 possibilitat entre 2. Perdre la primera vegada vol dir: sense cofre, la meitat de les monedes i un "Heu tornat a casa". És el pitjor primer record possible.
3. **El més divertit (aconseguir una bestiola nova) no està garantit a la primera expedició.** Surt a l'atzar. En la meva prova no n'ha sortit cap.
4. **Tot és visible des del primer segon.** Casa, Forja, Sets, Niu, Combos i Formes "0 de 200" surten abans de la primera batalla. Per a algú que no juga mai, això és una paret. Per a una noia de 13 anys, són números que fan semblar que no avança.
5. **Els consells tapen el joc i no es poden tornar a llegir.** Són blocs grans dins la pàgina. A la batalla n'hi ha dos, un sobre l'altre, i la batalla (que va sola) queda a sota (`15-batalla-1.png`). Si toques "Entesos" sense llegir, ja no tornen.
6. **La pantalla "Tria l'equip" demana massa decisions.** Hi ha 8 dades per bestiola, talents sense explicar i el botó de sortir amagat a sota. Una persona nova no sap triar i tria malament.
7. **Ningú diu "què faig ara?" després de la primera expedició.** Hi ha punts vermells al menú, però cap frase que digui el pas següent.
8. **El menú de baix es veu durant l'expedició.** El codi el vol amagar (`$('nav').hidden=true` a `06-render.js`), però la regla CSS `nav.nav{display:grid}` (`css/controls.css`) passa per sobre de `hidden`. Durant la primera expedició, això convida a sortir-ne.
9. **Noms dobles i símbols repetits.** Foc/Brasàlia, Aigua/Mar de Fons. La ★ vol dir dificultat, força i forma. (Ja ho va dir la revisió `council-v13/role-ux.md`.)
10. **Es poden gastar les monedes inicials en decoració** abans de saber per a què serveixen.

---

## 3. Propostes

### 3.1 Ordre d'aprenentatge (desbloqueig progressiu)

Regla: **en els 5 primers minuts només es veu el bucle bàsic**. És aquest: *tria món → camina → tria opció → batalla → bestiola nova → guardià → premi*. Cada sistema nou apareix **quan serveix per primera vegada**, amb una targeta "Nou!" d'una frase.

Molt important: **les partides que ja existeixen (la de l'Alba) ho tenen tot obert.** Quan es carrega una partida amb `completed>0` o amb més de 4 bestioles, la guia es marca com a feta i no s'amaga res.

| Moment | Què apareix | Condició al codi | Text de la targeta "Nou!" |
|---|---|---|---|
| **Inici** | Títol + intro curta (rol `historia`) → guia | `G.tut` no existeix | — |
| **Guia, expedició 1** | Mapa, món, zona, equip ja triat, camí, opcions, risc, batalla, bestiola salvatge, menjar, guardià, XP, cofre. A dalt només les monedes. Al menú només **Explorar**. | `G.tut.step<END` | — |
| Final de la guia | Pestanya **Bestioles** | guia acabada | "Nou: Bestioles. Aquí hi ha totes les que tens." |
| 1r objecte a la motxilla | Pestanya **Motxilla** (només Equip i Menjar) | `G.items.length>0` | "Nou: Motxilla. Posa't objectes per ser més forta." |
| Expedició 2 (triar l'equip tu sola) | Etiquetes d'avantatge a l'equip + "Feble a" a la batalla | `G.tut.runs>=1` | "Les etiquetes verdes volen dir avantatge en aquest món." |
| 1r "SUPER!" a la batalla | Esquema d'elements (també al "?") | primer cop amb `eff==='super'` | "SUPER! {Element} guanya {element}." |
| Expedició 2 acabada o 1a bestiola cansada | Pestanya **Casa** + "Places" a dalt | `G.tut.runs>=2` o alguna `c.rest>0` | "Nou: la Casa. Aquí descansen i hi pots construir." |
| Zona 1 guanyada en un món | Etiquetes de **talent** a l'equip | algun `G.done[w+':z0']` | "Les etiquetes liles són talents. Alguns camins en necessiten un." |
| Expedició 3 | Bloc de **sinergies** a l'equip | `G.tut.runs>=3` o primera sinergia activa | "Algunes bestioles juntes són més fortes." |
| Primera bestiola amb ≤1 expedició | Barra de cansament a l'equip | `maxFat(c)-c.fat<=1` | "Aquesta està cansada. Deixa-la descansar a casa." |
| Primera evolució possible | Botó d'evolucionar destacat | `evoCheck(c).ok` (primera vegada) | "{Nom} pot evolucionar! Toca-la." |
| Primera evolució feta | "Formes X de 200" a Bestioles | primer `c.stage>0` | — |
| 1a bestiola al Niu | Bloc **Niu** a Bestioles | `G.niu.length>0` | "La casa és plena. Les que no hi caben esperen al Niu." |
| 1r combo secret | Comptador de combos | `megaCount()>0` | "Combo secret! Mira'ls tots a Bestioles." |
| 2 objectes iguals | Una línia: "Junta'n 4 per forjar-ne un de millor." | algun `fcount(id)>=2` | — |
| 4 objectes iguals | Pestanya **Objectes i forja** completa | `forgeReady().length>0` | "Nou: la Forja. 4 iguals fan 1 de millor." |
| 1r objecte amb poder | Bloc "Poders especials" | `powerText(powerOf(G.equip)).length>0` | — |
| 1a Superèpica | Pestanya **Sets** (abans, amb cadenat: "S'obre quan forgis una Superèpica.") | `legendOpen()` | "Nou: Sets de llegenda." |
| 8 espècies | Botons "Ordena per" | `SP_ORDER.filter(ownsSp).length>=8` | — |
| Casa | Al principi només Dormitori obert; la resta de zones tancades (plegades) fins que la jugadora tingui monedes per a alguna cosa d'aquella zona | `G.hFold` per defecte | — |

Altres coses que ja funcionen bé i es queden igual: el món desconegut a les 3 expedicions, l'equip que creix a les 2/5/9 expedicions, la cova a la Zona 3 i les zones 4–5.

### 3.2 Guia de la primera expedició

**Com és:** una bombolla blanca d'una frase (`.coach`), **fixa a la pantalla**: no empeny el contingut. Hi ha un marc groc al botó que cal tocar i la resta queda una mica fosca (maquetes `M1-guia-mapa.png`, `M2-guia-equip.png`). A sota de la frase hi ha "Guia · pas X de 8". Sempre hi ha un enllaç **"Salta la guia"**. A la batalla, la bombolla **no la para** i desapareix sola als 4 segons.

**Decisions de disseny:**
- **Món d'Aigua, Zona 1.** És el més fàcil per a l'equip inicial (76% al simulador).
- **Equip ja triat**: Orquí (Atac), Aquilet (Curador) i Lumi (Defensa). Durant la guia, les etiquetes d'element no surten: és massa aviat.
- **Ruta curta de 6 llocs** en lloc de 10: escena → batalla fàcil → bestiola salvatge (segur) → font → escena → guardià. Sense cruïlla ni campament.
- **Guardià més suau només aquesta vegada**: vida ×0,7. L'objectiu és guanyar més de 9 de cada 10 vegades. Si tot i així es perd, el botó "Torna a començar la zona" es destaca i surt la frase del pas 8b.
- La jugadora té 1 menjar d'Aigua (`newGame`), i la bestiola salvatge d'aquest món és d'Aigua. Per tant, el pas 6 sempre funciona.

| Pas | Pantalla | Què es destaca | Text exacte |
|---|---|---|---|
| 1 | Mapa | El món d'Aigua (els altres es veuen enfosquits; si els toques: "Primer prova l'Aigua.") | **Toca el món d'Aigua per començar.** |
| 2 | Món | Zona 1 | **Toca la Zona 1: al final hi ha un guardià.** |
| 3 | Tria l'equip | Botó `Surt a explorar`, posat a dalt de la llista | **Un ataca, un protegeix i un cura. Toca Surt a explorar.** |
| 4 | 1r lloc del camí | Primer la tira del camí i després les opcions | **Tria què fas a cada lloc del camí.** |
| 5 | 1a batalla (sense pausa, 4 s) | La fila de l'equip | **La batalla va sola. Mira com lluiten!** |
| 5b | 1r "SUPER!" (en aquesta ruta, l'Orquí contra l'Aigua) | El número gran | **SUPER! La Planta guanya l'Aigua.** |
| 5c | Batalla guanyada | `Continua` | **Heu guanyat! Toca Continua.** |
| 6 | Bestiola salvatge | L'opció "Dona-li menjar" | **Dona-li menjar i vindrà amb tu.** |
| 6b | Carta "Bestiola nova!" | `Afegeix-la a l'equip` | **És teva! Afegeix-la a l'equip.** |
| 7 | Guardià (abans de lluitar) | `Lluita contra el guardià` | **El guardià tanca la zona. Guanya'l!** |
| 8 | Resum | El cofre | **Toca el cofre: cada toc el pot millorar.** |
| 8b | (només si es perd) | `Torna a començar la zona` | **No passa res: torna-ho a provar amb tota la vida.** |
| Final | Targeta gran (com `bigCard`) | Botó `Mira les teves bestioles` | Títol: **Primera expedició feta!** · Text: **Ara tens 5 bestioles.** |

Quan s'acaba (o es salta) la guia, s'apaguen els consells antics que la guia ja ha explicat: `explorar`, `mon`, `equip`, `run` i `battle`.

### 3.3 Ajuda permanent: botó "?" i pàgina "Com es juga"

- Un **botó rodó "?"** a la barra de dalt, a la dreta, sempre visible, també durant l'expedició (maqueta `M3-objectiu-seguent.png`). `Comentaris` passa a ser una icona petita de bafarada al costat. No l'hem de treure: és com la família envia els seus comentaris.
- En tocar "?" s'obre una **fulla des de baix** que es diu **"Com es juga"** (maqueta `M4-com-es-juga.png`). Té targetes de 2 línies com a màxim. Les dels sistemes que encara no s'han desbloquejat surten grises amb un cadenat. Així l'ajuda també creix amb la jugadora.

Text exacte de les targetes:

1. **Què has de fer** — Explora els 5 mons, fes-te amic de totes les bestioles i guanya els guardians.
2. **Explorar** — Tria un món i una zona. A cada lloc del camí, tria què fas.
3. **Batalles** — Van soles. Porta un tanc, un curador i un atacant.
4. **Elements** — Porta bestioles que guanyin l'element del món. + l'esquema:
   - Aigua guanya Foc i Llamp
   - Foc guanya Planta i Psíquic
   - Planta guanya Aigua i Llamp
   - Llamp guanya Foc i Psíquic
   - Psíquic guanya Aigua i Planta

   Fins que s'obri el món desconegut, Psíquic surt com a "???".
5. **Fer-les fortes** — Menjar i aventures donen nivells. Amb nivell i còpies, evolucionen.
6. **Cansament** — Després d'unes quantes aventures descansen a casa. *(Cadenat: "S'obre quan tinguis la Casa.")*
7. **Objectes i forja** — Posa't objectes a la Motxilla. 4 iguals fan 1 de millor. *(Cadenat: "S'obre quan trobis el primer objecte.")*
8. **Casa i Niu** — A casa hi caben poques bestioles; la resta espera al Niu. *(Cadenat fins que hi hagi Niu.)*
9. **Sets de llegenda** — Peces Superèpiques que juntes donen habilitats. *(Cadenat fins a la 1a Superèpica.)*

A sota hi ha dos botons: **"Torna a veure els consells"** (buida `G.tips`) i **"Torna a fer la guia"** (posa `G.tut.step=0`; només surt quan no hi ha cap expedició a mitges).

Els consells que queden, més curts. Cada un és una bombolla d'una sola frase, no un bloc dins la pàgina:

| Clau | Text nou |
|---|---|
| `explorar` | Toca un món. El % diu quant n'has explorat. |
| `mon` | Acaba una zona i s'obre la següent. |
| `equip` | Tria fins a 3 bestioles. El teu personatge sempre hi va. |
| `run` | Tria què fas a cada lloc. Els punts vermells volen dir perill. |
| `battle` | La batalla va sola. Les barres grogues carreguen els atacs. |
| `casa` | Aquí descansen les bestioles i hi pots construir. |
| `bestioles` | Toca una bestiola per donar-li menjar o fer-la evolucionar. |
| `motxilla` | Posa't objectes. ▲ verd vol dir que millora. |

### 3.4 Targeta "Objectiu següent"

És una **sola targeta fosca** a dalt de tot, a **Explorar** i a **Casa** (maqueta `M3-objectiu-seguent.png`). Té una frase i un botó que et porta al lloc. Es calcula cada vegada amb `nextGoal()`, i surt **la primera regla que es compleix**:

| Prioritat | Condició | Text exacte | Botó → on va |
|---|---|---|---|
| 1 | `G.chest && !G.chest.open` | Tens un cofre per obrir. | **Obre'l** → resum |
| 2 | hi ha una expedició a mitges | Tens una aventura a mitges a {Món}. | **Continua** → `resume` |
| 3 | alguna `evoCheck(c).ok` | {Nom} ja pot evolucionar. | **Mira-la** → fitxa |
| 4 | `betterGear()` | Tens un objecte millor per posar-te. | **Motxilla** |
| 5 | `forgeReady().length` | Tens 4 objectes iguals: forja'n un de millor. | **Forja** |
| 6 | cap bestiola disponible | Les bestioles estan cansades. Feu la migdiada a Casa. | **Casa** |
| 7 | Niu no buit, casa plena i prou monedes per a una Habitació | La casa és plena. Construeix una Habitació. | **Casa** |
| 8 | hi ha menjar i una bestiola que encara no l'ha provat (només les 3 primeres vegades) | Tens menjar: dona'l a una bestiola perquè pugi de nivell. | **Bestioles** |
| 9 | Zona 3 oberta, però cap bestiola amb el talent que cal | Per a {zona} cal portar un {talent}. | **Bestioles** |
| 10 | la zona oberta i no acabada més fàcil (món amb `TIER` més baix) | Guanya el guardià de {zona} ({Món}). | **Som-hi** → pantalla del món |
| 11 | Psíquic tancat (línia petita a sota de la regla 10) | Et falten {n} expedicions per al món desconegut. | — |
| 12 | res més | Et falten {n} bestioles per completar la col·lecció. | **Bestioles** |

La regla 10 sempre recomana el món més fàcil. Així es resol "per on començo?" i s'evita anar a Planta o Llamp massa d'hora.

### 3.5 On va cada peça a `src/` i quina mida té

| Peça | Fitxers | Mida |
|---|---|---|
| Arreglar el menú visible durant l'expedició: `nav.nav[hidden]{display:none}` | `css/controls.css` | petita |
| Estat nou `G.tut={step,runs,seen:{}}` a `newGame()`. Partides antigues (`completed>0` o >4 bestioles): guia feta i tot obert | `js/04-state.js` | petita (però crítica: protegeix la partida de l'Alba) |
| Fitxer nou amb el motor de la guia (passos, bombolla, marc, saltar), `unlocked(k)`, targetes "Nou!", `nextGoal()` i la fulla "Com es juga" | `js/26-onboarding.js` (nou, abans de `99-boot.js`) + afegir-lo a `src/index.html` | mitjana |
| Estils: `.coach`, `.spot`, `.goal`, `.help`, botó `?` | `css/controls.css` (o `css/onboarding.css` nou, afegit a `src/index.html`) | petita |
| Cridar la guia i `menuDots`/unlocks després de dibuixar; filtrar les pestanyes del menú; botó "?" i icona de comentaris a `topBar()` | `js/06-render.js` | petita |
| Accions noves: `help`, `helpClose`, `tutNext`, `tutSkip`, `tipsReset`, `tutRestart`; durant la guia, bloquejar `nav` i els mons que no toquen | `js/07-actions.js` | petita |
| Ruta curta de la guia (6 llocs, bestiola salvatge segura) | `js/09-route-and-effects.js` (`buildRoute`) | petita |
| Guardià ×0,7 només a l'expedició de la guia | `js/11-battle.js` (`makeBattle`), valor a `js/02-balance.js` (`BAL.TUT_GUARD_HP`) | petita |
| Comptar les expedicions acabades (guanyades o no) a `G.tut.runs` | `js/11-battle.js` (`finishRun`) | petita |
| Bombolla del primer "SUPER!" | `js/15-comic-effects.js` (`showEvent`) | petita |
| Equip ja triat i botó de sortir a dalt durant la guia; etiquetes d'avantatge, talents, sinergies i cansament segons `unlocked()` | `js/screens/equip.js` | petita |
| Targeta "Objectiu següent" | `js/screens/explorar.js`, `js/screens/casa.js` | petita |
| Amagar Niu, combos, formes i ordenar fins que es desbloquegen | `js/screens/bestioles.js` | petita |
| Pestanyes de la Motxilla segons el desbloqueig; Sets amb cadenat | `js/screens/motxilla.js` | petita |
| Treure els consells de dins la pàgina i fer-los bombolles; textos nous | `js/06-render.js` (`tip()`) + les 8 pantalles | petita |
| Targeta final de la guia | `js/screens/resum.js` | petita |
| Intro i títol (contingut del rol `historia`), mostrats amb `comicPage()` | `js/17-comic-pages.js` | petita (només l'enganxament) |
| **Proves**: `tools/golden.js` comença partides noves i ara entraria a la guia. Cal posar `tut` com a fet a la partida inicial del harness, o enregistrar el nou recorregut, i tornar a calcular `tools/golden-hash.txt` | `tools/` | mitjana |

**Total: gran**, però es pot fer en 3 entregues, i cadascuna ja millora el joc tota sola:
- **A (petita):** arreglar el menú, crear `G.tut`, fer la targeta "Objectiu següent" i el botó "?" amb "Com es juga".
- **B (mitjana):** la guia de la primera expedició (ruta curta i guardià suau inclosos).
- **C (mitjana):** el desbloqueig progressiu de les pestanyes i els blocs.

---

## 4. Què NO s'ha de fer

- **No fer una guia llarga que no es pugui saltar**, ni posar parets de text o més de 8 passos. Cada bombolla ha de tenir una frase.
- **No parar la batalla per explicar-la.** La gràcia és que va sola. La bombolla s'ha d'apagar sola.
- **No amagar res a qui ja juga.** Si la partida de l'Alba es queda sense Forja o sense Sets en actualitzar, plegarà.
- **No deixar que la primera expedició es perdi** ni que acabi sense cap bestiola nova.
- **No posar cadenats a tot.** Només a Sets, que és el més llunyà. La resta simplement no surt fins que serveix. Massa cadenats fan sentir que el joc és "per a més endavant".
- **No explicar números a la guia** (multiplicadors, percentatges, ×1,6, 70/30). Han d'anar dins el "?" de cada pantalla.
- **No obligar a llegir l'ajuda** ni obrir-la sola. El "?" hi és sempre, però només s'obre si el toques.
- **No mostrar el món desconegut amb el seu nom a l'ajuda** abans que s'obri: trencaria la sorpresa.
- **No treure el botó de Comentaris.** Fer-lo més petit, sí.
- **No fer servir la ★ per a res nou.** Ja vol dir massa coses.
