'use strict';
/* ================= THE QUIMERA: the legendary critter of all five elements =================
   Idea of Alba: when you finish every world, a legendary critter wakes up: a chimera of all the elements.
   - It wakes up when the zone 3 guardian of all five worlds is beaten (the game already calls a world
     "finished" then). It comes once, at forma 3 and level 15, and cannot evolve further.
   - In battle it always hits with the element that beats the monster (x1.5), no element hurts it extra,
     and once per battle it does "Prisma dels Cinc": five hits, one of each element.
   - It is not one of the 40 species of the collection (it does not appear in the wild); Bestioles shows
     it in its own box, as a grey shape until it wakes up. */
TALENT.cincEls={n:'Cinc elements',d:'Ataca sempre amb l’element que guanya el monstre, i cap element li fa mal de més.'};
SPECIES.quimera={n:'Quimera',el:'psiquic',all:true,role:'Atac',price:0,legend:true,talent:'cincEls',
  evos:[E('Quimera Jove'),E('Quimera dels Cinc'),E('Quimera dels Cinc')]};
KIND_DESC.prism='Cinc cops, un de cada element. Només una vegada per batalla.';
SPECIAL.quimera='Prisma dels Cinc';
ABIL.quimera=[['Urpa de cinc colors',2,'hit',1.4],['Escut dels cinc elements',4,'shield',1],['Prisma dels Cinc',4,'prism',0.8]];
var QUIMERA_LVL=15;
/* all five worlds finished (zone 3 guardian beaten) */
function quimeraReady(){return ORDER.every(function(w){return !!G.done[w+':z2']})}
/* give it once; returns true when it woke up now */
function quimeraWake(){
  if(G.quimera||!quimeraReady())return false;
  var c=mk('quimera');c.stage=2;c.evo=1;c.lvl=QUIMERA_LVL;c.xp=0;
  if(G.owned.length<cap())G.owned.push(c);else{G.niu=G.niu||[];G.niu.push(c)}
  G.quimera=1;return true;
}
/* the drawing: leaf wings (Planta), water body (Aigua), fire mane (Foc), lightning tail (Llamp),
   purple eyes and gem (Psíquic), and a ring of the five colours */
function quimeraArt(px,locked){
  var spin=RM||locked?'':'<animateTransform attributeName="transform" type="rotate" from="0 32 34" to="360 32 34" dur="9s" repeatCount="indefinite"/>';
  var ring=locked?'':'<g opacity=".55">'+spin+['#F26B3A','#2E8BE6','#3DAA5C','#F2B90F','#9B59E0'].map(function(c,i){var a=i*72*Math.PI/180,b=(i*72+60)*Math.PI/180;
    return '<path d="M'+(32+29*Math.cos(a)).toFixed(1)+' '+(34+29*Math.sin(a)).toFixed(1)+' A29 29 0 0 1 '+(32+29*Math.cos(b)).toFixed(1)+' '+(34+29*Math.sin(b)).toFixed(1)+'" stroke="'+c+'" stroke-width="3.2" fill="none" stroke-linecap="round"/>'}).join('')+'</g>';
  var o=ring+'<g stroke="#2A1F3D" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">'+
    /* wings */
    '<path d="M24 34 C10 22 4 26 6 36 C9 33 13 33 16 36 C12 38 12 43 16 44 C19 41 22 39 24 38 Z" fill="#3DAA5C"/>'+
    '<path d="M40 34 C54 22 60 26 58 36 C55 33 51 33 48 36 C52 38 52 43 48 44 C45 41 42 39 40 38 Z" fill="#3DAA5C"/>'+
    '<path d="M9 33 L20 37 M55 33 L44 37" stroke="#1F6E37" stroke-width="1.2" fill="none"/>'+
    /* tail */
    '<path d="M42 50 L50 46 L47 52 L56 49 L49 57 L51 52 L43 54 Z" fill="#F2B90F"/>'+
    /* body */
    '<ellipse cx="32" cy="47" rx="13" ry="10.5" fill="#2E8BE6"/><ellipse cx="32" cy="50" rx="7.5" ry="5.5" fill="#CFE6FF" stroke="none"/>'+
    '<path d="M24 55 L23 60 M29 57 L29 61 M35 57 L35 61 M40 55 L41 60" stroke-width="2.6" fill="none"/>'+
    /* mane */
    '<path d="M32 9 L36 15 L43 12 L42 19 L49 20 L45 26 L51 30 L44 33 L46 39 L39 37 L32 42 L25 37 L18 39 L20 33 L13 30 L19 26 L15 20 L22 19 L21 12 L28 15 Z" fill="#F26B3A"/>'+
    /* face */
    '<circle cx="32" cy="27" r="9.5" fill="#FFD3B8"/>'+
    '<ellipse cx="28.3" cy="26" rx="2.3" ry="2.9" fill="#9B59E0" stroke="none"/><ellipse cx="35.7" cy="26" rx="2.3" ry="2.9" fill="#9B59E0" stroke="none"/>'+
    '<circle cx="27.6" cy="25" r=".9" fill="#fff" stroke="none"/><circle cx="35" cy="25" r=".9" fill="#fff" stroke="none"/>'+
    '<path d="M29.5 31.5 Q32 33.5 34.5 31.5" fill="none" stroke-width="1.4"/>'+
    /* gem */
    '<path d="M32 13.5 L34.5 17 L32 20.5 L29.5 17 Z" fill="#C9A6F2"/>'+
    '</g>';
  return '<svg class="cr" width="'+px+'" height="'+px+'" viewBox="0 0 64 64" aria-hidden="true"'+(locked?' style="filter:brightness(0) opacity(.22)"':'')+'>'+o+'</svg>';
}
/* its box on the Bestioles screen */
function quimeraTile(){
  var q=allCr().filter(function(c){return c.sp==='quimera'})[0];
  if(q)return '<button type="button" class="tap quimera-tile" data-act="detail" data-s="quimera">'+quimeraArt(70,false)+'<span><b>'+esc(cName(q))+'</b><span class="small" style="display:block">Llegendària · de tots els elements</span></span></button>';
  var n=ORDER.filter(function(w){return G.done[w+':z2']}).length;
  return '<div class="flat quimera-tile off">'+quimeraArt(60,true)+'<span><b>???</b><span class="small" style="display:block">Una bestiola llegendària dorm. Acaba la zona 3 dels cinc mons per despertar-la ('+n+' de 5).</span></span></div>';
}
/* the moment it wakes up: three comic panels, then the summary shows it */
function quimeraComic(done){
  var bg='conic-gradient(from 0deg,#F26B3A,#F2B90F,#3DAA5C,#2E8BE6,#9B59E0,#F26B3A)';
  comicPage([
    {wide:1,at:0,bg:'#111',html:'<div class="mbox">Els cinc mons s’han obert…</div><div style="display:flex;gap:8px">'+ORDER.map(function(e){return elIcon(e,40,ELS[e].c)}).join('')+'</div>'},
    {wide:1,at:900,bg:bg,html:'<div style="line-height:0">'+quimeraArt(190,false)+'</div>'},
    {wide:1,at:1800,bg:'#fff',html:'<div class="mname">LA QUIMERA S’HA DESPERTAT!</div><div class="mdesc">La bestiola de tots els elements vol venir amb tu.</div>'}
  ],RM?900:5200,done||function(){});
}
