'use strict';
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
function heroOutfit(){var id=G.equip.vestit,it=IT(id);
  return '<div class="row" style="gap:12px;align-items:center;justify-content:center">'+hero(64)+
    '<div class="box" style="min-height:96px;min-width:130px;'+(it?'border:3px solid '+TIER_C[it.tier]:'border:2px dashed #B9B3C6')+'"><span class="muted small">Vestit</span>'+
    (it?'<b style="font-size:13px;text-align:center">'+esc(it.n)+'</b><span class="muted small" style="text-align:center">'+esc(itemStats(it))+'</span><button type="button" class="btn sm light" style="min-height:40px" data-act="unequip" data-slot="vestit">Treu</button>':'<span class="muted small" style="text-align:center">Sense vestit. En trobaràs explorant.</span>')+'</div></div>'}
/* a heading with a one-line explanation and a "?" that opens the full detail (tap on a phone, hover shows a tooltip on a computer) */
function qHead(title,short,long){return '<div class="qhead"><h2 style="margin:0">'+esc(title)+'</h2><details class="qd"><summary title="'+esc(long)+'" aria-label="Més informació sobre '+esc(title)+'">?</summary><p class="small qdtxt">'+esc(long)+'</p></details></div><p class="small" style="margin:2px 0 0">'+esc(short)+'</p>'}
(function(){try{var st=document.createElement('style');st.textContent='.qhead{display:flex;flex-wrap:wrap;align-items:center;gap:8px}.qd{display:contents}.qd>summary{list-style:none;cursor:pointer;width:28px;height:28px;border-radius:50%;background:#1E1B2E;color:#fff;font-weight:800;display:inline-flex;align-items:center;justify-content:center;font-size:15px}.qd>summary::-webkit-details-marker{display:none}.qd .qdtxt{flex-basis:100%;margin:4px 0 0;background:#fff;border:2px solid #1E1B2E;border-radius:10px;padding:8px 10px}';document.head.appendChild(st)}catch(e){}})();
/* legend sets: short text, details behind the "?" */
var setsBlockV13=setsBlock;
setsBlock=function(){var h=setsBlockV13();
  var a=h.indexOf('<h2>Sets de llegenda</h2>'),b=h.indexOf('<p class="small"><b>Taller de llegendes</b>');
  if(a<0||b<0)return h;
  var long='Hi ha 10 sets (2 de cada element) de 5 peces Superèpiques. Amb 2 peces del mateix set posades tens 1 habilitat, amb 3 en tens 2, amb 4 en tens 3, i amb les 5 la super habilitat. Els caps en deixen caure una molt poques vegades (5%). Al Taller de llegendes en pots comprar una per '+LEGEND_COST+' monedes, però només quan has forjat un objecte fins a Superèpica.';
  var total=(h.match(/Tens <b>(\d+) de 50<\/b>/)||[])[1]||'0';
  return h.slice(0,a)+qHead('Sets de llegenda','Peces Superèpiques que, juntes, donen habilitats. Molt difícils d’aconseguir. En tens '+total+' de 50.',long)+
    '<p class="small" style="margin-top:6px"><b>Taller de llegendes</b>'+(legendOpen()?' · '+LEGEND_COST+' monedes per peça':' · tancat fins que forgis una Superèpica')+'</p>'+h.slice(h.indexOf('<div class="row"',b))};

