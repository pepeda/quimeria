# Consell "Primera partida" — Rol: història (disseny narratiu)

Revisora: disseny narratiu per a jocs de 10-15 anys. To: no infantil, una mica madur, original.
Fonts llegides: `src/js/01-data.js`, `21-council-names.js`, `02-scenes-data.js`, `10-more-scenes.js`, `08-zones-abilities-synergies.js`, `13-more-critters-and-talents.js`, `16-bosses-and-group-attacks.js`, `17-comic-pages.js`, `18-powers-sets-combos.js`, `04-state.js`, `11-battle.js`, `screens/explorar.js`, `screens/mon.js`, `screens/casa.js`, i `source/council-v13/role-names.md`.
Captures i scripts: `source/council-onboarding/historia/`.

- `shots.js`: obre `dist/index.html` en un context nou (jugadora nova) i fa la captura `01`. També prova el motor `comicPage` tal com és ara (captures `02`, `03`).
- `prototip-intro.js`: dibuixa la pantalla de títol i les 5 pantalles de la intro proposada amb el motor `comicPage` i l'art del joc (`spArt`, `hero`, `elIcon`). Només afegeix CSS temporal a la pàgina. No toca `src/`. Captures `10` a `15`.
- Nota: el brief diu que `playwright-core` és a `source/pwtool/node_modules`, però aquesta carpeta no existeix. La còpia que funciona és a `scratchpad/pwtool/node_modules` (un nivell per sobre del repositori). Els meus scripts fan servir aquesta.

---

## 1. Què passa ara

- **Primera pantalla** (`historia/01-primera-pantalla.png`): una jugadora nova cau directament al mapa "Explorar". Veu un consell sobre el percentatge i les estrelles, 4 boles de colors (Foc, Llamp, Aigua, Planta), una bola grisa amb "???" i una casa al mig. No hi ha cap frase que digui què és el joc, qui ets ni per què hi ets.
- **El nom "Quimèria" no surt mai a la pantalla.** Només és al títol de la pestanya del navegador (`src/index.html`, `22-sound.js`).
- **El joc ja té molta història amagada als noms**, però ningú no la llegeix junta:
  - 5 mons amb nom propi: Brasàlia, Altavolta, Mar de Fons, Boscúria, Somnàlia (`21-council-names.js`). Al mapa només surt l'element ("Foc · 5%"), no el nom del món.
  - L'última zona de cada món sona a "final": Tron de Cendra, Fossa de l'Oblit, Arrels del Món, Corona de Llamps, Ment Primordial (`08-zones-abilities-synergies.js`).
  - Cada món té un guardià final amb nom: Cavaller de Cendra, Glacius el Bruixot del Gebre, Colós Molsut, Reina Vespa Elèctrica, Penombra Senyor dels Miralls. A les coves hi ha Trícefal, Rei de les Profunditats.
  - Les 4 bestioles inicials (Pirí, Aquilet, Orquí, Lumi) tenen un atac secret junts que es diu **"La Colla Original"** (`18-powers-sets-combos.js` + `21-council-names.js`).
  - A la forma 3 algunes bestioles **barregen dos elements** (híbrids), i la forma 4 es diu **Astral**. El nom "Quimèria" ve d'aquí (el consell v13 ho va proposar així: "el lloc on les bèsties es barregen").
  - El cinquè món és "el món desconegut" i s'obre després de 3 expedicions.
- **Les pàgines de còmic** (`17-comic-pages.js`) només surten als guardians. Mostren el nom i les regles del combat (`bossD`), però el guardià no diu res. No té veu ni motiu.
- **He provat el motor `comicPage` per a una intro** (`02`, `03`): funciona, però la quadrícula de 4 vinyetes deixa molt espai buit i el text queda petit (13 px). Amb una sola vinyeta a pantalla completa queda molt millor (`11` a `15`).

## 2. Problemes (del més greu al menys greu)

1. **No hi ha cap frase que expliqui el joc.** La Sandra no sabia si era un joc de taula o de manualitats. Ni el missatge de WhatsApp ni la primera pantalla diuen "és un joc per al mòbil on reculls bestioles i explores mons".
2. **No hi ha cap motiu per explorar ni cap objectiu final.** El joc no té final. L'únic objectiu visible és el % de cada món. Una jugadora de 13 anys aguanta més si sap què persegueix.
3. **El nom del joc no surt enlloc.** Sense títol, el joc sembla una eina o una pàgina a mig fer.
4. **El jugador no sap qui és.** El personatge (`hero()`) "sempre hi va" (consell de l'Equip), però ningú no diu qui és ni per què té 4 bestioles.
5. **La casa no té sentit dins del món.** És al mig del mapa i té una funció (descans, places), però no se sap per què hi és ni per què és teva.
6. **Els guardians no tenen veu.** Són el millor moment dramàtic del joc i només mostren regles.
7. **El "món desconegut" no té història.** Es desbloqueja amb un comptador ("0 de 3"), sense cap motiu. I quan s'obre, la pantalla de resum diu "Has descobert el Món Psíquic!" (`screens/resum.js`), no "Somnàlia".
8. **Els híbrids i la forma Astral no s'expliquen.** Són el més original del joc i no tenen cap frase.
9. **Paraula "cor" repetida.** Hi ha zones que es diuen "Cor del volcà" (zona 3 de Foc) i "Cor de l'arbre gegant" (zona 3 de Planta). Si la història parla del "cor de cada món" per a la zona 5, confondrà. Per això la proposta diu "fins al final de cada món", no "fins al cor".
10. **Menor:** a la pàgina de còmic, el text "Toca per saltar" queda tallat a baix de tot amb el mòbil de 412×915 (es veu a `02` i `03`). Ho he vist al meu prototip, que fa servir el mateix motor; no ho he comprovat dins d'una batalla real.

## 3. Propostes

### 3.1. Frase d'una línia per al WhatsApp (3 opcions)

Totes diuen primer **què és** (joc de mòbil), perquè és el que va fallar amb la Sandra.

1. **"Quimèria: un joc per al mòbil on reculls bestioles, les fas créixer i explores cinc mons. No cal instal·lar res."** ★ recomanada. És la més clara per a una persona adulta.
2. "Un món trencat en cinc trossos, quatre bestioles i tu. Joc per al mòbil, en català, fet a casa."
3. "Fes-te amb 40 bestioles, porta-les a la forma Astral i venç els cinc guardians. Joc per al mòbil, en català."

Nota: si voleu dir qui l'ha fet ("l'ha dissenyat l'Alba, 13 anys"), és decisió de la família. Jo no posaria el nom de la nena en una pàgina pública.

### 3.2. Premissa del món

Les dues premisses fan servir només el que el joc ja fa: 5 mons, 5 zones per món, un guardià al final de cada zona, la casa al mig del mapa, el món desconegut, les formes, els híbrids i la forma Astral. Cap mecànica nova.

#### Premissa A — "El món trencat" ★ recomanada

- **El món:** Quimèria era un sol món. Un dia es va trencar en cinc trossos: Brasàlia (foc), Altavolta (llamp), Mar de Fons (aigua), Boscúria (planta) i un cinquè que ningú no recorda.
- **Els guardians:** cada tros es va tancar. Un guardià en vigila el camí. No són dolents: protegeixen el seu tros des del dia que es va trencar. Quan els guanyes, et deixen passar més endins (això és el que ja fa el joc: guanyar una zona obre la següent).
- **Les bestioles:** viuen als cinc trossos, cadascuna amb el seu element. Creixen i canvien de forma. Algunes, quan creixen, barregen dos elements: "recorden" el món d'abans. Quan dues bestioles iguals s'uneixen, en surt una de més forta (això explica les còpies). La forma 4, Astral, brilla tant que les bestioles del seu element lluiten més fort al seu costat (això explica l'aura).
- **Tu:** vius a la casa del mig del mapa. És l'únic lloc on els cinc trossos encara es toquen, i per això bestioles de tots els elements hi poden viure juntes. Quatre bestioles, una de cada element, t'han triat: la Colla Original.
- **La casa:** el teu refugi. Com més la fas créixer, més bestioles hi caben.
- **El món desconegut:** és Somnàlia, el tros fet de somnis. Per això ningú no el recordava. Apareix quan ja has fet 3 expedicions (el que ja fa el joc).
- **L'objectiu final:** arribar fins al final dels cinc mons (la zona 5 de cadascun). Potser així Quimèria tornarà a ser un sol món.

Per què la recomano:
- El mapa ja la dibuixa: una casa al mig i cinc camins cap a fora, amb un món gris amb "???" (`01`, `04`).
- El nom "Quimèria" hi encaixa: és el món on les coses es barregen, i els híbrids són la prova.
- Les zones finals ja sonen a final de món: "Arrels del Món", "Ment Primordial", "Fossa de l'Oblit".
- Dóna un objectiu clar i mesurable amb el que ja hi ha (`G.done`).
- No cal cap personatge nou: els únics personatges són tu, les bestioles i els guardians.

#### Premissa B — "El refugi de la cruïlla"

- **El món:** Quimèria té cinc mons salvatges que es toquen en un sol punt, una cruïlla.
- **Tu:** hi has heretat una casa vella. Abans era un refugi de bestioles; ara és buida. Quatre bestioles s'hi han quedat i t'han triat.
- **Els guardians:** cada món té un guardià que posa a prova qui vol entrar més endins.
- **El món desconegut:** la casa "recorda" un cinquè camí, i l'obre quan has fet 3 expedicions.
- **L'objectiu final:** tornar a omplir el refugi i tenir les 40 bestioles al Bestiari.

Per què no la recomano: és més tranquil·la i més "de col·leccionar", però no té urgència ni final. Necessita algú que t'hagi deixat la casa, i aquest personatge no existeix al joc. S'assembla més a altres jocs de criatures.

**Recomanació: A.** De la B en guardaria una idea: els guardians no són dolents, són vigilants que et posen a prova.

### 3.3. Pantalla de títol i intro

#### Pantalla de títol (`historia/10-prototip-titol.png`)

- **Nom:** QUIMÈRIA (lletra de còmic, la mateixa de `.mname`).
- **Subtítol:** "Recull bestioles. Fes-les créixer. Explora cinc mons."
- **Imatge:** les 4 bestioles inicials (Pirí, Aquilet, Orquí, Lumi).
- **Botons:**
  - Jugadora nova: **"Comença"** → intro → mapa.
  - Partida guardada: **"Continua"** (botó gran) i, a sota, un enllaç petit **"Torna a veure la història"**.
- **Peu de pàgina:** "Joc per al mòbil · en català · la partida es guarda sola".
- No hi posaria "Partida nova" aquí: ja és a la Casa, amb confirmació, i a la pantalla de títol es podria tocar sense voler.
- Quan surt: només en obrir el joc. Si la partida ja té progrés, el títol pot durar poc (un toc a "Continua").

#### Intro: 5 pantalles (`historia/11` a `15`)

Regles: una vinyeta gran per pantalla. Un toc a qualsevol lloc = pantalla següent. Botó **"Salta"** a dalt a la dreta (salta tota la intro). Cinc punts a baix per saber quantes en queden. **No avança sola** (cadascú llegeix al seu ritme). Surt només la primera vegada, i després des de "Torna a veure la història".

| # | Text exacte (català) | Què mostra la imatge |
|---|---|---|
| 1 | Fa molt de temps, Quimèria era un sol món. Hi havia foc, aigua, planta, llamp… i una cosa més. | Fons de nit lila. Les 4 icones d'element juntes i un "?" lila al costat. |
| 2 | Un dia es va trencar en cinc trossos. Cada tros es va tancar, i un guardià en vigila el camí. | Fons de ratlles (com a les pàgines dels guardians). Paraula "CRAC!". Les 4 icones se separen cap als costats. |
| 3 | Tu vius a la casa del mig, on els trossos encara es toquen. Quatre bestioles t'han triat. | La casa del mapa, el personatge (`hero`) i les 4 bestioles inicials a banda i banda. |
| 4 | Les bestioles creixen i canvien de forma. Algunes encara recorden el món d'abans, i barregen elements. | Pirí → forma 2 → forma 3 híbrida (foc + aigua), cada vegada més gran. |
| 5 | Explora els mons amb la teva colla. Arriba fins al final de cadascun. Potser Quimèria tornarà a ser una. | El mapa: la casa al mig, 4 icones al voltant i el "?" gris. |

Després de la pantalla 5 s'arriba al mapa. El pols que ja hi ha (`G.completed===0`) i el consell de primer cop fan la resta. La part de "com es juga" (tocar un món, triar l'equip) és feina del rol d'UX, no de la història.

Totes les frases tenen 20 paraules o menys. Cap frase diu "el noi" o "la noia": el jugador sempre és "tu", sense adjectius amb gènere.

### 3.4. Moments d'història durant el joc

Cada moment surt **una sola vegada** (com els consells, amb una marca a `G.story`). Format: una vinyeta gran, el mateix motor de la intro, un toc per tancar. Màxim 2 frases.

**Primera bestiola nova**
- "Una bestiola salvatge s'ha unit a la teva colla. A Quimèria, són les bestioles les que trien a qui segueixen."

**Primer guardià (abans del combat).** Proposo afegir a cada guardià una frase seva, que surti a la vinyeta del nom, a sobre de les regles (`bossD`) que ja hi ha:
- Cavaller de Cendra: «Ningú no creua el foc sense cremar-se una mica.»
- Glacius, el Bruixot del Gebre: «Aquí baix el temps es glaça. I tu també.»
- Colós Molsut: «Fa mil anys que dormo. Espero que valgui la pena despertar-me.»
- Reina Vespa Elèctrica: «El meu eixam no dorm mai. I ara t'ha vist.»
- Penombra, Senyor dels Miralls: «Mira'm bé. El que veus ets tu.»
- Trícefal, Rei de les Profunditats: «Tres caps, tres opinions. Totes diuen que perds.»

**Primera victòria contra cada guardià** (una vegada per guardià):
- Cavaller de Cendra: «Passa. Més endins, el foc crema més.»
- Glacius: «Baixa, si goses. La fossa no té fons.»
- Colós Molsut: «Les arrels et coneixen. Pots seguir.»
- Reina Vespa Elèctrica: «L'eixam se'n recordarà de tu.»
- Penombra: «Has vist el teu reflex i no has fugit. Endavant.»
- Trícefal: «Dos caps diuen que has guanyat. El tercer encara s'ho pensa.»

**Primera vegada que entres a cada món**
- Brasàlia: "Brasàlia. Terra de cendra i rius de lava. Aquí les bestioles neixen calentes i parlen poc."
- Altavolta: "Altavolta. Prats que espurnegen i una ciutat damunt dels núvols. Aquí ningú camina a poc a poc."
- Mar de Fons: "Mar de Fons. A la platja tot és calma. A sota, la fossa no s'acaba mai."
- Boscúria: "Boscúria. Un bosc tan vell que té memòria. Les seves arrels arriben al centre del món."
- Somnàlia: "Somnàlia. Miralls, palaus i llibres que xiuxiuegen. Aquí, el que veus no sempre és el que hi ha."

**Quan s'obre el món desconegut** (al resum de la 3a expedició; substitueix "Has descobert el Món Psíquic!")
- "El tros perdut ha tornat. Es diu Somnàlia i és fet de somnis: per això ningú no el recordava."

**Primera evolució (forma 2)**
- "[Nom] ha canviat de forma. A Quimèria, créixer vol dir canviar."

**Primer híbrid (forma 3 amb dos elements)**
- "[Nom] barreja dos elements. Encara recorda quan Quimèria era un sol món."

**Primera forma 4 (Astral)**
- "[Nom] arriba a la forma Astral. Brilla com un estel, i les bestioles del seu element lluiten més fort al seu costat."

**Opcionals (si hi ha temps)**
- Primera vegada a la zona 5 d'un món: "Has arribat al final de [món]. El guardià d'aquí és el més fort de tots."
- Zona 5 d'un món acabada: "[Món] torna a estar obert. Un tros de Quimèria ja està a punt."
- Les 5 zones 5 acabades (és l'única cosa nova: un final): "Els cinc trossos tornen a tocar-se. Quimèria torna a ser un sol món, i la teva casa n'és el centre." I a sota: "Encara hi ha bestioles per trobar." (el joc continua igual).

### 3.5. On va al codi i mida

| Què | Fitxers de `src/` | Mida |
|---|---|---|
| Fitxer nou amb tots els textos de la història i les funcions `storyIntro(done)` i `storyBeat(clau, nom)` | `js/26-story.js` (nou) i afegir-lo a la llista `build:js` de `src/index.html`, abans de `99-boot.js` | mitjana |
| Que `comicPage` pugui fer una sola vinyeta a pantalla completa, que **no es tanqui sola** i que tingui botó "Salta". Ara sempre es tanca sola (`setTimeout(close, RM?900:total)`): amb "moviment reduït" es tancaria en 0,9 s i no es podria llegir | `js/17-comic-pages.js` (petit canvi a `comicPage`), `css/battle.css` (`.mp.full`, caixa de text gran, botó "Salta", arreglar "Toca per saltar" tallat) | petita |
| Pantalla de títol | `js/26-story.js` + estils a `css/base.css` (o `css/story.css` nou); cridar-la a `js/99-boot.js` abans del primer `render()` | petita |
| Marques "ja vist" (`G.story`) | `js/04-state.js` (`newGame()` afegeix `story:{}`; la reparació en carregar ja omple les claus que falten, però cal afegir `'story'` a la llista d'objectes que es reparen) | petita |
| Frases dels guardians (abans i després) | `js/16-bosses-and-group-attacks.js` (camps nous a `BOSS`), `js/17-comic-pages.js` (`bossIntro` les mostra) | petita |
| Enganxar els moments | primera bestiola: `js/05-run-helpers.js` (`recruitCard`); entrar a un món: `js/07-actions.js` (`case 'world'`); evolucions: `js/07-actions.js` (`case 'evolve'`); guardià guanyat i Somnàlia: `js/11-battle.js` (final d'expedició) i `js/screens/resum.js` | mitjana |
| "Torna a veure la història" | `js/screens/casa.js` (secció "Partida") | petita |
| Final opcional (5 zones 5 acabades) | `js/11-battle.js` + `js/26-story.js` | petita |

**Total: mitjana.** Intro + títol sols: petita-mitjana. No cal art nou: totes les imatges es poden fer amb `spArt`, `hero`, `elIcon` i la casa del mapa (ho demostren les captures `10` a `15`). Un artista les podria millorar després.

## 4. Què NO s'ha de fer

- **No posar parets de text.** Màxim 20 paraules per pantalla i 5 pantalles. Res de pròlegs llargs ni "llegendes antigues" d'un paràgraf.
- **No fer que la intro avanci sola ni que no es pugui saltar.** Cadascú llegeix al seu ritme; qui ja ho sap, salta.
- **No tornar a ensenyar la intro cada vegada que s'obre el joc.** Una vegada, i després només si la demanes.
- **No parlar com a un nen petit.** Res de "Hola, amiguet!", ni de diminutius a les frases de la història, ni d'exclamacions a cada línia.
- **No fer del jugador "l'escollit" que salva el món.** És algú que viu a la casa i a qui les bestioles han triat. El "potser" de la pantalla 5 és volgut: el joc no té final i no s'ha de prometre.
- **No donar gènere al jugador.** El personatge no té nom ni gènere: sempre "tu".
- **No dir que les còpies "moren", "es gasten" o "se sacrifiquen".** Dir "s'uneixen".
- **No inventar un mentor o un professor** que et dóna les bestioles. Aquest personatge no és al joc i s'assembla massa a altres jocs de criatures.
- **No fer que els guardians siguin malvats sense més.** Són vigilants. És més interessant per a 13 anys i lliga amb que et deixen passar.
- **No treure les regles del guardià de la vinyeta** (`bossD`). La frase del guardià va a sobre, no en lloc de les regles.
- **No fer servir "cor" per a la zona 5.** Ja hi ha zones que es diuen "Cor del volcà" i "Cor de l'arbre gegant".
- **No copiar noms ni frases d'altres jocs** ("atrapa'ls tots", "el teu primer company", etc.).
