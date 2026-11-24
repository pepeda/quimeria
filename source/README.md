# Quimèria source

The playable game is `../index.html`, built from the files here. Everything is plain JavaScript run with Node; no build tools.

## How the game file is built

`joc/joc-bestioles-v12.bak` is the game as it was at version 12. `joc/rebuild.sh` copies it to `joc/joc-bestioles.html` and applies, in order:

| Script | What it changes |
|---|---|
| `patch-v13.js` + `v13-js.txt` | item powers, legendary sets, secret combos, new statuses, enemies growing each turn |
| `patch-v13b.js` | collection sorting, evolution dots |
| `patch-v13c.js` | safety fixes: whole-team-down battle, unreadable saves, rest clock |
| `patch-v13d.js` + `v13d-js.txt` | short help with "?", weapon types, outfit slot, build menu under the house |
| `patch-v14.js` + `v14-names-js.txt`, `v14-js.txt`, `v14-art-js.txt`, `v14-house-js.txt` | name Quimèria, council names, balance, zone 4, forge choice, backpack tabs, red dots, sounds, new critter art, new house items |

Each patch replaces exact pieces of text and stops with an error if a piece is not found exactly once.

`joc/publish-gh.sh` copies the built game to `index.html` with a doctype and phone viewport, commits and pushes (it expects this repository checked out at `../joc-repo` next to the `joc` folder).

## Tests and simulations

- `joc/test13.js`, `joc/test13d.js`, `joc/test14.js`: focused checks (run `node test13.js`; the other two take the game file as argument).
- `council-v13/harness/`: a fake browser for Node (`h.js`) and reproduction tests from the code review.
- `joc/sim13.js`, `joc/sim14.js`, `joc/sim14f.js`: battle simulations that print win rates.
- `pwtool/`, `v14h/`: screenshot scripts with playwright-core and a local Chrome (`npm install` in `pwtool`).

## Design and review

- `design/fitxes/`: the design cards (one JSON per critter, place or idea).
- `design/mockups/`: the first screen mockups.
- `council-v13/`: the review council reports (names, balance, usability, code, art), `names.json` with the approved names, and screenshots in `shots/`.

Older version history (v7 to v12 patches) is in `joc/` for reference; rebuilding starts at v12.
