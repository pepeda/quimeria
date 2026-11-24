# Consell "Primera partida" — brief comú

## El joc
- **Quimèria**: joc web per a mòbil en vertical, tot en català. Publicat a https://pepeda.github.io/quimeria/
- Fet per un pare (David) amb la seva filla **Alba (13 anys)**, que en dissenya les bestioles. Públic: 10-15 anys (l'Alba i les seves amigues) i també adults de la família.
- Què hi ha: un personatge explora 5 mons d'element (Foc, Aigua, Planta, Llamp, Psíquic) per un camí amb decisions, recull bestioles (rols atac / defensa / curador; nivells 1-20; 4 formes; còpies per evolucionar; "Niu"), combat en batalles automàtiques, troba objectes (motxilla, forja, sets) i construeix una casa per a les bestioles.

## El problema que hem de resoldre
La **Sandra** (parella del David, adulta, no jugadora habitual) va obrir l'enllaç i va dir: *"pensava que era un joc de taula o de manualitats... no l'entenc"*. No sap de què va, què ha de fer ni com començar.
Ara el joc **no té** intro, història, pantalla de títol, ni tutorial. Només té:
- consells d'un sol cop (`tip()`, es marquen a `G.tips` i no es poden tornar a llegir),
- un pols "hint" quan `G.completed===0`,
- pàgines de còmic per als bosses (`src/js/17-comic-pages.js`), que es podrien reutilitzar per a una intro.

## On és tot
- Repositori: `C:\Users\dxaus\AppData\Local\Temp\claude\c746909b08787762\3a4a1565-2332-4ee5-9377-031a5fb8775c\scratchpad\joc-repo`
- Joc construït (un sol fitxer): `dist/index.html`. Codi font: `src/` (`src/README.md` l'explica; pantalles a `src/js/screens/`; textos de consells a `src/js/20-weapons-outfits-help.js` i altres).
- Revisió anterior d'un altre consell (sobre UX, art i sistemes): `source/council-v13/role-*.md`. Llegeix-la per no repetir el que ja s'ha dit.
- Navegador: `playwright-core` ja instal·lat a `source/pwtool/node_modules` (fes `require('<ruta absoluta>/source/pwtool/node_modules/playwright-core')`). Chrome: `C:/Program Files/Google/Chrome/Application/chrome.exe`. Viewport 412x915, `deviceScaleFactor:2`. Obre `dist/index.html` amb una URL `file://` en un context NOU (localStorage buit = jugadora nova). Exemple d'script: `source/pwtool/shots.js`.

## Regles
- **No toquis** `src/`, `dist/`, `index.html` ni res de git (ni commit ni push). Escriu només dins de la teva carpeta `source/council-onboarding/<el-teu-rol>/` (scripts i captures) i el teu informe.
- No copiïs noms, personatges ni art d'altres jocs existents.
- Escriu en **català**, llenguatge pla i clar, frases curtes. Sense metàfores. Si una cosa no l'has pogut comprovar, digues-ho.

## Què has d'entregar
Un fitxer `source/council-onboarding/role-<el-teu-rol>.md` amb:
1. **Què passa ara** (el que vas veure, amb referència a les captures).
2. **Problemes**, ordenats del més greu al menys greu.
3. **Propostes concretes**: què s'ha de mostrar, quan, i el **text exacte en català** quan calgui. Indica la mida de la feina (petita / mitjana / gran) i quins fitxers de `src/` caldria tocar.
4. **Què NO s'ha de fer** (coses que farien plegar la jugadora).
Al final, respon amb un resum de 200 paraules com a màxim.
