# Consell v13 · Rol UX (jocs per a nens i adolescents, mòbil)

Revisat llegint el codi de `joc-bestioles.html` (2.039 línies, sense prova al navegador). Públic: **10-15 anys (la jugadora principal en té 13)** més el pare, mòbil en vertical.
Criteri per a aquesta edat: menys acompanyament i menys aspecte infantil, una interfície més "cool" i eficient (icones, números, colors de raresa), però que es pugui llegir d'un cop d'ull en un mòbil. A un adolescent no li molesta la profunditat del joc; el que el fa plegar és haver de **llegir paràgrafs** i no saber **què ha canviat** després de tocar un botó.

## 1. Els 10 problemes d'usabilitat més greus (del més greu al menys)

1. **La Motxilla és una paret de text i l'ordre està al revés** (`scMotxilla`, `setsBlock`). L'ordre és: figura, millor equip, 7 llocs, un paràgraf de Forja amb els multiplicadors (×1,6 ×2,4 ×3,4 ×4,8) i els costos, Poders especials (una llista separada per punts), Sets de llegenda (3 paràgrafs, i cada set té 4 línies de bonus), i només llavors l'inventari, que és el que més es fa servir. Cada grup d'objectes repeteix botó d'equipar, fletxes de canvi, botó de forjar i un text d'estat (els anells, dues vegades). Això són molts dits de scroll per arribar a l'objecte que acabes de trobar. **Proposta:** pestanyes a dalt: `Equip · Objectes · Forja · Sets`. Els paràgrafs passen a una icona "i" que s'obre només si la toques.
2. **L'estrella ★ vol dir tres coses diferents.** `starStr` marca la dificultat d'un món, una zona o un enemic. "Estrelles de força" (`c.mill`, de 0 a 5) és el que guanya una bestiola menjant. `specName` posa ★ segons el nivell d'evolució. Un jugador no pot saber quina és quina. **Proposta:** dificultat = calavera o flama, força = barra o rombe, evolució = número de nivell.
3. **A la batalla hi ha massa coses i la lletra és massa petita** (`battleStage`, CSS `.ab-row span{font-size:9.5px}`). Els noms de les habilitats a 9,5 px dins de 3 columnes de ~110 px no es llegeixen. A la zona de l'enemic hi ha estrelles, element, "Feble a", "Resisteix", perill, vida, estats i avís, tot alhora. **Proposta:** a cada bestiola, una icona d'habilitat amb un anell de càrrega en lloc de 2-3 barres amb text. Que "Feble a / Resisteix" es mostri amb icones d'element, i el nivell de perill només abans de la batalla.
4. **Evolucionar, forjar i equipar acaben amb un "toast" i prou** (`act0`, casos `evolve`, `equip`, `bestEquip`, `feed`, i `forgeOnce`). Evolucionar és el moment més important de la col·lecció i ara només diu "Ara és X!". A la forja et toca un **poder aleatori** (`aff.push(pickOne(AFF_KEYS))`) i no hi ha cap revelació: el poder nou queda amagat al text de l'objecte. **Proposta:** una carta de revelació com la de `bigCard` (ja existeix): "Forjat! Espasa Màgica + poder nou: Verí".
5. **No hi ha cap "què faig ara" fora del primer cop** (`render`: el pols `hint` només apareix amb `G.completed===0`). La Casa té edificis, migdiada i places; Bestioles té "ja pot evolucionar"; la Motxilla té forja a punt. Però el menú de baix no avisa de res. **Proposta:** punts vermells amb número al menú (`Bestioles ●2` si n'hi ha a punt d'evolucionar, `Motxilla ●` si hi ha forja a punt o un objecte millor per equipar) i, a la Casa, una targeta "Objectiu següent".
6. **Els consells (tips) es mostren una sola vegada i després no es poden tornar a llegir** (`tip()` posa `G.tips[k]=1`). Rols, elements, sinergies, combos i sets s'expliquen una vegada en un bloc lila, o enlloc. Si el toques "Entesos" sense llegir, ja no el tornes a veure. A més, el consell de la batalla surt **damunt** d'una batalla que va sola. **Proposta:** botó "?" fix a cada pantalla que torni a obrir el consell, i un "Manual" (glossari) a la Casa.
7. **La fitxa de la bestiola és un rotllo molt llarg** (`detailSheet`). En una sola columna hi ha: capçalera, rol, talent, cada exemplar amb botons de menjar (un per cada tipus de menjar), adopció, habilitats, arbre d'evolució i combos secrets. Els botons d'evolucionar queden enmig. **Proposta:** dues pestanyes (`Les meves · Info`) i que l'acció principal (menjar o evolucionar) quedi fixa a sota.
8. **Hi ha massa sistemes amb noms propis sense una jerarquia visual.** Rols (3), elements (5, i també el doble element 70/30), talents, sinergies, atac de tot l'equip, atac combinat, combos secrets (mega), poders d'objecte, 5 categories de forja, sets i el taller de llegendes. Per a un nen de 13 anys això és bo (dona profunditat), però **cada sistema necessita una icona i un color fixos** que es facin servir igual a tot arreu. Ara els talents fan servir `.syn` lila, igual que les sinergies, i això es confon.
9. **Botons petits i una amplada fixa.**
   - Els botons "Treu" fan 36 px d'alt, dins de caselles de `grid4` d'uns 80 px.
   - Els chips de tipus de comentari fan 36 px.
   - El mapa té una amplada fixa de 390 px (`.map{width:390px}`) dins d'un `overflow-x:auto`. En mòbils de 360-375 px apareix scroll horitzontal i un món queda tallat.
   - Les vinyetes de còmic (`comicPage`) es tanquen amb **qualsevol toc**, i això és fàcil de fer sense voler.

   **Proposta:** mínim 44 px per a tot el que es toca, i un mapa escalat amb `viewBox` o percentatges.
10. **Quan compares objectes no veus els poders** (`deltaChips`). Les fletxes ▲▼ només mostren Atac, Defensa i Vida. Si canvies un objecte amb Xucla vida per un altre amb més atac, veus "▲ millor" i no "perds Xucla vida". "Equipa el millor" pot desmuntar un set sense avisar. **Proposta:** chips de poders guanyats o perduts, i un avís del tipus "Trencaràs el set (3→2 peces)".

Altres coses menors:
- Durant l'aventura, la barra de dalt només mostra les monedes de l'aventura, no el total.
- Els textos de risc ("Una mica arriscat") estan bé.
- Les confirmacions "Segur? Toca un altre cop" estan bé.

## 2. Que el joc sigui més gratificant (sense allargar les habilitats normals)

- **So**: ara no n'hi ha cap (0 coincidències d'`AudioContext`). Proposta: sons curts generats amb WebAudio, de menys de 150 ms:
  - cop, SUPER, curar i KO;
  - "ding" de moneda;
  - fanfara de 3 notes en guanyar, evolucionar o forjar.

  Cal un botó de silenci a la barra de dalt, apagat per defecte si el mòbil està en silenci. Es pot afegir vibració (`navigator.vibrate(20)`) als cops crítics i als combos.
- **Moments grans, curts i que es poden saltar** (menys d'1,5 s): evolució (silueta, flaix, forma nova), primera Superèpica, combo secret nou (ja hi és), set complet a 5/5 i bestiola nova a la col·lecció.
- **Habilitats normals**: només el número que puja, l'etiqueta amb el nom (ja hi és) i el so. **Sense vinyeta.** Les vinyetes de còmic (`teamPage`, `bossIntro`, `mangaUlt`, de 3,3 a 4,3 s) s'haurien de veure sencera només la primera vegada; les següents, en versió curta d'1 s.
- **Progrés de la col·lecció visible**: anells de percentatge a Bestioles (espècies, evolucions, combos), com els que ja hi ha al mapa. Recompenses a cada fita (10/20/30/40 bestioles: monedes o un objecte).
- **Colors de raresa** de tipus "loot" (gris, verd, blau, lila, daurat) amb una mica de brillantor a Èpica i Superèpica. A aquesta edat, aquest llenguatge visual ja el coneixen d'altres jocs.
- **Resum de l'expedició** (`scResum`): llistar el botí (bestioles, objectes, combos descoberts) com a cartes petites, no només monedes.

## 3. Onboarding: aprendre de mica en mica

Regla general: **un sistema nou per expedició, i explicat quan apareix, no abans.** Cada explicació ha de cabre en una frase i una icona, amb un "i" per a qui vulgui el detall.

1. **Expedició 1 (rols):** l'equip inicial ja té un Atac, un Defensa i un Curador. Durant la primera batalla, tres etiquetes curtes: "Tanc: rep els cops", "Atac: fa mal", "Curador: cura".
2. **Expedició 2 (elements):** el primer cop "SUPER!" pausa la batalla 1 segon i mostra el cercle d'elements (qui guanya a qui) com a dibuix. El cercle es pot tornar a obrir des del "?".
3. **Primer objecte → Motxilla:** punt vermell a la pestanya i un consell guiat: "Toca Equipa i mira la fletxa verda".
4. **Quatre objectes iguals → Forja:** només llavors apareix la pestanya Forja amb un sol botó, "Forja", i la revelació del poder. La taula de multiplicadors queda dins del "i".
5. **Primer combo:** la vinyeta ja l'ensenya. Després hi afegiríem: "Has descobert un combo. Mira'n la llista a Bestioles".
6. **Primera Superèpica → Sets i Taller de llegendes:** fins aleshores la pestanya Sets ha d'estar tancada amb un cadenat i la frase "S'obre quan forgis una Superèpica". Ara els 3 paràgrafs surten des del primer dia.
7. **Primera evolució possible:** punt vermell a Bestioles i la fitxa oberta directament al botó d'evolucionar.

Afegir un **"Manual"** (glossari amb icones) a la Casa, i també el "?" de cada pantalla.

## 4. Millores ràpides (poc canvi, molt efecte)

1. **Motxilla amb pestanyes** (Equip / Objectes / Forja / Sets) i els paràgrafs de Forja i Sets amagats darrere un "i". És el canvi que més treu càrrega de lectura.
2. **Punts vermells al menú** per a: evolució a punt, forja a punt, objecte millor per equipar i edifici que ja et pots pagar.
3. **Treure el ★ de dues de les tres funcions** (dificultat = calavera, força = barra) i pujar els noms d'habilitat de 9,5 px a ≥12 px, o canviar-los per icones.
4. **Carta de revelació en evolucionar i en forjar** (reaprofitant `bigCard`): mostra la forma nova o el poder nou.
5. **Sons curts amb WebAudio, amb botó de silenci**, i les vinyetes de còmic curtes a partir de la segona vegada.

## 5. Idees més grans

1. **Objectius i missions** a la Casa: 3 missions actives ("Guanya un guardià de Foc", "Descobreix 1 combo", "Forja una Màgica") amb recompensa. Resolen el "què faig ara" i donen un ritme diari pare-filla.
2. **Pantalla de col·lecció tipus "àlbum"**: per element, amb anells de progrés, fites amb recompensa i una secció "Combos" amb siluetes (?) per descobrir. Converteix la col·lecció en l'objectiu a llarg termini.
3. **Una batalla més fàcil de seguir amb una sola mirada**:
   - bestioles amb icona i anell de càrrega;
   - enemic amb un sol estat important a la vista;
   - una "línia de temps" petita que avisa del cop fort de l'enemic;
   - opcionalment, un botó ×2 de velocitat per al pare o per als jugadors amb experiència.

   El joc continua automàtic, però el jugador entén què passa i per què guanya.
