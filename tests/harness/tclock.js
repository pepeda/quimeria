const ev=require('./h.js');ev('G.restClock=Date.now()+86400000;applyRestClock()');console.log('clock reset to now:',ev('G.restClock<=Date.now()'));
