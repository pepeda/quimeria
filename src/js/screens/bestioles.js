'use strict';
/* ================= SCREEN: Bestioles (the collection) ================= */
function scBestioles(){
  var owned=SP_ORDER.filter(ownsSp).length,ready=allCr().filter(function(c){return evoCheck(c).ok});
  var tileOf=function(s){var own=ownsSp(s),S=SPECIES[s],ev=ready.some(function(c){return c.sp===s});
    var best=allCr().filter(function(c){return c.sp===s}).sort(function(a,z){return z.stage-a.stage||z.lvl-a.lvl})[0];
    var art=best?cArt(best,50):spArt(s,'',50,true),name=best?esc(cName(best))+(best.stage?'<span class="muted" style="font-size:11px">('+esc(S.n)+')</span>':''):'???';
    return '<button type="button" class="tap'+(own?'':' off')+'" data-act="detail" data-s="'+s+'" style="min-height:118px;position:relative'+(own?';border-color:'+ELS[S.el].c+';box-shadow:0 4px 0 '+ELS[S.el].c:'')+'" aria-label="'+(own?esc(best?cName(best):S.n):'Bestiola que encara no tens')+'">'+art+name+roleTag(S.role,true)+evoDots(best,S)+(ev?'<span class="badge" style="right:-6px;top:-6px">Evoluciona!</span>':'')+'</button>'};var tiles=spGrid(tileOf);
  return '<h1>Bestioles</h1>'+tip('bestioles','Les ombres grises són bestioles que encara no tens. Toca una bestiola per veure-la, donar-li menjar i fer-la evolucionar. Per evolucionar calen nivell i còpies (altres bestioles de la mateixa espècie).')+
    '<div class="row between"><span>Bestioles <b>'+owned+' de '+SP_ORDER.length+'</b></span><span>Formes <b>'+formsOwned()+' de '+SP_ORDER.length*5+'</b></span></div><div class="row between"><span>Combos secrets descoberts <b>'+megaCount()+' de '+MEGA.length+'</b></span></div>'+
    (function(){var n=roleCounts(allCr());return '<div class="row" style="gap:6px"><span class="small">En tens:</span>'+['Atac','Defensa','Curador'].map(function(r){return roleTag(r)+'<b>'+n[r]+'</b>'}).join(' ')+'</div>'})()+bar(owned*100/SP_ORDER.length,'#9B59E0')+
    (ready.length?'<p class="tag mid" style="font-size:14px;padding:6px 10px">'+esc(ready.map(cName).join(', '))+' ja pot evolucionar!</p>':'')+sortBar()+tiles+niuBlock();
}
/* --- collection sort: normal order, by category (role) or by element --- */
function sortBar(){var m=G.sortB||'num';return '<div class="row" style="gap:6px;flex-wrap:wrap;margin:6px 0"><span class="small">Ordena per:</span>'+[['num','Número'],['role','Categoria'],['el','Element']].map(function(x){return '<button type="button" class="btn sm'+(m===x[0]?' green':'')+'" data-act="sortB" data-k="'+x[0]+'" aria-pressed="'+(m===x[0])+'">'+x[1]+'</button>'}).join('')+'</div>'}
function spGrid(tileOf){var m=G.sortB||'num';
  if(m==='role')return ['Atac','Defensa','Curador'].map(function(r){var l=SP_ORDER.filter(function(s){return SPECIES[s].role===r});return l.length?'<h3 style="margin:10px 0 4px">'+roleTag(r)+' '+l.filter(ownsSp).length+' de '+l.length+'</h3><div class="grid4">'+l.map(tileOf).join('')+'</div>':''}).join('');
  if(m==='el')return ORDER.map(function(e){var l=SP_ORDER.filter(function(s){return SPECIES[s].el===e});return l.length?'<h3 style="margin:10px 0 4px;color:'+ELS[e].c+'">'+esc(ELS[e].n)+' · '+l.filter(ownsSp).length+' de '+l.length+'</h3><div class="grid4">'+l.map(tileOf).join('')+'</div>':''}).join('');
  return '<div class="grid4">'+SP_ORDER.map(tileOf).join('')+'</div>'}
/* --- collection: form, level and experience of the best critter of a species --- */
function evoDots(c,S){if(!c)return '';var col=ELS[S.el].c,need=xpNeed(lvl(c)),x=Math.min(c.xp||0,need);
  return '<span class="small" style="display:block;font-weight:800;margin-top:2px" aria-label="Forma '+form(c)+', nivell '+lvl(c)+'">F'+form(c)+' · niv. '+lvl(c)+'</span>'+
    '<span style="display:block;width:100%;height:5px;border-radius:3px;background:#E6E1D6;overflow:hidden"><span style="display:block;height:100%;width:'+Math.round(x*100/need)+'%;background:'+col+'"></span></span>'}
/* --- the Niu: critters that do not fit in the house wait here, without limit. They are copies for evolving --- */
function niuBlock(){var N=G.niu||[],room=G.owned.length<cap();if(!N.length)return '';
  var rows=N.map(function(c){var sel=G.niuSwap===c.uid;
    var swap=sel?'<div class="flat" style="background:#fff;gap:6px;width:100%"><b class="small">Quina bestiola de casa va al Niu?</b>'+G.owned.filter(function(h){return !busyWorld(h)}).map(function(h){
        return '<button type="button" class="btn sm light" style="text-align:left" data-act="niuSwap" data-u="'+c.uid+'" data-h="'+h.uid+'">'+esc(cName(h))+' · forma '+form(h)+' · niv. '+lvl(h)+'</button>'}).join('')+'<button type="button" class="btn sm" data-act="niuPick" data-u="'+c.uid+'">Cancel·la</button></div>':'';
    return '<div class="row" style="gap:8px;flex-wrap:wrap">'+cArt(c,40)+'<div style="flex:1;min-width:0"><b>'+esc(cName(c))+'</b><div class="muted small">Forma '+form(c)+' · nivell '+lvl(c)+'</div></div>'+
      (room?'<button type="button" class="btn sm green" data-act="niuHome" data-u="'+c.uid+'">A casa</button>':'<button type="button" class="btn sm light" data-act="niuPick" data-u="'+c.uid+'" aria-pressed="'+sel+'">Canvia</button>')+swap+'</div>'}).join('');
  return '<div class="flat" style="gap:8px;background:#F3E7D3;margin-top:12px"><h2>El Niu ('+N.length+')</h2>'+
    '<p class="small">Al Niu esperen les bestioles que no caben a casa. No hi ha límit. No poden anar d’aventura, però serveixen com a <b>còpies</b> per evolucionar. Quan hi hagi lloc a casa, toca <b>A casa</b>. Si la casa és plena, toca <b>Canvia</b> i tria quina bestiola de casa va al Niu.</p>'+
    (rows||'<p class="muted small">Ara el Niu és buit.</p>')+'</div>'}
