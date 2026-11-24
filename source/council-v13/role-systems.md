# Consell v13 — Rol: disseny de sistemes i equilibri

Públic objectiu corregit: **10-15 anys (jugadora principal de 13)**. Això vol dir que podem demanar decisions reals (builds, sinergies, contres), però **cada derrota ha d'ensenyar alguna cosa** i cada progrés (evolucionar, forjar) s'ha de *notar*.

Fitxer revisat: `joc/joc-bestioles.html` (v13). No l'he editat.

---

## 1. Problemes principals d'equilibri / progressió (per gravetat)

**P1 — Rubber-band: millorar l'equip fa més forts els enemics (crític).**
- `teamPow()` (l.1010) = `(1+0.55·stage_mitjà+0.04·mill)·(1+(atk+def+hp%)/400)`, i `enemyStats()` (l.1011) multiplica **tota la vida enemiga per `tp`** i l'atac per `1+(tp-1)·0.3`.
- Evolucionar a ★ dona a la bestiola ×1,35 (`stats()`), però la vida enemiga puja ×1,55. Evolucionar a ★★ dona ×1,75 i l'enemic ×2,10. **Evolucionar fa les batalles MÉS llargues**, i com que els enemics creixen cada torn (P2), més llarg = més perillós. Els objectes també: +100% d'stats d'objectes → +25% vida enemiga.
- Efecte per a la jugadora: "he evolucionat i perdo igual". Mata la motivació de menjar/forjar.
- Fix: `tp` amb exponent ~0,5 i només a la vida (`hp·tp^0.5`, atac sense `tp`), o millor: escalar per **zona/món** i no pel teu equip. Si es vol rubber-band, que compensi només la meitat del guany.

**P2 — Creixement compost dels bosses: rellotge d'enrage ocult (alt).**
- `growRate()`/`growF()` (l.1820): boss ×1,05^torn. Torn 10 = ×1,55; torn 15 = ×1,98; torn 20 = ×2,53. Ho aplica `inDmg()` a TOTS els cops (inclòs l'ultimate i els soldats).
- Combinat amb P1 (més vida = més torns) i amb soldats que absorbeixen el 50% del mal (eixam/ombres, `battleTick1`), els bosses llargs són impossibles: és el motiu del 0% al Psíquic.
- No hi ha cap indicador visible del creixement → la nena no entén per què perd.
- Fix: boss 1,03 a partir del torn 6 (abans 1,00), sostre ×2,0; guardià 1,02 des del torn 6; normals 1,0 (ja ho fa el "cop fort"). Mostrar un xip "🔥 Fúria ×1,4" a `foe-st`.

**P3 — Senyor de les Ombres (Psíquic) sense contra-joc (alt).**
- `battleTick1`: amb soldats, el 50% de TOT el mal (incloent DoT, espines, encanteris) va als soldats i el boss es cura aquesta quantitat; a <20% torna a cridar tots els caiguts. Vida psíquica: L=3+ → `(90+54·L)·1,8·tp`. Sense els MEGA (que fan molt de mal en un sol torn) no s'hi arriba abans que el creixement ho mati.
- Fix: els atacs `multi`, combos de grup i el "Atac de tot l'equip" **maten un soldat sencer per cop** (contra clar i llegible: "porta atacants de cops múltiples"); absorció 50%→35%; la resurrecció final només torna la meitat dels caiguts.

**P4 — Primer boss de Foc 40% amb els inicials (mitjà-alt).**
- 3 inicials sense alimentar contra el Cavaller: Espurnet (Foc vs Foc = ×0,75), Brotet (Planta vs Foc = ×0,67) → 2 de 3 ataquen malament. L'estocada cada 3 torns travessa escut i la fase 2 ataca dues vegades.
- Per a 13 anys, el primer boss hauria de ser 70-80% amb l'equip inicial: és el tutorial del sistema de bosses.
- Fix: `V13_ADJ.boss` ja fa atk×0,85 a z0; afegir hp×0,8 a la zona 0 de Foc, o regalar una bestiola d'Aigua abans del boss (el joc ja ho insinua amb "Feble a").

**P5 — Planta (Gegant de Pedra) 29%: el contra depèn d'un timing que la jugadora no controla (mitjà).**
- `battleTick1` gegant: cal atordir mentre carrega, però `chooseAbility()` gasta l'stun quan està disponible (no el guarda). Batalla automàtica = zero agència.
- **Bug text/codi:** `BOSS.gegant.d` diu "Cada 4 torns", el codi fa `b.turn%5===0`.
- Fix: a `chooseAbility`, si el boss és `gegant` i no carrega, no gastar `stun` (guardar-lo); i/o la IA prioritza `stun` quan `b.charging>0`. Corregir el text a 5.

**P6 — No hi ha decisions tàctiques a la batalla (mitjà, important per 13 anys).**
- Tot és automàtic (`battleTick` cada ~1 s). A 13 anys volen sentir que l'estratègia guanya. Proposta mínima: abans de cada boss/guardià, triar **una postura**: *Atac* (+15% mal, −10% def), *Prudent* (els curadors curen a 75%, escut al torn 1), *Paciència* (guardar stun/escut per als avisos). Un sol botó, gran impacte, molt llegible.

**P7 — Botiga de llegendes: massa cara i a l'atzar (mitjà).**
- `buyLegend()`: 900 monedes per una peça aleatòria d'entre les **10** de l'element (2 sets). Per completar UN set de 5 peces cal de mitjana ~9 compres ≈ **8.100 monedes**. Una batalla dona `15+10·L`, una zona 40-110 de bonus: són desenes de partides. Drop del boss: 5%.
- Fix: triar el set (5 peces), preu 600 (450 amb Regatejador), i "peça garantida cada 3 victòries de boss sense drop" (pity).

**P8 — Forjar no té decisió (mitjà).** `forgeOnce()`: `aff.push(pickOne(AFF_KEYS))` — poder a l'atzar entre 13, inclòs `sort` (monedes) que no ajuda a la batalla. Fix: **tria 1 de 3 poders** en forjar. És l'element de build més barat d'implementar i més valuós per a la franja 10-15.

**P9 — Poders sense sostre (mitjà).** `powerOf()` limita `poison/burn/slow/dist/dizzy/crit` a 60 i `haste` a 75, però **`thorns`, `regen`, `vamp` no tenen sostre**. Una Superèpica té 4 poders; 7 ranures → fins a 28 poders. Rosa 3p (25) + Leviatan 3p (20) + 1 objecte 4×espines (32) = **77% espines**, i les espines creixen amb el creixement del boss (es calculen sobre `inDmg` amb `growF`) → contra-rellotge invertit. Fix: espines ≤50, regen ≤8%/torn, vamp ≤25%.

**P10 — Petits.**
- `P.stun` existeix a `emptyP()` i es processa a `outDmg()` però cap poder ni set el dona → codi mort (o oportunitat: veure idees).
- Fènix 5p (`battleTick`): s'activa amb el **primer KO** individual, no quan cau l'equip → el "Renaixement" sovint es gasta en un sol KO. Fer-lo saltar quan queda 1 bestiola en peu o quan cau l'última.
- `statusActive()` no coneix `slow/dist/dizzy` → la IA no evita re-aplicar-los (menor).
- Mida d'equip >3: +22% vida enemiga per membre (`enemyStats`) vs ~+33% de DPS → 4a bestiola és pràcticament neutra; s'hauria de sentir com a premi.

---

## 2. Poders d'objectes (13) i sets (10)

### Poders (AFFIX, l.1719)
| Poder | Valor | Veredicte | Canvi |
|---|---|---|---|
| vamp | 4% mal → cura la més ferida | Feble, invisible | 6%, i número verd visible |
| escut | +1 escut inicial | Bo, llegible | OK (sostre 6 global ja hi és) |
| conjur | Bola màgica pow 0,7 cada 5 torns, sense element | Feble; s'apila sumant pow (nom igual) | pow 1,0 i amb l'element de la bestiola amb més atac; cada 4 torns |
| veri / brasa | 10% | Bé però redundants | Diferenciar: brasa = més mal curt (3 torns), verí = s'acumula (stacks fins 3) |
| gebre / lluentor / remoli | 10% | **Tres poders que fan el mateix** (l'enemic perd el torn) | Veure §4: donar-los efectes diferents |
| crit | 8%, ×2 | Bo i emocionant | OK; sostre 60 → 40 |
| espines | 8% | Bo, però sense sostre | sostre 50 global |
| rosada | 1%/torn | Massa petit per notar-se | 2%/torn, sostre 8 |
| rapid | 10% prob. −1 càrrega | Invisible | Determinista: −1 càrrega cada 4 torns per cada Rapidesa |
| sort | +15% monedes | Avorrit a la batalla, però útil d'economia | Treure'l del sorteig de forja; fer-lo "objecte de botiga" |

### Sets (SETS, l.1740+)
- **Massa forts:** *Ull Etern* (2p def, 3p dist 25, 4p dizzy 20, 5p Mirada cada 4 torns amb 3 estats) → amb el bloqueig d'estats (§4) un enemic normal perd ~75% dels torns. *Tro* 5p (`meter:1` = barra d'equip ×2 → atac de tot l'equip cada ~3,5 torns) és el millor set ofensiu del joc.
- **Massa febles / avorrits:** *Vent Ràpid* (tot és velocitat invisible; 2p +10/+10). *Somni Profund* 4p "Son profund" pow 0,9 cada 5 torns és un stun de boss que fa poc. 2p de tots els sets = "+15% stat" → avorrit i idèntic.
- **Drac/Leviatan/Bosc:** bé dissenyats (identitat clara).
- Canvis concrets:
  - Ull 5p: Mirada cada **5** torns i només `dist+weaken`.
  - Tro 5p: `meter:0.5` (no 1).
  - Vent 2p: "Comences amb la barra d'equip a la meitat" (sentit immediat); 5p: "la primera habilitat de cada bestiola ja està carregada".
  - Somni 4p: Son profund pow 1,2 i atordeix 2 torns contra no-bosses.
  - 2p de tots: substituir el +15% genèric per un efecte petit de l'element (Foc: cremades +1 torn; Aigua: mullat +1 torn; etc.).
  - Fènix 5p: arreglar el disparador (P10).

### 5 idees noves (decisions reals)
1. **Poder "Pacte" (risc):** +25% mal, però l'equip comença amb el 80% de vida. Decisió atrevit/prudent.
2. **Poder "Caçador de soldats":** els cops destrueixen un soldat/ombra directament amb 30%. Contra directe de Reina/Ombres → la jugadora aprèn a preparar-se per al boss.
3. **Poder "Llamp a terra" (stun real):** 6% d'atordir (usa `P.stun`, ja existent). Contra del Gegant.
4. **Set "Fragments de Prisma" (multi-element, 3 peces):** 2p: el bonus d'elements dels combos passa de +10% a +20% per element; 3p: els combos de 3+ elements diferents apliquen tots els estats dels seus elements. Premia equips variats vs. el set monoelement.
5. **Set "Rellotge de Sorra" (anti-creixement, 4 peces):** 2p: l'enemic creix la meitat; 4p: cada 6 torns el creixement torna a ×1. Contra explícit del sistema de fúria → build "lent i segur" contra bosses.

---

## 3. Els 16 combos secrets (MEGA, l.1832)

**Problemes**
- **Plantilla repetida:** 10 de 16 són "pow 2,2-2,8 + 2 estats". Somni elèctric / Ulls de la nit / Ment de cristall = els tres són dist/dizzy/stun psíquics. Jardí del tro i Festa de llumetes = verí-lent / lent-distret. Poca identitat.
- **Disparament cec:** `megaReady()` dispara el primer MEGA disponible des del torn 3 sense condició. *Cor del món* (cura 100% + revive) i *Llum de lluna* surten al torn 3 amb l'equip ple → malgastats. *Muralla* surt sense avís de cop fort.
- *Llum de lluna* pow 1,2 → el més feble; *Cor del món* requereix 4 curadors (equip que no pot guanyar sense ell).
- *Els quatre vents* requereix els 4 inicials → només amb equip de 4 (2 zones completades): bé com a "descobriment tardà", però hauria de dir-ho la fitxa.
- Mal real = `pow·0,75` per participant + bonus elements; a 4 participants és el cop més fort del joc (bé), però els de 2 són més febles que el combo normal de 3 + TEAM_METER.

**Regla nova de disparament:** MEGA de cura només si 2+ ferides <50% o algú KO; MEGA d'escut només amb `b.warn` actiu; ofensius des del torn 3.

**Efectes millorats (mateixos membres)**
- *Drac de vapor* (espurnet+petxina): treu tots els escuts/soldats de l'enemic (1 soldat) + mullat. Identitat: "trenca defenses".
- *Somni elèctric* (trona+somni): atordit 2 torns (no boss) / 1 torn al boss i cancel·la la càrrega del Gegant.
- *Jardí del tro* (brotet+xispa): verí que salta: cada tic de verí fa també un llamp petit.
- *Llum de lluna* (guspira+mentoli): cura 40% + l'enemic queda "il·luminat": els crítics pugen +20% 3 torns. Pow 1,6.
- *Bosc encantat* (molsa+ullet): l'enemic es confon i els seus 2 propers atacs van a un objectiu a l'atzar a meitat de mal.
- *Festa de llumetes* (cucafera+cuquet): carrega la barra d'equip al 100% (encadena amb "Atac de tot l'equip"). Molt satisfactori.
- *Ulls de la nit* (mussolet+fantasmet): revela i cancel·la el proper avís (cop fort / atac a tothom).
- *Trident* / *Volcà* / *Selva*: bé; Selva: lent+verí, l'stun treure'l (massa control).
- *Ment de cristall* (ullet+somni+mentoli): copia l'última habilitat de cada bestiola de l'equip sense gastar càrrega.
- *Aurora* (xispa+guspira+gotim): cura 40% + 2 escuts; deixar l'stun.
- *Quatre vents*: el seu bonus d'elements ×1,4 (4 elements) ja és enorme; afegir "trenca soldats".
- *Cor del món*: es queda; amb la regla de disparament nova ja serà bo.
- *Muralla* (4 tancs): 4 escuts + reflex; afegir "l'enemic no creix 3 torns" (anti-fúria).
- *Exèrcit de la nit*: OK, és el "gran cop".

**3 combos nous**
- *Foc i gel* — fumet + medusina + gotim (2 aigua + foc): "Sauna": cura 30% i treu congelacions (contra del Mag de Gel).
- *Martell de pedra* — brasa + arrel + imantat: atordeix i, si el Gegant carregava, rep el seu propi cop. (contra del Gegant)
- *Llum que dissol ombres* — guspira + mussolet + barretmagic: elimina totes les ombres/soldats i impedeix que tornin. (contra Psíquic, descobrible)

Contra-boss descobribles = el millor ganxo per a 13 anys: "hi ha una combinació secreta per guanyar aquest boss".

---

## 4. Estats

- **Llegibilitat:** 9 estats + `CRÍTIC!`, i tres (`slow`, `dist`, `dizzy`) fan **la mateixa cosa** a `foeSkip()`: l'enemic perd el torn (40/35/35%, ×0,6 al boss). Es comproven en cadena → amb els tres actius un enemic normal perd ~75% dels torns (=bloqueig). Una nena de 13 no veu la diferència i l'estratègia queda buida.
- **Burn/poison:** una sola instància, s'agafa el màxim (`applyFx`) — bé, però iguals entre si.
- **Proposta (cada estat = un verb diferent):**
  - **Cremat**: mal alt 3 torns. **Enverinat**: s'acumula fins ×3, 4 torns.
  - **Mullat**: −50% def i llamps ×1,6 (ja és bo, és l'exemple a seguir).
  - **Debilitat**: −30% atac (OK).
  - **Atordit**: perd el torn (només stun garanteix skip).
  - **Lent** → *atura la fúria*: aquell torn l'enemic no creix i els avisos triguen 1 torn més. Molt valuós contra bosses, llegible.
  - **Distret** → el proper **cop fort / atac a tothom** falla segur.
  - **Marejat** → 35% de pegar-se ell mateix (deixar com està; és el divertit).
  - Sostre: com a màxim **un** skip aleatori per torn (stun a part).
- Mostrar a `foe-st` cada xip amb el nombre de torns restants i una icona; tooltip curt de 6-8 paraules (ja hi ha `FX_N`).

---

## 5. Corba de dificultat proposada (10-15 anys)

Percentatges = victòria al **primer intent** amb un equip raonable (alimentat segons el que hauria tingut a aquella altura). Entre parèntesis: amb equip "de contra" (element bo + build pensada).

| Zona | Normal | Boss/guardià | Notes |
|---|---|---|---|
| Foc z0 (tutorial) | 90% | **75%** (90%) | ara 40% |
| Foc z1 / Aigua z0 | 85% | 65% (85%) | |
| Foc z2 / Aigua z1 / Planta z0 | 80% | 55% (80%) | Planta ara 29% |
| Llamp z0-z1 | 75% | 50% (75%) | |
| Psíquic z0 | 70% | 45% (75%) | |
| Psíquic z1-z2 | 65% | **30-35%** (65-70%) | ara 0% sense MEGA |

Principi clau: **la bretxa "equip qualsevol" vs "equip de contra" ha de ser ≥25-30 punts**. És el que fa que pensar valgui la pena a 13 anys. Cap boss ha de ser 0% sense un secret.

**Què tocar, per ordre d'impacte:**
1. `enemyStats`/`teamPow`: rubber-band a la meitat (`tp^0.5`, només vida). Sense això cap altre ajust és estable.
2. `growRate`/`growF`: boss 1,03 des del torn 6, sostre ×2; xip visible de fúria.
3. `battleTick1` ombres/eixam: multi i combos maten soldats; absorció 35%.
4. `V13_ADJ` per zona: z0 boss hp×0,8; Psíquic hp×0,9.
5. `chooseAbility`: guardar stun per a la càrrega del Gegant; corregir text "4 torns".
6. `megaReady`: condicions de disparament.
7. `powerOf`: sostres a espines/regen/vamp; limitar a 1 skip aleatori per torn.
8. Mètrica: tornar a simular cada boss amb 3 perfils (inicials sense menjar / equip normal / equip de contra) i comprovar la taula.

---

## Annex — correcció: hi ha 40 espècies, no 16

`SP_ORDER` es redefineix (~l.1404) amb 40 espècies: 8 per element (16 originals + 24 noves, l.1376-1400, cadascuna amb talent).

**Cobertura dels MEGA:** només **23 de 40** espècies surten en algun combo secret. **17 espècies (42%) no en tenen cap**: xurrufet, cremallot, fogonet, fumerol, nedet, medusina, cranquet, bombolli, boletó, punxetes, bavós, endollet, brunzit, imantat, bolavidre, barretmàgic, dormilega. Comprar-les (340-480 monedes) no obre cap secret → per a una jugadora col·leccionista de 13 anys és una recompensa que falta. Objectiu: cada espècie en ≥1 MEGA (els 3 combos nous de §3 ja n'hi posen medusina, imantat i barretmàgic).

**MEGA nous proposats per cobrir les que falten** (cadascun amb una identitat diferent):
- *Traca final* — xurrufet + endollet: 5 cops petits seguits; cada un pot fer crític (+20% crit en aquest combo).
- *Forn de pedra* — cremallot + punxetes + bavós (3 tancs, 2 elements): 3 escuts + espines 30% durant 3 torns.
- *Banquet* — fogonet + boletó: cura 35% a tothom i els torna a carregar la primera habilitat. (combo dels dos "cuiners/bolets")
- *Fumarola* — fumerol + nedet: vapor: mullat + cremat i l'enemic perd la propera càrrega de COP FORT.
- *Bombolla del temps* — bombolli + dormilega: l'enemic "s'adorm" 1 torn i no creix aquell torn (anti-fúria, encaixa amb el nom d'evolució de Bombolli).
- *Pinça elèctrica* — cranquet + brunzit: trenca soldats (2) i lent.
- *Oracle* — bolavidre + mussolet (o qualsevol curador Psíquic): mostra els propers 3 atacs del boss i els seus avisos costen 1 torn més.

**Impacte en la resta de l'informe:**
- Amb 8 espècies per element (≈4 Atac, 2 Defensa, 2 Curador a Foc; repartiment similar a la resta), sempre es pot fer un equip complet monoelement → la sinergia "Germans" (+15%) i els sets monoelement (+40% a 5p) són fàcils d'apilar. Reforça que el 2p dels sets i els bonus de combo multielement (idea "Prisma", §2) premiïn la varietat.
- Els talents (8 tipus, requisits de zona 2 a `ZONE_NEED`) fan que el drafting sigui real: amb 40 espècies, les decisions d'equip són prou riques per a 10-15 anys. El que falta és que els **bosses premiïn clarament un contra** (§1 P3/P5, §3 combos contra-boss) perquè aquesta riquesa es faci servir.
- Les meves conclusions de §1 (rubber-band `teamPow`, creixement compost, ombres) no canvien: no depenen del nombre d'espècies.
