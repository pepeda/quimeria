#!/usr/bin/env node
/*
 * One command before every commit:
 *   1. build dist/index.html from src/
 *   2. golden transcript: the built file and src/index.html (scripts loaded one by one) must play
 *      exactly like the reference game (default: index.html at the repository root, the live game)
 *   3. every test and simulation, compared with its recorded output (tests/run-all.js)
 *
 *   node tools/verify.js [--quick] [reference.html]
 * --quick skips the slow fuzz tests and battle simulations.
 */
'use strict';
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2);
const ref = path.resolve(args.find(a => /\.html$/.test(a)) || path.join(ROOT, 'index.html'));
const quick = args.indexOf('--quick') >= 0;

function run(label, file, argv) {
  console.log('== ' + label);
  const r = spawnSync(process.execPath, [path.join(ROOT, file)].concat(argv), { cwd: ROOT, stdio: 'inherit' });
  if (r.status !== 0) { console.log('FAILED: ' + label); process.exit(1); }
}
run('build', 'tools/build.js', []);
run('golden: dist/index.html', 'tools/golden.js', ['compare', ref, path.join(ROOT, 'dist', 'index.html')]);
run('golden: src/index.html', 'tools/golden.js', ['compare', ref, path.join(ROOT, 'src', 'index.html')]);
run('tests and simulations', 'tests/run-all.js', quick ? ['--quick'] : []);
console.log('ALL CHECKS PASSED' + (quick ? ' (quick)' : ''));
