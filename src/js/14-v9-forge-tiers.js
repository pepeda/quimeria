'use strict';
/* ================= V9: forge and item tiers, enemy cut-ins, who-is-acting colours ================= */
var TIER_N=['Normal','Refinada','Màgica','Èpica','Superèpica'];
var TIER_M=[1,1.6,2.4,3.4,4.8];
var TIER_C=['#7D8597','#2E8BE6','#9B59E0','#E0572B','#C98A00'];
var FORGE_COST=[30,60,120,240];
function tierOf(id){return Math.min(4,parseInt(String(id).split('#')[1],10)||0)}
function baseOf(id){return String(id).split('#')[0]}
function IT(id){if(id==null)return null;var b=ITEMS[baseOf(id)];if(!b)return null;var t=tierOf(id),m=TIER_M[t];
  return {aff:affOf(id),set:b.set,n:b.n+(t&&!b.set?' '+'★'.repeat(t):''),slot:b.slot,atk:b.atk*m,def:b.def*m,hp:b.hp*m,rar:(b.set?'Set de llegenda · ':b.relic?'Tresor · ':'')+TIER_N[t],relic:b.relic,tier:t,base:baseOf(id)}}
function itemStats0(it){return [it.atk?'Atac +'+Math.round(it.atk*3)+'%':'',it.def?'Defensa +'+Math.round(it.def*3)+'%':'',it.hp?'Vida +'+Math.round(it.hp*2)+'%':''].filter(Boolean).join(' · ')}
function itemGroups(){var g={},order=[];G.items.forEach(function(id){if(!IT(id))return;if(!g[id]){g[id]=0;order.push(id)}g[id]++});
  return order.sort(function(a,b){var A=IT(a),B=IT(b);return (A.slot>B.slot?1:A.slot<B.slot?-1:0)||(A.base>B.base?1:A.base<B.base?-1:0)||tierOf(b)-tierOf(a)}).map(function(id){return {id:id,n:g[id]}})}
function forgeOnceV9(id){var t=tierOf(id);if(t>=4)return false;var cnt=G.items.filter(function(x){return x===id}).length;if(cnt<4||G.coins<FORGE_COST[t])return false;
  for(var k=0;k<4;k++)G.items.splice(G.items.indexOf(id),1);G.coins-=FORGE_COST[t];G.items.push(baseOf(id)+'#'+(t+1));return true}
function forgeAllV9(){var n=0,again=true,guard=0;while(again&&guard++<200){again=false;var gs=itemGroups();for(var i=0;i<gs.length;i++){if(gs[i].n>=4&&forgeOnce(gs[i].id)){n++;again=true;break}}}return n}
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
/* who is acting: green for your team, red for the enemy; big enemy moves get their own cut-in */
var US_EV=['hit','heal','regen','special','combo','dot','stunned','foeDown'],THEM_EV=['ehit','aoe','warn','enrage','wave','teamDown','boss','minion'];
function showEvent(e){
  if(v13Show(e))return;
  if(e.t==='ult'){var c0=$('caption');if(c0){c0.classList.add('them');c0.classList.remove('us');c0.textContent=e.txt}mangaUlt(e,function(){bossFx(e);impact();sfx($('squad'),'KRAAAAK!','w',1);anim($('squad'),'shake')});return}
  var cap=$('caption');if(cap){cap.classList.toggle('them',THEM_EV.indexOf(e.t)>=0);cap.classList.toggle('us',US_EV.indexOf(e.t)>=0)}
  var big=(e.t==='ehit'&&e.strong)||e.t==='aoe'||e.t==='enrage'||e.t==='boss';
  if(big){enemyCut(e);setTimeout(function(){showEventNow(e);mangaFx(e);bossFx(e)},RM?100:950);return}
  showEventNow(e);mangaFx(e);bossFx(e);
  if(e.t==='ehit'){var fa=$('foe-art');floatNum(fa,'ATACA!','tagtxt')}
}
function enemyCut(e){
  var r=run(),b=r&&r.event,st=$('stage');if(!st||!b||!b.enemy)return;var en=b.enemy;
  var ci=document.createElement('div');ci.className='cutin enemy';ci.style.setProperty('--cc',ELS[en.el].c);
  ci.innerHTML='<div class="lines"></div><div class="side">ENEMIC</div><div class="who foeIn">'+(en.wild?spArt(en.wild,'',118):monster(en.el,118,en.guardian))+'</div><div class="sname">'+(e.label?e.label:e.t==='aoe'?'ATAC A TOTHOM!':e.t==='enrage'?'S’ENFADA!':'COP FORT!')+'</div>';
  st.appendChild(ci);anim(st,'shake');setTimeout(function(){ci.remove();anim($('squad'),'shake')},RM?100:950);
}


