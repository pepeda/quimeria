'use strict';
/* ================= END-OF-RUN CHEST ================= */
/* After a won expedition there is a chest (G.chest). It starts Normal. Each tap tries to raise it one tier
   (chances in BAL.CHEST_UP); when a try fails, or it is already Superèpic, it opens and gives its contents (BAL.CHEST). */
var CHEST_N=['Normal','Refinat','Màgic','Èpic','Superèpic'];
function rndIn(a){return a[0]+rnd(a[1]-a[0]+1)}
/* an item of tier t (0-4) with t powers, like a forged one */
function chestItem(t){var a=[];for(var i=0;i<t;i++)a.push(pickOne(AFF_KEYS));return pickOne(COMMON)+(t?'#'+t+'~'+a.join('.'):'')}
/* one item tier from weights [[tier, weight], ...] */
function rollTier(W){var x=Math.random()*W.reduce(function(a,w){return a+w[1]},0);for(var i=0;i<W.length;i++){x-=W[i][1];if(x<0)return W[i][0]}return W[W.length-1][0]}
/* what a chest of tier t holds, for world w: {coins, food:{element:n}, critters:[species], items:[ids]} */
function chestContents(t,w){var T=BAL.CHEST[t],out={coins:rndIn(T.coins),food:{},critters:[],items:[]},n,i;
  if(Math.random()<T.food.p){n=rndIn(T.food.n);for(i=0;i<n;i++){var el=Math.random()<BAL.CHEST_FOOD_HOME?w:pickOne(ORDER);out.food[el]=(out.food[el]||0)+1}}
  if(Math.random()<T.critters.p){n=rndIn(T.critters.n);var sps=speciesOf(w);for(i=0;i<n;i++)out.critters.push(pickOne(sps))}
  if(Math.random()<T.items.p){n=rndIn(T.items.n);
    for(i=0;i<n;i++){var q=rollTier(T.itemTiers);
      if(q==='legend'){var miss=missingPieces(w);if(miss.length){out.items.push(pickOne(miss));continue}q=4}
      out.items.push(chestItem(q))}}
  return out}
/* one tap on the chest */
function chestTap(){var C=G.chest;if(!C||C.open)return;C.taps++;
  if(C.tier<4&&Math.random()<BAL.CHEST_UP[C.tier]){C.tier++;C.anim='up';snd(C.tier>=3?'combo':'tap');buzz(C.tier>=3?[30,30,60]:20);return}
  openChest();C.anim='open';snd(C.tier>=3?'big':C.tier>=1?'win':'forge');if(C.tier>=3)buzz([60,40,120])}
/* opens the chest: puts its contents in the game and keeps a list to show */
function openChest(){var C=G.chest;if(!C||C.open)return;var w=C.world||'foc',x=chestContents(C.tier,w),got=[];
  G.coins+=x.coins;got.push('+'+x.coins+' monedes');
  var fl=Object.keys(x.food);fl.forEach(function(k){G.food[k]=(G.food[k]||0)+x.food[k]});
  if(fl.length)got.push('Menjar: '+fl.map(function(k){return x.food[k]+' × '+FOOD[k]}).join(', '));
  if(x.critters.length){var nest=0;x.critters.forEach(function(s){if(!addCritter(mk(s)))nest++});
    got.push((x.critters.length>1?'Bestioles: ':'Bestiola: ')+x.critters.map(function(s){return SPECIES[s].n}).join(', ')+(nest?' ('+nest+' al Niu)':''))}
  if(x.items.length){x.items.forEach(function(id){G.items.push(id)});got.push((x.items.length>1?'Objectes: ':'Objecte: ')+x.items.map(function(id){var it=IT(id);return it?it.n+' ('+TIER_N[it.tier]+')':id}).join(', '))}
  C.open=true;C.got=got;C.contents=x}
/* the chest drawing in the colour of its tier; open shows the lid up and a glow */
function chestSvg(t,open){var c=TIER_C[t],gl=t>=3?'#FFE27A':'#fff';
  return '<svg width="140" height="120" viewBox="0 0 140 120" aria-hidden="true">'+(open?'<ellipse cx="70" cy="62" rx="62" ry="40" fill="'+gl+'" opacity=".55"/>':'')+
    '<rect x="22" y="56" width="96" height="52" rx="8" fill="'+c+'" stroke="#1E1B2E" stroke-width="4"/><rect x="22" y="74" width="96" height="8" fill="#1E1B2E" opacity=".25"/>'+
    (open?'<path d="M22 44 Q70 4 118 44 L118 52 L22 52 Z" fill="'+c+'" stroke="#1E1B2E" stroke-width="4" transform="rotate(-18 22 52)"/><path d="M40 58 L48 40 M70 56 L70 34 M100 58 L92 40" stroke="'+gl+'" stroke-width="4" stroke-linecap="round"/>'
      :'<path d="M22 56 Q70 14 118 56 Z" fill="'+c+'" stroke="#1E1B2E" stroke-width="4"/><rect x="62" y="60" width="16" height="18" rx="3" fill="#F7C948" stroke="#1E1B2E" stroke-width="3"/>')+
    (t>=2?'<path d="M14 24 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 Z M124 14 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" fill="#FFE27A"/>':'')+'</svg>'}
/* the chest panel on the summary screen */
function chestBlock(){var C=G.chest;if(!C)return '';var a=C.anim;C.anim=null;
  if(!C.open)return '<div class="flat chestbox" style="align-items:center;gap:6px;border:4px solid '+TIER_C[C.tier]+'"><h2>Cofre '+CHEST_N[C.tier]+'</h2>'+
    '<button type="button" class="chest'+(a==='up'?' up':'')+'" data-act="chestTap" aria-label="Toca el cofre">'+chestSvg(C.tier,false)+'</button>'+
    '<p class="small" style="text-align:center">Toca el cofre! Cada toc el pot fer pujar de categoria: Normal → Refinat → Màgic → Èpic → Superèpic. Quan no puja, s’obre.</p></div>';
  return '<div class="flat chestbox" style="align-items:center;gap:6px;border:4px solid '+TIER_C[C.tier]+'"><h2>Cofre '+CHEST_N[C.tier]+' obert!</h2><div class="chest'+(a==='open'?' opened':'')+'">'+chestSvg(C.tier,true)+'</div>'+
    '<ul class="chestgot">'+(C.got||[]).map(function(g){return '<li>'+esc(g)+'</li>'}).join('')+'</ul></div>'}
