// v14: Quimèria. Inserts the names block, the v14 rules block, and (when present) the new critter art and house blocks.
const fs = require('fs');
const P = __dirname + '/joc-bestioles.html';
let s = fs.readFileSync(P, 'utf8');
function rep(a, b) { const n = s.split(a).length - 1; if (n !== 1) { console.error('FAIL expected once (' + n + '): ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, () => b); }
rep('<title>Joc de les Bestioles</title>', '<title>Quimèria</title>');
rep("'Comentaris del Joc de les Bestioles (versió 2)'", "'Comentaris de Quimèria'");
rep("return 'A l’aventura del '+ELS[w].mon;", "return 'D’aventura a '+ELS[w].mon;");
// the three-headed cave boss is found by name: accept the old and the new name, then rename the visible text
rep("o.n==='Rei de la cova'?'tricap'", "(o.n==='Rei de la cova'||o.n==='Rei de les Profunditats')?'tricap'");
s = s.split("Rei de la cova'||o.n==='Rei de les").join('@@KEEP@@');
s = s.split('Rei de la cova').join('Rei de les Profunditats');
s = s.split('@@KEEP@@').join("Rei de la cova'||o.n==='Rei de les");
let block = fs.readFileSync(__dirname + '/v14-names-js.txt', 'utf8') + '\n' + fs.readFileSync(__dirname + '/v14-js.txt', 'utf8');
for (const f of ['v14-art-js.txt', 'v14-house-js.txt']) if (process.env['WITH_' + f.split('-')[1].toUpperCase()] !== '0' && fs.existsSync(__dirname + '/' + f)) block += '\n' + fs.readFileSync(__dirname + '/' + f, 'utf8');
rep('/* ================= COMMENTS ================= */', block + '\n/* ================= COMMENTS ================= */');
fs.writeFileSync(P, s);
console.log('patched v14');
