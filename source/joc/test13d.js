const fs=require('fs');const vm=require('vm');
const ev=require('../council-v13/harness/h.js');
function ok(c,m){console.log((c?'ok   ':'FAIL ')+m);if(!c)process.exitCode=1}
const mx=ev("G.mtab='obj';scMotxilla()")+ev("G.mtab='sets';scMotxilla()")+ev("G.mtab='eq';scMotxilla()");
ok(mx.indexOf('class="qd"')>=0&&mx.indexOf('4 objectes iguals → 1')>=0,'forge short text with ?');
ok(mx.indexOf('Molt difícils d’aconseguir')>=0&&mx.indexOf('Hi ha <b>10 sets</b>')<0,'sets short text, details behind ?');
ok(mx.indexOf('>Arma<')>=0&&mx.indexOf('>Espasa<')<0,'weapon slot is Arma');
ok(mx.indexOf('Sense vestit')>=0,'outfit box beside character');
ok(ev("ITEMS.set_drac_espasa.n")==='Espasa del Drac Roig'&&ev("ITEMS.set_tro_espasa.n").indexOf('Martell')===0,'set weapons have their own kind: '+ev("ITEMS.set_tro_espasa.n"));
ev("G.items.push('tunicaMag');act('equip',{id:'tunicaMag',slot:'vestit'})");
ok(ev("G.equip.vestit")==='tunicaMag'&&ev("hero(48)").indexOf('#6A3FB5')>=0,'outfit equips and colours the character');
ok(ev("bonusPct(G.equip).atk")>0,'outfit gives stats');
const best=ev("JSON.stringify(bestEquipSet().equip)");ok(best.indexOf('vestit')>=0,'best equip includes outfit');
const c=ev("scCasa()");ok(c.indexOf('Construir i decorar')<c.indexOf('Places per a bestioles'),'build section right under the house');
ok(ev("COMMON.indexOf('arcCaca')>=0&&COMMON.indexOf('vestitNinja')>=0"),'new weapons and outfits can drop');
