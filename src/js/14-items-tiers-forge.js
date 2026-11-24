'use strict';
/* ================= ITEM TIERS AND ITEM TEXT ================= */
var TIER_N=['Normal','Refinada','Màgica','Èpica','Superèpica'];
var TIER_M=[1,1.6,2.4,3.4,4.8];
var TIER_C=['#7D8597','#2E8BE6','#9B59E0','#E0572B','#C98A00'];
var FORGE_COST=[30,60,120,240];
function tierOf(id){return Math.min(4,parseInt(String(id).split('#')[1],10)||0)}
function baseOf(id){return String(id).split('#')[0]}
function IT(id){if(id==null)return null;var b=ITEMS[baseOf(id)];if(!b)return null;var t=tierOf(id),m=TIER_M[t];
  return {aff:affOf(id),set:b.set,n:b.n+(t&&!b.set?' '+'★'.repeat(t):''),slot:b.slot,atk:b.atk*m,def:b.def*m,hp:b.hp*m,rar:(b.set?'Set de llegenda · ':b.relic?'Tresor · ':'')+TIER_N[t],relic:b.relic,tier:t,base:baseOf(id)}}
/* an item's bonuses as text, with its powers and its legend set */
function itemStats(it){var s=[it.atk?'Atac +'+Math.round(it.atk*3)+'%':'',it.def?'Defensa +'+Math.round(it.def*3)+'%':'',it.hp?'Vida +'+Math.round(it.hp*2)+'%':''].filter(Boolean).join(' · ');if(it.aff&&it.aff.length)s+=' · Poders: '+it.aff.map(function(a){return AFFIX[a].n}).join(', ');if(it.set)s+=' · '+SETS[it.set].n;return s}
function itemGroups(){var g={},order=[];G.items.forEach(function(id){if(!IT(id))return;if(!g[id]){g[id]=0;order.push(id)}g[id]++});
  return order.sort(function(a,b){var A=IT(a),B=IT(b);return (A.slot>B.slot?1:A.slot<B.slot?-1:0)||(A.base>B.base?1:A.base<B.base?-1:0)||tierOf(b)-tierOf(a)}).map(function(id){return {id:id,n:g[id]}})}
/* who is acting: green for your team, red for the enemy; big enemy moves get their own cut-in */
var US_EV=['hit','heal','regen','special','combo','dot','stunned','foeDown'],THEM_EV=['ehit','aoe','warn','enrage','wave','teamDown','boss','minion'];


