'use strict';
/* --- v13.4 safety: a battle never continues with the whole team down, and an error in a turn ends the battle instead of freezing the game --- */
function battleTick(){var r=run(),b=r&&r.event;
  if(b&&!b.over&&!alive(r).length){b.over='lose';return [{t:'teamDown',txt:'Tot l’equip ha caigut.'}]}
  try{return battleTick3()}catch(e){if(b){b.over='lose'}return [{t:'teamDown',txt:'Alguna cosa ha fallat en aquest torn. La batalla s’acaba.'}]}}
function battleWon(){battleWon3();var r=run();if(r&&r.team&&!r.team.some(function(u){return r.hp[u]>0}))r.team.forEach(function(u){r.hp[u]=1})}
try{document.documentElement.style.touchAction='manipulation'}catch(e){}
