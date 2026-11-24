// Adds the v8 content (40 critters, body shapes, explorer talents) to joc-bestioles.html.
const fs = require('fs');
const P = __dirname + '/joc-bestioles.html';
let s = fs.readFileSync(P, 'utf8');
function must(c, m) { if (!c) { console.error('FAIL: ' + m); process.exit(1); } }
function removeFn(name) {
  const key = '\nfunction ' + name + '(';
  const a = s.indexOf(key); must(a >= 0, 'fn not found ' + name); must(s.indexOf(key, a + 1) < 0, 'fn twice ' + name);
  const b = Math.min(...['\nfunction ', '\nvar ', '\n/* ', '\ndocument.', '\n})();'].map(m => s.indexOf(m, a + 1)).filter(i => i > 0));
  s = s.slice(0, a) + s.slice(b);
}
function rep(a, b) { const n = s.split(a).length - 1; must(n === 1, 'expected once (' + n + '): ' + a.slice(0, 80)); s = s.replace(a, () => b); }
['critter', 'cArt', 'teamHas', 'reqText'].forEach(removeFn);
rep("critter(s.el,'',150)", "spArt(e.sp,'',150)");
rep("critter(s2.el,'',130)", "spArt(e.sp,'',130)");
rep("critter(SPECIES[s].el,'',44,!own)", "spArt(s,'',44,!own)");
rep("critter(sw.el,'',90,!own)", "spArt(e.sp,'',90,!own)");
rep("critter(en.el,'',92):monster", "spArt(en.wild,'',92):monster");
rep("critter(S.el,e.el2,52,!ok,i>=0)", "spArt(s,e.el2,52,!ok,i>=0)");
rep("critter(S.el,e.el2,52,false,true)", "spArt(s,e.el2,52,false,true)");
rep("critter(S.el,'',90,!own)", "spArt(s,'',90,!own)");
rep("critter(S.el,'',50,true)", "spArt(s,'',50,true)");
rep("var r=run();if(!e){advance();return}", "var r=run();if(!e){advance();return}\n  if(e.shop||e.buyFood||e.price){var disc=teamTalent('mercat')?0.5:1;e=Object.assign({},e);if(e.shop)e.shop=Math.ceil(e.shop*disc);if(e.buyFood)e.buyFood=Math.ceil(e.buyFood*disc);if(e.price)e.price=Math.ceil(e.price*disc)}");
rep("if(e.coins){r.event={type:'card',kind:'coins',n:e.coins,why:'Has trobat monedes.'};return}", "if(e.coins){var tr=teamTalent('tresor');r.event={type:'card',kind:'coins',n:Math.round(e.coins*(tr?1.5:1)),why:tr?'L\\u2019Ensumatresors n\\u2019ha trobat m\\u00e9s!':'Has trobat monedes.'};return}");
rep("if(e.food){r.event={type:'card',kind:'food',el:r.world,n:e.food,", "if(e.food){r.event={type:'card',kind:'food',el:r.world,n:e.food+(teamTalent('bosc')&&!r.cave?1:0),");
rep("item:e.buyItem,why:", "item:e.buyItem==='RELIC'?pickOne(RELICS):e.buyItem,why:");
rep("*zap)),m:m,zap:zap>1};", "*zap*caveF(r)*huntF(b,c))),m:m,zap:zap>1};");
rep("var show=i<=r.i||i<=(r.reveal||0)||", "var show=i<=r.i||i<=(r.reveal||0)||(teamTalent('volador')&&i<=r.i+2)||");
rep("if(fo){var d0=danger(sampleEnemy(fo));dg=' <span class=\"tag '+d0.cls+'\">'+esc(d0.t)+'</span>'}", "if(fo){var d0=danger(sampleEnemy(fo));dg=' <span class=\"tag '+d0.cls+'\">'+esc(d0.t)+'</span>'}\n        if(ch.out&&(ch.out.shop||ch.out.buyFood||ch.out.price)&&teamTalent('mercat'))dg+=' <span class=\"tag good\">Regatejador: meitat de preu</span>';");
rep("n:Math.round(15+10*L),why:'Has guanyat la batalla!'", "n:Math.round((15+10*L)*(teamTalent('tresor')?1.5:1)),why:'Has guanyat la batalla!'");
rep("teamSummary()+'<button type=\"button\" class=\"btn green\" data-act=\"go\"'+(G.pick.length?'':' disabled')+'>Surt a explorar</button>';", "teamSummary()+needBlock()+'<button type=\"button\" class=\"btn green\" data-act=\"go\"'+(G.pick.length&&needOk()?'':' disabled')+'>Surt a explorar</button>';");
rep("case 'go':if(G.pick.length){", "case 'go':if(G.pick.length&&needOk()){");
rep("abilities(c).length+' habilitats')+'</span></span>'", "abilities(c).length+' habilitats')+'</span>'+talentTag(sp(c).talent)+'</span>'");
rep("(open?'':'<span class=\"need\">Tancada: acaba primer la zona '+i+'</span>')+'</button>'}).join('');", "(i===2?'<span class=\"need\">Cal portar: '+esc(TALENT[ZONE_NEED[w]].n)+'</span>':i===1?'<span class=\"d\">Recomanat: '+esc(TALENT[ZONE_REC[w]].n)+'</span>':'')+(open?'':'<span class=\"need\">Tancada: acaba primer la zona '+i+'</span>')+'</button>'}).join('');");
rep("'<div class=\"row\" style=\"gap:8px;align-items:flex-start\">'+roleTag(S.role)+'<p class=\"small\" style=\"flex:1;min-width:0\">'+esc(ROLE_DESC[S.role])+'</p></div>'+", "'<div class=\"row\" style=\"gap:8px;align-items:flex-start\">'+roleTag(S.role)+'<p class=\"small\" style=\"flex:1;min-width:0\">'+esc(ROLE_DESC[S.role])+'</p></div>'+'<div class=\"row\" style=\"gap:8px;align-items:flex-start\">'+talentTag(S.talent)+'<p class=\"small\" style=\"flex:1;min-width:0\">'+esc(TALENT[S.talent].d)+'</p></div>'+");
rep("sub=ELS[s.el].n+' · '+s.role;", "sub=ELS[s.el].n+' · '+s.role+' · '+(TALENT[s.talent]?TALENT[s.talent].n:'');");
rep("roleTag(sw.role)+' Vols que vingui amb tu?</p>'", "roleTag(sw.role)+' '+talentTag(sw.talent)+' Vols que vingui amb tu?</p>'");
rep("' de '+r.cave.list.length+'</b></p>'", "' de '+r.cave.list.length+'</b> '+(teamTalent('cova')?'<span class=\"tag good\">L\\u2019Espele\\u00f2leg fa llum: +20% de mal</span>':'<span class=\"tag bad\">Fa fosc: \\u221220% de mal. Porta un Espele\\u00f2leg!</span>')+'</p>'");
rep('/* ================= COMMENTS ================= */', fs.readFileSync(__dirname + '/v8-js.txt', 'utf8') + '\n/* ================= COMMENTS ================= */');
fs.writeFileSync(P, s);
console.log('patched v8, size', s.length);
