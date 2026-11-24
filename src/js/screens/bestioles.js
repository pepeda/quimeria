'use strict';
/* ================= SCREEN: Bestioles (the collection) ================= */
function scBestioles(){
  var owned=SP_ORDER.filter(ownsSp).length,ready=G.owned.filter(function(c){return c.stage<2&&c.mill>=5});
  var tileOf=function(s){var own=ownsSp(s),S=SPECIES[s],ev=G.owned.some(function(c){return c.sp===s&&c.stage<2&&c.mill>=5});
    var best=G.owned.filter(function(c){return c.sp===s}).sort(function(a,z){return z.stage-a.stage})[0];
    var art=best?cArt(best,50):spArt(s,'',50,true),name=best?esc(cName(best))+(best.stage?'<span class="muted" style="font-size:11px">('+esc(S.n)+')</span>':''):'???';
    return '<button type="button" class="tap'+(own?'':' off')+'" data-act="detail" data-s="'+s+'" style="min-height:118px;position:relative'+(own?';border-color:'+ELS[S.el].c+';box-shadow:0 4px 0 '+ELS[S.el].c:'')+'" aria-label="'+(own?esc(best?cName(best):S.n):'Bestiola que encara no tens')+'">'+art+name+roleTag(S.role,true)+evoDots(best,S)+(ev?'<span class="badge" style="right:-6px;top:-6px">Evoluciona!</span>':'')+'</button>'};var tiles=spGrid(tileOf);
  return '<h1>Bestioles</h1>'+tip('bestioles','Les ombres grises són bestioles que encara no tens. Toca una bestiola per veure-la, donar-li menjar i fer-la evolucionar.')+
    '<div class="row between"><span>Bestioles <b>'+owned+' de '+SP_ORDER.length+'</b></span><span>Evolucions <b>'+formsOwned()+' de '+SP_ORDER.length*3+'</b></span></div><div class="row between"><span>Combos secrets descoberts <b>'+megaCount()+' de '+MEGA.length+'</b></span></div>'+
    (function(){var n=roleCounts(G.owned);return '<div class="row" style="gap:6px"><span class="small">En tens:</span>'+['Atac','Defensa','Curador'].map(function(r){return roleTag(r)+'<b>'+n[r]+'</b>'}).join(' ')+'</div>'})()+bar(owned*100/SP_ORDER.length,'#9B59E0')+
    (ready.length?'<p class="tag mid" style="font-size:14px;padding:6px 10px">'+esc(ready.map(cName).join(', '))+' ja pot evolucionar!</p>':'')+sortBar()+tiles;
}
/* --- collection sort: normal order, by category (role) or by element --- */
function sortBar(){var m=G.sortB||'num';return '<div class="row" style="gap:6px;flex-wrap:wrap;margin:6px 0"><span class="small">Ordena per:</span>'+[['num','Número'],['role','Categoria'],['el','Element']].map(function(x){return '<button type="button" class="btn sm'+(m===x[0]?' green':'')+'" data-act="sortB" data-k="'+x[0]+'" aria-pressed="'+(m===x[0])+'">'+x[1]+'</button>'}).join('')+'</div>'}
function spGrid(tileOf){var m=G.sortB||'num';
  if(m==='role')return ['Atac','Defensa','Curador'].map(function(r){var l=SP_ORDER.filter(function(s){return SPECIES[s].role===r});return l.length?'<h3 style="margin:10px 0 4px">'+roleTag(r)+' '+l.filter(ownsSp).length+' de '+l.length+'</h3><div class="grid4">'+l.map(tileOf).join('')+'</div>':''}).join('');
  if(m==='el')return ORDER.map(function(e){var l=SP_ORDER.filter(function(s){return SPECIES[s].el===e});return l.length?'<h3 style="margin:10px 0 4px;color:'+ELS[e].c+'">'+esc(ELS[e].n)+' · '+l.filter(ownsSp).length+' de '+l.length+'</h3><div class="grid4">'+l.map(tileOf).join('')+'</div>':''}).join('');
  return '<div class="grid4">'+SP_ORDER.map(tileOf).join('')+'</div>'}
/* --- collection: how close each critter is to evolving (5 dots = can evolve) --- */
function evoDots(c,S){if(!c)return '';var col=ELS[S.el].c;
  if(c.stage>=2)return '<span class="small" style="display:block;font-weight:800;color:'+col+'" aria-label="Forma final">Forma final ✓</span>';
  var n=Math.min(5,c.mill||0),d='';for(var i=0;i<5;i++)d+='<span style="display:inline-block;width:8px;height:8px;margin:0 1.5px;border-radius:50%;border:1.5px solid '+col+';background:'+(i<n?col:'transparent')+'"></span>';
  return '<span style="display:block;line-height:1;margin-top:3px" aria-label="'+n+' de 5 per evolucionar a la forma '+(c.stage+2)+'">'+d+'<span class="small" style="margin-left:4px;font-weight:800">'+n+'/5</span></span>'}
