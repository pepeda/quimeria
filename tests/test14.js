const ev=require('./harness/h.js');
function ok(c,m){console.log((c?'ok   ':'FAIL ')+m);if(!c)process.exitCode=1}
ok(ev("SPECIES.espurnet.evos[0].n")==='Flamàs'&&ev("ELS.foc.mon")==='Brasàlia','council names applied');
ok(ev("ZONES.foc.length")===4&&ev("ZONE_ROUTES.length")===4&&ev("ZONE_INFO[3]").indexOf('MOLT DIFÍCIL')===0,'zone 4 exists');
ok(ev("zoneOpen('foc',3)")===false,'zone 4 locked until zone 3 done');
ev("G.done['foc:z2']=true");ok(ev("zoneOpen('foc',3)")===true,'zone 4 opens after zone 3');
// forge choice
ev("G.coins=9999;G.items=['espasaFusta','espasaFusta','espasaFusta','espasaFusta'];G.mtab='obj'");ev("act('forge',{id:'espasaFusta'})");
ok(ev("G.forgeChoice&&G.forgeChoice.opts.length")===3,'forge offers 3 powers');
const h=ev("scMotxilla()");ok(h.indexOf('Tria el poder nou')>=0,'choice panel shown');
const k=ev("G.forgeChoice.opts[1]");ev("act('forgePick',{k:'"+k+"'})");ok(ev("G.items.filter(function(x){return x.indexOf('espasaFusta#1~"+k+"')===0}).length")===1,'chosen power applied: '+k);
// tabs and dots
['eq','obj','sets','menjar'].forEach(t=>{ev("G.mtab='"+t+"'");const x=ev("scMotxilla()");ok(x.indexOf('class="mtabs"')>=0&&x.indexOf('<h1>Motxilla</h1>')>=0,'tab '+t+' renders')});
ok(typeof ev("betterGear()")==='boolean','better gear check runs');
// boss name and cave king
ok(ev("BOSS.gel.n")==='Glacius, el Bruixot del Gebre','boss renamed');
const b=ev("(function(){G.pick=[G.owned[0].uid];G.world='planta';G.zone=1;startRun();startBattle({el:'planta',L:3,guardian:true,n:'Rei de les Profunditats'});return run().event.enemy.boss})()");ok(b==='tricap','renamed cave king still triggers the three-headed boss');
// balance: enemy hp grows with sqrt of team power outside zone 4
ok(ev("(function(){var a=enemyStats(3,false,3,4).hp,c=enemyStats(3,false,3,1).hp;return Math.round(a/c)})()")===2,'team power x4 doubles enemy hp (sqrt)');
ok(ev("snd('tap'),true")===true,'sound call is safe without audio');
ok(ev("scCasa()").indexOf('So i vibració')>=0,'sound switch in the house');
