# Consell "Primera partida" · Rol jugadora-13

Mirada: com aprèn un joc de mòbil una noia o un noi de 10 a 15 anys.
Regles que fan servir sense saber-ho: no llegeixen, toquen per provar, pleguen si en 30 segons no passa res,
i també pleguen si no saben què han de fer després.

## Com ho he provat

- `dist/index.html` en un Chrome nou (localStorage buit = jugadora nova), mòbil 412x915, només tocs reals (`tap`).
- Script `jugadora-13/kid.js`: una "jugadora que no llegeix". Toca sempre el botó més evident, no toca mai "Entesos".
  Compta el temps i les paraules noves que surten a cada pantalla.
- Script `jugadora-13/kid-entesos.js`: la mateixa jugadora, però tanca cada consell amb "Entesos".
- Script `jugadora-13/play.js`: tocs un per un, per fer captures concretes.
- Registres: `jugadora-13/k3-kid-no-llegeix.log` i `jugadora-13/e1-kid-entesos.log`.
- 3 partides noves completes de 2,5 a 4 minuts. El bot toca cada segon. Una noia real va més lenta (2-4 s per pantalla),
  o sigui que els temps reals són més llargs que els meus.
- No he provat el joc publicat a GitHub Pages, només `dist/index.html`. No he provat el so.

---

## 1. Què passa ara

### La línia de temps d'una jugadora nova (bot ràpid, partida k3)

| Temps | Què veu | Captura |
|---|---|---|
| 0 s | Un mapa amb 5 cercles de colors i una caseta. Cap bestiola. Un bloc lila de text a dalt. | `A1-primera-pantalla-mapa.png` |
| 2 s | Pantalla del món de Foc: 183 paraules (descripció, consell, 5 zones, "MOLT DIFÍCIL", "LLEGENDÀRIA"). | `A2-mon-foc.png` |
| 3 s | "Tria l'equip": 4 bestioles petites (uns 40 px), 117 paraules. La primera de la llista diu "Desavantatge aquí". | `A3-tria-equip.png` |
| 5 s | Primer lloc del camí: dibuix d'una torre, 2-4 opcions amb text. | `A4-primer-lloc.png` |
| 6-10 s | **Primera recompensa**: una carta "Menjar! Baia picant ×3". | `A5-primera-recompensa-menjar.png` |
| 15-16 s | **Primera batalla** (a les 3 partides, al lloc 5, després de "Truca a la porta"). | `A6-...png` |
| 16-47 s | La batalla dura **25-30 segons** i no es pot fer res. | `A7-batalla-sense-consells.png` |
| 41 s | "Heu guanyat!" i un botó. | `A8-heu-guanyat.png` |
| 52-104 s | Campament: 2 batalles seguides (52 s en total). | |
| **1 min 44 s** | **"Heu perdut"**. Monedes de l'expedició: **+0**. Bestioles noves: **cap**. | `A9-heu-perdut-1m44s.png` |

A la partida e1, la jugadora va guanyar el campament. Les primeres monedes van arribar a l'**1 min 50 s** (+40).
**En cap de les 3 partides ha entrat cap bestiola nova** en els primers 2,5 a 4 minuts.

### El que més m'ha cridat l'atenció

- **La primera pantalla no sembla un videojoc.** És un mapa de cercles amb una caseta (`A1`). No hi surt cap bestiola, cap monstre
  ni el nom del joc. El nom "Quimèria" només és al títol de la pestanya; no surt enlloc dins del joc.
  Això explica el que va dir la Sandra ("pensava que era un joc de taula").
  La Casa (`B1-casa-nova.png`) és una casa de nines amb llistes de preus: encara sembla més un joc de manualitats.
- **La primera batalla queda amagada.** Si no has tocat "Entesos", a sobre de la batalla hi ha **dos blocs lilas apilats**
  (el del camí i el de la batalla, 66 paraules). Les teves bestioles queden a sota de la pantalla i no les veus lluitar (`A6`).
  Una jugadora que no llegeix (la majoria) es perd el moment més divertit.
- **Tocar i que no passi res.** A "Tria l'equip", el botó "Surt a explorar" està apagat fins que tries bestioles.
  Queda a sota de tot (cal fer scroll) i no diu per què està apagat.
- **El joc posa primer la pitjor opció.** A la llista d'equip, la primera bestiola és Orquí, amb "Desavantatge aquí".
  La jugadora que toca les 3 primeres porta un equip feble. Al primer combat surt "Perillós per al teu equip".
- **Es pot perdre la primera expedició i no endur-se res** (`A9`).

---

## 2. Respostes a les 5 preguntes

### 1) En els primers 30 segons, passa alguna cosa divertida? Quina és la primera recompensa i quan arriba?

- **Sí, però mal ensenyada.** Amb tocs ràpids: la primera recompensa arriba als **6-10 s** i la primera batalla als **15-16 s**.
  Amb una noia real (2-4 s per pantalla), calculo la primera batalla entre els **40 i els 60 s**.
- **La primera recompensa és menjar** ("Baia picant ×3"), o un objecte. Està ben presentada (carta gran, "ÑAM!"),
  però no és el que vol una jugadora d'un joc de col·leccionar. El que vol és **una bestiola nova**,
  i en 3 partides no n'ha arribat cap.
- **Les primeres monedes arriben a l'1 min 50 s.** Fins llavors, el comptador de dalt diu "+0".
- **Els 10 primers segons no són divertits:** hi ha 3 pantalles de menú (mapa, món, equip) abans de veure res que es mogui.

### 2) Quanta estona ha de llegir abans de la primera batalla?

- **Consells obligatoris (blocs lilas): 5 consells, 122 paraules** (explorar 19, món 19, equip 18, camí 27, batalla 39).
  El de la batalla surt *damunt* de la batalla que ja ha començat.
- **Text total que surt a la pantalla abans de la primera batalla: entre 630 i 755 paraules noves**
  (mesurat pel bot: tot el text de cada pantalla, opcions incloses).
  Només la pantalla del món de Foc en té 183. Una noia de 13 anys n'acostuma a llegir 0.
- Moltes d'aquestes paraules parlen de coses que encara no fan falta: "forma 3", "equip Èpic", "sinergies",
  "atacs combinats", "talent Volador", "Caçaguardians".

### 3) Quin estil de tutorial va bé per a aquest públic, i quant pot durar?

**Aprendre fent, amb un dit que assenyala el botó que cal tocar i una sola frase curta al costat.**

- **Sí:** un dit (o una fletxa) que fa pampallugues sobre el botó, amb un globus d'**una sola línia de 7 paraules com a màxim**.
  La jugadora toca, passa alguna cosa i surt el següent pas. Res bloqueja la pantalla.
- **Sí, però curt:** 3 vinyetes de còmic al principi (reaprofitant `comicPage` de `17-comic-pages.js`),
  **6 segons en total**, que es tanquen soles. Serveixen per dir de què va el joc, no com es juga.
- **No:** diapositives amb "Següent" (pleguen a la segona).
- **No:** un personatge que parla amb paràgrafs o amb text que surt lletra a lletra. Una bestiola guia sí que pot sortir al costat del globus,
  però **només amb frases d'una línia**.
- **Durada:** tot el tutorial guiat ha de cabre **en la primera expedició, en uns 90 segons**, i acabar amb una victòria i una bestiola nova.
  Després, res més de cop: cada sistema nou s'explica quan apareix (com ja proposava el consell v13).
- **Es pot saltar:** un botó petit "Salta" sempre a dalt a la dreta durant el tutorial.
- **Es pot tornar a veure:** botó "Com es juga?" a la Casa, i també a la pantalla de títol.

### 4) Quins tutorials farien plegar una noia de 13 anys?

Vegeu la secció 5 ("Què NO s'ha de fer"), amb exemples concrets.

### 5) Text per enviar per WhatsApp i què ha de mostrar la primera pantalla

Vegeu la proposta P1 (primera pantalla) i la P8 (textos per a WhatsApp i vista prèvia de l'enllaç).

---

## 3. Problemes, del més greu al menys greu

1. **La primera pantalla no diu que és un videojoc de bestioles.** Mapa de cercles, cap bestiola, cap nom del joc (`A1`).
2. **Cap bestiola nova en els primers minuts.** El joc va de col·leccionar, però la primera expedició no en garanteix cap.
3. **Es pot perdre la primera expedició sense guanyar res** (1 min 44 s, +0 monedes, `A9`). És el moment exacte en què pleguen.
4. **La primera batalla queda tapada per dos blocs de consells** i les bestioles queden fora de la pantalla (`A6`).
5. **Massa text abans de jugar** (122 paraules de consells, 630-755 paraules a la pantalla), i en part sobre coses de més endavant
   (zones 4 i 5: "MOLT DIFÍCIL", "LLEGENDÀRIA", "forma 3", "equip Èpic").
6. **Tres pantalles de menú abans d'aventura** (mapa, món, equip). Cap no té acció ni moviment.
7. **L'equip inicial no està triat**, la llista comença per la bestiola amb desavantatge i "Surt a explorar" està apagat i sota de tot sense dir per què.
8. **Els consells no es poden tornar a veure.** Qui toca "Entesos" sense llegir ja no els tornarà a veure (`tip()` a `06-render.js`).
   Qui no el toca el té a sobre de cada pantalla, també a sobre de la batalla.
9. **La batalla dura 25-30 s sense fer res.** Per a la primera batalla és massa llarg: hauria de durar uns 10-12 s.
10. **El botó més gran de la primera pantalla és "Comentaris (0)"**, a dalt a la dreta. Per a algú de fora és un botó estrany:
    no sap de qui són els comentaris.
11. **Les bestioles es veuen petites**: 36-44 px a l'equip i a la batalla, uns 20 px al dibuix del camí (`A4`, `A7`).
    Són el que fa ganes de jugar i ara són el més petit de la pantalla.
12. A la primera pantalla, el món de **Llamp queda tallat** per la dreta (`A1`). Ja ho va dir el consell v13 (mapa de 390 px).
13. El pols "hint" del menú (`G.completed===0`) **no es veu mai al principi**, perquè el joc ja comença a la pantalla Explorar.

---

## 4. Propostes concretes

### P1. Pantalla de títol (la primera que es veu) · mida: mitjana

**Què ha de mostrar, de dalt a baix** (tot dins d'una pantalla de mòbil, sense scroll):

1. El nom del joc en gran: **QUIMÈRIA**
2. Una frase: **"Col·lecciona bestioles, fes-les evolucionar i guanya batalles."**
3. Una escena gran: les 4 bestioles inicials (Pirí, Aquilet, Orquí, Lumi) a 80-100 px, a l'esquerra,
   mirant un monstre a la dreta, amb un "VS" de còmic al mig. Que es moguin una mica (respirar o botar).
   Així, en 1 segon, s'entén: **videojoc, bestioles, batalles.**
4. Un botó molt gran, verd: **"Juga"**
5. A sota, un botó petit: **"Com es juga?"** (torna a passar les vinyetes i el tutorial).
6. Molt petit, a baix (opcional, ho decideix la família): **"Bestioles dissenyades per l'Alba."**

Quan ja hi ha una partida guardada, el botó gran diu **"Continua"**.

Fitxers: un fitxer nou `src/js/screens/titol.js` (afegir-lo a `src/index.html`), `src/js/06-render.js` (nova pantalla `titol`),
`src/js/04-state.js` (`newGame()` amb `screen:'titol'`), `src/css/controls.css`.
Reaprofitar `spArt`/`cArt` (`23-critter-art.js`) i `monster` (`03-drawing.js`).

### P2. Intro de 3 vinyetes, 6 segons · mida: petita

Reaprofitar `comicPage()` de `src/js/17-comic-pages.js`. Surt després de tocar "Juga" la primera vegada. Es tanca sola o amb un toc.

- Vinyeta 1 (els 5 mons de colors): **"Hi ha bestioles amagades en 5 mons."**
- Vinyeta 2 (el personatge i una bestiola fent-se amics): **"Fes-te'n amic i porta-les a casa."**
- Vinyeta 3 (l'equip davant d'un guardià, "LLUITA!"): **"Junts, guanyeu els guardians!"**

18 paraules en total. A sota de tot, el text de sempre: "Toca per saltar".

### P3. Primera expedició guiada (el tutorial) · mida: mitjana-gran

**Idea:** la primera expedició és el tutorial. Un dit que fa pampallugues assenyala el botó i hi ha **una línia de text** al costat.
No hi ha blocs lilas. Botó **"Salta"** a dalt a la dreta. Durada: uns 90 s.

| Pas | On | Text del globus (exacte) |
|---|---|---|
| 1 | Mapa, dit sobre Foc | **"Toca el món de Foc."** |
| 2 | Món, dit sobre la Zona 1 | **"Comença per aquí."** |
| 3 | Equip **ja triat** (Aquilet, Lumi, Pirí), dit sobre "Surt a explorar" | **"Equip a punt! Som-hi."** |
| 4 | Lloc 1: **sempre** una bestiola salvatge fàcil | **"Una bestiola salvatge! Lluita per fer-te'n amic."** |
| 5 | Batalla (curta, sense consells a sobre) | Banner **"La batalla va sola. Mira!"** i, sobre cada bestiola, 1,5 s cadascuna: **"Rep els cops"** (tanc), **"Fa mal"** (atac), **"Cura"** (curador) |
| 6 | Carta de la bestiola nova | **"Nova bestiola! Ara en tens 5."** |
| 7 | Lloc 2 i següents, dit sobre una opció | **"Tria un camí."** (només la primera vegada) |
| 8 | Abans del guardià | **"El guardià! Guanya'l i acabes la zona."** |
| 9 | Cofre del final | **"Toca el cofre!"** |
| 10 | Casa, dit sobre Bestioles | **"Mira les teves bestioles."** |

Unes **45 paraules** en tot el tutorial (ara n'hi ha 122 de consells abans de la primera batalla).

Regles del tutorial:
- **El dit fa pampallugues**, però no tapa res ni bloqueja. Si la jugadora toca una altra cosa, el dit espera a la pantalla que toca.
- **La primera expedició no es pot perdre**: si l'equip cau, es desperta amb la meitat de vida, amb el text **"Ui! Tornem-hi."**
- **La primera batalla dura uns 10-12 s** (enemic amb menys vida).
- **Totes les bestioles a 80 px o més** a la carta de la bestiola nova.

Fitxers:
- `src/js/04-state.js`: un camp `G.tut` (pas del tutorial, o `done`).
- `src/js/09-route-and-effects.js`: a `buildRoute`, si és la primera expedició, el lloc 1 és una bestiola salvatge fàcil.
- `src/js/screens/equip.js`: l'equip ja triat; botó "Surt a explorar" fix a baix.
- `src/js/06-render.js` i `src/css/controls.css`: classe `tut` (dit i globus) sobre el botó objectiu.
- `src/js/11-battle.js` i `src/js/02-balance.js`: primera batalla més curta, i primera expedició que no es pot perdre.
- `src/js/07-actions.js`: avançar `G.tut` en cada acció, i acció `skipTut`.

### P4. Res de consells a sobre de la batalla · mida: petita

A `src/js/screens/battle-stage.js`, treure `tip('battle',...)` del principi de l'escenari.
Quan hi ha una batalla, `src/js/screens/run.js` tampoc no ha de posar `tip('run',...)` a sobre.
La batalla ha de començar a dalt de tot de la pantalla, amb les bestioles visibles (com a `A7`).

### P5. Consells curts i que es puguin tornar a llegir · mida: petita-mitjana

- Cada consell, **una frase de 12 paraules com a màxim**. Textos nous:
  - explorar: **"Toca un món per entrar-hi."**
  - món: **"Acaba una zona i s'obre la següent."**
  - equip: **"Toca bestioles per portar-les. Prova un tanc i un curador."**
  - camí: **"Toca una opció. Els punts vermells volen dir perill."**
  - bestioles: **"Les ombres són bestioles que encara no tens."**
- Botó **"?"** a la barra de dalt, que torna a obrir el consell de la pantalla (`src/js/06-render.js`, `tip()` i `topBar()`).
- A la Casa, el botó **"Com es juga?"** torna a passar les vinyetes (P2) i reinicia el tutorial (P3).

### P6. Amagar el que encara no toca · mida: petita

- Al món, les zones 2-5 tancades es mostren com **un sol cadenat amb "Zona 2"**, sense descripció,
  fins que s'acaba la zona anterior (`src/js/screens/mon.js`). Fora "MOLT DIFÍCIL" i "LLEGENDÀRIA" a la primera visita.
- A l'equip, la descripció de les sinergies, les etiquetes de talent i "Pot fer 3 expedicions més" no surten fins a la segona expedició
  (`src/js/screens/equip.js`).

### P7. Treure soroll de la primera pantalla · mida: petita

- "Comentaris (0)" passa a ser **una icona petita de bafarada** al costat de la barra de dalt, amb un punt quan n'hi ha
  (`src/js/06-render.js`, `topBar()`). Molt important per a la família, però no ha de ser el botó més gran de la primera pantalla.

### P8. Textos per enviar l'enllaç i vista prèvia a WhatsApp · mida: petita

**Missatge per als adults de la família** (llest per enganxar):

> Mira el videojoc que hem fet amb l'Alba! Es diu Quimèria. Col·lecciones bestioles, les fas evolucionar i lluites contra monstres en 5 mons. És per al mòbil, en català, i no cal instal·lar res. Toca "Juga" i en un minut ja estàs en una batalla.
> https://pepeda.github.io/quimeria/

**Missatge per a les amigues de l'Alba** (que l'enviï ella):

> Ei! He fet un joc amb el meu pare. Les bestioles les he dissenyat jo! Les reculls, les fas evolucionar i lluites contra guardians. Prova'l al mòbil:
> https://pepeda.github.io/quimeria/

**Vista prèvia de l'enllaç.** Ara la pàgina només té `<title>Quimèria</title>`. A WhatsApp sortirà sense imatge ni descripció.
Cal afegir a `src/index.html` (i, en publicar, a l'`index.html` de l'arrel):

```html
<meta name="description" content="Videojoc per al mòbil, en català. Col·lecciona bestioles, fes-les evolucionar i guanya batalles en 5 mons.">
<meta property="og:title" content="Quimèria · joc de bestioles">
<meta property="og:description" content="Videojoc per al mòbil, en català. Col·lecciona bestioles, fes-les evolucionar i guanya batalles en 5 mons.">
<meta property="og:image" content="https://pepeda.github.io/quimeria/preview.png">
<meta property="og:type" content="website">
```

`preview.png` ha de ser un fitxer de debò al costat de l'`index.html` (1200x630 px). WhatsApp no llegeix imatges dins del codi.
La imatge: la mateixa escena de la pantalla de títol (4 bestioles, "VS", un monstre) amb "QUIMÈRIA" en gran.
No he comprovat com ho mostra WhatsApp.

### Ordre recomanat

1. P4 (petita, arregla la primera batalla tapada).
2. P1 + P8 (que s'entengui que és un videojoc abans de tocar res).
3. P3 (la primera expedició guiada, amb bestiola nova segura i sense poder perdre).
4. P5, P6, P7.
5. P2 (vinyetes), si queda temps. És el que menys falta fa: P1 ja diu de què va el joc.

---

## 5. Què NO s'ha de fer (coses que farien plegar la jugadora)

1. **Diapositives de tutorial amb "Següent"** abans de jugar. A la segona diapositiva ja estan buscant el botó de saltar.
2. **Un personatge que parla amb paràgrafs**, o text que surt lletra a lletra i s'ha d'esperar. Una línia, i fora.
3. **Bloquejar la pantalla** perquè només es pugui tocar el botó del tutorial, sense botó "Salta".
4. **Explicar sistemes que encara no fan falta**: forja, sets, Niu, formes, talents, sinergies. En el primer minut, només: tocar, lluitar, bestiola nova.
5. **Deixar perdre la primera expedició sense premi.** Perdre a l'1 min 44 s amb "+0" és el punt on es tanca la pestanya i no es torna.
6. **Una batalla llarga on no es pot fer res i ni tan sols es veu.** La primera batalla ha de ser curta i ocupar tota la pantalla.
7. **Botons apagats sense explicació** ("Surt a explorar" en gris i a sota de tot).
8. **Textos de nen petit**: "Molt bé!!! Ets un crack!!!" a cada toc, o una mascota que aplaudeix tota l'estona. A 13 anys això fa vergonya.
   Millor curt i directe: "Nova bestiola!", "Heu guanyat!".
9. **Demanar el nom, un compte o permisos abans de jugar.** Si mai voleu un nom per al personatge, que sigui després de la primera batalla.
10. **Tornar a ensenyar el tutorial cada vegada**, o no poder-lo tornar a veure mai més. Ha de sortir un cop, i després ha de ser fàcil tornar-lo a obrir.
11. **Una pantalla de títol amb música alta automàtica.** Molts juguen en llocs on no poden fer soroll. (No he comprovat com sona ara el joc.)
12. **Dir "MOLT DIFÍCIL" o "LLEGENDÀRIA" el primer minut.** Fa sentir que el joc no és per a tu.

---

## Fitxers d'aquest rol

- Scripts: `source/council-onboarding/jugadora-13/play.js`, `kid.js`, `kid-entesos.js`
- Registres: `jugadora-13/k3-kid-no-llegeix.log`, `jugadora-13/e1-kid-entesos.log`
- Captures principals: `jugadora-13/A1-primera-pantalla-mapa.png` ... `A9-heu-perdut-1m44s.png`, `B1-casa-nova.png`
  (la resta de captures `k*-NN.png`, `e1-*.png` són de les partides automàtiques).

## Resum (200 paraules com a màxim)

3 partides noves, tocs reals, jugadora que no llegeix.
La primera pantalla és un mapa de cercles, sense bestioles ni nom del joc: sembla un joc de taula.
Abans de la primera batalla: 5 consells (122 paraules) i 630-755 paraules a la pantalla.
Primera recompensa: menjar, als 6-10 s. Primera batalla: als 15 s (bot ràpid), 40-60 s amb una noia real.
La batalla queda tapada per dos blocs de consells i les bestioles no es veuen.
Cap bestiola nova en 3 partides. En una, va perdre la primera expedició a l'1:44 amb +0 monedes.
Propostes, de més a menys urgent:
- treure els consells de sobre la batalla;
- pantalla de títol amb bestioles grans, "VS" i botó "Juga";
- primera expedició guiada (un dit i una frase, unes 45 paraules): equip ja triat, bestiola nova segura, no es pot perdre;
- consells d'una frase que es tornen a obrir amb "?".
Inclou textos per a WhatsApp i etiquetes `og:` per a la vista prèvia.
No fer: diapositives, paràgrafs, bloquejar la pantalla, perdre la primera expedició sense premi.
