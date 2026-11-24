// Zones 4 and 5 only, with more battles per cell: the hard end of the table of sim14.js.
// To try other zone numbers without changing the game: SIM_ZONE='{"foc":[[..],[..],[..],[..],[..]]}' node tests/sim14z.js
process.env.SIM_Z = process.env.SIM_Z || '4,5';
process.env.SIM_N = process.env.SIM_N || '100';
require('./sim14.js');
