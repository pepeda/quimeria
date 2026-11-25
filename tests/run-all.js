#!/usr/bin/env node
/*
 * Runs every test and battle simulation against one game file (default dist/index.html) with a
 * seeded Math.random and a fixed clock, and compares each output with tests/expected/<name>.txt,
 * recorded from the live game. Timings (numbers followed by "ms") are masked.
 *
 *   node tests/run-all.js [game.html]            check
 *   node tests/run-all.js --record [game.html]   write tests/expected/ from that game file
 *   node tests/run-all.js --quick                skip the slow fuzz tests and simulations
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const DIR = __dirname;
const RUNS = [
  ['test13', 'test13.js'], ['test13d', 'test13d.js'], ['test14', 'test14.js'], ['progression', 'test-progression.js'], ['quimera', 'test-quimera.js'],
  ['h-t1', 'harness/t1.js'], ['h-t1b', 'harness/t1b.js'], ['h-t2', 'harness/t2.js'], ['h-t3', 'harness/t3.js'], ['h-t3b', 'harness/t3b.js'],
  ['h-t4', 'harness/t4.js'], ['h-t5', 'harness/t5.js'], ['h-t6', 'harness/t6.js'], ['h-tclock', 'harness/tclock.js'], ['h-tsafe', 'harness/tsafe.js'],
  ['sim14', 'sim14.js'], ['sim14z', 'sim14z.js']
];
const args = process.argv.slice(2);
const record = args.indexOf('--record') >= 0;
const SLOW = ['h-t3', 'h-t3b', 'sim14', 'sim14z'];
const quick = args.indexOf('--quick') >= 0 && !record;
const game = path.resolve(args.find(a => /\.html$/.test(a)) || path.join(DIR, '..', 'dist', 'index.html'));
const EXP = path.join(DIR, 'expected');
if (record) fs.mkdirSync(EXP, { recursive: true });

function mask(s) { return s.replace(/\d+(\.\d+)?(\s*ms)/g, '#$2').replace(/(ms\/render\(node\)=\s*)[\d.]+/g, '$1#'); }
let bad = 0, oks = 0, fails = 0;
for (const [name, file] of RUNS.filter(r => !quick || SLOW.indexOf(r[0]) < 0)) {
  const t0 = Date.now();
  const r = spawnSync(process.execPath, ['-r', path.join(DIR, 'seed.js'), path.join(DIR, file), game], { cwd: DIR, encoding: 'utf8', env: Object.assign({}, process.env, { QUIMERIA_HTML: game }), maxBuffer: 64 << 20 });
  const out = mask((r.stdout || '') + (r.stderr ? '\n[stderr]\n' + r.stderr : '')) + '\n[exit ' + r.status + ']\n';
  const o = (out.match(/^ok\b/gm) || []).length, f = (out.match(/^FAIL\b/gm) || []).length;
  oks += o; fails += f;
  const ef = path.join(EXP, name + '.txt');
  let verdict;
  if (record) { fs.writeFileSync(ef, out); verdict = 'recorded'; }
  else if (!fs.existsSync(ef)) { verdict = 'NO EXPECTED OUTPUT'; bad++; }
  else if (fs.readFileSync(ef, 'utf8') === out) verdict = 'same as expected';
  else { verdict = 'DIFFERENT from expected'; bad++; fs.writeFileSync(path.join(DIR, name + '.actual.txt'), out); }
  console.log(name.padEnd(9), ('exit ' + r.status).padEnd(7), (o + ' ok, ' + f + ' fail').padEnd(16), verdict, '(' + ((Date.now() - t0) / 1000).toFixed(1) + ' s)');
}
console.log('checks: ' + oks + ' ok, ' + fails + ' fail; ' + (record ? 'expected outputs written' : bad ? bad + ' runs differ from expected' : 'all outputs as expected'));
process.exitCode = bad || fails ? 1 : 0;
