# Consell v13 — Rol: Desenvolupador JavaScript sènior / QA

Fitxer revisat: `joc/joc-bestioles.html` (2039 línies, 230 KB). No he editat el joc.
Mètode: lectura del codi i proves amb node (v25), amb un arnès que extreu el `<script>`, simula el DOM i el `localStorage` i dona accés a l'àmbit intern (`council-v13/harness/h.js`, proves `t1`–`t6`).
Fuzz: 24.000 batalles aleatòries (equips, evolucions, equipament amb poders i sets, caps, onades, salvatges). Resultat: **0 excepcions, 0 NaN, 0 batalles infinites** (la batalla més llarga va durar 88 torns). El creixement de l'enemic (+2–5 % per torn) garanteix que totes les batalles acaben.

Públic: de 10 a 15 anys (el jugador principal en té 13). Gairebé no afecta la revisió de codi.

---

## 1. Errors

### CONFIRMATS (reproduïts amb node)

**B1 — CRÍTIC: una batalla guanyada amb tot l'equip KO deixa la partida bloquejada per sempre.**
- On: `battleTick0`, branca de l'atac de l'enemic (`ehit`). Primer es fa `if(foeCheck(r,b,ev))return ev;` (el mirall mata l'enemic) i només després `if(!alive(r).length){b.over='lose'}`.
- Escenari: l'última bestiola viva té el Mirall (`reflect`) actiu. Rep un cop i cau a 0 de vida, i el mal que torna el mirall mata l'enemic. La batalla queda com a **guanyada amb tot l'equip KO**. Els KO no reviuen entre batalles, així que la següent batalla comença sense cap bestiola viva. Al primer torn, `tg=tank||pickOne([])` és `undefined` i `inDmg` → `stats(undefined)` llança `TypeError: Cannot read properties of undefined (reading 'sp')`.
- L'error passa dins del `setTimeout` de `scheduleTick0`: no es programa cap més torn, i la pantalla de batalla no té botons (ni pausa, ni abandonar, ni menú). Si es recarrega, `render()` torna a cridar `scheduleTick()` i es torna a penjar. **La partida queda bloquejada fins que s'esborra el localStorage.**
- Prova: `t1.js` → `events: hit,ehit,foeDown over=win teamHP={..:0}` i després `NEXT BATTLE CRASH` (3 de 3 execucions). És un cas rar (no ha sortit en el fuzz aleatori), però és determinista i l'impacte és màxim.
- Correcció:
  - (a) A `battleTick0`, comprovar `!alive(r).length` abans del `foeCheck` del mirall. O bé, si l'equip mor i l'enemic també, decidir explícitament (per exemple, guanyar però reviure els KO amb 1 de vida).
  - (b) A `battleWon`, deixar els KO a 1 de vida, com ja fa `blose` amb els salvatges.
  - (c) Protecció general: a `makeBattle`/`scheduleTick0`, si `alive(r).length===0` posar `over='lose'`. A més, embolcallar `battleTick()` amb `try/catch` i, si falla, posar `b.over='lose'` i fer `render()`, perquè una excepció no deixi la partida bloquejada.

**B2 — ALT: una partida corrupta o d'una versió desconeguda s'esborra en silenci quan s'obre el joc.**
- On: `load` + `migrate` + l'IIFE de migració v13 (final de V13).
- Escenaris:
  - JSON corrupte: `load` retorna `null` → `newGame()`. L'IIFE v13 crida `persist()` immediatament, abans de cap render, i **la partida original es perd del tot**. Prova `t2`: coins 9999 → 150.
  - `v:3` (per exemple, si una versió futura canvia `v` i el mòbil carrega una còpia antiga de la pàgina des de la memòria cau de GitHub Pages): `migrate` retorna `newGame()` i la sobreescriu igual.
  - A més, quan el JSON falla, `load` posa `storageOk=false` i surt l'avís «aquest navegador no deixa guardar», que és fals.
- Correcció: si la partida existeix però no es pot llegir o la versió és desconeguda, **no sobreescriure-la**. Copiar-la abans a `bestioles-joc-v1.bak-<data>`, mostrar un avís i oferir la importació (vegeu la secció 2).

**B3 — ALT: si la partida té una forma inesperada, la pàgina queda en blanc.**
- Una partida `v:2` sense `owned` o amb `items:null` fa petar l'script a la càrrega (`G.owned.forEach` / `G.items.map`). Prova `t2`. Tot està dins una IIFE i no hi ha cap gestor d'errors, així que el nen veu una pantalla buida.
- Correcció: una funció `normalize(G)` que posi valors per defecte a cada camp (`owned`, `items`, `equip`, `runs`, `built`, `food`, `done`, `tips`, `seen`, `megas`), filtri les bestioles amb `sp` desconegut i les peces amb `IT(id)===null`, i un `try/catch` global que mostri «Hi ha hagut un problema» amb un botó per exportar la partida.

**B4 — MITJÀ: la previsualització del guardià mostra una resistència falsa.**
- On: `scRun`, branques `guardianPre` i `wild`. Criden `makeBattle(...)` a cada render només per ensenyar dades, i `makeBattle0` tria la resistència a l'atzar (`b.resist=pickOne(others)`).
- Efecte: cada toc canvia el text «Resisteix X» (prova `t6`: 'Planta' i 'Psíquic' a la mateixa pantalla), i la batalla real (`gfight`) en torna a triar una altra. Un jugador de 13 anys que tria l'equip segons aquesta pista rep informació falsa.
- Correcció: triar la resistència un cop, guardar-la a `r.slots[r.i].resist` (o a l'event `guardianPre`) i passar-la a `makeBattle` via `o.resist`.

**B5 — MITJÀ: el botó «Afegeix-la a l'equip» usa un 3 fix, encara que la mida de l'equip pot arribar a 6.**
- On: `bigCard` (`canJoin=r.team.length<3||ko`) i `act0` cas `join` (`if(r.team.length<3)`).
- Efecte: amb `maxTeam()` = 4–6 i un equip de 3 sense cap KO, no surt l'opció d'afegir la bestiola nova (prova `t6`: `maxTeam=6, team=3, join=false`).
- Correcció: fer servir `maxTeam()` als dos llocs.

**B6 — MITJÀ: si el rellotge del mòbil va enrere, el descans queda congelat.**
- On: `applyRestClock`. Si `G.restClock` queda en el futur (el mòbil ha tingut una data equivocada), `steps<0` i no es recupera res fins que el temps real l'atrapa (prova `t6`: 24 h sense descans).
- Correcció: `if(G.restClock>now)G.restClock=now;`.

**B7 — BAIX: rendiment de la Motxilla.** Vegeu la secció 3: 21 ms per render en node amb 120 objectes.

### SOSPITATS (per lectura de codi, no reproduïts)

- **S1 — Doble toc al mòbil.** No hi ha `touch-action: manipulation`, i `render()` substitueix tot el DOM a cada clic. Un doble toc ràpid sobre una opció d'escena pot fer que el segon clic caigui sobre el botó nou que ocupa la mateixa posició. Això tria una opció de l'escena següent (per exemple, una opció «Arriscat»).
  - Correcció: `touch-action:manipulation` als botons i ignorar clics a menys de ~350 ms del render anterior per a les accions que avancen (`choice`, `next`, `claim`, `fork`, `bwin`, ...).
- **S2 — Falta l'etiqueta viewport.** Aquest fitxer no té `<!doctype html>`, `<meta charset>` ni `<meta name="viewport">`, perquè es va escriure com a artifact i el marc s'afegia en publicar. Si GitHub Pages serveix aquest fitxer tal qual, el mòbil el pinta a 980 px reduït i en mode quirks. **Cal comprovar la còpia publicada.**
- **S3 — Dues pestanyes o navegadors.** Si el joc s'obre des de WhatsApp (navegador intern) i des de Chrome, cadascun té el seu propi localStorage: per al nen, «s'ha perdut la partida». Amb dues pestanyes obertes, guanya la que desa l'última. Es pot mitigar escoltant l'event `storage` (avís «el joc està obert en una altra pestanya») i amb l'export/import.
- **S4 — Cap de la cova.** `foeCheck` afegeix onades de reforç sense els ajustos `V13_ADJ`, sense `boss` i sense `guardian`. Les onades segones no tenen la mateixa calibració. És un tema d'equilibri, no un error d'estat.
- **S5 — Batalla guanyada i després «desguanyada».** A `battleTick1`, els soldats del cap poden absorbir el cop final: `over` torna a `null` i el `foeDown` es filtra. Funciona, però els events ja emesos mostren `after:0` i la barra baixa a 0 i després torna a pujar.
- **S6 — Forja.** `forgeOnce` consumeix 3 còpies amb el mateix `fkey` però **amb poders diferents**, i només conserva els poders de l'objecte triat. Els poders de les altres 3 desapareixen. Pot ser una decisió de disseny, però el jugador no ho veu.
- **S7 — «Equipa el millor».** `bestEquipSet` treu del inventari els objectes amb `IT(id)===null`, és a dir, els perd. A més, `itemScore` no té en compte els bonus de set, així que pot trencar un set de 5 peces.
- **S8 — Comic de combo.** `playEvents` espera 3700 ms per a `mega/all/ult`, encara que el jugador salti la pàgina de còmic tocant-la. La batalla queda aturada uns segons sense res a la pantalla. És de UX, no un error d'estat.
- **S9 — Comentaris.** Si `bestioles-comentaris-v1` es corromp (`F.items` no és una llista), `topBar()` peta a cada `render()` i el joc queda inutilitzable. Cal la mateixa normalització que a B3.

### Comprovat sense problemes
- **Temporitzadors:** no hi ha cap `setInterval`. `scheduleTick0` té la protecció `battleTimer||playing`, `introPlaying` evita el doble inici, `comicPage` té la protecció `closed`, i `playEvents` s'atura si `run()` canvia.
- **Fuzz de 24.000 batalles:** sense NaN, sense excepcions i sense batalles infinites.
- **Recàrrega a mitja batalla:** l'estat es desa a cada torn i es reprèn correctament.

---

## 2. Dades de la partida

| Cas | Què passa avui | Risc |
|---|---|---|
| Partida antiga v1 | `migrate` la passa a v2 (camps principals) | Baix |
| Partida v2 anterior a v13 | IIFE v13: afegeix poders a les peces forjades i posa `G.v13=1` | Baix (decisió irreversible però volguda) |
| Batalla d'una versió antiga a mig fer | `b.P`, `megaUsed`, `meter` es creen si falten; `frozen` només existeix als caps (creats a V11) | Baix |
| JSON corrupte / `v` desconeguda | **Se sobreescriu amb una partida nova a l'arrencada** | **Alt (B2)** |
| Camps nuls o mancants | Pantalla en blanc | Alt (B3) |
| localStorage ple | `save` falla en silenci; `storageOk=false` mostra un avís; el que hi ha en memòria es perd en tancar | Mitjà. Ara la partida ocupa ~6 KB, així que és improbable |
| Safari iOS sense «Afegeix a la pantalla d'inici» | Esborra el localStorage després de 7 dies sense visites (ITP) | Mitjà si hi ha vacances |
| Dues apps/navegadors (WhatsApp vs Chrome) | Partides separades | Mitjà (S3) |

**Mesures ràpides:**
- Còpia de seguretat rotativa: abans de cada `persist()` important (fi d'expedició), copiar el valor anterior a `bestioles-joc-v1.prev`.
- Afegir `G.schema=13` i comparar-lo amb una versió mínima i màxima coneguda.
- Cridar `navigator.storage.persist()` una vegada.
- Desar al `pagehide`/`visibilitychange`.

**Disseny d'exportar/importar partida** (dins el mateix HTML, sense servidor):
- **Format:** `BESTIOLES1:` + base64url(JSON `{schema, savedAt, game:G}`) + `:` + una suma de control curta (per exemple, FNV-1a de 32 bits en hex). La suma detecta textos retallats per WhatsApp.
- **Exportar** (a la pantalla Casa, «Guarda una còpia»):
  1. Botó «Copia el codi de la partida»: `navigator.clipboard` amb una àrea de text com a alternativa, com ja fa `fbCopy`.
  2. Botó «Envia per WhatsApp» (`wa.me/?text=`). Amb ~6–8 KB cap. Si en el futur és massa llarg, comprimir amb `CompressionStream('gzip')` quan existeixi.
  3. Botó «Descarrega fitxer» (`Blob` + `a[download]` → `bestioles-AAAA-MM-DD.txt`).
- **Importar:**
  1. Àrea de text per enganxar o `<input type=file>`.
  2. Validar el prefix, la suma de control, que el JSON es pugui llegir, l'esquema ≤ l'actual, i passar-lo per `normalize()`.
  3. Mostrar un resum («12 expedicions, 23 bestioles, 840 monedes, desada el 20/11») i demanar confirmació en dos tocs (el mateix patró que `reset`).
  4. Abans de substituir, desar la partida actual a `.prev`, i oferir «Desfés la importació».
- **Bonus:** un recordatori discret de «Fes una còpia» cada 7 dies (`G.lastExport`). També fa possible passar la partida d'un mòbil a un altre o recuperar-la després d'esborrar dades del navegador.

---

## 3. Rendiment en un mòbil de gamma baixa

Mesures en node (només construir el HTML, sense layout del navegador), amb una partida avançada (40 bestioles, 120 objectes):

| Pantalla | ms/render (node) | Mida del HTML | SVG | Elements |
|---|---|---|---|---|
| Casa | 0,27 | 70 KB | 100 | ~1160 |
| Bestioles | 0,24 | 84 KB | 83 | ~880 |
| **Motxilla** | **18–21** | 50 KB | 6 | ~840 |
| Batalla (render inicial) | – | 8 KB | 9 | – |

- **Motxilla: el coll d'ampolla real.** Per cada grup d'objectes i ranura es fa `deltaChips(eqNew)` → `bonusPct` → `powerOf(eqNew)`, i la memòria cau de `powerOf` només té **una entrada**, així que es buida a cada crida. `fcount()` es crida 3 vegades per grup i és O(n²) sobre `G.items` (`forgeReady` sol triga 2,6 ms, `setsBlock` 2,7 ms). En un Android barat, això són ~100–250 ms per toc, més el layout de 50 KB.
  - Correcció: calcular un mapa `fkey→count` un sol cop per render; fer servir per a `powerOf` una memòria cau per clau (un `Map` limitat a ~64 entrades) o calcular el delta només amb `bonusPct` sense els poders; no calcular `deltaChips` dels grups plegats.
- **Cada toc refà tota la pantalla amb `innerHTML`** (Casa/Bestioles: ~1000 nodes i ~100 SVG en línia). Avui és acceptable (~20–60 ms de layout en un mòbil baix), però creix amb la col·lecció.
  - Pas pragmàtic: un `render()` amb memòria del HTML de la pantalla (si el HTML generat és idèntic a l'anterior, no tocar el DOM) i reutilitzar la icona SVG de cada espècie amb `<symbol>` + `<use href="#sp-brotet">` en lloc de repetir el `critter()` sencer.
- **Batalla:** està ben feta. Els torns actualitzen el DOM de manera incremental (`setBar`, `floatNum`) i no hi ha `render()` per torn. El cost són els efectes de CSS: `drop-shadow` ×4 animat als textos «sfx», `filter` a les sacsejades, i 7 animacions `infinite` (pulse/glow/shake). En un mòbil baix poden fer caure fotogrames.
  - Correcció: substituir el `drop-shadow` múltiple per `-webkit-text-stroke` o per `text-shadow`, animar només `transform` i `opacity`, i respectar sempre `prefers-reduced-motion` (ja es fa amb `RM`).
- **`persist()` a cada `render()` i a cada torn:** `JSON.stringify` de ~6 KB. Avui és barat. Si `G.items` creix sense límit, convindrà desar amb un petit retard (debounce).
- **No hi ha cap `setInterval`.** Els `setTimeout` es netegen sols, i en segon pla el navegador els alenteix. Bé.

---

## 4. Mantenibilitat

**Diagnosi:** la cadena d'embolcalls ja és un risc real.
- `battleTick` → `battleTick2` → `battleTick1` → `battleTick0` (4 capes). Cada capa canvia `b.over` i filtra events de les altres: V11 «desguanya», V13 «desperd» (Fènix). L'error B1 n'és la conseqüència directa: l'ordre de les comprovacions de mort està repartit entre 3 funcions.
- `updateStatus` → `1` → `0` fan servir `f.innerHTML += ...`: cada capa depèn que l'anterior hagi escrit primer.
- `makeBattle` (3 capes) aplica multiplicadors de dificultat en cadena (`enemyStats` → `tricap ×0.7` → `V13_ADJ ×0.85`...), i ningú no veu el número final.
- Hi ha codi mort: `forgeOnceV9`, `forgeAllV9`. A més, `showEvent` (V9) es va editar al seu lloc per cridar `v13Show` (V13): ara barreja els dos estils, embolcallar i editar al lloc.
- Hi ha flags de migració escampats (`evoTree`, `v13`, `superForged`, `megas`...) i `v` sempre val 2.

**Pla de neteja pragmàtic (es manté un sol HTML; cada pas es pot publicar per separat):**
1. **Xarxa de seguretat primer (½ dia).** Posar l'arnès de node (`harness/h.js` + fuzz) dins el repositori com a `test/`, amb 3 tests: (a) el fuzz de 5.000 batalles sense excepcions ni NaN; (b) les partides de mostra v1, v2 i v12 carreguen i passen per `normalize`; (c) un test de regressió per a B1. Cal executar-lo abans de cada publicació a GitHub Pages.
2. **Arreglar B1–B6 + export/import** abans de cap funcionalitat nova.
3. **Una sola capa de dades de partida:** `const SCHEMA=14; function loadGame(){...}` amb una llista de migracions numerades (`[m1to2, m2to13, m13to14]`), `normalize()` i còpia de seguretat. Substitueix els flags escampats. `G.v` passa a ser `G.schema`.
4. **Aplanar la batalla per seccions dins el mateix `<script>`**, sense canviar el comportament (verificat amb el fuzz i amb una llavor fixa de `Math.random`):
   - un sol `makeBattle(o)` amb les fases `baseEnemy → bossSetup → difficultyAdj → itemPowers`;
   - un sol `battleTick()` com una llista de fases: `[preTurn, teamMeter, dots, regen, combos, teamActions, enemyAction, bossActions, ultimate, itemSpells, drainThorns, phoenix, endOfTurn]`, i **una sola funció `resolveOutcome()` al final que decideix guanyar o perdre** (fi de B1 i de S5);
   - un sol `updateStatus()` que construeix la llista de xips un sol cop.
5. **Seccions clares al fitxer:** `DATA / STATE+SAVE / RULES (pures, sense DOM) / BATTLE / RENDER / FX / ACTIONS / BOOT`. Les funcions de regles no toquen el DOM, així es poden provar a node. Per a les funcionalitats noves, en lloc d'embolcallar, s'afegeixen ganxos explícits (`HOOKS.afterTurn.push(fn)`).
6. **Constants d'equilibri en un sol objecte** `BAL={growth:{boss:1.05,...}, adj:{...}, meter:7}`, per poder ajustar la dificultat per edats sense buscar números per tot el codi.
7. **Esborrar el codi mort** (`*V9`) i afegir un comentari de capçalera amb el mapa de seccions.

Si cal més modularitat, es pot tenir `src/*.js` i un script mínim que ho ajunti en un sol `joc-bestioles.html`. Però amb els passos 1–5 n'hi ha prou per a la mida actual.

---

## Prioritat recomanada
1. B1 (bloqueig de la partida) + protecció amb `try/catch` del torn.
2. B2/B3 (no sobreescriure mai una partida que no es pot llegir) + exportar/importar.
3. Comprovar S2 (viewport/doctype a la còpia de GitHub Pages) i S1 (doble toc).
4. B4, B5, B6.
5. Rendiment de la Motxilla.
6. Pla de neteja (passos 1, 3 i 4).
