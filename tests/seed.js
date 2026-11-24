// Preloaded with `node -r ./seed.js` by run-all.js: a seeded Math.random and a fixed clock,
// so every test and simulation prints the same numbers on every run.
process.env.TZ = 'UTC';
let a = 20261124 >>> 0;
Math.random = function () {
  a = (a + 0x6D2B79F5) >>> 0;
  let t = a;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const RealDate = Date, T0 = RealDate.UTC(2026, 10, 24, 10, 0, 0);
function FixedDate(...args) {
  if (!new.target) return new RealDate(T0).toString();
  return args.length ? new RealDate(...args) : new RealDate(T0);
}
FixedDate.now = () => T0;
FixedDate.UTC = RealDate.UTC;
FixedDate.parse = RealDate.parse;
FixedDate.prototype = RealDate.prototype;
global.Date = FixedDate;
