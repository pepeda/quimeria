#!/usr/bin/env node
/*
 * Golden transcript: plays a fixed, seeded sequence of the game in a fake browser and records,
 * after every step, the whole game state (G), the rendered screen, menu, top bar and overlay,
 * every DOM side effect (classes, texts, appended nodes), sounds, vibrations and the saved game.
 *
 * Two builds that behave the same produce the same transcript, step by step.
 *
 *   node tools/golden.js record  <game.html> <out.jsonl>   write the transcript
 *   node tools/golden.js compare <a.html> <b.html>          play both and report the first difference
 *   node tools/golden.js hash    <game.html>                print one hash of the whole transcript
 *
 * Math.random is a seeded generator, Date/Date.now follow a virtual clock and setTimeout runs on
 * virtual time, so the same file always gives the same transcript (run `hash` twice to check).
 */
'use strict';
process.env.TZ = 'UTC';
const fs = require('fs');
const vm = require('vm');
const crypto = require('crypto');

const T0 = Date.UTC(2026, 10, 24, 10, 0, 0); // 24 Nov 2026 10:00 UTC (day time)

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function extractJs(html) {
  const a = html.indexOf('<script>') + 8, b = html.lastIndexOf('</script>');
  let js = html.slice(a, b);
  const k = js.lastIndexOf('})();');
  if (k < 0) throw new Error('game script does not end with })();');
  return js.slice(0, k) + 'globalThis.__ev=function(s){return eval(s)};\n' + js.slice(k);
}

/* ---------------- fake browser ---------------- */
const STATIC_IDS = ['phone', 'top', 'screen', 'nav', 'overlay', 'toastSlot', 'chat', 'chatClose', 'who', 'types', 'fbList',
  'fbForm', 'fbText', 'fbCtx', 'fbCopy', 'fbWa', 'fbOut', 'fbMsg', 'fbClear'];

function makeSession(html, opts) {
  opts = opts || {};
  const log = [];            // DOM side effects since the last snapshot
  const sounds = [];
  const clock = { now: opts.now || T0 };
  const store = Object.assign({}, opts.store || {});
  const timers = [];
  let timerSeq = 0;
  const listeners = { document: {} };
  let dynamic = {};          // elements created from ids found in rendered HTML
  const statics = {};

  function L(op, who, a, b) { log.push([op, who, a === undefined ? null : a, b === undefined ? null : b]); }

  class ClassList {
    constructor(el) { this.el = el; this.set = new Set(); }
    add(...c) { c.forEach(x => this.set.add(x)); L('cls+', this.el._name, c.join(' ')); }
    remove(...c) { c.forEach(x => this.set.delete(x)); L('cls-', this.el._name, c.join(' ')); }
    toggle(c, force) { const on = force === undefined ? !this.set.has(c) : !!force; if (on) this.set.add(c); else this.set.delete(c); L('cls~', this.el._name, c, on); return on; }
    contains(c) { return this.set.has(c); }
  }
  function makeStyle(el) {
    const s = {};
    return new Proxy(s, {
      get(t, k) { if (k === 'setProperty') return (p, v) => { t[p] = v; L('style', el._name, p, String(v)); }; return t[k] === undefined ? '' : t[k]; },
      set(t, k, v) { t[k] = v; L('style', el._name, String(k), String(v)); return true; }
    });
  }
  class El {
    constructor(tag, name) {
      this.tagName = tag; this._name = name; this._html = ''; this._text = ''; this.value = ''; this.hidden = false;
      this.dataset = {}; this.classList = new ClassList(this); this.style = makeStyle(this); this.children = [];
      this.listeners = {}; this.attrs = {}; this.scrollTop = 0; this.scrollHeight = 0; this.offsetWidth = 1; this.parent = null;
      this._className = '';
      this._q = {};
    }
    get className() { return this._className; }
    set className(v) { this._className = String(v); L('class=', this._name, this._className); }
    get innerHTML() { return this._html; }
    set innerHTML(v) { this._html = String(v); this._q = {}; if (statics[this._name] === this) dynamic = {}; else L('html', this._name, this._html); }
    get textContent() { return this._text; }
    set textContent(v) { this._text = String(v); L('text', this._name, this._text); }
    get parentNode() { return this.parent || { classList: new ClassList({ _name: this._name + '^' }) }; }
    appendChild(c) { this.children.push(c); c.parent = this; L('append', this._name, c._className, c._html || c._text); return c; }
    remove() { if (this.parent) { const i = this.parent.children.indexOf(this); if (i >= 0) this.parent.children.splice(i, 1); } L('remove', this._name, this._className); }
    setAttribute(k, v) { this.attrs[k] = String(v); L('attr', this._name, k, String(v)); }
    addEventListener(type, f) { (this.listeners[type] = this.listeners[type] || []).push(f); }
    querySelector(sel) {
      let m = /^\[data-to="([^"]+)"\]$/.exec(sel);
      if (m) { if (this._html.indexOf('data-to="' + m[1] + '"') < 0) return null; return this._q[sel] || (this._q[sel] = new El('button', this._name + sel)); }
      if (sel.charAt(0) === '.') { const c = sel.slice(1); return this.children.find(x => x._className.split(' ').indexOf(c) >= 0) || null; }
      return null;
    }
    replaceChildren() { this.children = []; L('clear', this._name); }
    contains() { return true; }
    focus() { L('focus', this._name); }
    select() {}
    scrollTo(x, y) { L('scrollTo', this._name, x, y); }
    closest() { return null; }
  }
  STATIC_IDS.forEach(id => { statics[id] = new El('div', id); });
  const head = new El('head', 'head');
  const docEl = new El('html', 'html');

  function findDynamic(id) {
    if (dynamic[id]) return dynamic[id];
    const needle = 'id="' + id + '"';
    const inStatic = STATIC_IDS.some(s => statics[s]._html.indexOf(needle) >= 0);
    if (!inStatic) return null;
    return (dynamic[id] = new El('div', id));
  }
  const document = {
    getElementById: id => statics[id] || findDynamic(id),
    createElement: tag => new El(tag, 'new:' + tag),
    querySelector: () => null,
    addEventListener: (type, f) => { (listeners.document[type] = listeners.document[type] || []).push(f); },
    head, documentElement: docEl,
    set title(v) { L('title', 'document', String(v)); }, get title() { return ''; }
  };
  class FakeAC {
    constructor() { this.currentTime = 0; this.destination = {}; }
    createOscillator() { const o = { type: '', frequency: { value: 0 }, connect() {}, start(t) { sounds.push(['osc', o.type, o.frequency.value, +t.toFixed(3)]); }, stop() {} }; return o; }
    createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} }; }
  }
  const window = {
    matchMedia: () => ({ matches: false }),
    scrollTo: (x, y) => L('scrollTo', 'window', x, y),
    AudioContext: FakeAC
  };
  const navigator = { vibrate: p => { sounds.push(['vibrate', JSON.stringify(p)]); return true; } };
  const localStorage = {
    getItem: k => (k in store ? store[k] : null),
    setItem: (k, v) => { if (opts.full) throw new Error('QuotaExceededError'); store[k] = String(v); },
    removeItem: k => { delete store[k]; }
  };
  function setTimeout(f, ms) { const id = ++timerSeq; timers.push({ id, due: clock.now + (+ms || 0), f }); return id; }
  function clearTimeout(id) { const i = timers.findIndex(t => t.id === id); if (i >= 0) timers.splice(i, 1); }

  const ctx = vm.createContext({ window, document, navigator, localStorage, setTimeout, clearTimeout, console });
  ctx.__rand = mulberry32(opts.seed || 12345);
  ctx.__clock = clock;
  vm.runInContext(`(function(){var R=Date;function D(){if(!(this instanceof D))return new R(__clock.now).toString();
    return arguments.length?new (Function.prototype.bind.apply(R,[null].concat([].slice.call(arguments))))():new R(__clock.now)}
    D.now=function(){return __clock.now};D.UTC=R.UTC;D.parse=R.parse;D.prototype=R.prototype;globalThis.Date=D;Math.random=function(){return __rand()};})();`, ctx);

  const errors = [];
  try { vm.runInContext(extractJs(html), ctx, { filename: 'game.js' }); } catch (e) { errors.push('load: ' + e.message); }
  const ev = ctx.__ev || (() => { throw new Error('game did not load'); });

  function flush(limit) {
    let n = 0;
    while (timers.length && n < (limit || 20000)) {
      timers.sort((a, b) => a.due - b.due || a.id - b.id);
      const t = timers.shift();
      if (t.due > clock.now) clock.now = t.due;
      try { t.f(); } catch (e) { errors.push('timer: ' + e.message); }
      n++;
    }
    return n;
  }
  function click(act, data) {
    const ds = Object.assign({ act }, data || {});
    Object.keys(ds).forEach(k => { ds[k] = String(ds[k]); });
    const t = { dataset: ds, disabled: false, closest: () => t };
    const e = { target: t };
    (listeners.document.click || []).forEach(f => { try { f(e); } catch (x) { errors.push(act + ': ' + x.message); } });
  }
  function snap(label) {
    let G = null;
    try { G = ev('JSON.stringify(G)'); } catch (e) { G = 'ERR ' + e.message; }
    const s = {
      step: label,
      G,
      top: statics.top._html, screen: statics.screen._html, nav: statics.nav._html, navHidden: statics.nav.hidden,
      overlay: statics.overlay._html, toast: statics.toastSlot._html, fbCtx: statics.fbCtx._text,
      dom: log.splice(0), sounds: sounds.splice(0), errors: errors.splice(0),
      store: Object.keys(store).sort().map(k => k + '=' + store[k])
    };
    return s;
  }
  return { ev, click, flush, snap, store, clock, statics, timers };
}

/* ---------------- the scripted play ---------------- */
function play(html, emit) {
  const pick = mulberry32(777); // decisions of the player (independent from the game's own randomness)
  let S = makeSession(html, { seed: 1001 });
  let n = 0;
  function rec(label) { emit(S.snap((++n) + ' ' + label)); }
  function step(act, data, label) { S.click(act, data); S.flush(); rec(label || (act + (data ? ' ' + JSON.stringify(data) : ''))); }
  function exec(code, label) { let err = ''; try { S.ev(code); } catch (e) { err = ' ERROR ' + e.message; } S.flush(); rec('eval ' + (label || code.slice(0, 60)) + err); }
  const E = c => S.ev(c);

  /* play the active run to its end with simple rules; returns when back out of the run */
  function autoRun(tag, maxSteps) {
    for (let k = 0; k < (maxSteps || 120); k++) {
      if (E("G.screen") !== 'run' || !E("!!run()")) return;
      const t = E("run().event?run().event.type:''");
      if (t === 'scene') {
        const ok = E("(function(){var r=run(),S=SCENES[r.scene],N=S.nodes[r.node];return N.ch.map(function(c,i){return !c.req||teamHas(c.req)?i:-1}).filter(function(i){return i>=0})})()");
        step('choice', { i: ok[Math.floor(pick() * ok.length)] }, tag + ' choice');
      } else if (t === 'fork') {
        const o = E("run().slots[run().i].opts"); step('fork', { s: o[Math.floor(pick() * o.length)] }, tag + ' fork');
      } else if (t === 'guardianPre') step('gfight', null, tag + ' guardian');
      else if (t === 'miniPre') step(pick() < 0.8 ? 'mfight' : 'mleave', null, tag + ' camp');
      else if (t === 'battle') {
        const over = E("run().event.over");
        if (!over) { S.ev('render()'); S.flush(); rec(tag + ' battle played'); if (!E("run()&&run().event&&run().event.over")) { exec('battleTick();render()', 'force tick'); } continue; }
        if (over === 'win') step('bwin', null, tag + ' won');
        else if (E("!!run().event.enemy.wild")) step('blose', null, tag + ' lost wild');
        else if (pick() < 0.5 && !E("run().restarted")) { exec('run().restarted=1', 'mark'); step('restartNow', null, tag + ' restart zone'); }
        else step('blose', null, tag + ' lost');
      } else if (t === 'card') {
        const canJoin = E("(function(){var r=run(),e=r.event;return e.kind==='critter'&&(r.team.length<3||r.team.some(function(u){return r.hp[u]<=0}))})()");
        step(canJoin && pick() < 0.7 ? 'join' : 'claim', null, tag + ' card');
      } else if (t === 'wild') {
        const food = E("(G.food[SPECIES[run().event.sp].el]||0)>0");
        const x = pick();
        step(food && x < 0.5 ? 'wfeed' : x < 0.85 ? 'wfight' : 'skip', null, tag + ' wild');
      } else step('next', null, tag + ' next');
    }
  }
  /* choose a team for zone z of world w through the screens, as a player would */
  function startZone(w, z, tag) {
    step('nav', { to: 'explorar' }); step('world', { w }); step('path', { p: z });
    const uids = E(`(function(){var need=${z === 2} ?ZONE_NEED[G.world]:null,av=G.owned.filter(function(c){return !busyWorld(c)&&c.rest===0});
      av.sort(function(a,b){return (b.stage*10+b.mill)-(a.stage*10+a.mill)});
      if(need){var i=av.findIndex(function(c){return sp(c).talent===need});if(i>0)av.unshift(av.splice(i,1)[0])}
      return av.slice(0,maxTeam()).map(function(c){return c.uid})})()`);
    uids.forEach(u => step('pick', { u }, tag + ' pick'));
    step('go', null, tag + ' go');
    autoRun(tag);
  }

  rec('init');
  // first look at every screen
  step('tip', { k: 'explorar' });
  ['casa', 'bestioles', 'motxilla', 'explorar'].forEach(to => step('nav', { to }));
  ['eq', 'obj', 'sets', 'menjar'].forEach(k => { step('nav', { to: 'motxilla' }); step('mtab', { k }); });
  ['num', 'role', 'el', 'num'].forEach(k => step('sortB', { k }));
  ['brotet', 'espurnet', 'ullet', 'dragonet'].forEach(s => { step('detail', { s }); step('close'); });
  step('detail', { s: 'gotim' }); step('closeBg'); step('close');
  step('chat');
  step('world', { w: 'psiquic' });
  // first expeditions
  startZone('planta', 0, 'planta z1');
  step('nav', { to: 'casa' }); step('nap');
  startZone('aigua', 0, 'aigua z1');
  exec("G.owned.forEach(function(c){c.rest=0;c.fat=0})", 'rest all');
  startZone('foc', 0, 'foc z1');
  // pause, resume, restart, abandon
  step('nav', { to: 'explorar' }); step('world', { w: 'llamp' }); step('path', { p: 0 });
  E("G.owned.filter(function(c){return !busyWorld(c)&&c.rest===0}).slice(0,3).map(function(c){return c.uid})").forEach(u => step('pick', { u }));
  step('go'); step('pause'); step('resume', { w: 'llamp' }); step('restart'); step('restart'); step('pause');
  step('nav', { to: 'explorar' }); step('abandon', { w: 'llamp' }); step('abandon', { w: 'llamp' });
  // a richer game: coins, food, items, many critters
  exec("G.coins=20000;G.food={foc:6,aigua:6,planta:6,llamp:6,psiquic:6};G.psiquic=true;['petxina','arrel','trona','mentoli','somni','fantasmet','cranquet','boleto'].forEach(function(s){if(SPECIES[s])G.owned.push(mk(s))});G.owned.forEach(function(c){c.rest=0;c.fat=0})", 'rich');
  ['habitacio', 'habitacio', 'jardi', 'piscina', 'spa', 'tennis', 'mobles', 'mobles', 'llit', 'neo', 'posters', 'hamaca', 'consola', 'pufs', 'pingpong', 'trofeus', 'peixera',
    'cuina', 'forja', 'lab', 'salaFoc', 'skate', 'arbre', 'foguera', 'hort', 'antena', 'portal'].forEach(k => step('build', { k }));
  ['dorm', 'sala', 'ext', 'dorm'].forEach(k => step('hfold', { k }));
  step('nav', { to: 'casa' });
  // adopt, feed, evolve along both branches
  step('detail', { s: 'xispa' }); step('adopt', { s: 'nedet' }); step('detail', { s: 'nedet' });
  const u0 = E("G.owned[0].uid"), u1 = E("G.owned[1].uid");
  step('detail', { s: E("G.owned[0].sp") });
  for (let i = 0; i < 4; i++) step('feed', { u: u0, el: E("SPECIES[G.owned[0].sp].el") });
  step('evolve', { u: u0, i: 0 });
  exec(`byUid('${u0}').mill=5`); step('evolve', { u: u0, i: 2 });
  exec(`byUid('${u1}').mill=5`); step('detail', { s: E("G.owned[1].sp") }); step('evolve', { u: u1, i: 0 });
  exec(`byUid('${u1}').mill=5`); step('evolve', { u: u1, i: 1 }); step('close');
  // forge with a choice of powers, cancel, forge all
  exec("G.items=G.items.concat(['espasaFusta','espasaFusta','espasaFusta','espasaFusta','cascPetxina','cascPetxina','cascPetxina','cascPetxina','anellFoc','anellFoc','anellFoc','anellFoc','anellFoc','anellFoc','anellFoc','anellFoc'])", 'items');
  step('nav', { to: 'motxilla' }); step('mtab', { k: 'obj' });
  step('forge', { id: 'espasaFusta' }); step('forgeCancel');
  step('forge', { id: 'espasaFusta' });
  step('forgePick', { k: E("G.forgeChoice.opts[1]") });
  step('forge', { id: 'cascPetxina' }); step('forgePick', { k: 'nope' });
  step('forgeAll');
  ['eq', 'obj', 'sets', 'menjar'].forEach(k => step('mtab', { k }));
  // weapons, outfit, best gear
  exec("G.items.push('martellPedra','tunicaMag','vestitNinja','arcCaca')", 'gear');
  step('equip', { id: 'martellPedra', slot: 'espasa' }); step('equip', { id: 'tunicaMag', slot: 'vestit' }); step('equip', { id: 'vestitNinja', slot: 'vestit' });
  step('unequip', { slot: 'vestit' }); step('bestEquip'); step('mtab', { k: 'eq' });
  // legend shop
  exec("G.superForged=1", 'super'); step('mtab', { k: 'sets' }); step('legend', { el: 'foc' }); step('legend', { el: 'psiquic' });
  // sound switch
  step('nav', { to: 'casa' }); step('mute'); step('mute');
  // harder zones: zone 3 (needs a talent, has a cave) and zone 4
  exec("G.done['planta:z0']=true;G.done['planta:z1']=true;G.owned.forEach(function(c){c.rest=0;c.fat=0;c.mill=5;if(c.stage<1){c.stage=1;c.evo=0}})", 'strong');
  step('nav', { to: 'explorar' }); step('world', { w: 'planta' });
  startZone('planta', 2, 'planta z3');
  exec("G.done['planta:z2']=true;G.owned.forEach(function(c){c.rest=0;c.fat=0;c.stage=2;c.evo=1})", 'z4 ready');
  step('nav', { to: 'casa' });
  startZone('planta', 3, 'planta z4');
  exec("G.owned.forEach(function(c){c.rest=0;c.fat=0})", 'rest');
  // a cave from a scene, a boss with an intro and ultimate attack
  startZone('psiquic', 0, 'psiquic z1');
  exec("G.owned.forEach(function(c){c.rest=0;c.fat=0});G.world='llamp';G.zone=1;G.pick=G.owned.slice(0,4).map(function(c){return c.uid});startRun();var r=run();r.cave=newCave(3);enterScene(r.cave.list[0]);render()", 'cave run');
  autoRun('cave');
  exec("G.owned.forEach(function(c){c.rest=0;c.fat=0});G.world='foc';G.zone=2;G.pick=G.owned.slice(0,4).map(function(c){return c.uid});startRun();startBattle({el:'foc',L:4,guardian:true,final:true,n:'Rei de la cova'});G.screen='run';render()", 'boss');
  autoRun('boss');
  for (let w of ['aigua', 'llamp']) { exec("G.owned.forEach(function(c){c.rest=0;c.fat=0})", 'rest'); startZone(w, 1, w + ' z2'); }
  // the rest clock: day, night with the campfire, a clock set in the future
  ['casa', 'bestioles'].forEach(to => step('nav', { to }));
  exec("G.owned.forEach(function(c){c.rest=3;c.fat=5})", 'tired');
  S.clock.now += 35 * 60000; step('nav', { to: 'casa' }, 'after 35 min');
  S.clock.now += 12 * 3600000; step('nav', { to: 'casa' }, 'night +12h');
  S.clock.now += 3 * 3600000; step('nav', { to: 'casa' }, 'night +3h');
  exec("G.restClock=Date.now()+86400000;render()", 'future clock');
  // comments panel
  S.statics.fbText.value = 'M’agrada molt';
  (S.statics.fbForm.listeners.submit || []).forEach(f => f({ preventDefault() {} })); S.flush(); rec('comment sent');
  // save and load again
  const saved = Object.assign({}, S.store);
  const before = E('JSON.stringify(G)');
  S = makeSession(html, { seed: 2002, store: saved, now: S.clock.now }); rec('reloaded');
  emit({ step: 'reload round trip', same: S.ev('JSON.stringify(G)') === before });
  ['casa', 'explorar', 'bestioles', 'motxilla'].forEach(to => step('nav', { to }));
  // reset
  step('reset'); step('reset');
  // unreadable or odd saves
  const cases = {
    corrupt: '{bad json', wrongVersion: JSON.stringify({ v: 99, coins: 5 }), notObject: '"hola"',
    old: JSON.stringify({ v: 1, coins: 77, equip: { anell: 'anellFoc' }, owned: [{ uid: 'a1', sp: 'brotet', stage: 1, evo: 1, mill: 0, fat: 0, rest: 0 }] }),
    partial: JSON.stringify({ v: 2, coins: 'x', owned: [{ uid: 'z', sp: 'nope' }], items: 'no', equip: [] })
  };
  Object.keys(cases).forEach(k => { S = makeSession(html, { seed: 3003, store: { 'bestioles-joc-v1': cases[k] } }); rec('load ' + k); step('nav', { to: 'casa' }); });
  S = makeSession(html, { seed: 4004, full: true }); rec('storage full'); step('nav', { to: 'casa' });
}

function transcript(html) { const out = []; play(html, s => out.push(s)); return out; }
function hashOf(list) { const h = crypto.createHash('sha256'); list.forEach(s => h.update(JSON.stringify(s) + '\n')); return h.digest('hex'); }

function main() {
  const [cmd, a, b] = process.argv.slice(2);
  if (cmd === 'record') {
    const t = transcript(fs.readFileSync(a, 'utf8'));
    fs.writeFileSync(b, t.map(s => JSON.stringify(s)).join('\n') + '\n');
    console.log(t.length + ' steps, sha256 ' + hashOf(t));
  } else if (cmd === 'hash') {
    const t = transcript(fs.readFileSync(a, 'utf8'));
    const errs = t.reduce((n, s) => n + (s.errors ? s.errors.length : 0), 0);
    console.log(t.length + ' steps, ' + errs + ' errors, sha256 ' + hashOf(t));
  } else if (cmd === 'compare') {
    const A = transcript(fs.readFileSync(a, 'utf8')), B = transcript(fs.readFileSync(b, 'utf8'));
    let diffs = 0;
    for (let i = 0; i < Math.max(A.length, B.length); i++) {
      const x = A[i] || {}, y = B[i] || {};
      const keys = Array.from(new Set(Object.keys(x).concat(Object.keys(y))));
      const bad = keys.filter(k => JSON.stringify(x[k]) !== JSON.stringify(y[k]));
      if (!bad.length) continue;
      diffs++;
      if (diffs <= 3) {
        console.log('DIFF at step ' + i + ' (' + (x.step || y.step) + '): ' + bad.join(', '));
        bad.forEach(k => {
          const p = JSON.stringify(x[k]) || '', q = JSON.stringify(y[k]) || '';
          let j = 0; while (j < p.length && p[j] === q[j]) j++;
          console.log('  ' + k + ' a: …' + p.slice(Math.max(0, j - 80), j + 160));
          console.log('  ' + k + ' b: …' + q.slice(Math.max(0, j - 80), j + 160));
        });
      }
    }
    console.log(A.length + ' / ' + B.length + ' steps, ' + diffs + ' differing steps; a ' + hashOf(A).slice(0, 16) + ' b ' + hashOf(B).slice(0, 16));
    process.exitCode = diffs ? 1 : 0;
  } else {
    console.log('usage: golden.js record <html> <out.jsonl> | hash <html> | compare <a.html> <b.html>');
    process.exitCode = 2;
  }
}
if (require.main === module) main();
module.exports = { transcript, hashOf, makeSession };
