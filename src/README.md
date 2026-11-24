# Quimèria source

The game is plain HTML, CSS and JavaScript: no framework and no runtime packages.
Everything here is joined into one file, `dist/index.html`, which is the page that is published.

## Build and run

```sh
node tools/build.js        # writes dist/index.html
```

- Open `dist/index.html` in a browser to play the built game (one file, works offline).
  `dist/` is not committed. To publish, copy `dist/index.html` to `index.html` at the repository root
  (GitHub Pages serves that file from `main`). Until then the root `index.html` is the published game,
  and `tools/verify.js` uses it as the reference that the build must play exactly like.
- Open `src/index.html` to play straight from the source files: it loads every stylesheet and
  script listed in it, in order, so there is no build step while you change things.

`src/index.html` is the page shell. Its `<!-- build:css -->` and `<!-- build:js -->` blocks list the
files. The build puts every stylesheet into one `<style>` and every script into one `<script>`,
inside a single function scope `(function(){'use strict'; ... })();`, so the built page has no globals.
When the scripts are loaded one by one from `src/index.html` they share globals instead; the order
of the list matters in both cases (data first, the boot call last).

Each `.js` file starts with `'use strict';` (the build drops that line). The scripts are classic
scripts, not modules, so the game also works opened from disk.

## Saved game

The game is saved in `localStorage` under the key `bestioles-joc-v1` (the comments panel under
`bestioles-comentaris-v1`). The save format is the object `G` (see `newGame()` in `js/04-state.js`), version
`SAVE_V` = 3 (levels and forms). A save of another version (or an unreadable one) is copied to
`bestioles-joc-v1.bak-<time>` and a new game starts. Critters of unknown species are dropped only in
`js/99-boot.js`, after every species file has run: never filter by species while loading in `04-state.js`.

## Progression in short

- **Nivell** (level 1–20) and **forma** (form 1–4). Each form has a highest level: 5 / 10 / 15 / 20.
  Experience (XP) comes from expeditions (whole team), food, the tennis court and the lab.
- **Evolving** needs a level and **copies** (other critters of the same species, which are used up):
  forma 2 = level 5 + 1 copy; forma 3 = level 10 + 2 copies of forma 2; forma 4 = level 15 + 2 copies of forma 3.
- **El Niu** (Bestioles screen): critters that do not fit in the house wait there, without limit.
- **Forma 4** has an aura: team mates of its element get more attack and defence.
- **The chest** after a won expedition: each tap may raise it Normal → Refinat → Màgic → Èpic → Superèpic; when it does not, it opens.
- **5 zones per world** with fixed difficulty: enemies do not adapt to your team.

Every number of these rules is in `js/02-balance.js`.

## Files

| File | What it does for the game |
|---|---|
| `css/base.css` | colours, page layout, the phone frame, top bar |
| `css/controls.css` | buttons, choices, tiles, bars, tags, bottom menu, world map |
| `css/run.css` | route strip, scenes and event panels of an expedition |
| `css/battle.css` | battle stage, cut-ins, comic pages, numbers that pop up, animations |
| `css/cards.css` | reveal cards, the critter sheet, toasts, role and change tags |
| `css/chest.css` | the end-of-run chest: shake and glow when it goes up, pop when it opens |
| `css/comments.css` | comments panel beside the game |
| `css/responsive.css` | phone layout and reduced motion |
| `js/00-util.js` | save/load helpers, `esc`, random helpers |
| `js/01-data.js` | elements (worlds), roles, the first 16 critters, items, house builds |
| `js/02-balance.js` | **every number to tune**: XP, level caps, strength per level and form, copies to evolve, aura, chest chances and contents, zone difficulty |
| `js/02-scenes-data.js` | the places of an expedition and their choices |
| `js/03-drawing.js` | monsters, element icons, the player character, scene pictures |
| `js/04-state.js` | the game state `G`: new game, loading a save (with repairs), levels and XP, evolving rules and copies, the Niu, stats, rest clock, toast |
| `js/05-run-helpers.js` | picking scenes, small DOM helpers, recruiting critters, claiming cards |
| `js/06-render.js` | `render()`: draws the top bar, the current screen, the menu (with red dots) and the sheet |
| `js/07-actions.js` | `act()`: what every button does (`data-act`) and the click listener |
| `js/08-zones-abilities-synergies.js` | element advantages, team size, the 5 zones of each world, critter abilities, combos, synergies |
| `js/09-route-and-effects.js` | building a route, moving along it, caves, what a choice does (`applyEffect`) |
| `js/10-more-scenes.js` | more scenes (caves, signature places) |
| `js/11-battle.js` | battles: fixed enemy strength per zone, forma 4 auras, `makeBattle()`, damage, abilities, `battleTick()` (one turn and its steps), turn timer, playing the events, statuses, winning, finishing an expedition |
| `js/13-more-critters-and-talents.js` | 24 more critters and their abilities, explorer talents, talent-only choices |
| `js/14-items-tiers-forge.js` | item tiers (Normal to Superèpica), item text, item groups |
| `js/15-comic-effects.js` | comic sound words, impact flash, showing a battle event and enemy cut-ins |
| `js/16-bosses-and-group-attacks.js` | bosses and their moves, the team meter, combined attacks |
| `js/17-comic-pages.js` | boss intro and ultimate attack comic pages |
| `js/18-powers-sets-combos.js` | item powers, legend sets and their workshop, enemy statuses and growth, secret combos, gear powers in a turn, forging |
| `js/19-chest.js` | the end-of-run chest: tapping, odds, contents, drawing |
| `js/20-weapons-outfits-help.js` | weapon kinds, outfits that colour the character, short help with a "?" |
| `js/21-council-names.js` | the names chosen by the naming council (critters, worlds, bosses, combos, sets) |
| `js/22-sound.js` | short sounds and vibration, scrolling to the top |
| `js/23-critter-art.js` | one drawing per critter and per form (`spArt`, `cArt`); forma 4 = forma 3 + a golden star + an aura |
| `js/24-house.js` | house builds by area, their effects after an expedition, the house drawing |
| `js/screens/*.js` | one file per screen: `casa`, `explorar`, `mon` (a world), `equip` (choose the team), `run` (an expedition), `battle-stage`, `resum` (with the chest), `bestioles` (with the Niu), `motxilla` (4 tabs), `detail` (a critter's sheet: level, XP, food, evolving, Niu buttons) |
| `js/25-comments.js` | the comments panel (write, copy, send by WhatsApp) |
| `js/99-boot.js` | first draw of the game and the comments panel |

### Where things happen

- **A battle turn**: `battleTick()` in `11-battle.js` calls, in order, `gearTurnStart` (18), `teamMeterAttack` (16),
  `turnMoves` (11, the normal moves), `bossMoves` (16), `bossUltimate` (17) and `gearTurnEnd` (18).
  `scheduleTick()` (11) runs one turn about every second and shows its events with `showEvent()` (15).
- **A button**: every `data-act` goes through `act()` in `07-actions.js`, then `render()` (06) draws the screen again.
- **After an expedition**: `finishRun()` (11) gives XP and the chest, then `houseAfterRun()` (24) for the house bonuses; `scResum()` shows all, with `chestBlock()` (19).
- **Evolving**: `evoCheck()` (04) says what is missing; the `evolve` action (07) uses up the copies.

Some files still change data that an earlier file defined, at load time, in this order: for
example `13` adds critters to `SPECIES`, `20` adds weapons and outfits to `ITEMS`, `21` renames,
`24` adds house builds. Keep that order. Loading a saved game (in `04-state.js`) runs before `13` adds
the new critters, which is why unknown species are dropped only in `99-boot.js`.

## Checks

```sh
node tools/verify.js           # build + golden transcript + all tests and simulations (several minutes)
node tools/verify.js --quick   # without the slow fuzz tests and battle simulations
```

- `tools/golden.js` plays a fixed, seeded game in a fake browser (every screen, runs in several
  worlds and zones including zone 4 and a cave, battles, recruiting, feeding, evolving, forging,
  gear, house, the Niu, chests, zone 5, rest clock, sound switch, save/load, old and unreadable saves) and
  records the state, the screen and every DOM change after each step. `tools/verify.js` checks that
  `src/index.html` plays exactly like `dist/index.html` and that the transcript hash is the one in
  `tools/golden-hash.txt`. After an intended change, run the tests, then record the new hash:
  `node tools/golden.js hash dist/index.html > tools/golden-hash.txt`.
- `tests/run-all.js` runs the checks (`test13`, `test13d`, `test14`, `test-progression`), the review harness tests
  (`tests/harness/`) and the battle simulations (`sim14` = win-rate table per world × zone × team strength,
  `sim14z` = zones 4–5 with more battles; `SIM_ZONE='{...}'` tries other zone numbers) against `dist/index.html` with a seeded
  random generator, and compares each output with `tests/expected/`.
  Any single test also runs alone: `node tests/test14.js` (or `node tests/test14.js some-game.html`).
