const ev=require('./h.js');
// 1) guardian preview resist vs real fight
ev(`G.world='foc';G.zone=0;G.pick=G.owned.slice(0,3).map(function(c){return c.uid});startRun();var r=run();r.event={type:'guardianPre'};G.screen='run';`);
const seen=new Set();for(let i=0;i<20;i++){ev('render()');const m=/Resisteix ([^<]+)</.exec(ev(`$('screen').innerHTML`));seen.add(m&&m[1]);}
console.log('resist shown across 20 renders of the same guardian screen:',[...seen]);
// 2) clock jumped forward then corrected
ev(`G.restClock=Date.now()+86400000; G.owned[0].rest=3; applyRestClock();`);
console.log('restClock 24h in future -> rest after applyRestClock:',ev('G.owned[0].rest'),'(stays until real time catches up)');
// 3) join with maxTeam 6 and 3-member team
ev(`G.completed=9;G.runs={};G.active=null;G.pick=G.owned.slice(0,3).map(function(c){return c.uid});startRun();var r=run();var n=mk('somni');G.owned.push(n);r.event={type:'card',kind:'critter',sp:'somni',uid:n.uid};`);
console.log('maxTeam=',ev('maxTeam()'),'team=',ev('run().team.length'),'join button shown:',/data-act="join"/.test(ev('bigCard(run().event)')));
