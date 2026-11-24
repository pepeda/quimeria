'use strict';
/* ================= SCREEN: Motxilla (the backpack, 4 tabs) ================= */
function scMotxilla(){
  var q=bonusPct(G.equip);
  var slots=SLOTS.filter(function(x){return x[0]!=='vestit'}).map(function(x){var id=G.equip[x[0]],it=IT(id);return '<div class="box" style="min-height:96px;'+(it?'border:3px solid '+TIER_C[it.tier]:'border:2px dashed #B9B3C6')+'"><span class="muted small">'+x[1]+'</span>'+(it?'<b style="font-size:13px;text-align:center">'+esc(it.n)+'</b><span class="muted small" style="text-align:center">'+esc(itemStats(it))+'</span><button type="button" class="btn sm light" style="min-height:36px" data-act="unequip" data-slot="'+x[0]+'">Treu</button>':'<span class="muted small">buit</span>')+'</div>'}).join('');
  var groups=itemGroups(),ready=forgeReady();
  var forge='<div class="flat" style="gap:8px;background:#FFF1DA">'+qHead('Forja','4 objectes iguals → 1 de la categoria següent, amb un poder especial nou.','Normal → Refinada → Màgica → Èpica → Superèpica. Cada categoria dona molt més: Refinada ×1,6 · Màgica ×2,4 · Èpica ×3,4 · Superèpica ×4,8. Costa '+FORGE_COST.join(', ')+' monedes segons la categoria. Cada vegada que forges, l’objecte guanya un poder especial (Xucla vida, Verí, Encanteri, Espines…). Els 4 objectes han de ser de la mateixa mena i categoria.')+
    (ready.length?'<button type="button" class="btn gold" data-act="forgeAll">Forja-ho tot ('+ready.length+' grups a punt)</button>':'<p class="muted small">Ara no tens 4 objectes iguals de cap mena.</p>')+'</div>';
  var inv=groups.map(function(g){var it=IT(g.id),t=it.tier,sl=it.slot==='anell'?['anell1','anell2']:[it.slot],cost=t<4?FORGE_COST[t]:0;
    return '<div class="flat" style="background:var(--soft);gap:6px;outline:3px solid '+TIER_C[t]+'"><div class="row between"><b>'+esc(it.n)+(g.n>1?' ×'+g.n:'')+'</b><span class="tag" style="background:'+TIER_C[t]+';color:#fff">'+esc(it.rar)+'</span></div><span class="muted small">'+esc(itemStats(it))+'</span>'+
      sl.map(function(s){var eqNew=Object.assign({},G.equip);eqNew[s]=g.id;var cur=G.equip[s];
        return '<div class="row" style="gap:6px"><button type="button" class="btn sm" data-act="equip" data-id="'+esc(g.id)+'" data-slot="'+s+'">'+(cur?'Canvia per aquest':'Equipa')+(sl.length>1?' ('+(s==='anell1'?'Anell 1':'Anell 2')+')':'')+'</button></div><div class="row" style="gap:4px">'+deltaChips(eqNew)+'</div>'}).join('')+
      (t<4?'<div class="row" style="gap:6px"><button type="button" class="btn sm gold" data-act="forge" data-id="'+esc(g.id)+'"'+(fcount(g.id)>=4&&G.coins>=cost?'':' disabled')+'>Forja 4 → 1 '+esc(TIER_N[t+1])+' ('+cost+' monedes)</button><span class="muted small">'+(fcount(g.id)>=4?(G.coins>=cost?'':'Et falten monedes'):'En tens '+fcount(g.id)+' de 4 d’aquesta categoria')+'</span></div>':'<span class="muted small">Ja és Superèpica: la millor categoria.</span>')+'</div>'}).join('');
  var food=Object.keys(ELS).map(function(k){return '<div class="box">'+elIcon(k,26,ELS[k].c)+'<span class="small" style="text-align:center">'+esc(FOOD[k])+'</span><b>'+(G.food[k]||0)+'</b></div>'}).join('');
  /* the backpack has 4 tabs: Equip, Objectes i forja, Sets, Menjar */
  var tabs={eq:tip('motxilla','Els objectes que portes fan més forta cada bestiola de l’equip. Abans d’equipar, mira les fletxes: ▲ verd vol dir que millora, ▼ vermell que empitjora. Amb 4 objectes iguals, a la Forja en fas un de millor.')+'<div class="flat" style="align-items:center">'+heroOutfit()+'<div class="row" style="justify-content:center"><span class="tag">Atac +'+Math.round(q.atk)+'%</span><span class="tag">Defensa +'+Math.round(q.def)+'%</span><span class="tag">Vida +'+Math.round(q.hp)+'%</span></div></div>'+
    bestBlock()+'<div class="grid4">'+slots+'</div>'};
  tabs.obj=forge;tabs.eq+=powersBlock();tabs.sets=setsBlock();
  tabs.obj+='<h2>A la motxilla</h2>'+(inv||'<p class="muted">Encara no tens objectes. En trobaràs explorant.</p>');
  tabs.menjar='<h2>Menjar</h2><div class="grid3">'+food+'</div>';
  var t=tabs[G.mtab]?G.mtab:'eq';
  /* red dots on the tabs: something can be forged, a legend piece can be bought, better gear is in the backpack */
  var dot={obj:forgeReady().length>0,sets:legendOpen()&&G.coins>=LEGEND_COST&&ORDER.filter(worldOpen).some(function(el){return missingPieces(el).length}),eq:betterGear()};
  var bar='<div class="mtabs" role="tablist">'+[['eq','Equip'],['obj','Objectes i forja'],['sets','Sets'],['menjar','Menjar']].map(function(x){return '<button type="button" role="tab" class="mtab'+(t===x[0]?' on':'')+'" aria-selected="'+(t===x[0])+'" data-act="mtab" data-k="'+x[0]+'">'+x[1]+(dot[x[0]]?'<span class="rdot" aria-label="hi ha novetats"></span>':'')+'</button>'}).join('')+'</div>';
  return '<h1>Motxilla</h1>'+bar+(t==='obj'?forgeChoiceBlock():'')+tabs[t];
}
function heroOutfit(){var id=G.equip.vestit,it=IT(id);
  return '<div class="row" style="gap:12px;align-items:center;justify-content:center">'+hero(64)+
    '<div class="box" style="min-height:96px;min-width:130px;'+(it?'border:3px solid '+TIER_C[it.tier]:'border:2px dashed #B9B3C6')+'"><span class="muted small">Vestit</span>'+
    (it?'<b style="font-size:13px;text-align:center">'+esc(it.n)+'</b><span class="muted small" style="text-align:center">'+esc(itemStats(it))+'</span><button type="button" class="btn sm light" style="min-height:40px" data-act="unequip" data-slot="vestit">Treu</button>':'<span class="muted small" style="text-align:center">Sense vestit. En trobaràs explorant.</span>')+'</div></div>'}
function bestBlock(){
  if(!G.items.length&&!Object.keys(G.equip).length)return '';
  var best=bestEquipSet(),same=SLOTS.every(function(x){return (best.equip[x[0]]||'')===(G.equip[x[0]]||'')});
  return '<div class="flat" style="gap:6px"><button type="button" class="btn green" data-act="bestEquip"'+(same?' disabled':'')+'>'+(same?'Ja portes el millor':'Equipa el millor')+'</button>'+
    (same?'':'<div class="row" style="gap:4px">'+deltaChips(best.equip)+'</div>')+'<p class="muted small">Tria per a cada lloc l’objecte que dona més en total (atac + defensa + vida).</p></div>';
}
function deltaChips(eqNew){
  var a=bonusPct(G.equip),b=bonusPct(eqNew),out=[];
  [['atk','Atac'],['def','Defensa'],['hp','Vida']].forEach(function(k){var d=b[k[0]]-a[k[0]];if(d!==0)out.push('<span class="delta '+(d>0?'up':'down')+'">'+(d>0?'▲ ':'▼ ')+k[1]+' '+(d>0?'+':'−')+Math.abs(d)+'%</span>')});
  return out.length?out.join(' '):'<span class="muted small">Igual que el que portes</span>';
}
/* special powers of the gear that is equipped */
function powersBlock(){
  var P=powerOf(G.equip),pw=powerText(P);
  return '<div class="flat" style="gap:6px;background:#F3ECFF"><h2>Poders especials</h2>'+(pw.length?'<p class="small">'+esc(pw.join(' · '))+'</p>':'<p class="muted small">Encara cap. Els objectes forjats i els sets de llegenda en donen.</p>')+'</div>';
}
/* legend sets: what you have, what each set does, and the legend workshop. Short text; the details are behind the "?" */
function setsBlock(){
  var mine={},n=setCounts(G.equip),total=0;allMine().forEach(function(id){var b=ITEMS[baseOf(id)];if(b&&b.set){mine[b.set]=mine[b.set]||{};mine[b.set][b.slot]=1}});
  Object.keys(mine).forEach(function(k){total+=Object.keys(mine[k]).length});
  var list=SET_KEYS.filter(function(k){return mine[k]}).map(function(k){var S=SETS[k],on=n[k]||0;
    return '<div class="flat" style="background:var(--soft);gap:4px;outline:3px solid '+ELS[S.el].c+'"><div class="row between"><b>'+esc(S.n)+'</b><span class="tag" style="background:'+ELS[S.el].c+';color:#fff">'+on+' de 5 posades</span></div>'+
      '<span class="small">Peces: '+S.slots.map(function(sl){return (mine[k][sl]?'✓ ':'· ')+SLOT_N[sl]}).join(' · ')+'</span>'+
      S.b.map(function(x,i){var act=on>=i+2;return '<span class="small" style="'+(act?'font-weight:800;color:#1E7B3A':'opacity:.65')+'">'+(i===3?'5 peces · SUPER: ':(i+2)+' peces: ')+esc(x.d)+(act?' ✓':'')+'</span>'}).join('')+'</div>'}).join('');
  var shop=ORDER.filter(worldOpen).map(function(el){var m=missingPieces(el).length;
    return '<button type="button" class="btn sm" style="background:'+ELS[el].c+';color:#fff" data-act="legend" data-el="'+el+'"'+(m&&legendOpen()&&G.coins>=LEGEND_COST?'':' disabled')+'>'+esc(ELS[el].n)+(m?'':' (complet)')+'</button>'}).join(' ');
  var long='Hi ha 10 sets (2 de cada element) de 5 peces Superèpiques. Amb 2 peces del mateix set posades tens 1 habilitat, amb 3 en tens 2, amb 4 en tens 3, i amb les 5 la super habilitat. Els caps en deixen caure una molt poques vegades (5%). Al Taller de llegendes en pots comprar una per '+LEGEND_COST+' monedes, però només quan has forjat un objecte fins a Superèpica.';
  return '<div class="flat" style="gap:6px;background:#FFF6D6">'+qHead('Sets de llegenda','Peces Superèpiques que, juntes, donen habilitats. Molt difícils d’aconseguir. En tens '+total+' de 50.',long)+
    '<p class="small" style="margin-top:6px"><b>Taller de llegendes</b>'+(legendOpen()?' · '+LEGEND_COST+' monedes per peça':' · tancat fins que forgis una Superèpica')+'</p><div class="row" style="gap:6px;flex-wrap:wrap">'+shop+'</div></div>'+list;
}
function forgeChoiceBlock(){var fc=G.forgeChoice;if(!fc)return '';var it=IT(fc.id);if(!it){G.forgeChoice=null;return ''}
  return '<div class="flat" style="gap:8px;background:#1E1B2E;color:#fff;outline:3px solid #F2B705"><h2 style="color:#fff">Tria el poder nou</h2><p class="small">'+esc(it.n)+' → '+esc(TIER_N[it.tier+1])+' · '+FORGE_COST[it.tier]+' monedes</p>'+
    fc.opts.map(function(k){return '<button type="button" class="btn gold" style="text-align:left;display:block" data-act="forgePick" data-k="'+k+'"><b>'+esc(AFFIX[k].n)+'</b>'+(AFFIX[k].d?'<span class="small" style="display:block;font-weight:600">'+esc(AFFIX[k].d)+'</span>':'')+'</button>'}).join('')+
    '<button type="button" class="btn light sm" data-act="forgeCancel">Encara no</button></div>'}
function betterGear(){try{var b=bestEquipSet().equip;return SLOTS.some(function(x){return (b[x[0]]||'')!==(G.equip[x[0]]||'')&&itemScore(b[x[0]]||'')>itemScore(G.equip[x[0]]||'')})}catch(e){return false}}
