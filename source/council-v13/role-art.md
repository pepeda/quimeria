# Consell v13 — Director d'art (públic 10-15 anys, jugadora principal de 13)

Revisió feta **veient l'art renderitzat**: Chrome headless (playwright-core) a 412x915 sobre una còpia de depuració del fitxer local (només s'hi exposen variables a `window.D`; el joc original no s'ha tocat). Captures a `council-v13/shots/`.

## 0. La troballa principal (abans de res)

L'art de les bestioles NO és per espècie. `critter(el, el2, px, locked, evolved, shape)` només depèn de **element × forma (8 formes) × "evolucionat sí/no" × color secundari**. Conseqüències, verificades a les captures 10 i 11:

- **Espècies idèntiques entre elles** (mateix element + mateixa forma):
  - Foc tall: **Fumet = Fumerol**
  - Aigua tiny: **Bufa = Bombolli**
  - Planta round: **Brotet = Molsa**
  - Llamp round: **Trona = Imantat = Nuvolet**
  - Llamp tiny: **Guspira = Cuquet de llum**
  - Psíquic round: **Mentoli = Ullet = Bolavidre**
  - Psíquic tall: **Somni = Fantasmet**
  - → 16 de les 40 espècies comparteixen dibuix amb una altra.
- **Les formes 2 i 3 (nivell 2 i nivell 3) són el mateix dibuix**: `evolved` és un booleà. L'únic canvi en evolucionar és un anell groc puntejat + dos "banyetes" petites del color del cos; la branca amb segon element només afegeix 3 punts de color i la cresta de l'altre element. "Evolucions 1 de 120" promet 120 aparences; n'hi ha unes 26 de diferents.
- **El nom no coincideix amb la forma**: Dragonet sembla un mico (les "ales" són orelles rodones); Medusina, Fantasmet, Boletó, Mussolet, Imantat, Cranquet, Popet són taques amb ulls. Per a una noia de 13 anys això es nota de seguida.
- **Monstres i bosses**: un sol dibuix (campana amb ulls vermells i boca en ziga-zaga) per a tot; el guardià i el boss final només hi afegeixen una corona. "Gegant de Pedra", "Cavaller", "Eixam", "Ombres", "Tricap" (3 caps!) es veuen igual que un monstre normal (captures 12, 13).

Tot l'estil és "kawaii de bebè" (cara rodona, ulls grans, somriure en U, sense contorn). Per a 10-15 anys cal més actitud: siluetes més valentes, formes més punxegudes a mesura que evolucionen, contorn, mirada.

## 1. CASA

**Funciona**
- La idea de casa que creix amb cada compra (habitacions apilades, piscina, spa, tennis, jardí) és bona i llegible.
- Les bestioles apareixen a les habitacions i el "z z" quan descansen és un bon detall.
- Paleta càlida i neta, coherent amb la UI.

**Sembla inacabat**
- Talls sense profunditat: rectangles plans, sense ombres, sense perspectiva; les "Habitacions" són caixes idèntiques amb una finestreta.
- Les etiquetes de text dins el dibuix ("Dormitori", "Bany", "Pista de tennis") fan de plànol escolar, no de joc.
- "Mobles" (5 nivells) són 5 objectes minúsculs (sofà, banyera, làmpada, catifa, planta) que no es veuen a 30 px.
- Les bestioles a casa no fan res (no estan a la piscina ni a la pista: es col·loquen per posicions fixes).
- No hi ha res que reflecteixi el progrés del joc (trofeus de bosses, mons, tresors rars).

**Redisseny proposat**
- **Vista isomètrica 2.5D d'una casa-cau** (casa a l'arbre / taller d'exploradora), fons de cel que canvia amb l'hora real (dia, posta, nit amb estrelles). Més "cool" que una caseta de nines.
- **Una sala per element** que es desbloqueja quan completes el món: Forja de lava (Foc), Aquari (Aigua), Hivernacle (Planta), Sala de bobines (Llamp), Observatori (Psíquic). Cada sala és alhora decoració i "casa" per a les bestioles d'aquell element.
- **Paret de trofeus**: cada boss vençut deixa un trofeu (la màscara del Cavaller, el cor de gel, la pedra del Gegant…). Els tresors rars equipats/obtinguts es mostren en vitrines. Això és el "rècord" visible del progrés.
- **Decoració col·locable**: una graella de 6-8 "ranures" on la nena tria què hi posa (pòster, làmpada de neó, catifa, planta, pufs, consola, banderí del món). Es guanyen com a botí (nova categoria "Deco" al loot) o a la botiga del poble.
- **Bestioles vives a casa**: les d'Aigua a la piscina, les de Llamp a la pista, les que descansen dormen al llit; animació idle (respirar, parpellejar) amb CSS.
- **Tema de colors de la casa** (fusta, neó fosc, pastel, pedra) com a recompensa.

## 2. PERSONATGE DEL JUGADOR

- Ara: `hero()` és un ninot de 50x60 (cap rodó, casquet marró, rectangle lila, dues potes). Sense braços, sense cara més enllà de dos punts, sense gènere ni personalitat. Apareix a 34 px a la "crew" i quasi no es veu. És l'element més fluix de tot el joc i, per a una jugadora de 13 anys, el que més importa ("sóc jo").
- **Proposta de redisseny**: personatge de proporció 1:3 (cap més petit que ara, cos amb braços), contorn fosc de 2 px com les bestioles redissenyades, postura de 3/4 amb motxilla d'exploradora i una bufanda/caputxa que ondeja.
- **Personalització (editor senzill, 6 eixos)**: pentinat (curt, cua alta, trenes, rinxols, rapat, monyo), color de cabell (inclosos colors fantasia desbloquejables), pell (5 tons), roba de dalt (jaqueta, dessuadora amb caputxa, armilla d'explorador), color principal, accessori (ulleres de sol, auriculars, gorra, banda al cap).
- **Equip visible**: els objectes que ja existeixen (Casc, Capa, Botes, Espasa, Escut) haurien de dibuixar-se sobre el personatge (capa estrellada, casc de cristall, botes de núvol). Ara l'equip només són números.
- **Recompenses cosmètiques per món**: pegats a la jaqueta per cada boss vençut, una aura de color de l'element preferit (el que més fas servir).
- **Pare i filla**: dos personatges/perfils diferenciats, o almenys un selector de "qui juga", perquè cadascú tingui el seu aspecte.
- Mateix llenguatge visual que les bestioles: formes geomètriques simples + contorn + 1 color d'accent.

## 3. BESTIOLES (40 espècies × 3 formes)

Llegenda: *Llegible* = es distingeix a 30-44 px; *Element/Rol* = s'entén què és i què fa; *Creix* = la forma 2/3 sembla més forta.
Nota comuna a totes: forma 2 = forma 3 (només anell + banyetes); el rol (Atac/Defensa/Curador) no es veu mai en el dibuix.

**Foc**
- Espurnet (round, Atac): llegible i simpàtic; flama clara. Creix: no. Li falta actitud d'atacant (celles, mirada).
- Fumet (tall, Curador): **idèntic a Fumerol**. No sembla fum ni curador.
- Brasa (spiky, Defensa): de les millors siluetes (corona de punxes). Però les punxes diuen "atac", no "defensa".
- Xurrufet (tiny, Atac): petard petit, ok; Bengala (llamp) és la millor forma 3 del foc (dues crestes). Creix poc.
- Cremallot (snail, Defensa): cargol llegible; el foc no es veu (la forma snail amaga la cresta). Bona idea de "cargol de lava" desaprofitada.
- Fogonet (blocky, Curador): caixa taronja amb flama; llegible però no diu "cuiner". Afegir barret/olla.
- Dragonet (wing, Atac): **sembla un mico** (ales rodones = orelles). Un drac és l'espècie més "cool" per a 13 anys i és la més fallida.
- Fumerol (tall, Atac): **idèntic a Fumet**; no sembla xemeneia ni volcà.

**Aigua**
- Gotim (round, Curador): gota llegible i agradable. Creix: no.
- Bufa (tiny, Defensa): **idèntic a Bombolli**; res de "closca" de Defensa.
- Petxina (snail, Atac): cargol blau; la petxina es llegeix bé però un cargol "d'atac" no convenç.
- Nedet (long, Atac): forma de llúdriga/peix acceptable; la cua es llegeix. Llúdriga elèctrica, ok.
- Medusina (tall, Curador): **no és una medusa** (no té tentacles). Gran oportunitat perduda.
- Cranquet (blocky, Defensa): una capsa blava; **no té pinces**. No és un cranc.
- Bombolli (tiny, Curador): **idèntic a Bufa**.
- Popet (spiky, Atac): punxes en lloc de tentacles; sembla un eriçó blau, no un pop.

**Planta**
- Brotet (round, Atac): brot simpàtic, llegible. **Idèntic a Molsa**.
- Molsa (round, Curador): **idèntic a Brotet**.
- Pinyol (tiny, Atac): llegible (llavor amb brot), però indistingible de Brotet a 30 px.
- Arrel (tall, Defensa): ou verd amb fulles; no diu arbre/soca. Forma 3 (llamp) ok.
- Boletó (tall, Curador): **no té barret de bolet**; és el mateix ou verd que Arrel.
- Cucafera (long, Atac): eruga acceptable; Papallona de llum NO té ales.
- Punxetes (spiky, Defensa): cactus llegible i bona silueta; bé per a Defensa.
- Bavós (snail, Defensa): cargol verd clar, ok.

**Llamp**
- Xispa (spiky, Defensa): bona silueta, però confusa amb Brasa/Punxetes (mateixa forma, altre color).
- Trona (round, Atac): **idèntic a Imantat i Nuvolet**; les "banyes" de llamp semblen orelles de gat.
- Guspira (tiny, Curador): **idèntic a Cuquet de llum**.
- Endollet (blocky, Atac): capsa groga; sense endoll/cable no s'entén.
- Brunzit (wing, Atac): mateix problema que Dragonet (ales = orelles). No és un colibrí.
- Cuquet de llum (tiny, Curador): **idèntic a Guspira**; no brilla (cap halo).
- Imantat (round, Defensa): **idèntic a Trona**; no té forma d'imant (U).
- Nuvolet (round, Atac): **idèntic a Trona**; un núvol hauria de ser l'espècie més fàcil de dibuixar.

**Psíquic**
- Mentoli (round, Curador): **idèntic a Ullet i Bolavidre**; antena amb bola llegible però genèrica.
- Somni (tall, Defensa): **idèntic a Fantasmet**.
- Ullet (round, Atac): **no té un gran ull** (el nom ho demana); idèntic a Mentoli.
- Fantasmet (tall, Atac): **no és un fantasma** (sense cua ondulada, sense transparència).
- Mussolet (wing, Curador): sembla un ratolí lila; sense bec ni ulls d'òliba.
- Bolavidre (round, Defensa): **idèntic a Mentoli**; no és una bola de vidre.
- Barretmàgic (blocky, Atac): capsa lila; **no té barret**.
- Dormilega (long, Defensa): llegible com a "llarg i mandrós", ok; li falten ulls tancats.

**Les 5 pitjors i com arreglar-les (SVG concret)**

1. **Dragonet / Dragó / Drac roig** (és el "drac" i és la icona cool del joc)
   - Forma 1: cos ovalat inclinat (`ellipse` rotat -10°), coll curt, cap amb morro (`path` en trapezi arrodonit), 2 banyes corbes enrere, ales **membranoses** (`path` amb 3 puntes i nervis `stroke` del color fosc), cua amb punta de fletxa.
   - Forma 2: més gran, banyes més llargues, pinta d'escates al pit (3 `path` en V més clars), ulls amb parpella superior plana (mirada decidida).
   - Forma 3: dret sobre 2 potes, ales esteses, flama a la boca; color de cos més fosc (#C9431E) amb ventre daurat. Variant llamp: ales retallades en ziga-zaga i ratlles grogues.
2. **Trona / Imantat / Nuvolet** (tres espècies, un dibuix)
   - Nuvolet: silueta de núvol (4-5 `circle` fusionats) gris-blanc amb vores grogues i una petita llamp penjant; Nimbus amb gotes de pluja, forma 3 amb llamps creuats.
   - Imantat: cos en **U d'imant** (`path` gruixut) amb puntes vermella/blava, ulls a la corba; evoluciona amb boletes metàl·liques orbitant.
   - Trona: quadrúpede petit amb crinera de llamp (3 ziga-zagues) i cua en forma de raig.
3. **Mentoli / Ullet / Bolavidre**
   - Ullet: **un sol ull gran** central (iris de color, `circle` concèntrics), cos petit flotant amb aletes; forma 3 Cristall amb facetes (`polygon`).
   - Bolavidre: esfera transparent (`circle` amb `fill-opacity:.35` + reflex blanc en arc) amb la bestiola petita dins; base de bronze. Defensa = bombolla protectora.
   - Mentoli: cos amb fulla de menta al cap i "ones mentals" (2 arcs concèntrics) en lloc de l'antena genèrica.
4. **Medusina / Fantasmet** (tall genèric que hauria de ser criatures icòniques)
   - Medusina: campana semicircular translúcida (`fill-opacity:.8`) + 4-5 tentacles ondulats (`path` amb `Q`), punts bioluminescents. Medusa reial: corona de punts a la campana.
   - Fantasmet: cos que acaba en **vora ondulada** (path amb 3 ones), sense potes, `opacity .85`, ulls ovals inclinats (picardia, no cuquis). Fantasma reial: capa/collar alt de punxes.
5. **Cranquet / Barretmàgic / Endollet** (blocky = capsa sense identitat)
   - Cranquet: cos ample i baix (`ellipse` aplanada) + **2 pinces grans** (`path` de C obert) + ulls sobre pedicels. Cranc guerrer: closca amb dents i una pinça més gran (asimetria = actitud).
   - Barretmàgic: el **barret de copa és el personatge** (cilindre negre amb cinta lila) i els ulls brillen sota l'ala; Mag: varetes i estrelles.
   - Endollet: cos d'endoll amb 2 potes-pins metàl·liques i cable-cua; Bateria: indicador de càrrega al ventre.

**Correccions estructurals del sistema d'art**
- Passar de `shape` a un **dibuix per espècie** amb 3 variants: `ART[sp] = [f1, f2, f3]` (funcions o strings SVG), mantenint la paleta d'elements. 40 × 3 és molt, però amb peces reutilitzables (ulls, contorn, accessoris de rol) és viable i és la feina d'art que més valor dona.
- **Evolució = creixement real**: forma 1 rodona i petita; forma 2 més gran (viewBox ocupat al 90 %) amb 1 tret nou; forma 3 silueta més angulosa i dreta + tret del segon element integrat (no 3 punts).
- **Rol visible**: Atac = celles en V, ulls amb parpella plana, punta/arma; Defensa = closca/escut/armadura, cos ample i baix; Curador = forma suau, símbol de fulla/creu a la front, halo.
- **Contorn** fosc de 1.5-2 px a totes (com ja tenen els monstres): augmenta molt la llegibilitat a 30 px i dona to "cool".
- **Ulls amb personalitat** per espècie (rodons, ametllats, mig tancats, d'un sol ull), en lloc del mateix parell blanc+pupil·la a tot arreu.

## 4. ESTIL GENERAL

- **Paleta**: els 5 colors d'element són clars i ben diferenciats (taronja, blau, verd, groc, lila); bon contrast amb el fons crema. Però tot és saturació mitjana i pla: cap ombra, cap llum. Groc Llamp sobre crema perd contrast.
- **Coherència**: UI (botons amb ombra inferior negra, tipografia display gruixuda, panells foscos de batalla amb trama) és més madura i "cool" que les bestioles; les bestioles semblen d'un joc per a 5 anys. Monstres (amb contorn) i bestioles (sense) no comparteixen llenguatge. Els escenaris (`sceneArt`) són els millors dibuixos del joc.
- **Mapa**: el món de Llamp queda tallat per la dreta a 412 px (captura 06).
- **Fitxa**: dibuixos de 44-50 px a la col·lecció, prou per a la silueta però massa petits per a detall; la fitxa de 120 px és on més es noten les mancances.

**5 victòries ràpides**
1. Afegir `stroke="#2A1F3D" stroke-width="1.5"` al cos de totes les bestioles (com els monstres) → més llegibles i més "cool".
2. Fer que forma 2 ≠ forma 3: passar `c.stage` (0/1/2) en lloc de `!!c.stage` i escalar el cos (×1.08 i ×1.16) + banyes/crestes més grans al nivell 3.
3. Ulls d'atacant: per a `role==='Atac'` afegir una parpella plana (`path` sobre l'ull) → mirada decidida; Defensa: celles rectes; Curador: ulls feliços (arcs).
4. Trencar les espècies duplicades amb un accessori per espècie (barret de copa, pinces, ull únic, vora de fantasma, U d'imant) dibuixat damunt la forma actual mentre arriba el redisseny complet.
5. Monstres: variar per tipus de boss (cavaller amb elm i espasa, gel amb punxes de glaç, gegant amb blocs de pedra, eixam = 5 monstres petits, ombres amb vora difuminada, tricap amb 3 caps); i arreglar el mapa perquè Llamp no quedi tallat.

**3 idees grans**
1. **Redisseny complet de les 40 espècies × 3 formes** amb un full d'estil comú (contorn, ulls, accessoris de rol, siluetes que s'afilen en evolucionar). És el que més canviarà la percepció de "joc per a nens petits" a "joc meu".
2. **Personatge personalitzable amb equip visible** + perfils pare/filla; l'equip i els trofeus de bosses es veuen sobre el personatge.
3. **Casa-cau isomètrica amb sales per element, paret de trofeus i decoració col·locable**, amb les bestioles animades fent coses a cada sala (piscina, pista, llit), com a pantalla "meva" on mostrar el progrés.

Totes les propostes són originals (no imiten personatges de franquícies existents).

## Captures
- shots/01-inici.png, 02-casa-inicial.png, 03-casa-completa.png, 04-bestioles.png, 05-fitxa-dragonet.png, 06-mapa.png, 07-equip.png, 08-cami.png, 09-batalla.png, 10-galeria-bestioles-1-20.png, 11-galeria-bestioles-21-40.png, 12-monstres-guardians-heroi.png, 13-boss.png, 14-motxilla.png

---
# Abast extra (petició de la família)

## 5. OBJECTES I EQUIPAMENT (captura shots/14-motxilla.png)

Estat actual: la Motxilla són 8 targetes de text amb vora discontínua ("Casc buit", "Espasa de llamp ★★★★"); el personatge de dalt (ninot de 50 px) no canvia gens quan equipes coses. El nivell (Normal → Superèpica) només es veu pel color de la vora i les estrelles.

**Proposta: una icona SVG per objecte, feta per capes (funció `itemArt(id, px)`)**
- **Capa 1, silueta per tipus** (viewBox 0 0 32 32, contorn #2A1F3D de 1.5 px, igual que el nou estil de bestioles):
  - Casc: cúpula + visera. Escut: escut heràldic (path en punta). Collaret: cordó en U + penjoll. Anell: cercle gruixut + gemma. Capa: trapezi amb vora ondulada. Botes: bota de perfil.
  - **Arma** (slot nou), una silueta per tipus: Espasa (fulla recta + guarda en creu), Daga (fulla curta triangular), Arc (arc corbat + corda fina + fletxa), Bastó (pal amb orbe/cristall a dalt), Martell (cap rectangular gran + mànec), Trident (3 puntes + mànec llarg); opcionals Destral, Llança, Ventall de batalla. Cada tipus s'ha de reconèixer a 24 px només per la silueta.
  - **Vestit** (slot nou): icona de jaqueta plegada pintada amb el color del vestit; és l'únic slot que canvia el color del cos del personatge.
- **Capa 2, material per element**: la mateixa silueta canvia de farciment i detall: Foc (vermell-taronja, flameta a la punta), Aigua (blau, ona gravada), Planta (fusta + fulla), Llamp (groc + ziga-zaga), Psíquic (lila + gemma-ull), Cristall (blanc-blau translúcid amb facetes).
- **Capa 3, nivell** (que es vegi sense llegir):
  - Normal: pla.
  - Refinada: reflex blanc diagonal + vora blava.
  - Màgica: 2 espurnes d'estrella de 4 puntes que parpellegen (CSS).
  - Èpica: halo radial taronja (`radialGradient`), forma més ornamentada (guarda doble, 2 gemmes).
  - Superèpica: halo daurat que gira lentament + partícules; marc de targeta amb degradat daurat.
- **Peces de conjunt (SETS: Drac Roig, Fènix…)**: motiu comú a totes les peces (escata de drac, ploma de fènix…) + una cinta petita a la cantonada amb el color del conjunt; a la targeta, comptador "2/5" amb mini-icones grises de les peces que falten.
- **Relíquies (Tresor rar)**: forma única, no derivada de la base, sobre fons fosc estrellat.

**El personatge com a maniquí**
- Personatge gran (140-180 px) a la Motxilla amb els slots al voltant, com un RPG: casc al cap, arma a la mà dreta, escut a l'esquerra, capa darrere, botes, collaret, anells com a punts de llum a les mans.
- Cada slot equipat afegeix la seva capa SVG (ordre: capa → cos/vestit → botes → collaret → casc → escut → arma). Cal un personatge amb braços (secció 2).
- **Vestit**: canvia el color de tors i mànigues; patrons desbloquejables (llis, ratlles, estrelles, flames, camuflatge) amb `<pattern>`.
- Slot buit = silueta grisa puntejada de l'objecte, no la paraula "buit".
- A l'expedició i a la batalla, el personatge petit porta com a mínim l'arma i la capa (es llegeixen a 34 px).

## 6. EXPLORACIÓ (mapa de mons, camí, escenes)

Observat (captures 06, 08, 09): mapa de 5 cercles de color i una caseta, amb el món de Llamp tallat a la dreta a 412 px; el camí és una fila de cercles grisos amb "?"; l'escena és neta però genèrica (la "Torre de guaita" del món Planta és una torre grisa amb un llamp sobre el mateix turó de sempre); l'equip surt en fila a sota.

**Mapa de mons**
- Canviar els cercles per **5 illes flotants dibuixades** (volcà fumejant, arxipèlag amb onades, bosc gegant, altiplà de torres amb núvols elèctrics, illa invertida lila) unides per ponts al voltant de la casa. Cada illa amb 3 banderetes = 3 zones; es planten amb el color de l'element en completar la zona.
- Món desconegut: illa coberta de boira (degradat + `blur`) en lloc d'un "?".
- Silueta del boss sobre cada illa, que es torna trofeu daurat quan el vences.
- Mapa amb `viewBox` i `width:100%` perquè no es talli.

**Camí**
- En lloc de cercles grisos: un **sender serpentejant** amb el terra del món, icones de lloc (tenda, cova, pont, font, castell) que apareixen en revelar-se, boira sobre els llocs futurs, i el personatge que camina fins al lloc següent.
- Al final, la silueta del boss esperant.

**Escenes (`sceneArt`)**
- **3 capes de paral·laxi** per món amb elements propis, no només canvi de color: Foc (basalt, rius de lava, cendra que cau), Aigua (palmeres, escuma, gavines), Planta (falgueres gegants, bolets, cuques de llum), Llamp (pals amb cables, núvols baixos, llamps llunyans), Psíquic (roques flotants, llibres, estrelles de dia).
- **Hora i temps aleatoris** (posta, nit, pluja, boira): canvi de degradat del cel + capa de partícules. Barat i dona molta varietat.
- Equip **dins** l'escena, sobre el terra amb ombra, personatge davant amb l'arma; si hi ha perill, les bestioles es posen en guàrdia.
- **Batalla**: fons = escena del món enfosquida en lloc del panell lila genèric; monstre gran (120-160 px) amb disseny propi; els bosses amb entrada a pantalla completa (les vinyetes de còmic ja són una bona base).

## 7. CASA — "Construir i decorar": 23 propostes noves

Avui (BUILD): Habitació ×3, Jardí, Piscina, Spa, Pista de tennis, Mobles ×5 (sofà, banyera, làmpada, catifa, planta). `houseSvg` dibuixa 4 sales (Dormitori, Bany, Sala, Racó de jocs), habitacions apilades a la dreta i l'exterior a terra.

Proposta: separar **Construir** (ampliacions amb efecte de joc) i **Decorar** (objectes sense efecte o amb efecte petit, col·locats en ranures). Preus en monedes, coherents amb els actuals (80-700).

**Dormitori**
1. **Llit-cabana amb cortines** — 150-250 — les bestioles que hi descansen recuperen +1 punt. SVG: rectangle de llit + tela triangular corbada + garlanda de llumetes (cercles grocs que s'encenen alterns).
2. **Rètol de neó amb el teu nom** — 120 — decoració, color a triar. SVG: `text` amb traç gruixut i resplendor (`feGaussianBlur`).
3. **Pòsters dels bosses vençuts** — gratis, en vèncer cada boss. SVG: rectangle amb vora blanca i silueta del boss.
4. **Hamaca penjada** — 180 — +1 plaça. SVG: dues cordes + tela en U a ratlles.

**Sala / Racó de jocs**
5. **Consola i pantalla gran** — 300 — decoració; les bestioles de Llamp s'hi asseuen. SVG: pantalla fosca amb reflex + comandament.
6. **Pufs de colors** (fins a 3) — 60 cadascun — decoració. SVG: el·lipses arrodonides amb ombra.
7. **Taula de ping-pong** — 250 — una bestiola d'Atac guanya una mica de força entre expedicions. SVG: taulell verd en perspectiva + línia blanca + xarxa.
8. **Estanteria de trofeus** — 200 — mostra les relíquies trobades. SVG: prestatges de fusta amb mini-icones d'objecte.
9. **Peixera** — 150 — les bestioles d'Aigua descansen el doble. SVG: rectangle blau translúcid, 2 peixos i bombolles animades.

**Cuina / Taller (sala nova)**
10. **Cuina de bestioles** — 400 — cuina 1 menjar de l'element triat cada cert temps. SVG: fogons + olla amb vapor ondulat animat.
11. **Taller de forja** — 500 — forjar a casa amb descompte. SVG: enclusa + foc taronja + martell penjat.
12. **Laboratori d'evolució** — 600 — mostra en silueta la propera evolució de cada bestiola. SVG: matràs amb líquid de colors i bombolles + pantalla.

**Sales d'element (s'obren en completar cada món)**
13. **Forja de lava** (Foc) — 450 — les de Foc descansen el doble. SVG: paret de roca fosca amb una esquerda de lava brillant.
14. **Aquari gegant** (Aigua) — 450 — +2 places per a bestioles d'Aigua. SVG: paret de vidre blau, algues que oscil·len.
15. **Hivernacle** (Planta) — 450 — +1 Fulla tendra per expedició. SVG: sostre de vidre a dues aigües, testos.
16. **Sala de bobines** (Llamp) — 450 — les habilitats de Llamp comencen més carregades. SVG: bobines en espiral i un arc elèctric animat.
17. **Observatori** (Psíquic) — 600 — revela un lloc secret del camí a cada expedició. SVG: cúpula oberta amb telescopi i estrelles.

**Exterior**
18. **Rampa de skate** — 300 — decoració; les bestioles hi fan salts. SVG: quart de tub corbat amb vora metàl·lica.
19. **Casa a l'arbre** — 500 — +2 places. SVG: tronc gran, plataforma, caseta i escala de corda.
20. **Foguera amb troncs** — 150 — a la nit (hora real) totes les bestioles de casa recuperen 1 punt extra. SVG: flames animades + 3 troncs per seure.
21. **Hort de baies** — 250 — 1 menjar aleatori al dia. SVG: solcs marrons amb plantetes i baies de colors.
22. **Antena de rastreig** — 350 — indica quin món té una bestiola rara avui. SVG: torre prima amb bandera del color del món del dia.
23. **Portal entre mons** — 900 (objectiu final) — reprendre l'expedició des de la zona on la vas deixar. SVG: arc de pedra amb remolí de 5 colors (degradat cònic animat).

**Sistema de decoració**
- Cada sala té **3-4 ranures fixes** (paret esquerra, paret dreta, terra, sostre) marcades amb "+" en mode Decorar; tocar-ne una obre la llista del que hi cap. Més simple que un editor lliure a mòbil, però dona sensació de "casa meva".
- **Temes de paret i terra** per sala (fusta, rajola, pedra, neó fosc, galàxia) — 40-100 — canvien el farciment i un `<pattern>`.
- **Colors exteriors**: teulada i façana a triar entre 6 colors (avui teulada vermella fixa).
- **Nivell de casa** a la porta, que puja amb el total construït; recompensa cosmètica cada 5 nivells.
- Els rètols de text dins el dibuix desapareixen fora del mode Decorar.
