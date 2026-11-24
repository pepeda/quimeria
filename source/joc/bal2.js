// Headless smoke test: runs the game script with a tiny fake DOM and taps random buttons, looking for exceptions.
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/check.js', 'utf8');
const els = {};
function mkEl(id) {
  return {
    id, _html: '', textContent: '', value: '', hidden: false, scrollTop: 0, style: { setProperty() {} }, dataset: {}, get parentNode() { return mkEl('p') },
    set innerHTML(v) { this._html = v; }, get innerHTML() { return this._html; },
    classList: { _s: new Set(), add(c) { this._s.add(c) }, remove(c) { this._s.delete(c) }, toggle(c, on) { on ? this._s.add(c) : this._s.delete(c) }, contains(c) { return this._s.has(c) } },
    querySelector() { return null }, appendChild() {}, replaceChildren() {}, remove() {}, addEventListener() {}, setAttribute() {}, focus() {}, select() {},
    contains() { return true }, get offsetWidth() { return 1 }
  };
}
let clickHandler = null;
const timers = [];
global.window = { matchMedia: () => ({ matches: false }) };
global.localStorage = { _d: {}, getItem(k) { return this._d[k] || null }, setItem(k, v) { this._d[k] = v } };
global.navigator = {};
global.setTimeout = (f) => { timers.push(f); return timers.length };
global.clearTimeout = () => {};
global.document = {
  getElementById(id) { return els[id] || (els[id] = mkEl(id)) },
  querySelector() { return null },
  createElement(t) { return mkEl(t) },
  addEventListener(t, f) { if (t === 'click') clickHandler = f }
};
eval(src.replace('function doAbility(c,a,b,r){','function doAbility(c,a,b,r){global.SPECIALS=(global.SPECIALS||0)+1;'));
function flush(n) { for (let i = 0; i < n && timers.length; i++) { const f = timers.shift(); f(); } }
function clickables() {
  const html = els.screen._html + els.nav._html + els.overlay._html;
  const re = /<button[^>]*data-act="([^"]+)"[^>]*>/g; let m; const out = [];
  while ((m = re.exec(html))) {
    const tag = m[0]; if (/ disabled[ >]/.test(tag)) continue;
    const ds = {}; tag.replace(/data-([a-z]+)="([^"]*)"/g, (_, k, v) => { ds[k] = v });
    if (['reset', 'abandon', 'chat', 'restart', 'pause', 'gleave', 'mleave', 'nav', 'detail', 'equip', 'unequip', 'feed', 'build', 'close', ].includes(ds.act)) continue;
    out.push(ds);
  }
  return out;
}
function tap(ds) { const t = { dataset: ds, disabled: false, closest() { return t } }; clickHandler({ target: t }); }
let seed = 8; Math.random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const acts = {};
for (let step = 0; step < 20000; step++) {
  flush(5);
  let c = clickables();
  const pref = c.filter(x => ['go', 'choice', 'fork', 'claim', 'next', 'skip', 'bwin', 'blose', 'wfight', 'gfight', 'path', 'pick', 'world', 'special', 'join', 'evolve', 'feed', 'equip', 'build', 'adopt', 'nap', 'resume', 'tip', 'restartNow', 'restart', 'bestEquip', 'mfight', 'mleave'].includes(x.act));
  if (pref.length && Math.random() < 0.85) c = pref;
  if (!c.length) { flush(300); continue; }
  const ds = c[Math.floor(Math.random() * c.length)];
  acts[ds.act] = (acts[ds.act] || 0) + 1;
  tap(ds);
}
const save = JSON.parse(localStorage.getItem('bestioles-joc-v1'));
console.log('specials fired:',global.SPECIALS);console.log('OK, no exceptions. Taps per action:', JSON.stringify(acts));
console.log('completed expeditions:', save.completed, 'coins:', save.coins, 'owned:', save.owned.length, 'stages:', save.owned.map(c => c.sp + ':' + c.stage).join(' '), 'psiquic:', save.psiquic);
