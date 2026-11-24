// v13.1: collection screen can be sorted by number, category (role) or element.
const fs = require('fs');
const P = __dirname + '/joc-bestioles.html';
let s = fs.readFileSync(P, 'utf8');
function rep(a, b) { const n = s.split(a).length - 1; if (n !== 1) { console.error('FAIL expected once (' + n + '): ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, () => b); }
rep("var tiles=SP_ORDER.map(function(s){var own=ownsSp(s)", "var tileOf=function(s){var own=ownsSp(s)");
rep("'</button>'}).join('');\n  return '<h1>Bestioles</h1>'", "'</button>'};var tiles=spGrid(tileOf);\n  return '<h1>Bestioles</h1>'");
rep("'<div class=\"grid4\">'+tiles+'</div>';\n}\nfunction deltaChips", "sortBar()+tiles;\n}\nfunction deltaChips");
// collection: dots showing how close each critter is to evolving
rep("+roleTag(S.role,true)+(ev?", "+roleTag(S.role,true)+evoDots(best,S)+(ev?");
// comment export: count the real number of species
rep("' de 16 bestioles, '", "' de '+SP_ORDER.length+' bestioles, '");
fs.writeFileSync(P, s);
console.log('patched v13b');
