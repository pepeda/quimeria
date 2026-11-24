'use strict';
try{document.documentElement.style.touchAction='manipulation'}catch(e){}
/* --- v13.5: weapons of different kinds, outfits for the player character, short help with a "?" --- */
(function(){
  var W={arcCaca:{n:'Arc de caça',slot:'espasa',atk:3,def:0,hp:0,rar:'Comú'},bastoMagic:{n:'Bastó màgic',slot:'espasa',atk:2,def:0,hp:2,rar:'Comú'},
    martellPedra:{n:'Martell de pedra',slot:'espasa',atk:5,def:0,hp:0,rar:'Rar'},dagaOmbra:{n:'Daga d’ombra',slot:'espasa',atk:4,def:0,hp:1,rar:'Rar'},
    vestitExplorador:{n:'Vestit d’explorador',slot:'vestit',hp:3,def:1,atk:0,rar:'Comú',col:'#4E7A3A'},tunicaMag:{n:'Túnica de mag',slot:'vestit',atk:2,hp:1,def:0,rar:'Comú',col:'#6A3FB5'},
    armaduraLleugera:{n:'Armadura lleugera',slot:'vestit',def:3,hp:1,atk:0,rar:'Rar',col:'#7A8496'},vestitNinja:{n:'Vestit de ninja',slot:'vestit',atk:3,def:1,hp:0,rar:'Rar',col:'#23202E'},
    jaquetaFoc:{n:'Jaqueta de foc',slot:'vestit',atk:2,def:1,hp:1,rar:'Rar',col:'#C8462B'}};
  Object.keys(W).forEach(function(k){ITEMS[k]=W[k];COMMON.push(k)});
  // set weapons: each set has its own kind of weapon
  var SW={drac:'Espasa',fenix:'Bastó',marea:'Arpó',levia:'Trident',bosc:'Arc',rosa:'Fuet',tro:'Martell',vent:'Daga',ull:'Vareta',somnia:'Ventall'};
  SET_KEYS.forEach(function(k){var it=ITEMS['set_'+k+'_espasa'];if(it)it.n=(SW[k]||'Arma')+' '+SETS[k].suf});
  SLOTS.push(['vestit','Vestit']);SLOT_N.vestit='Vestit';
})();
function heroCol(){var it=G&&G.equip&&ITEMS[baseOf(G.equip.vestit||'')];return it&&it.col?it.col:'#4A3FB5'}
/* a heading with a one-line explanation and a "?" that opens the full detail (tap on a phone, hover shows a tooltip on a computer) */
function qHead(title,short,long){return '<div class="qhead"><h2 style="margin:0">'+esc(title)+'</h2><details class="qd"><summary title="'+esc(long)+'" aria-label="Més informació sobre '+esc(title)+'">?</summary><p class="small qdtxt">'+esc(long)+'</p></details></div><p class="small" style="margin:2px 0 0">'+esc(short)+'</p>'}
(function(){try{var st=document.createElement('style');st.textContent='.qhead{display:flex;flex-wrap:wrap;align-items:center;gap:8px}.qd{display:contents}.qd>summary{list-style:none;cursor:pointer;width:28px;height:28px;border-radius:50%;background:#1E1B2E;color:#fff;font-weight:800;display:inline-flex;align-items:center;justify-content:center;font-size:15px}.qd>summary::-webkit-details-marker{display:none}.qd .qdtxt{flex-basis:100%;margin:4px 0 0;background:#fff;border:2px solid #1E1B2E;border-radius:10px;padding:8px 10px}';document.head.appendChild(st)}catch(e){}})();

