#!/usr/bin/env node
/*
 * One command before every commit:
 *   1. build dist/index.html from src/
 *   2. golden transcript: the built file and src/index.html (scripts loaded one by one) must play exactly alike,
 *      and the transcript must have the hash recorded in tools/golden-hash.txt (the accepted behaviour).
 *      After an intended change of behaviour, check the tests, then record the new hash:
 *        node tools/golden.js hash dist/index.html > tools/golden-hash.txt
 *   3. every test and simulation, compared with its recorded output (tests/run-all.js)
 *
 *   node tools/verify.js [--quick]
 * --quick skips the slow fuzz tests and battle simulations.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const quick = process.argv.indexOf('--quick') >= 0;

function run(label, file, argv) {
  console.log('== ' + label);
  const r = spawnSync(process.execPath, [path.join(ROOT, file)].concat(argv), { cwd: ROOT, stdio: 'inherit' });
  if (r.status !== 0) { console.log('FAILED: ' + label); process.exit(1); }
}
run('build', 'tools/build.js', []);
run('golden: src/index.html plays like dist/index.html', 'tools/golden.js', ['compare', path.join(ROOT, 'dist', 'index.html'), path.join(ROOT, 'src', 'index.html')]);
console.log('== golden: recorded hash');
const want = fs.readFileSync(path.join(ROOT, 'tools', 'golden-hash.txt'), 'utf8').trim();
const got = spawnSync(process.execPath, [path.join(ROOT, 'tools', 'golden.js'), 'hash', path.join(ROOT, 'dist', 'index.html')], { cwd: ROOT, encoding: 'utf8' }).stdout.trim();
console.log(got);
if (got !== want) { console.log('FAILED: golden transcript changed. Recorded: ' + want); process.exit(1); }
run('tests and simulations', 'tests/run-all.js', quick ? ['--quick'] : []);
console.log('ALL CHECKS PASSED' + (quick ? ' (quick)' : ''));
