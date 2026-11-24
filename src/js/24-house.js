'use strict';
/* ================= HOUSE: builds grouped by area, their effects, the house drawing ================= */
/* Areas for the build list. Old items get an area too. */
var H14_AREAS=[['dorm','Dormitori'],['sala','Sala'],['taller','Taller'],['elem','Sales d’element'],['ext','Exterior']];
var H14_OLD={habitacio:'dorm',mobles:'sala',jardi:'ext',piscina:'ext',spa:'ext',tennis:'ext'};
BUILD.forEach(function(x){if(!x.area)x.area=H14_OLD[x.k]||'ext'});
/* element rooms: one per world, opened when the last zone (guardian) of that world is done */
var H14_EL={foc:'salaFoc',llamp:'salaLlamp',aigua:'salaAigua',planta:'salaPlanta',psiquic:'salaPsiquic'};
BUILD.push(
  {k:'llit',n:'Llit-cabana',what:'A casa descansen +1 per expedició',price:220,max:1,cap:0,area:'dorm'},
  {k:'neo',n:'Rètol de neó',what:'Decoració que brilla',price:120,max:1,cap:0,area:'dorm'},
  {k:'posters',n:'Pòsters de guardians',what:'Un pòster per cada món acabat',price:60,max:1,cap:0,area:'dorm'},
  {k:'hamaca',n:'Hamaca',what:'+1 plaça',price:180,max:1,cap:1,area:'dorm'},
  {k:'consola',n:'Consola i pantalla',what:'Decoració: pantalla gran',price:300,max:1,cap:0,area:'sala'},
  {k:'pufs',n:'Puf de colors',what:'Decoració (fins a 3)',price:60,max:3,cap:0,area:'sala'},
  {k:'pingpong',n:'Taula de ping-pong',what:'Decoració per al racó de jocs',price:250,max:1,cap:0,area:'sala'},
  {k:'trofeus',n:'Estanteria de trofeus',what:'Trofeus dels mons i tresors rars',price:200,max:1,cap:0,area:'sala'},
  {k:'peixera',n:'Peixera',what:'Les d’Aigua descansen +1 per expedició',price:150,max:1,cap:0,area:'sala'},
  {k:'cuina',n:'Cuina de bestioles',what:'+1 menjar del món on acabes un camí',price:400,max:1,cap:0,area:'taller'},
  {k:'forja',n:'Taller de forja',what:'Forjar costa un 20% menys',price:500,max:1,cap:0,area:'taller'},
  {k:'lab',n:'Laboratori',what:'Una de casa guanya +1 estrella per expedició',price:600,max:1,cap:0,area:'taller'},
  {k:'salaFoc',n:'Forja de lava',what:'Les de Foc descansen +1 per expedició',price:450,max:1,cap:0,area:'elem',el:'foc'},
  {k:'salaLlamp',n:'Sala de bobines',what:'+10% de monedes per expedició',price:450,max:1,cap:0,area:'elem',el:'llamp'},
  {k:'salaAigua',n:'Aquari gegant',what:'+2 places',price:450,max:1,cap:2,area:'elem',el:'aigua'},
  {k:'salaPlanta',n:'Hivernacle',what:'+1 Fulla tendra per camí completat',price:450,max:1,cap:0,area:'elem',el:'planta'},
  {k:'salaPsiquic',n:'Observatori',what:'+1 Bolet somiador per camí completat',price:600,max:1,cap:0,area:'elem',el:'psiquic'},
  {k:'skate',n:'Rampa de skate',what:'Decoració per fer salts',price:300,max:1,cap:0,area:'ext'},
  {k:'arbre',n:'Casa a l’arbre',what:'+2 places',price:500,max:1,cap:2,area:'ext'},
  {k:'foguera',n:'Foguera',what:'De nit, a casa descansen el doble',price:150,max:1,cap:0,area:'ext'},
  {k:'hort',n:'Hort de baies',what:'+1 menjar a l’atzar per camí completat',price:250,max:1,cap:0,area:'ext'},
  {k:'antena',n:'Antena de rastreig',what:'Decoració: bandera d’un color cada dia',price:350,max:1,cap:0,area:'ext'},
  {k:'portal',n:'Portal entre mons',what:'+25 monedes per camí completat',price:900,max:1,cap:0,area:'ext'}
);
function h14Item(k){return BUILD.filter(function(x){return x.k===k})[0]}
function h14WorldDone(w){return !!G.done[w+':z2']}
function h14Open(x){return !x.el||h14WorldDone(x.el)}

/* ---------- effects ---------- */
/* forge discount: FORGE_COST is read everywhere, so keep it in step with the build */
var H14_FC=FORGE_COST.slice();
function h14Forge(){for(var i=0;i<H14_FC.length;i++)FORGE_COST[i]=G.built.forja?Math.round(H14_FC[i]*0.8):H14_FC[i]}

/* after each expedition: extra rest, extra coins and food from the house (team: who went, w: the world, c0: coins before) */
function houseAfterRun(ok,team,w,c0){
  var s=G.summary||{},B=G.built,got=G.coins-c0,notes=[];
  var home=G.owned.filter(function(c){return team.indexOf(c.uid)<0&&!busyWorld(c)});
  function rest1(c){if(c.rest>0){c.rest=Math.max(0,c.rest-1);if(!c.rest)c.fat=0}else c.fat=Math.max(0,c.fat-1)}
  var rested=0;
  home.forEach(function(c){var e=sp(c).el,n=(B.llit?1:0)+(B.peixera&&e==='aigua'?1:0)+(B.salaFoc&&e==='foc'?1:0);if(n&&(c.rest>0||c.fat>0))rested++;for(var i=0;i<n;i++)rest1(c)});
  if(rested)notes.push(rested+(rested>1?' bestioles han':' bestiola ha')+' descansat més gràcies a la casa.');
  function coin(n,why){G.coins+=n;s.coins=(s.coins||0)+n;notes.push(why+': +'+n+' monedes.')}
  if(B.salaLlamp&&got>0){var x=Math.max(1,Math.round(got*0.1));coin(x,'Sala de bobines')}
  if(ok){
    if(B.portal)coin(25,'Portal entre mons');
    var food=function(el,why){G.food[el]=(G.food[el]||0)+1;notes.push(why+': +1 '+FOOD[el]+'.')};
    if(B.cuina&&FOOD[w])food(w,'Cuina');
    if(B.salaPlanta)food('planta','Hivernacle');
    if(B.salaPsiquic)food('psiquic','Observatori');
    if(B.hort)food(pickOne(ORDER),'Hort de baies');
  }
  if(B.lab){var cand=home.filter(function(c){return c.mill<5&&cName(c)!==s.tennis});if(cand.length){var t=pickOne(cand);t.mill++;notes.push(cName(t)+' ha fet experiments al laboratori: +1 estrella de força.')}}
  s.house=notes;
}


/* locked element rooms cannot be bought; area headings fold */
function h14Folded(a){var f=G.hFold&&G.hFold[a];if(f!==undefined)return !!f;
  return BUILD.filter(function(x){return x.area===a}).every(function(x){return (G.built[x.k]||0)>=x.max})}

/* ---------- build list, grouped by area ---------- */
(function(){if(!document.head||!document.head.appendChild)return;var st=document.createElement('style');st.textContent=
  '.h14head{display:flex;align-items:center;gap:8px;width:100%;min-height:44px;margin-top:4px;padding:8px 4px 6px;background:none;border:0;border-bottom:2px solid #E3E0EA;font-family:var(--display);font-weight:800;font-size:17px;color:var(--ink);text-align:left;cursor:pointer}'+
  '.h14head>span:first-child{flex:1}.h14head .h14n{font-family:inherit;font-size:13px;font-weight:700;color:#5E5A72}'+
  '.h14builds .grid3{margin-top:8px}.h14builds{margin-top:-8px}.h14builds .tap{min-height:92px;justify-content:space-between}.h14builds .tap .muted{line-height:1.2;font-size:12.5px}'+
  '.h14builds .tap.h14lock{background:#ECE9F2;border-style:dashed}';
  document.head.appendChild(st)})();
function h14Btn(x){
  var n=G.built[x.k]||0,full=n>=x.max,lock=!h14Open(x),poor=G.coins<x.price,
    stripe=x.el?' border-top:6px solid '+ELS[x.el].c+';':'';
  var tag=full?'<span class="tag good">Fet</span>':lock?'<span class="tag">Tancada</span>':'<span class="tag mid">'+x.price+' monedes</span>';
  var what=lock?'Cal acabar: '+ELS[x.el].mon:x.what;
  return '<button type="button" class="tap'+(lock?' h14lock':'')+'" data-act="build" data-k="'+x.k+'"'+(full||poor||lock?' disabled':'')+' style="'+stripe+'"'+(lock?' aria-label="'+esc(x.n+': tancada. '+what)+'"':'')+'>'+
    '<span style="font-size:14px;text-align:center;line-height:1.15">'+esc(x.n)+(x.max>1&&n?' ('+n+')':'')+'</span><span class="muted small" style="text-align:center;font-weight:700">'+esc(what)+'</span>'+tag+'</button>';
}
function h14Builds(){
  return H14_AREAS.map(function(A){var items=BUILD.filter(function(x){return x.area===A[0]});if(!items.length)return '';
    var done=items.filter(function(x){return (G.built[x.k]||0)>=x.max}).length,fold=h14Folded(A[0]);
    return '<button type="button" class="h14head" data-act="hfold" data-k="'+A[0]+'" aria-expanded="'+(!fold)+'"><span>'+esc(A[1])+'</span><span class="h14n">'+done+' de '+items.length+' fets</span><span aria-hidden="true">'+(fold?'▸':'▾')+'</span></button>'+
      (fold?'':'<div class="grid3">'+items.map(h14Btn).join('')+'</div>')}).join('');
}

/* ---------- house drawing ---------- */
/* the drawing keeps the 366-wide coordinates; it grows downwards: a second garden strip and an underground floor */
function h14Lay(b){var ext=!!(b.skate||b.foguera||b.hort||b.portal),el=ORDER.some(function(w){return b[H14_EL[w]]}),g1=ext?346:270;
  return {ext:ext,el:el,g1:g1,H:el?g1+88:g1}}
function h14RoomX(w){return 6+ORDER.indexOf(w)*72}
/* places the critters that are at home inside the rooms of the house drawing */
function houseCrew(home){
  var b=G.built,L=h14Lay(b),ham=b.hamaca;
  var spots=[[ham?52:62,139],[ham?88:102,139],[158,139],[198,139],[62,191],[102,191],[158,191],[198,191]];
  for(var k=0;k<(b.habitacio||0);k++){var y=196-40*k;spots.push([248,y-2],[278,y-2])}
  if(b.jardi)spots.push([318,196],[346,196],[332,182]);
  if(b.piscina)spots.push([262,244],[306,244]);
  if(ham)spots.push([110,126]);
  if(b.arbre)spots.push([318,96],[344,96]);
  if(b.salaAigua){var ax=h14RoomX('aigua');spots.push([ax+18,L.g1+82],[ax+48,L.g1+82])}
  return home.slice(0,spots.length).map(function(c,i){var s=spots[i];
    return '<div class="in" style="left:'+(s[0]/366*100)+'%;top:'+(s[1]/L.H*100)+'%">'+(c.rest>0?'<div style="color:#34405A">z z</div>':'')+cArt(c,30)+'</div>'}).join('');
}
function h14Txt(x,y,t,fill,size){return '<text x="'+x+'" y="'+y+'" font-size="'+(size||9)+'" font-weight="800" font-family="Nunito,sans-serif" fill="'+(fill||'#1E1B2E')+'">'+t+'</text>'}
function h14Anim(attr,vals,dur){return RM?'':'<animate attributeName="'+attr+'" values="'+vals+'" dur="'+dur+'" repeatCount="indefinite"/>'}
/* the house drawing grows with every purchase: things behind the house, the first rooms, then the new rooms, garden and underground floor */
function houseSvg(b,home){
  var o=houseRooms(b),L=h14Lay(b),back='',f='',i;
  /* --- behind the house: antenna, tree house --- */
  if(b.antena){var dw=ORDER[Math.floor(Date.now()/86400000)%ORDER.length];
    back+='<g stroke="#5E6678" stroke-width="2" fill="none"><path d="M5 196 L12 62 L19 196"/><path d="M7 160 H17 M8 128 H16 M9 98 H15 M7 160 L16 128 M8 128 L15 98"/></g><path d="M12 62 V54" stroke="#34405A" stroke-width="2"/>'+
      '<path d="M12 56 L1 59 L12 63 Z" fill="'+ELS[dw].c+'" stroke="#1E1B2E" stroke-width="1"/><circle cx="12" cy="53" r="2.6" fill="#E2574C">'+h14Anim('opacity','1;.2;1','1.4s')+'</circle>'}
  if(b.arbre){
    back+='<path d="M326 198 C328 160 326 130 328 98 H338 C338 130 336 160 340 198 Z" fill="#6B3E26"/><path d="M330 140 L312 126 M336 120 L354 108" stroke="#6B3E26" stroke-width="4" stroke-linecap="round"/>'+
      '<circle cx="312" cy="84" r="18" fill="#3B7D32"/><circle cx="356" cy="80" r="16" fill="#4E9A43"/><circle cx="334" cy="60" r="16" fill="#3B7D32"/>'+
      '<rect x="306" y="64" width="50" height="32" fill="#C98A5A" stroke="#8A5A3C" stroke-width="2"/><path d="M300 66 L331 44 L362 66 Z" fill="#3DAA5C" stroke="#2C7A42" stroke-width="2.5" stroke-linejoin="round"/>'+
      '<rect x="324" y="70" width="14" height="12" fill="#BFE3F7" stroke="#8A5A3C" stroke-width="1.5"/><rect x="298" y="96" width="66" height="5" rx="2" fill="#8A5A3C"/>'+
      '<g stroke="#B5793E" stroke-width="1.6"><path d="M302 101 V182 M310 101 V182"/><path d="M302 112 H310 M302 124 H310 M302 136 H310 M302 148 H310 M302 160 H310 M302 172 H310"/></g>'}
  /* --- attic workshop (kitchen, forge, lab) inside the roof --- */
  if(b.cuina||b.forja||b.lab){
    f+='<path d="M90 84 V50 H170 V84 Z" fill="#FFE9C7" stroke="#A23A31" stroke-width="2"/>'+h14Txt(94,58,'Taller','#8A5A3C',7.5);
    if(b.cuina)f+='<rect x="94" y="70" width="22" height="14" rx="1.5" fill="#9AA3B5" stroke="#5E6678" stroke-width="1"/><circle cx="99" cy="77" r="2" fill="#34405A"/><circle cx="111" cy="77" r="2" fill="#34405A"/><rect x="98" y="63" width="14" height="7" rx="2" fill="#34405A"/><path d="M101 61 q-2 -3 0 -6 M106 61 q2 -3 0 -6" stroke="#9AA3B5" stroke-width="1.3" fill="none">'+h14Anim('opacity','1;.3;1','1.6s')+'</path>';
    if(b.forja)f+='<path d="M121 72 H143 L139 76 H135 V80 H139 V84 H125 V80 H129 V76 H124 Z" fill="#4A4F63"/><rect x="127" y="69" width="10" height="3" rx="1" fill="#F7A23A"/><circle cx="141" cy="66" r="1.2" fill="#F7C948">'+h14Anim('opacity','1;0;1','.9s')+'</circle><circle cx="124" cy="64" r="1.2" fill="#F26B3A">'+h14Anim('opacity','0;1;0','.9s')+'</circle><path d="M138 62 L132 68" stroke="#6B3E26" stroke-width="2" stroke-linecap="round"/><rect x="136" y="59" width="6" height="4" fill="#5E6678"/>';
    if(b.lab)f+='<path d="M153 60 h6 v6 l6 16 h-18 l6 -16 z" fill="#E8F7F2" stroke="#34405A" stroke-width="1.3" stroke-linejoin="round"/><path d="M149 78 l2 -5 h10 l2 5 z" fill="#7CE0C0"/><circle cx="155" cy="74" r="1.4" fill="#fff">'+h14Anim('cy','76;66;76','2s')+'</circle><rect x="160" y="54" width="8" height="10" rx="1" fill="#34405A"/><path d="M161 60 l2 -2 l2 3 l2 -3" stroke="#7CE0C0" stroke-width="1" fill="none"/>';
  }
  /* --- dormitori: canopy bed, posters, hammock; neon sign on the bathroom wall --- */
  if(b.llit){f+='<rect x="40" y="128" width="32" height="11" rx="2" fill="#fff" stroke="#9AA3B5"/><rect x="42" y="125" width="10" height="5" rx="2" fill="#BFE3F7"/><rect x="52" y="131" width="20" height="8" rx="2" fill="#9B59E0"/>'+
      '<path d="M38 128 L56 107 L74 128" fill="#F7A8C8" fill-opacity=".55" stroke="#D45C8C" stroke-width="1.5" stroke-linejoin="round"/><path d="M56 107 Q50 120 44 128 M56 107 Q62 120 68 128" stroke="#D45C8C" stroke-width="1" fill="none"/>'+
      [[44,121],[50,114],[56,109],[62,114],[68,121]].map(function(p,j){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="1.6" fill="#F7C948">'+h14Anim('opacity',j%2?'1;.3;1':'.3;1;.3','1.2s')+'</circle>'}).join('')}
  if(b.posters){var nd=ORDER.filter(h14WorldDone);var pl=nd.length?nd:[null];
    pl.forEach(function(w,j){var x=90+j*7;f+='<rect x="'+x+'" y="96" width="6" height="9" fill="'+(w?ELS[w].c:'#D9D4E4')+'" stroke="#fff" stroke-width="1"/>'+(w?'<circle cx="'+(x+3)+'" cy="99.5" r="1.6" fill="#1E1B2E"/><path d="M'+(x+1)+' 104 Q'+(x+3)+' 101 '+(x+5)+' 104 Z" fill="#1E1B2E"/>':'')})}
  if(b.hamaca)f+='<path d="M94 110 L98 120 M126 110 L122 120" stroke="#8A5A3C" stroke-width="1.4"/><circle cx="94" cy="110" r="1.4" fill="#6B3E26"/><path d="M98 120 Q110 133 122 120 Z" fill="#F26B3A" stroke="#C0392B" stroke-width="1"/><path d="M101 123 Q110 131 119 123" stroke="#F7C948" stroke-width="1.6" fill="none"/>';
  if(b.neo)f+='<g font-size="8.5" font-weight="900" font-family="Nunito,sans-serif" letter-spacing=".6"><text x="168" y="105" fill="none" stroke="#FF4FA3" stroke-width="3" stroke-opacity=".45">QUIMÈRIA'+h14Anim('stroke-opacity','.45;.15;.45','2.4s')+'</text><text x="168" y="105" fill="#fff" stroke="#FF4FA3" stroke-width=".6">QUIMÈRIA</text></g>';
  /* --- sala: TV + console, fish tank, poufs --- */
  if(b.consola)f+='<rect x="84" y="149" width="34" height="18" rx="2" fill="#1E1B2E" stroke="#5E6678" stroke-width="1.5"/><path d="M88 152 L96 152 L88 160 Z" fill="#fff" fill-opacity=".18"/><rect x="88" y="152" width="26" height="12" fill="#3B7DE6" fill-opacity=".35"/><circle cx="104" cy="158" r="3" fill="#F7C948"/><rect x="94" y="167" width="14" height="3" rx="1" fill="#34405A"/>';
  if(b.peixera)f+='<rect x="46" y="176" width="18" height="15" fill="#B5793E"/><rect x="42" y="160" width="26" height="16" rx="2" fill="#7CC0FF" fill-opacity=".85" stroke="#fff" stroke-width="1.5"/><path d="M45 175 q2 -5 0 -9 M62 175 q-2 -4 0 -8" stroke="#3DAA5C" stroke-width="1.4" fill="none"/>'+
      '<path d="M50 167 l5 -2.5 v5 z M55 167 l4 -2 v4 z" fill="#F26B3A"><animateTransform attributeName="transform" type="translate" values="0 0;5 1;0 0" dur="'+(RM?'0s':'3s')+'" repeatCount="indefinite"/></path><circle cx="60" cy="164" r="1.2" fill="#fff"/><circle cx="58" cy="168" r=".9" fill="#fff"/>';
  var pc=['#F26B3A','#2E8BE6','#F7C948'];for(i=0;i<(b.pufs||0);i++)f+='<ellipse cx="'+(82+i*16)+'" cy="187" rx="7" ry="5" fill="'+pc[i]+'" stroke="#1E1B2E" stroke-opacity=".35" stroke-width="1"/><ellipse cx="'+(82+i*16)+'" cy="184.5" rx="4" ry="1.5" fill="#fff" fill-opacity=".45"/>';
  /* --- racó de jocs: trophy shelf, ping-pong --- */
  if(b.trofeus){var nd2=ORDER.filter(h14WorldDone).length,rel={};
    G.items.concat(Object.keys(G.equip).map(function(k){return G.equip[k]})).forEach(function(id){var it=IT(id);if(it&&it.relic)rel[baseOf(id)]=1});var nr=Object.keys(rel).length;
    f+='<rect x="146" y="166" width="52" height="2.5" fill="#8A5A3C"/><rect x="146" y="175" width="52" height="2.5" fill="#8A5A3C"/>';
    for(i=0;i<5;i++)f+=i<nd2?'<path d="M'+(149+i*10)+' 159 h6 l-1 4 h-1.3 v2 h1.6 v1 h-4.6 v-1 h1.6 v-2 h-1.3 z" fill="#F7C948" stroke="#C98A00" stroke-width=".6"/>':'';
    for(i=0;i<Math.min(4,nr);i++)f+='<path d="M'+(152+i*12)+' 168.5 l3 3 l-3 3.5 l-3 -3.5 z" fill="#9B59E0" stroke="#5B2A96" stroke-width=".6"/>';}
  if(b.pingpong)f+='<path d="M140 184 L146 178 H196 L202 184 Z" fill="#2C9A5C" stroke="#1E6B3E" stroke-width="1"/><path d="M171 178 V184" stroke="#fff" stroke-width="1"/><path d="M170 173 V181" stroke="#1E1B2E" stroke-width="1.4"/><path d="M146 184 V191 M196 184 V191" stroke="#34405A" stroke-width="2"/><circle cx="148" cy="176" r="2.6" fill="#E2574C"/><circle cx="194" cy="176" r="2.6" fill="#2E8BE6"/><circle cx="160" cy="172" r="1.3" fill="#fff"/>';
  /* --- second garden strip --- */
  if(L.ext){
    f+='<rect x="0" y="270" width="366" height="76" fill="#7CC46B"/><path d="M0 270 H366" stroke="#6CB85C" stroke-width="1.5" stroke-dasharray="3 6"/>';
    if(b.skate)f+='<path d="M8 338 H34 Q74 338 76 296 H84 V338 Z" fill="#B7BED0" stroke="#5E6678" stroke-width="2" stroke-linejoin="round"/><path d="M76 294 H86" stroke="#34405A" stroke-width="3" stroke-linecap="round"/><path d="M40 330 Q62 326 70 304" stroke="#fff" stroke-width="1.5" fill="none" stroke-dasharray="3 3"/><rect x="18" y="331" width="18" height="3" rx="1.5" fill="#E2574C"/><circle cx="21" cy="336" r="1.8" fill="#1E1B2E"/><circle cx="33" cy="336" r="1.8" fill="#1E1B2E"/>'+h14Txt(10,286,'Skate');
    if(b.foguera)f+='<rect x="102" y="330" width="16" height="6" rx="3" fill="#8A5A3C"/><rect x="146" y="330" width="16" height="6" rx="3" fill="#8A5A3C"/><path d="M118 336 L146 326 M118 326 L146 336" stroke="#6B3E26" stroke-width="5" stroke-linecap="round"/>'+
      '<path d="M132 330 C120 322 124 310 130 300 C132 308 138 308 136 296 C146 306 146 322 132 330 Z" fill="#F26B3A"/><path d="M132 330 C126 324 128 316 132 310 C134 316 140 318 132 330 Z" fill="#F7C948">'+h14Anim('opacity','1;.55;1','.7s')+'</path>'+h14Txt(104,286,'Foguera');
    if(b.hort){f+='<rect x="176" y="296" width="82" height="42" rx="4" fill="#8A5A3C"/><path d="M178 310 H256 M178 324 H256" stroke="#6B3E26" stroke-width="2"/>';
      var bc=['#E2574C','#2E8BE6','#9B59E0','#F26B3A','#F7C948'];for(var rw=0;rw<3;rw++)for(var cl=0;cl<5;cl++){var hx=186+cl*16,hy=304+rw*14;f+='<path d="M'+hx+' '+(hy+3)+' q-4 -6 0 -8 q4 2 0 8" fill="#3DAA5C"/><circle cx="'+(hx+3)+'" cy="'+(hy+1)+'" r="2" fill="'+bc[(rw+cl)%5]+'"/>'}
      f+=h14Txt(178,290,'Hort de baies')}
    if(b.portal){f+='<g><circle cx="318" cy="318" r="20" fill="#2B1E4A"/>';
      ORDER.forEach(function(w,j){var rr=18-j*3.4;f+='<circle cx="318" cy="318" r="'+rr+'" fill="none" stroke="'+ELS[w].c+'" stroke-width="2.6" stroke-dasharray="'+(rr*2.2)+' '+(rr*1.4)+'"/>'});
      f+=(RM?'':'<animateTransform attributeName="transform" type="rotate" from="0 318 318" to="360 318 318" dur="6s" repeatCount="indefinite"/>')+'</g>'+
        '<path d="M292 340 V318 A26 26 0 0 1 344 318 V340" fill="none" stroke="#8E94A8" stroke-width="8" stroke-linejoin="round"/><path d="M292 340 V318 A26 26 0 0 1 344 318 V340" fill="none" stroke="#5E6678" stroke-width="8" stroke-dasharray="2 9"/><circle cx="318" cy="290" r="3" fill="#F7C948"/>'+h14Txt(272,286,'Portal')}
  }
  /* --- underground floor with one room per element --- */
  if(L.el){var y0=L.g1;
    f+='<rect x="0" y="'+y0+'" width="366" height="'+(L.H-y0)+'" fill="#8A5A3C"/><path d="M0 '+(y0+1)+' H366" stroke="#5BA84E" stroke-width="3"/>'+
      [[30,y0+84],[120,y0+86],[210,y0+83],[300,y0+85],[358,y0+8]].map(function(p){return '<ellipse cx="'+p[0]+'" cy="'+p[1]+'" rx="4" ry="2" fill="#6B3E26"/>'}).join('');
    ORDER.forEach(function(w){var x=h14RoomX(w),y=y0+10,k=H14_EL[w],A=ELS[w];
      if(!b[k]){var open=h14WorldDone(w);f+='<rect x="'+x+'" y="'+y+'" width="66" height="72" rx="4" fill="#6B3E26" stroke="'+A.c+'" stroke-width="2" stroke-dasharray="5 4"/>'+
        (open?'<path d="M'+(x+33)+' '+(y+28)+' v16 M'+(x+25)+' '+(y+36)+' h16" stroke="'+A.c+'" stroke-width="3" stroke-linecap="round"/>':
          '<rect x="'+(x+26)+'" y="'+(y+33)+'" width="14" height="11" rx="2" fill="#4A2E1C"/><path d="M'+(x+29)+' '+(y+33)+' v-4 a4 4 0 0 1 8 0 v4" stroke="#4A2E1C" stroke-width="2.2" fill="none"/>');return}
      var r='<rect x="'+x+'" y="'+y+'" width="66" height="72" rx="4" fill="BG" stroke="#4A2E1C" stroke-width="3"/>',lbl=function(t,c){return h14Txt(x+5,y+11,t,c||'#fff',8)},fl=y+72;
      if(w==='foc')f+=r.replace('BG','#3A2A2E')+'<path d="M'+(x+10)+' '+(y+16)+' l8 10 l-5 8 l10 12 l-4 9 l12 12" stroke="#F26B3A" stroke-width="4.5" fill="none" stroke-linejoin="round"><animate attributeName="stroke" values="#F26B3A;#FF9A3A;#F26B3A" dur="'+(RM?'0s':'2s')+'" repeatCount="indefinite"/></path><path d="M'+(x+10)+' '+(y+16)+' l8 10 l-5 8 l10 12 l-4 9 l12 12" stroke="#FFE08A" stroke-width="1.5" fill="none" stroke-linejoin="round"/>'+
        '<path d="M'+(x+40)+' '+fl+' h20 l-3 -10 h-14 z" fill="#4A4F63"/><rect x="'+(x+44)+'" y="'+(fl-16)+'" width="12" height="6" rx="1" fill="#F7A23A"/>'+lbl('Lava');
      if(w==='llamp')f+=r.replace('BG','#2B2F4A')+[x+12,x+46].map(function(cx){var s='<rect x="'+(cx-4)+'" y="'+(y+28)+'" width="8" height="'+(fl-y-28)+'" fill="#9AA3B5"/>';for(var q=0;q<6;q++)s+='<rect x="'+(cx-6)+'" y="'+(y+30+q*6)+'" width="12" height="3" rx="1.5" fill="#C98A00"/>';return s+'<circle cx="'+cx+'" cy="'+(y+25)+'" r="5" fill="#C7CCDA"/>'}).join('')+
        '<path d="M'+(x+17)+' '+(y+25)+' l6 -5 l4 7 l5 -6 l4 6 l5 -4" stroke="#FFE27A" stroke-width="2" fill="none" stroke-linejoin="round">'+h14Anim('opacity','1;.1;1;.6;1','.8s')+'</path>'+lbl('Bobines');
      if(w==='aigua'){f+=r.replace('BG','#2E8BE6')+'<rect x="'+(x+3)+'" y="'+(y+14)+'" width="60" height="55" fill="#7CC0FF" fill-opacity=".45"/>';
        [8,20,50,58].forEach(function(dx,j){f+='<path d="M'+(x+dx)+' '+fl+' q-4 -8 0 -14 q4 -6 0 -14" stroke="#3DAA5C" stroke-width="2.4" fill="none">'+(RM?'':'<animateTransform attributeName="transform" type="skewX" values="0;'+(j%2?4:-4)+';0" dur="3s" repeatCount="indefinite"/>')+'</path>'});
        f+='<path d="M'+(x+30)+' '+(y+30)+' l7 -3.5 v7 z M'+(x+37)+' '+(y+30)+' l5 -3 v6 z" fill="#F7C948"/><circle cx="'+(x+44)+'" cy="'+(y+24)+'" r="1.6" fill="#fff"/><circle cx="'+(x+46)+'" cy="'+(y+19)+'" r="1.1" fill="#fff"/>'+lbl('Aquari')}
      if(w==='planta'){f+=r.replace('BG','#DDF3E2')+'<path d="M'+x+' '+(y+30)+' L'+(x+33)+' '+(y+14)+' L'+(x+66)+' '+(y+30)+'" stroke="#9AD3B0" stroke-width="2" fill="#F1FBF3"/><path d="M'+(x+16)+' '+(y+22)+' V'+(y+30)+' M'+(x+33)+' '+(y+14)+' V'+(y+30)+' M'+(x+50)+' '+(y+22)+' V'+(y+30)+'" stroke="#9AD3B0" stroke-width="1.5"/>';
        [10,28,46].forEach(function(dx,j){var px=x+dx;f+='<path d="M'+px+' '+(fl-12)+' h12 l-2 12 h-8 z" fill="#E8743B"/><path d="M'+(px+6)+' '+(fl-12)+' V'+(fl-24-j*3)+'" stroke="#2C7A42" stroke-width="1.8"/><ellipse cx="'+(px+3)+'" cy="'+(fl-20-j*2)+'" rx="4" ry="2.2" fill="#3DAA5C"/><ellipse cx="'+(px+9)+'" cy="'+(fl-24-j*3)+'" rx="4" ry="2.2" fill="#3DAA5C"/>'});
        f+=lbl('Hivernacle','#2C7A42')}
      if(w==='psiquic'){f+=r.replace('BG','#1E1B3E');[[8,20],[20,32],[50,18],[58,36],[30,22],[42,40],[12,46]].forEach(function(p,j){f+='<circle cx="'+(x+p[0])+'" cy="'+(y+p[1])+'" r="'+(j%3?1:1.6)+'" fill="#fff">'+h14Anim('opacity',j%2?'1;.3;1':'.4;1;.4','2s')+'</circle>'});
        f+='<circle cx="'+(x+52)+'" cy="'+(y+24)+'" r="6" fill="#F7E7A1"/><circle cx="'+(x+55)+'" cy="'+(y+22)+'" r="5" fill="#1E1B3E"/>'+
          '<rect x="'+(x+18)+'" y="'+(y+40)+'" width="26" height="8" rx="3" fill="#C9A6F2" stroke="#9B59E0" transform="rotate(-30 '+(x+31)+' '+(y+44)+')"/><path d="M'+(x+31)+' '+(y+46)+' L'+(x+24)+' '+fl+' M'+(x+31)+' '+(y+46)+' L'+(x+38)+' '+fl+'" stroke="#C7CCDA" stroke-width="2"/>'+lbl('Observatori')}
    });
  }
  var head='<svg viewBox="0 0 366 '+L.H+'" aria-hidden="true" style="background:#BFE3F7">';
  return '<div class="house">'+head+back+o+f+'</svg>'+houseCrew(home)+'</div>';
}

/* the first house drawing: four rooms, rooms on top, garden, pool, spa, tennis and furniture (inside of the svg) */
function houseRooms(b){
  var m=b.mobles||0,h=b.habitacio||0,o='';
  o+='<rect x="0" y="196" width="366" height="74" fill="#7CC46B"/><path d="M0 196 H366" stroke="#5BA84E" stroke-width="3"/>';
  if(b.tennis)o+='<rect x="12" y="212" width="130" height="50" rx="4" fill="#E8743B"/><path d="M14 214 H140 V260 H14 Z M77 214 V260 M14 237 H140" stroke="#fff" stroke-width="2" fill="none"/><path d="M77 208 V266" stroke="#1E1B2E" stroke-width="3"/><circle cx="110" cy="228" r="4" fill="#E6F55A"/><text x="16" y="208" font-size="9" font-weight="800" fill="#1E1B2E">Pista de tennis</text>';
  if(b.spa)o+='<ellipse cx="190" cy="240" rx="34" ry="14" fill="#B58BE6" stroke="#6B2FB3" stroke-width="3"/><ellipse cx="190" cy="238" rx="26" ry="8" fill="#7CC0FF"/><circle cx="180" cy="236" r="2.5" fill="#fff"/><circle cx="196" cy="239" r="2" fill="#fff"/><circle cx="203" cy="235" r="2.5" fill="#fff"/><path d="M178 222 q-4 -6 0 -12 M190 220 q4 -6 0 -12 M202 222 q-4 -6 0 -12" stroke="#fff" stroke-width="2.5" fill="none"/><text x="168" y="266" font-size="9" font-weight="800" fill="#1E1B2E">Spa</text>';
  if(b.piscina)o+='<rect x="236" y="216" width="110" height="38" rx="12" fill="#2E8BE6" stroke="#fff" stroke-width="4"/><path d="M246 236 q8 -5 16 0 t16 0 t16 0 t16 0 t16 0" stroke="#BFE3F7" stroke-width="2.5" fill="none"/><path d="M336 210 V236 M344 210 V236 M336 218 H344 M336 226 H344" stroke="#9AA3B5" stroke-width="2.5"/><circle cx="300" cy="230" r="7" fill="none" stroke="#F26B3A" stroke-width="4"/><text x="240" y="266" font-size="9" font-weight="800" fill="#1E1B2E">Piscina</text>';
  for(var k=0;k<h;k++){var y=156-40*k;o+='<rect x="228" y="'+y+'" width="66" height="40" fill="#C98A5A" stroke="#8A5A3C" stroke-width="2"/><rect x="236" y="'+(y+6)+'" width="50" height="28" fill="#FFF1DA"/><rect x="254" y="'+(y+10)+'" width="14" height="10" fill="#BFE3F7" stroke="#8A5A3C" stroke-width="1.5"/>'}
  if(h)o+='<path d="M222 '+(156-40*(h-1))+' L261 '+(130-40*(h-1))+' L300 '+(156-40*(h-1))+' Z" fill="#E2574C" stroke="#A23A31" stroke-width="3" stroke-linejoin="round"/><text x="232" y="'+(150-40*(h-1)-10)+'" font-size="9" font-weight="800" fill="#fff">Habitacions</text>';
  if(b.jardi)o+='<path d="M300 186 H364 M300 196 H364" stroke="#fff" stroke-width="2.5"/>'+[304,316,328,340,352,362].map(function(x){return '<rect x="'+x+'" y="180" width="3" height="18" fill="#fff"/>'}).join('')+'<rect x="318" y="140" width="6" height="40" fill="#6B3E26"/><circle cx="321" cy="132" r="20" fill="#3B7D32"/><rect x="346" y="156" width="5" height="26" fill="#6B3E26"/><circle cx="348" cy="150" r="13" fill="#4E9A43"/>'+[[308,190,'#F26B3A'],[336,192,'#F7C948'],[356,190,'#9B59E0']].map(function(f){return '<circle cx="'+f[0]+'" cy="'+f[1]+'" r="3.5" fill="'+f[2]+'"/>'}).join('')+'<text x="304" y="176" font-size="9" font-weight="800" fill="#1E1B2E">Jardí</text>';
  o+='<path d="M20 86 L130 20 L240 86 Z" fill="#E2574C" stroke="#A23A31" stroke-width="3" stroke-linejoin="round"/><rect x="30" y="86" width="200" height="110" fill="#8A5A3C"/>'+
    '<rect x="38" y="94" width="88" height="46" fill="#FDE7C8"/><rect x="134" y="94" width="88" height="46" fill="#E8F1FF"/><rect x="38" y="146" width="88" height="46" fill="#FFF7E8"/><rect x="134" y="146" width="88" height="46" fill="#F1E3FF"/>'+
    '<g font-size="9" font-weight="800" font-family="Nunito,sans-serif"><text x="42" y="104" fill="#6B3E26">Dormitori</text><text x="138" y="104" fill="#1A5FA3">Bany</text><text x="42" y="156" fill="#6B3E26">Sala</text><text x="138" y="156" fill="#5B2A96">Racó de jocs</text></g>';
  if(m>=1)o+='<rect x="74" y="178" width="46" height="12" rx="4" fill="#C0392B"/><rect x="74" y="170" width="46" height="9" rx="4" fill="#E2574C"/>';
  if(m>=2)o+='<rect x="84" y="126" width="38" height="12" rx="3" fill="#fff" stroke="#9AA3B5"/><rect x="86" y="124" width="10" height="6" rx="2" fill="#BFE3F7"/>';
  if(m>=3)o+='<path d="M212 190 V164" stroke="#6B3E26" stroke-width="2"/><path d="M204 166 L212 154 L220 166 Z" fill="#F7C948"/>';
  if(m>=4)o+='<ellipse cx="82" cy="191" rx="34" ry="3" fill="#9B59E0"/>';
  if(m>=5)o+='<rect x="206" y="128" width="10" height="10" fill="#B5793E"/><circle cx="211" cy="122" r="8" fill="#3DAA5C"/>';
  return o;
}
