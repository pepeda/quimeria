#!/usr/bin/env node
/*
 * Builds the single-file game from src/.
 *
 *   node tools/build.js            writes dist/index.html (the page GitHub Pages serves) and dist/game.js (its script alone)
 *
 * src/index.html lists the stylesheets and scripts between build markers, so it also runs as is
 * in a browser (open src/index.html). The build replaces
 *   <!-- build:css --> ... <!-- /build:css -->  with one <style> holding every listed .css file, in order;
 *   <!-- build:js -->  ... <!-- /build:js -->   with one <script> holding every listed .js file, in order,
 *                                               inside one function scope: (function(){'use strict'; ... })();
 * Each .js file starts with a 'use strict'; line for when it runs on its own; the build drops that line.
 * No other change is made to the text.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

function block(html, name) {
  const open = '<!-- build:' + name + ' -->\n', close = '<!-- /build:' + name + ' -->\n';
  const a = html.indexOf(open), b = html.indexOf(close);
  if (a < 0 || b < a) throw new Error('missing build:' + name + ' markers in src/index.html');
  return { a, b: b + close.length, body: html.slice(a + open.length, b) };
}
function listed(body, re) {
  const out = []; let m;
  while ((m = re.exec(body))) out.push(m[1]);
  return out;
}
function read(rel) { return fs.readFileSync(path.join(SRC, rel), 'utf8'); }
const STRICT = "'use strict';\n";

function build() {
  let html = read('index.html');
  const c = block(html, 'css');
  const cssFiles = listed(c.body, /<link rel="stylesheet" href="([^"]+)">/g);
  const css = cssFiles.map(read).join('');
  html = html.slice(0, c.a) + '<style>\n' + css + '</style>\n' + html.slice(c.b);

  const j = block(html, 'js');
  const jsFiles = listed(j.body, /<script src="([^"]+)"><\/script>/g);
  const js = jsFiles.map(f => {
    const t = read(f);
    if (t.indexOf(STRICT) !== 0) throw new Error(f + ' must start with ' + STRICT.trim());
    return t.slice(STRICT.length);
  }).join('');
  html = html.slice(0, j.a) + '<script>\n(function(){\n' + STRICT + js + '})();\n</script>\n' + html.slice(j.b);

  fs.mkdirSync(DIST, { recursive: true });
  fs.writeFileSync(path.join(DIST, 'index.html'), html);
  // the bare script, as the old tests and simulations read it (check.js in the old layout)
  fs.writeFileSync(path.join(DIST, 'game.js'), html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>')));
  return { css: cssFiles.length, js: jsFiles.length, bytes: Buffer.byteLength(html) };
}

if (require.main === module) {
  const r = build();
  console.log('dist/index.html: ' + r.bytes + ' bytes from ' + r.css + ' stylesheets and ' + r.js + ' scripts');
}
module.exports = { build };
