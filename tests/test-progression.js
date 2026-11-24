// Checks of the progression rules: levels, evolving with copies, the Niu, the chest, the aura, zone 5, saves.
// Runs the built game in the golden tool's fake browser (seeded Math.random, fixed clock).
const path = require('path');
const { makeSession } = require('../tools/golden.js');
const { file } = require('./game-source.js');
const { gameScripts } = require('../tools/golden.js');
const scripts = gameScripts(file);
let fails = 0;
function ok(c, m) { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) { fails++; process.exitCode = 1; } }
function session(o) { return makeSession(scripts, o || {}); }
let S = session(), E = S.ev;
const J = x => JSON.stringify(x);
// top-level variables of a check are kept as globals of the game page (strict-mode eval does not keep var)
const EV = code => E(code.replace(/\bvar (\w+)=/g, 'globalThis.$1='));

// ---- levels
ok(E('xpNeed(1)') === 10 && E('xpNeed(2)') === 11 && E('xpNeed(5)') === 16, 'XP needed: level 1->2 is 10, each level +12% (' + [1, 2, 5].map(l => E('xpNeed(' + l + ')')).join(', ') + ')');
EV("var c=mk('brotet');G.owned.push(c);addXp(c,100000)");
ok(E('c.lvl') === 5 && E('c.xp') === E('xpNeed(5)') && E('canXp(c)') === false, 'forma 1 stops at level 5 with a full bar');
E('c.stage=1;c.evo=0;addXp(c,0)'); ok(E('c.lvl') === 6, 'after evolving the full bar counts: level 6');
E('addXp(c,100000)'); ok(E('c.lvl') === 10, 'forma 2 stops at level 10');
E('c.stage=2;c.evo=1;addXp(c,100000)'); ok(E('c.lvl') === 15, 'forma 3 stops at level 15');
E('c.stage=3;addXp(c,100000)'); ok(E('c.lvl') === 20, 'forma 4 stops at level 20');
ok(J(E('BAL.FORM_CAP')) === '[5,10,15,20]', 'level caps per form 5/10/15/20');
// food gives XP, own element more
EV("var f=mk('gotim');G.owned.push(f);G.food={aigua:2,foc:2}");
S.click('feed', { u: E('f.uid'), el: 'foc' }); ok(E('f.lvl') === 1 + (E('BAL.XP_FOOD') >= 10 ? 1 : 0) && E('G.food.foc') === 1, 'a food ration gives ' + E('BAL.XP_FOOD') + ' XP');
E('f.lvl=1;f.xp=0'); S.click('feed', { u: E('f.uid'), el: 'aigua' }); ok(E('f.lvl') === 3 && E('f.xp') === E('BAL.XP_FOOD_OWN') - 10 - 11, 'food of its own element gives ' + E('BAL.XP_FOOD_OWN') + ' XP');

// ---- evolving with copies
S = session(); E = S.ev;
EV("G.owned=[];G.niu=[];var a=mk('popet');G.owned.push(a)");
const ua = E('a.uid');
ok(J(E('evoCheck(a).missing')) === J(['Ha d’arribar al nivell 5 (ara és al 1)', 'Et falta 1 còpia de forma 1']), 'forma 2 without level and copy: both missing, in words');
E('a.lvl=5'); S.click('evolve', { u: ua, i: 0 }); ok(E('a.stage') === 0, 'missing copy blocks forma 2');
ok(E("evoCheck(a).missing[0]") === 'Et falta 1 còpia de forma 1', 'the message says exactly what is missing');
EV("var k1=mk('popet');k1.lvl=3;G.owned.push(k1);var k2=mk('popet');k2.lvl=1;G.niu.push(k2)");
S.click('evolve', { u: ua, i: 0 });
ok(E('a.stage') === 1 && E("allCr().filter(function(x){return x.sp==='popet'}).length") === 2, 'forma 2: level 5 + 1 copy, the copy is used up');
ok(E("anyByUid(k2.uid)") === null && E("anyByUid(k1.uid)") !== null, 'the lowest-level copy is used (from the Niu)');
E('a.lvl=10'); ok(E("evoCheck(a).missing[0]") === 'Et falten 2 còpies de forma 2 o més', 'forma 3 needs 2 copies of forma 2 (forma-1 copies do not count)');
EV("var m1=mk('popet');m1.stage=1;m1.evo=0;G.owned.push(m1);var m2=mk('popet');m2.stage=1;m2.evo=0;G.niu.push(m2)");
S.click('evolve', { u: ua, i: 0 }); ok(E('a.stage') === 1, 'forma 3 must choose branch 1 or 2');
S.click('evolve', { u: ua, i: 2 }); ok(E('a.stage') === 2 && E('a.evo') === 2 && E('anyByUid(m1.uid)') === null && E('anyByUid(m2.uid)') === null, 'forma 3: level 10 + 2 forma-2 copies, both used up');
EV('a.lvl=15;var t1=mk(a.sp);t1.stage=2;t1.evo=1;G.owned.push(t1)'); ok(E("evoCheck(a).missing[0]") === 'Et falta 1 còpia de forma 3 o més', 'forma 4 needs 2 copies of forma 3');
EV('var t2=mk(a.sp);t2.stage=2;t2.evo=2;G.niu.push(t2);var s3=stats(a)'); S.click('evolve', { u: ua, i: 2 });
ok(E('a.stage') === 3 && /Astral$/.test(E('cName(a)')) && E('anyByUid(t1.uid)') === null, 'forma 4: level 15 + 2 forma-3 copies: ' + E('cName(a)'));
ok(E('stats(a).atk>s3.atk&&stats(a).hp>s3.hp'), 'forma 4 is stronger than forma 3 at the same level');
ok(E("(function(){var x=mk('popet'),y=mk('popet');x.stage=y.stage=2;x.evo=1;y.evo=2;x.lvl=y.lvl=12;return JSON.stringify(stats(x))===JSON.stringify(stats(y))})()"), 'both evolution branches give the same strength');
E('G.runs.foc={team:[a.uid]}'); ok(E('evoCheck(a).ok') === false, 'a critter on an expedition cannot be used'); E('G.runs={}');

// ---- the Niu
S = session(); E = S.ev;
E("while(G.owned.length<cap())G.owned.push(mk('bufa'));G.world='foc';G.zone=0;G.pick=[G.owned[0].uid];startRun()");
const before = E('G.owned.length');
E("recruitCard('dragonet',false)");
ok(E('G.owned.length') === before && E('G.niu.length') === 1 && E('run().event.kind') === 'niu', 'a critter that does not fit goes to the Niu');
E("for(var i=0;i<60;i++)addCritter(mk('popet'))"); ok(E('G.niu.length') === 61, 'the Niu has no limit');
E("Object.keys(G.runs).forEach(abandonRun)");
const nu = E('G.niu[0].uid'), hu = E('G.owned[1].uid');
S.click('niuSwap', { u: nu, h: hu }); ok(E('!!byUid("' + nu + '")') && E('inNiu(anyByUid("' + hu + '"))'), 'a Niu critter swaps with a house critter');

// ---- chest odds (seeded): shares of the five tiers
S = session({ seed: 7 }); E = S.ev;
const NCH = 20000;
const cnt = E(`(function(){var n=[0,0,0,0,0];for(var i=0;i<${NCH};i++){var t=0;while(t<4&&Math.random()<BAL.CHEST_UP[t])t++;n[t]++}return n})()`);
const exp = [20, 32, 28.8, 15.36, 3.84];
const pct = cnt.map(x => x * 100 / NCH);
ok(pct.every((p, i) => Math.abs(p - exp[i]) < 1), 'chest tiers over ' + NCH + ' chests: ' + pct.map(p => p.toFixed(2) + '%').join(' / ') + ' (expected 20 / 32 / 28.8 / 15.36 / 3.84)');
// the tap: tier goes up or opens
E("G.chest={tier:0,world:'aigua',taps:0,open:false}");
let taps = 0; while (!E('G.chest.open') && taps < 10) { S.click('chestTap'); taps++; }
ok(E('G.chest.open') && E('G.chest.got.length') >= 1 && E('G.chest.taps') === taps, 'tapping until the chest opens (' + taps + ' taps, tier ' + E('CHEST_N[G.chest.tier]') + ')');

// ---- chest contents per tier
const C = E(`(function(){var R=[];for(var t=0;t<5;t++){var s={n:0,coinsOk:true,food:0,foodAny:0,cr:0,crAny:0,crWorld:true,items:0,itemsAny:0,maxTier:0,legend:0,tiers:[0,0,0,0,0]};
  for(var i=0;i<4000;i++){var x=chestContents(t,'planta'),T=BAL.CHEST[t];s.n++;if(x.coins<T.coins[0]||x.coins>T.coins[1])s.coinsOk=false;
    var f=Object.keys(x.food).reduce(function(a,k){return a+x.food[k]},0);s.food+=f;if(f)s.foodAny++;s.cr+=x.critters.length;if(x.critters.length)s.crAny++;
    x.critters.forEach(function(c){if(SPECIES[c].el!=='planta')s.crWorld=false});s.items+=x.items.length;if(x.items.length)s.itemsAny++;
    x.items.forEach(function(id){var it=IT(id);if(it.set){s.legend++;return}s.tiers[it.tier]++;if(it.tier>s.maxTier)s.maxTier=it.tier})}
  R.push(s)}return R})()`);
const names = ['Normal', 'Refinat', 'Màgic', 'Èpic', 'Superèpic'], TN = ['Normal', 'Refinada', 'Màgica', 'Èpica', 'Superèpica'];
C.forEach((s, t) => console.log('   ' + names[t].padEnd(10) + 'food avg ' + (s.food / s.n).toFixed(2) + ' (any ' + Math.round(s.foodAny * 100 / s.n) + '%), critters avg ' + (s.cr / s.n).toFixed(2) + ' (any ' + Math.round(s.crAny * 100 / s.n) + '%), items avg ' + (s.items / s.n).toFixed(2) + ' (any ' + Math.round(s.itemsAny * 100 / s.n) + '%), top item tier ' + s.maxTier + (s.legend ? ', legend pieces ' + s.legend : '')));
ok(C.every(s => s.coinsOk), 'coins always inside the range of the tier');
ok(Math.abs(C[0].foodAny / C[0].n - 0.5) < 0.03 && Math.abs(C[0].food / C[0].n - 1) < 0.1, 'Normal: food 50% of the time, about 1 on average');
ok(Math.abs(C[0].cr / C[0].n - 0.6) < 0.06 && Math.abs(C[0].itemsAny / C[0].n - 0.15) < 0.03 && C[0].maxTier === 0, 'Normal: about 0.6 critters, 15% one Normal item');
ok(Math.abs(C[1].food / C[1].n - 3) < 0.15 && Math.abs(C[1].cr / C[1].n - 2) < 0.1 && C[1].maxTier <= 1, 'Refinat: about 3 food, 2 critters, items up to Refinada');
ok(C[2].foodAny === C[2].n && C[2].crAny === C[2].n && C[2].itemsAny === C[2].n && C[2].maxTier <= 2, 'Màgic: always food 4-6, critters 2-4, 1-2 items up to Màgica');
// each item rolls its own tier: shares per chest tier (seeded)
const W = [[[0, 100]], [[0, 60], [1, 40]], [[1, 70], [2, 30]], [[2, 70], [3, 30]], [[3, 60], [4, 30], ['legend', 10]]];
C.forEach((s, t) => {
  const got = W[t].map(([q]) => q === 'legend' ? s.legend : s.tiers[q]), tot = got.reduce((a, b) => a + b, 0);
  const sh = got.map(g => g * 100 / tot);
  ok(sh.every((p, i) => Math.abs(p - W[t][i][1]) < 2.5), names[t] + ' chest item tiers: ' + W[t].map(([q], i) => (q === 'legend' ? 'legend' : TN[q]) + ' ' + sh[i].toFixed(1) + '%').join(', ') + ' (expected ' + W[t].map(w => w[1] + '%').join(' / ') + ')');
});
ok(C.every(s => s.crWorld), 'critters are of the world just played');

// ---- aura of forma 4
S = session(); E = S.ev;
EV("G.owned=[];var f4=mk('espurnet');f4.stage=3;f4.evo=1;f4.lvl=20;var mate=mk('fumet');mate.lvl=10;var oth=mk('gotim');G.owned.push(f4,mate,oth);G.world='planta';G.zone=0;G.pick=[f4.uid,mate.uid,oth.uid];startRun();startBattle({el:'planta',L:2})");
const el2 = E('cEl2(f4)');
ok(J(E('run().event.aura')) === J(el2 ? { foc: 5, [el2]: 5 } : { foc: 8 }), 'forma 4 aura: ' + J(E('run().event.aura')) + (el2 ? ' (two elements: 5% each)' : ''));
EV("var b=run().event;var o1=outDmg(mate,1,b,run()).n;b.aura={};var o0=outDmg(mate,1,b,run()).n");
ok(E('o1>o0'), 'the aura makes a team mate of its element hit harder (' + E('o0') + ' -> ' + E('o1') + ')');
EV("var b2=run().event;b2.aura={foc:8};var d1=inDmg(b2,mate,1);b2.aura={};var d0=inDmg(b2,mate,1)");
ok(E('d1<=d0'), 'and take less damage (' + E('d0') + ' -> ' + E('d1') + ')');
EV("var f5=mk('gotim');f5.stage=3;f5.evo=2;f5.lvl=20");
ok(J(E('teamAura([f5])')) === J(E('cEl2(f5)') ? { aigua: 5, [E('cEl2(f5)')]: 5 } : { aigua: 8 }), 'aura of a dual-element forma 4 is split: ' + J(E('teamAura([f5])')));
ok(E("artDraw('espurnet',3,'',false,64).indexOf('opacity=\".4\"')>=0") && E("artDraw('espurnet',2,'',false,64).indexOf('opacity=\".4\"')<0"), 'forma 4 drawing has an aura, forma 3 not');

// ---- zone 5
S = session(); E = S.ev;
ok(E("ORDER.every(function(w){return ZONES[w].length===5})") && E('ZONE_ROUTES.length') === 5 && E('ZONE_INFO.length') === 5 && E('ZONE_BONUS.length') === 5, 'every world has 5 zones (zone 5: ' + E("ORDER.map(function(w){return ZONES[w][4]}).join(', ')") + ')');
ok(E("zoneOpen('foc',4)") === false, 'zone 5 is closed until zone 4 is done'); E("G.done['foc:z3']=true"); ok(E("zoneOpen('foc',4)") === true, 'zone 5 opens after zone 4');
E("G.world='psiquic';G.zone=4;G.pick=[G.owned[0].uid];startRun()");
const e5 = E('enemyStats(5,true,3)'); E("G.runs={};G.active=null;G.world='psiquic';G.zone=0;G.pick=[G.owned[0].uid];startRun()");
ok(e5.hp > E('enemyStats(5,true,3)').hp, 'zone 5 enemies are much stronger than zone 1 at the same level');
E("G.runs={};G.active=null;G.world='foc';G.zone=1;G.pick=[G.owned[0].uid];startRun()");
const weak = E('enemyStats(2,false,3).hp'); E("G.owned.forEach(function(c){c.stage=3;c.lvl=20});G.equip={espasa:'martellPedra#4'}");
ok(E('enemyStats(2,false,3).hp') === weak, 'difficulty is fixed: a stronger team does not make enemies stronger');

// ---- saves
const old = JSON.stringify({ v: 2, coins: 999, owned: [{ uid: 'q', sp: 'brotet', stage: 1, evo: 0, mill: 3, fat: 0, rest: 0 }] });
S = session({ store: { 'bestioles-joc-v1': old } }); E = S.ev;
const bak = Object.keys(S.store).filter(k => k.indexOf('bestioles-joc-v1.bak-') === 0);
ok(bak.length === 1 && S.store[bak[0]] === old, 'an old-version save is copied to ' + (bak[0] || '?'));
ok(E('G.v') === 3 && E('G.coins') === 150 && E("G.owned.map(function(c){return c.sp}).join()") === 'brotet,gotim,espurnet,xispa', 'and a new game starts');
S = session(); E = S.ev;
E("SP_ORDER.forEach(function(s,i){var c=mk(s);c.stage=i%4;c.evo=c.stage?(c.stage===1?0:1+i%2):-1;c.lvl=1+i%20;c.xp=i;if(i%2)G.niu.push(c);else G.owned.push(c)});persist()");
const saved = Object.assign({}, S.store), all = E('JSON.stringify(allCr())');
S = session({ store: saved }); E = S.ev;
ok(E('JSON.stringify(allCr())') === all && E('allCr().length') === 44, 'reload keeps every critter of all ' + E('SP_ORDER.length') + ' species, at home and in the Niu, with form, level and XP');
console.log(fails ? fails + ' FAILED' : 'ALL OK');
