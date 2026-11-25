// The first-expedition guide and the bottom menu (src/js/27-guide.js)
const ev=require('./harness/h.js');
function ok(c,m){console.log((c?'ok   ':'FAIL ')+m);if(!c)process.exitCode=1}
ev("G=newGame()");
ok(ev("tutOn()")===true,'a new game starts the guide');
ok(ev("['explorar','casa','bestioles','motxilla'].filter(navOpen).join()")==='explorar','at the start the menu shows only Explorar');
ok(ev("Object.keys(SCENES).filter(function(k){return SCENES[k].pool==='tut'}).every(function(k){return SCENES[k].nodes.a.ch.length===1&&!SCENES[k].nodes.a.ch[0].out.price&&!SCENES[k].nodes.a.ch[0].out.shop&&!SCENES[k].nodes.a.ch[0].out.buyFood})"),'the guided scenes have one choice and nothing to pay');
ok(ev("worldScenes('aigua').every(function(k){return SCENES[k].pool!=='tut'})"),'guided scenes do not count for exploring');
ev("act('world',{w:'foc'})");ok(ev("G.screen")==='explorar','during the guide only the Water world opens');
ev("act('world',{w:'aigua'});act('path',{p:'0'})");ok(ev("G.pick.length")===3,'the team is chosen for the player');
ev("act('go')");ok(ev("run().tut")===1&&ev("run().slots.map(function(s){return s.scene||s.k}).join()")==='tut_cami,wild,tut_monstre,mini,tut_font,guardian','the guided route');
ev("G.items.push('espasaFusta')");ok(ev("navOpen('motxilla')")===true,'Motxilla opens with the first item');
ev("G.owned.push(mk('nedet'))");ok(ev("navOpen('bestioles')")===true,'Bestioles opens with the first new critter');
ev("finishRun(true)");ok(ev("G.tut.ran")===1&&ev("tutOn()")===true&&ev("navOpen('casa')")===true,'after the guided expedition: chest, then Casa');
ev("G.tut.done=1");ok(ev("tutOn()")===false,'the guide ends');
ev("G=newGame();tutEnd(true)");ok(ev("tutOn()")===false&&ev("navOpen('casa')")===true&&!ev("G.tips.explorar"),'skipping the guide opens Casa and brings the tips back');
ev("G=newGame();G.completed=5;G.tut={done:0}");ok(ev("tutOn()")===false,'a save with finished expeditions never sees the guide');
ok(ev("['explorar','casa','bestioles','motxilla'].filter(navOpen).length")===4||ev("G.completed")<3,'old saves see the whole menu');
