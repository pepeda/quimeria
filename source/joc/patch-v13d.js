// v13.5: short help texts with a "?" for details (forge, legend sets); weapon slot is "Arma" with different weapons;
// separate outfit slot shown next to the player character, which changes the character's clothes colour;
// house build buttons right under the house drawing.
const fs = require('fs');
const P = __dirname + '/joc-bestioles.html';
let s = fs.readFileSync(P, 'utf8');
function rep(a, b) { const n = s.split(a).length - 1; if (n !== 1) { console.error('FAIL expected once (' + n + '): ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, () => b); }
// weapon slot label
rep("['espasa','Espasa']", "['espasa','Arma']");
rep("SLOT_N={casc:'Casc',espasa:'Espasa',", "SLOT_N={casc:'Casc',espasa:'Arma',");
// hero clothes follow the outfit
rep('rx="8" fill="#4A3FB5"/>', 'rx="8" fill="\'+heroCol()+\'"/>');
// backpack: outfit box beside the character, outfit not in the 8-slot grid, short forge text with "?"
rep("var slots=SLOTS.map(function(x){", "var slots=SLOTS.filter(function(x){return x[0]!=='vestit'}).map(function(x){");
rep("'<div class=\"flat\" style=\"align-items:center\">'+hero(48)+", "'<div class=\"flat\" style=\"align-items:center\">'+heroOutfit()+");
rep("<h2>Forja</h2><p class=\"small\">Amb <b>4 objectes iguals</b> en fas <b>1 de la categoria següent</b>: Normal → Refinada → Màgica → Èpica → Superèpica. Cada categoria dona molt més (Refinada ×1,6 · Màgica ×2,4 · Èpica ×3,4 · Superèpica ×4,8). Costa '+FORGE_COST.join(', ')+' monedes segons la categoria. <b>Cada vegada que forges, l’objecte guanya un poder especial</b> (Xucla vida, Verí, Encanteri, Espines…).</p>'",
    "'+qHead('Forja','4 objectes iguals → 1 de la categoria següent, amb un poder especial nou.','Normal → Refinada → Màgica → Èpica → Superèpica. Cada categoria dona molt més: Refinada ×1,6 · Màgica ×2,4 · Èpica ×3,4 · Superèpica ×4,8. Costa '+FORGE_COST.join(', ')+' monedes segons la categoria. Cada vegada que forges, l’objecte guanya un poder especial (Xucla vida, Verí, Encanteri, Espines…). Els 4 objectes han de ser de la mateixa mena i categoria.')");
// house: build and decorate right under the drawing
rep("'<h1>La teva casa</h1>'+svg+", "'<h1>La teva casa</h1>'+svg+'<h2>Construir i decorar</h2><div class=\"grid3\">'+builds+'</div>'+");
rep("'<h2>Construir i decorar</h2><div class=\"grid3\">'+builds+'</div>'+\n    '<div class=\"flat\"><h3>Partida", "'<div class=\"flat\"><h3>Partida");
rep('/* ================= COMMENTS ================= */', fs.readFileSync(__dirname + '/v13d-js.txt', 'utf8') + '\n/* ================= COMMENTS ================= */');
fs.writeFileSync(P, s);
console.log('patched v13d');
