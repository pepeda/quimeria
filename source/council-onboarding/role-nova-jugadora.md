# Consell "Primera partida" · Rol: nova jugadora (adulta que no juga)

He jugat com una persona adulta que gairebé mai no juga a videojocs, com la Sandra. Navegador nou (localStorage buit), mòbil 412x915, només tocs a coses visibles. He jugat uns 15 minuts: una expedició sencera a Foc · Zona 1 (10 llocs, una cova, el guardià), he tornat a casa, he mirat Bestioles i Motxilla, he donat menjar a una bestiola i he començat la segona sortida. Només després he llegit el codi per explicar el que havia passat.

- Captures: `source/council-onboarding/nova-jugadora/shots/01..59-*.png` (el número és l'ordre).
- Primer intent (les mateixes 6 primeres pantalles; vaig reiniciar per poder lliscar): `nova-jugadora/shots-intent1/`.
- Diari pas a pas, escrit mentre jugava: `nova-jugadora/notes.txt`. Script del navegador: `nova-jugadora/server.js`.

Avís honest: en dos tocs a la Casa (captures 48 i 49) em vaig equivocar jo de coordenades. Els dos tocs van caure sobre una targeta de la botiga i la van comprar. L'error de punteria va ser meu, però el que passa després (compra immediata, sense preguntar) és real, i en parlo al problema 4.

---

## 1. Què passa ara

| Pas | Captura | Què pensava que era / què faria | Tenia raó? |
|---|---|---|---|
| Obro l'enllaç | `shots-intent1/01-inici` | Un mapa amb 5 cercles de colors i una caseta. No hi ha cap nom de joc ni cap títol. "150", "Places 4/6" i "Comentaris (0)": no sé què són. Sembla una app, no un joc. Ja tinc un 5% explorat sense haver fet res. "Llamp · 5%" queda tallat a la dreta. | No sé què és. Toco "Entesos" i Foc (el de dalt, amb una estrella). |
| Món de Foc | `shots-intent1/03-foc` | Surt un nom nou, "Brasàlia" (jo havia tocat "Foc"). "Els monstres resisteixen el seu propi element. Consell: porta bestioles de Aigua o Llamp." No sé quines bestioles tinc ni com se'n "porten". | A mitges. Toco "Zona 1". |
| Tria l'equip | `shots-intent1/04-zona1`, `01-tria-baix` | És la pantalla on hauria plegat. "El teu personatge sempre hi va": quin personatge? Encara no n'he vist cap. Hi surten "sinergies", "atacs combinats", "tanc", "forma 1", "2 habilitats", etiquetes liles (Rastrejador, Caçaguardians, Nedador…), una barra verda sense nom i "Pot fer 3 expedicions més". Sí que entenc les etiquetes "Avantatge aquí" (verd) i "Desavantatge aquí" (vermell). Pirí diu "Resisteixen el seu element": no sé si és bo o dolent, ni de qui parla el plural. El botó per sortir ("Surt a explorar") no es veu: cal lliscar cap avall. | Trio les dues verdes, Aquilet i Lumi, i Pirí perquè diu "Atac". Tardo a trobar el botó. |
| Lloc 1 | `02-cami1` | Aquí veig per primer cop el meu personatge, un nen, amb les bestioles al darrere. És bonic i s'entén. "Ajustat" (etiqueta groga): no sé què vol dir. | Sí, és un camí amb decisions. Trio "Passa d'amagat" perquè sóc prudent. |
| Batalla 1 | `03-amagat`, `05-batalla3`, `06-batalla4` | Comença una batalla de cop. No surt cap frase tipus "T'han vist!". Un consell de 5 línies tapa la batalla mentre ja està en marxa. "Cremat 3", "Més fort ×1,08", "Prepara un COP FORT!": sembla un avís, però no hi puc fer res. Toco la Lumi i no passa res. Miro sense participar. El nen no surt a la batalla. Guanyem. Després del "Heu guanyat!" el text de sota diu "Comença la batalla!". | No. Em sento espectadora i no sé si havia de fer alguna cosa. |
| Monedes | `07-despres-b1` | La targeta "+25 monedes" és clara i agradable. A sota hi ha 3 botons que fan por: "Surt i guarda", "Torna a començar la zona", "Abandona". Dalt hi diu "+0" i abans hi deia "150". | Sí. Toco Continua. |
| Cruïlla | `08-lloc2` | Dues imatges: tenda o cova. Molt clar. | Sí. |
| Tenda → bestiola salvatge | `09-tenda`, `10-desperta` | "Cal una bestiola amb el talent Clauer": ARA entenc que les etiquetes liles són "talents". Ningú m'ho havia dit. Uns ulls entre l'herba: una bestiola que no he vist mai. "Lluita per fer-te'n amic." | Sí. És el primer moment en què entenc de què va el joc. |
| Batalla 2 | `12-b2-fi` | Una pantalla vermella sencera amb "ENEMIC · COP FORT!" i la bestiola que jo volia fer amiga. Ensurt: és enemiga o amiga? | No. |
| Bestiola nova | `14-b2-resultat` | "Bestiola nova! Fumí. Ara és amiga teva." És el millor moment de la partida. L'únic botó és "Envia-la a casa": no la puc portar amb mi? | Sí. M'agrada. |
| Niu d'ous | `15-lloc3`, `16-niu-res` | El dibuix és herba amb ulls, no hi veig cap niu. Trio "Espera que surti" i surt "Encara no surt". No passa res. | Decebedor. |
| Font | `17-lloc4`, `18-ampolla` | "Omple l'ampolla: menjar per a les bestioles" i em dona una "Baia picant" amb un dibuix de flama. Aigua que es converteix en una baia? La paraula "ÑAM!" porta una Ñ, que no és catalana. | A mitges. |
| Castell | `19-lloc5`, `20-castell-res`, `21-cofre` | Les opcions que depenen de les meves bestioles ("Una bestiola de Llamp obre la porta") em fan sentir llesta. Obro un cofre i comença una batalla sense cap frase que ho expliqui. | Sí, fins al cofre. |
| Cascada i cova | `24-lloc6` … `33-surt-cova` | "Neda fins a la cova… Hi entreu sense mullar-vos": nedar sense mullar-se? A dins: "nivell 1 de 3 · sala 1 de 4". Un camí dins el camí, i em preocupa quant durarà. Hi trobo una bestiola rara (gairebé no es veu, fosc sobre fosc) i li dono la Baia picant. El cercle es tanca i em sento llesta. Surto per l'escala segura. | Sí, i m'agrada. |
| Volcà, mirador, campament | `33` … `38` | Ja he entès el patró: llegir, triar, veure què passa. Al lloc 9, el campament té 1 estrella i diu "Perillós per al teu equip". Al lloc 1, el mateix tipus de monstre deia "Fàcil" i el campament "Ajustat". | Sí, però les estrelles i les etiquetes es contradiuen. |
| Guardià | `39-lloc10`, `40-boss1`, `41-boss2`, `42-boss-fi` | El text és tècnic: "Cada 3 torns fa una estocada que travessa l'escut…", i la frase de la meitat de la vida es diu dues vegades. El còmic d'entrada és emocionant. A la fitxa hi deia "Resisteix Planta"; a la batalla hi diu "Resisteix: Psíquic". Són uns 40 segons mirant. | El còmic, sí. La resta, no. |
| Premi i final | `44-boss-premi`, `45-final-zona`, `46-cofre-obert` | El títol diu "Tresor rar!" però l'etiqueta diu "Tresor · Normal". "Corona d'arrels" té el dibuix d'una estrella. "Camí completat! +275" i "Tots pugen a nivell 2": bé. "20 XP": paraula de joc. El cofre explica 5 categories (Normal → … → Superèpic) i s'obre al primer toc. | Sí, en general. |
| Casa | `47-casa1` | "Aquesta és la teva casa. Aquí descansen les bestioles." Aquest consell és la frase que explica el joc, i surt al cap de ~10 minuts. Ara entenc "Places 6/6": és la casa, i està plena. La casa és bonica, amb les 6 bestioles (el nen no hi és). | Sí. Hauria d'haver sortit al principi. |
| Botiga de la casa | `48`, `49`, `50` | Un toc a una targeta compra a l'instant, sense cap "Segur?". He gastat 340 monedes en dues coses que no volia. El rètol de neó comprat mostra "QUIMÈRIA": és la primera vegada que veig el nom del joc. Tocar una bestiola de la casa no fa res. | No. |
| Bestioles i fitxa | `51-bestioles`, `52-fitxa-fumi`, `53-menjar` | És un àlbum: les ombres són les que encara no tinc. S'entén. Però hi diu "Formes 0 de 200" (en són 200!?), "Combos secrets 0 de 16", "F1 · niv. 2". A la fitxa: "torn", "KO", "XP", "Les còpies desapareixen", "Viu al Brasàlia". Donar menjar funciona i fa gràcia ("Puja al nivell 3!"). "Envia-la al Niu": què és el Niu? Tinc por de perdre-la. | Menjar, sí. El Niu, no. |
| Motxilla, Comentaris | `54-motxilla`, `56-comentaris` | El botó "Equipa el millor" és fàcil. "Comentaris" és un formulari per opinar sobre el joc. Al principi semblava una xarxa social. | Sí. |
| 2a sortida | `58-foc2`, `59-tria-equip2` | No recorda l'equip d'abans (0 de 3) i he de tornar a triar. Ara entenc que la barra verda són les expedicions que li queden. | Sí. |

**Moment en què hauria tancat el joc:** a la pantalla "Tria l'equip" (`shots-intent1/04-zona1`), al minut 1. Hi ha més de 10 paraules que no entenc, no sé qui és "el teu personatge" i el botó per continuar no es veu. Si l'hagués superada, la batalla 1 (mirar sense poder fer res) era el segon punt de risc. A partir de la bestiola nova (minut ~4) ja no hauria plegat: el joc enganxa quan entens que "vas pel camí i fas amigues".

---

## 2. Problemes (del més greu al menys greu)

1. **El joc no diu mai què és ni de què va.** No hi ha nom, ni títol, ni presentació. La partida nova comença a la pantalla Explorar (`newGame()` a `src/js/04-state.js`, `screen:'explorar'`). La frase que explica el joc ("Aquesta és la teva casa. Aquí descansen les bestioles…", `src/js/screens/casa.js`) està pensada per sortir la primera, però surt al cap de 10 minuts. El nom "Quimèria" només el vaig veure perquè vaig comprar el rètol de neó sense voler.
2. **La primera decisió és la més difícil del joc.** "Tria l'equip" arriba en el segon 30, abans de veure cap batalla, i amb tota la jerga a la vista: rols, elements, talents, sinergies, formes, habilitats, cansament. A més, "Surt a explorar" queda fora de la pantalla. La persona nova no té cap manera de triar bé i el joc no tria per ella.
3. **La batalla automàtica no diu que és automàtica fins que ja ha començat, i el missatge és llarg.** No hi ha cap frase curta tipus "Mira com lluiten". Els avisos "Prepara un COP FORT!" semblen demanar una reacció que no existeix. El personatge (el nen) no hi apareix, i no queda clar quin és el meu paper.
4. **Botiga de la casa: un toc = compra, sense confirmar ni desfer.** `case 'build'` a `src/js/07-actions.js` cobra de seguida. El joc ja fa servir "Segur? Toca un altre cop" per a coses arriscades (reiniciar, abandonar), però no aquí. Una persona que toca "per veure què és" perd monedes i després no pot comprar el que necessitava (em va passar: 248 monedes per a una Habitació de 250).
5. **Paraules sense explicar a la primera pantalla de cada lloc.** Places, Comentaris, Brasàlia (un altre nom per a Foc), monstres vs bestioles, Ajustat, talent, tanc, XP, KO, F1, còpia, Niu, combo, forma. Una per una són poca cosa. Totes juntes fan que una adulta pensi "això no és per a mi".
6. **Informació que es contradiu** (fa desconfiar del joc):
   - El guardià: la fitxa d'abans diu "Resisteix Planta" i la batalla diu "Resisteix: Psíquic". Causa: `makeBattle()` tria la resistència a l'atzar (`pickOne`, `src/js/11-battle.js` línia 20) i es crida dues vegades, una per a la previsualització (`src/js/screens/run.js` línia 21) i una per a la batalla de veritat. És un error.
   - "Tresor rar!" amb l'etiqueta "Tresor · Normal" (`src/js/screens/run.js` línia 58 i la categoria del cofre).
   - Un campament d'1 estrella "Perillós per al teu equip", i el mateix monstre al lloc 1 "Fàcil". Les estrelles i l'etiqueta de perill diuen coses diferents.
   - Després de guanyar, el text de la batalla torna a dir "Comença la batalla!".
7. **Esperar sense recompensa.** "Espera que surti → Encara no surt" (niu) i el cofre final que s'obre al primer toc després d'explicar 5 categories. Les dues coses decebien.
8. **Errades de llengua**, que una adulta catalanoparlant veu de seguida:
   - "ÑAM!" (`run.js` línia 60) → "NYAM!"
   - "Algu obrirà" (`src/js/02-scenes-data.js` línia 42) → "Algú obrirà"
   - "porta bestioles de Aigua" (`src/js/screens/mon.js` línia 11) → "d'Aigua"
   - "Viu al Brasàlia" (`src/js/screens/detail.js` línia 39) → "Viu a Brasàlia"
   - "Neda… sense mullar-vos": contradictori
   - "Resisteixen el seu element" en plural sobre una sola bestiola (`src/js/screens/equip.js` línia 14)
9. **Petits detalls visuals:**
   - "Llamp · 5%" tallat a la dreta del mapa.
   - L'etiqueta verda de la cova es parteix en dues línies.
   - El dibuix del "Niu d'ous" és herba amb ulls.
   - L'interior del castell té el mateix dibuix que l'exterior.
   - L'avís negre de baix tapa les bestioles.
   - Els punts de la llista del cofre surten desalineats.
10. **No recorda l'últim equip** a la segona sortida, i s'ha de tornar a triar des de zero.

(No repeteixo el que ja va dir el consell v13: els consells no es poden tornar a llegir, el punt "hint" només surt a l'inici, les estrelles ★ volen dir tres coses i les vinyetes es tanquen amb qualsevol toc. Ho he vist i ho confirmo.)

---

## 3. Propostes concretes

### P1. Pantalla de títol + presentació de 3 vinyetes (mitjana)
Només en una partida nova (`G.completed===0` i sense `G.tips.intro`).

- **Pantalla de títol** (nova, `src/js/screens/` + `06-render.js`): el nom gran **Quimèria**, el nen amb 3 bestioles al costat (`hero()` a `03-drawing.js`, `spArt`), i a sota:
  > "Un joc d'aventures per al mòbil. Explora mons, fes-te amiga de bestioles i construeix-los una casa."
  > Botó: **Comença**. Botó petit: **Ja sé jugar** (salta la presentació).
- **3 vinyetes** reutilitzant l'estil de `comicPage` (`17-comic-pages.js`), però **avançant amb un toc a cada vinyeta**. Ara mateix `comicPage` es tanca sola en uns segons i amb qualsevol toc, i per a una presentació no serveix. Caldria un paràmetre `step:true`. Text exacte:
  1. "Aquest és el teu personatge. Viu en una casa petita amb quatre bestioles."
  2. "Fora de casa hi ha cinc mons. En cada un hi viuen bestioles noves que encara no coneixes."
  3. "Surt d'aventura, tria el camí i fes-te amiga de les bestioles que trobis. Tu tries; elles lluiten."
  > Botó final: **Som-hi!**
- Durada: menys de 30 segons. Es pot saltar sempre.

### P2. La partida nova comença a la Casa (petita)
`newGame()` a `04-state.js`: `screen:'casa'` en lloc de `'explorar'`. El consell de la casa ja diu el que cal. Retoc del text (`screens/casa.js`):
> "Aquesta és la teva casa. Aquí viuen i descansen les teves bestioles. Quan vulguis sortir d'aventura, toca **Explorar** (a baix)."

El pols "hint" del botó Explorar ja existeix i aquí sí que fa la seva feina.

### P3. Primera tria d'equip: el joc tria per tu (petita-mitjana)
A `screens/equip.js`, si `G.completed===0`:
- Les 3 bestioles recomanades ja venen marcades (les d'avantatge, i omplir els rols que faltin).
- Un consell nou, en lloc de l'actual:
  > "Ja t'hem triat un bon equip per començar. Toca **Surt a explorar**."
- El botó "Surt a explorar" fix a baix de tot (sticky) perquè sempre es vegi.
- Amagar els talents, les sinergies i "Pot fer X expedicions més" fins a la segona expedició (`G.completed>=1`). Deixar només el nom, el dibuix, el rol i l'etiqueta verd/vermell.
- Canviar "Resisteixen el seu element" per **"Aquí li costarà"**, i "Desavantatge aquí" per **"Aquí li costarà molt"** (o mantenir "Desavantatge" però en singular i clar).
- A la segona sortida, recordar l'últim equip (`G.pick` de l'última expedició) si les bestioles poden anar-hi.

### P4. La primera batalla diu clarament que és automàtica (petita)
Abans de la primera batalla (o en lloc del consell llarg actual de `screens/battle-stage.js`), una sola línia que **no tapi** la batalla, a la caixa de text del combat:
> "Les teves bestioles lluiten soles. Tu només mires i, quan s'acaba, tries el camí."

El consell llarg (habilitats, barres grogues, atac combinat) es pot moure a la segona o tercera batalla. Quan l'enemic "prepara un COP FORT" a la primera batalla, afegir: "No cal fer res: la teva Defensa l'aguantarà."

### P5. Confirmar les compres de la casa (petita)
`07-actions.js`, `case 'build'`: fer el mateix que "Abandona", amb un primer toc que arma i un segon que compra. Text del botó armat:
> "Comprar per 220? Toca un altre cop"

### P6. Canviar o explicar les paraules de la barra de dalt (petita)
`06-render.js` línia 14:
- "Places 4/6" → **"Casa 4/6"** (o "Llits 4/6").
- Que sigui tocable i obri una línia: "Bestioles que viuen a casa / lloc que hi ha. Fes més habitacions a la Casa."
- "Comentaris (0)": és útil per a la família que prova el joc, però per a una persona nova sembla una xarxa social. Proposta: **"Opina"**, o una icona de bafarada amb el text "Digues què en penses" la primera vegada.
- Durant l'aventura, posar "Aventura: +25" en lloc de només "+25" (si no, sembla que hagis perdut les 150 monedes).

### P7. Corregir les contradiccions (petita)
- Calcular la resistència del guardià una sola vegada i desar-la al pas del camí (per exemple `r.gate={resist:…}`), i fer servir aquesta mateixa a la previsualització i a la batalla (`11-battle.js` línia 20 i `screens/run.js` línia 21).
- El títol de la carta "Tresor rar!" ha de casar amb l'etiqueta. Si la categoria és "Normal", que posi "Tresor del guardià!".
- Quan la batalla s'acaba, que el text de la caixa digui "Heu guanyat!" i no "Comença la batalla!".
- Treure la frase repetida de la fitxa del guardià: "A la meitat de la vida s'enfada i fa més mal."

### P8. Frases quan passa alguna cosa inesperada (petita)
Quan un cofre o una opció porta a una batalla:
> "El cofre era una trampa! Un monstre en surt."

Quan "Passa d'amagat" falla:
> "T'han vist! Has de lluitar."

(`src/js/09-route-and-effects.js` o on es resolguin `rand`/`fight`.) Ara la batalla comença sense explicació.

### P9. Errades de llengua (petita)
"ÑAM" → "NYAM"; "Algu" → "Algú"; "de Aigua" → "d'Aigua" (fer servir una funció `de(nom)` per a les vocals); "Viu al Brasàlia" → "Viu a Brasàlia"; "Neda fins a la cova… sense mullar-vos" → "L'Aquilet us hi porta nedant" (i que digui quina bestiola ho fa, com al castell).

### P10. Explicar el Niu abans de mostrar el botó (petita)
A la fitxa (`screens/detail.js`), sota "Envia-la al Niu":
> "El Niu és un lloc on les bestioles que no caben a casa esperen. No la perds: la pots tornar a buscar."

(Si no és així, cal dir el que és de veritat. No ho he pogut comprovar jugant.)

---

## 4. Què NO s'ha de fer (coses que farien plegar la jugadora)

- **No fer un tutorial llarg de text** abans de jugar (5 pantalles de consells, regles d'elements, taula de rols). Ella vol tocar alguna cosa en menys de 30 segons.
- **No obligar a llegir.** Totes les presentacions s'han de poder saltar amb "Ja sé jugar".
- **No ensenyar números i percentatges a la primera hora**: +30%, ×1,08, 0 de 200 formes, 5 categories de cofre, XP. Que surtin quan ja s'ha entès el joc.
- **No començar amb una batalla ni amb una tria difícil.** La primera cosa que es toca ha de tenir una sola resposta bona.
- **No fer servir paraules de jugador sense explicar-les**: tanc, KO, XP, combo, buff, sinergia. Millor "rep els cops", "fora de combat", "experiència", "atac junts".
- **No posar avisos que demanen una acció quan no se'n pot fer cap** ("Prepara un COP FORT!" sense res a fer).
- **No cobrar monedes amb un sol toc.**
- **No perdre el que funciona.** Les escenes amb el nen i les bestioles, les opcions "Segur / Una mica arriscat", les etiquetes verd/vermell, la carta "Bestiola nova!" i fer-se amiga d'una bestiola salvatge són el que enganxa. La presentació ha de portar cap aquí tan aviat com es pugui (idealment, la primera bestiola nova abans del minut 3).
