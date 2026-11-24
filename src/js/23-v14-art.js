'use strict';
/* ================= V14 ART: one drawing per species and per form (stage 0/1/2) ================= */
/* Overrides critter(), spArt(), cArt() and patches the evolution tree in detailSheet() so each form is drawn apart. */
var ART_DK={foc:'#B8431F',aigua:'#1B5FA8',planta:'#24753C',llamp:'#B5850A',psiquic:'#5E2A9E'};
var ART_AC={foc:'#FFB238',aigua:'#9ED3FF',planta:'#8FE09C',llamp:'#FFE27A',psiquic:'#F0C3FF'};
var NS=' stroke="none"';
function aP(d,f,x){return '<path d="'+d+'" fill="'+f+'"'+(x||'')+'/>'}
function aC(cx,cy,r,f,x){return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+f+'"'+(x||'')+'/>'}
function aE(cx,cy,rx,ry,f,x){return '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="'+f+'"'+(x||'')+'/>'}
function aL(d,c,w){return '<path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="'+w+'"/>'}
/* thick line with dark outline (limbs, tentacles, tails) */
function aT(d,c,w){return aL(d,'#2A1F3D',w+3)+aL(d,c,w)}
function aM(s){return '<g transform="matrix(-1 0 0 1 64 0)">'+s+'</g>'}
/* merged circles with one outline (clouds, puffs) */
function aB(l,f){return l.map(function(c){return aC(c[0],c[1],c[2],'#2A1F3D',' stroke="#2A1F3D" stroke-width="4"')}).join('')+l.map(function(c){return aC(c[0],c[1],c[2],f,NS)}).join('')}
function aEye(x,y,r,role,dir,c){
  var o=aC(x,y,r,'#fff',' stroke-width="1.5"')+aC(x-dir*r*.18,y+r*.14,r*.56,'#1E1B2E',NS)+aC(x-dir*r*.18-r*.22,y-r*.16,r*.22,'#fff',NS);
  if(role==='Atac')o+=aL('M'+(x+dir*r*1.05)+' '+(y-r*1.25)+' L'+(x-dir*r*.95)+' '+(y-r*.45),'#2A1F3D',2.4);
  else if(role==='Defensa')o+=aP('M'+(x-r)+' '+(y-r*.15)+' A'+r+' '+r+' 0 0 1 '+(x+r)+' '+(y-r*.15)+' Z',c,' stroke-width="1.5"');
  else o+=aE(x+dir*r*.2,y+r*1.55,r*.6,r*.35,'#FF8FA3',NS+' opacity=".75"');
  return o;
}
function aMouth(role,x,y){
  if(role==='Atac')return aL('M'+(x-3.5)+' '+y+' Q'+x+' '+(y+3)+' '+(x+3.5)+' '+(y-.5),'#2A1F3D',1.8)+aP('M'+(x+.6)+' '+(y+1.1)+' l1.3 2.6 l1.2 -2.9 Z','#fff',' stroke-width="1"');
  if(role==='Defensa')return aL('M'+(x-3)+' '+(y+1)+' H'+(x+3),'#2A1F3D',1.8);
  return aL('M'+(x-3)+' '+y+' Q'+x+' '+(y+3.5)+' '+(x+3)+' '+y,'#2A1F3D',1.8);
}
function aHy(el,x,y,s){
  var B=ELS[el];if(!B)return '';var d={
    foc:'M0 6 C-6 5 -5 -2 -1 -7 C0 -3 2 -4 2 -6 C7 -1 6 5 0 6 Z',
    aigua:'M0 -7 C3 -3 6 0 6 2.5 A6 6 0 0 1 -6 2.5 C-6 0 -3 -3 0 -7 Z',
    planta:'M-6 6 C-6 -3 0 -7 7 -7 C7 1 2 6 -6 6 Z',
    llamp:'M1.5 -8 L-5.5 1 H-.5 L-1.5 8 L5.5 -1 H.5 Z',
    psiquic:'M0 -6.5 L6 0 L0 6.5 L-6 0 Z'}[el];
  return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')">'+aP(d,B.c,' stroke-width="1.6"')+(el==='psiquic'?aC(0,0,1.8,'#fff',NS):'')+'</g>';
}
/* each species: function(p) -> {b: body svg, e:[x1,x2,y,r] or null, ce: custom eyes, m:[x,y] mouth or null, f: front svg, h:[[x,y],..] hybrid marks, t:[x,y] head top} */
var ART={
espurnet:function(p){var s=p.st,o='';
  if(s>0)o+=aP('M42 52 Q54 54 56 '+(42-s*4)+' Q62 50 56 56 Q50 60 42 57 Z',p.H);
  o+=aP(s<2?'M20 38 C15 26 23 24 23 14 C29 20 31 24 32 28 C33 20 39 18 40 10 C46 20 47 30 44 38 Z':'M18 38 C12 26 20 20 18 6 C27 14 29 20 30 26 C31 14 38 12 38 2 C46 12 47 20 44 26 C48 22 52 20 52 14 C56 26 52 34 46 38 Z',p.H);
  o+=aE(32,45,15,14,p.c)+aE(32,51,8,5.5,p.L,NS);
  if(s>1)o+=aP('M19 40 L12 33 L20 36 Z M45 40 L52 33 L44 36 Z',p.c);
  return {b:o,e:[26,38,43,4.6],m:[32,50],h:[[18,50],[46,50]],t:[32,14]}},
fumet:function(p){var s=p.st,o='';
  if(s>0)o+=aP('M12 60 L52 52 L54 57 L14 64 Z M52 60 L12 52 L10 57 L50 64 Z','#8A5A3C');
  o+=aL('M27 26 q-5 -6 1 -11 q5 -4 1 -9 M37 25 q5 -6 -1 -10','#8E8AA0',3);
  o+=aB([[21,48,10],[43,48,10],[32,40,14],[32,52,12]],p.c)+aE(32,52,9,5,p.L,NS);
  if(s>1)o+=aP('M20 30 L22 22 L26 28 L30 18 L34 28 L38 20 L41 28 L44 22 L45 31 Q32 26 20 30 Z',p.H);
  return {b:o,e:[26,38,42,4.6],m:[32,49],h:[[16,46],[48,46]],t:[32,18]}},
brasa:function(p){var s=p.st,o='';
  if(s>1)o+=aP('M20 24 L22 8 L28 18 L32 4 L36 18 L42 8 L44 24 Z',p.H);
  o+=aP(s?'M8 58 L7 38 L16 24 L32 18 L48 24 L57 38 L56 58 Z':'M12 58 L10 40 L20 26 L36 22 L50 30 L54 44 L50 58 Z',p.D);
  if(s)o+=aP('M7 38 L2 30 L14 28 Z M57 38 L62 30 L50 28 Z',p.D);
  o+=aL('M13 34 L17 40 L14 48 M51 34 L47 42 L50 50',p.H,2);
  o+=aP('M22 58 L24 46 L40 46 L42 58 Z',p.c,' stroke-width="1.5"')+aL('M24 52 H40',p.D,1.5);
  return {b:o,e:[26,38,36,4.6],m:[32,42],h:[[14,50],[50,50]],t:[32,18]}},
xurrufet:function(p){var s=p.st,o='';var top=s>1?20:26;
  if(s>1)o+=aP('M20 46 L10 60 L20 58 Z M44 46 L54 60 L44 58 Z',p.D);
  o+=aL('M32 '+top+' Q34 '+(top-8)+' 40 '+(top-10),'#2A1F3D',2)+aP('M40 '+(top-17)+' l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z','#FFE27A',' stroke-width="1.2"');
  o+='<rect x="20" y="'+top+'" width="24" height="'+(60-top)+'" rx="6" fill="'+p.c+'"/>';
  if(s>1)o+=aP('M20 28 L32 '+(top-2)+' L44 28 Z',p.D);
  if(s>0)o+='<rect x="21" y="50" width="22" height="4" fill="'+p.H+'"'+NS+'/><rect x="21" y="'+(top+5)+'" width="22" height="3" fill="'+p.H+'"'+NS+'/>';
  return {b:o,e:[27,37,38,4.2],m:[32,45],h:[[20,46],[44,46]],t:[32,top-4]}},
cremallot:function(p){var s=p.st,o='';
  o+=aT('M14 48 L10 32 M21 48 L21 30',p.c,3);
  o+=aP('M4 58 Q6 46 18 46 L50 46 Q60 50 58 58 Z',p.c);
  if(s<2){o+=aC(38,36,s?17:15,p.D)+aL('M38 36 m-2 0 a2 2 0 1 1 4 0 a5 5 0 1 1 -9 0 a8 8 0 1 1 16 0',p.H,2.5);
    if(s)o+=aP('M28 24 L26 16 L33 21 Z M40 19 L42 11 L46 20 Z M51 28 L58 24 L54 32 Z',p.H);}
  else o+=aP('M22 50 L32 14 L48 14 L58 50 Z',p.D)+aE(40,14,8,3,p.H)+aL('M36 16 Q34 26 37 34 M44 16 Q47 24 45 30',p.H,2.5);
  return {b:o,ce:aEye(10,30,3.6,'Defensa',-1,p.c)+aEye(21,28,3.6,'Defensa',1,p.c),m:[15,53],h:[[30,40],[46,40]],t:[16,22]}},
fogonet:function(p){var s=p.st,o='';var hy=s>1?6:12;
  o+=aE(32,46,15,14,p.c);
  if(s>1)o+=aP('M23 50 H41 L43 59 H21 Z','#fff',' stroke-width="1.5"');
  o+=aB([[24,hy+8,6],[32,hy+5,7],[40,hy+8,6]],'#fff')+'<rect x="23" y="'+(hy+10)+'" width="18" height="'+(22-hy+4)+'" fill="#fff"/>';
  o+=aP('M32 '+(hy+12)+' c2 3 3 5 0 7 c-3 -2 -2 -4 0 -7 Z',p.c,NS);
  if(s>0)o+=aE(52,48,7,3,'#4A4660')+aL('M46 48 L40 50','#4A4660',3);
  return {b:o,e:[26,38,40,4.4],m:[32,46],h:[[18,50],[46,54]],t:[32,hy]}},
dragonet:function(p){var s=p.st,o='';var k=.75+.17*s;
  var w='<g transform="translate(24 40) scale('+k+') translate(-24 -40)">'+aP('M24 34 L4 16 L8 28 L0 30 L10 38 L4 44 L24 44 Z',p.D)+aL('M22 36 L8 24 M22 40 L6 34',p.H,1.4)+'</g>';
  o+=w+aM(w);
  o+=aT('M42 52 Q56 58 58 44',p.c,4)+aP('M56 44 L62 36 L54 40 Z',p.D);
  o+=aE(32,48,12,11,p.c)+aE(32,51,6.5,6.5,p.L,NS)+aL('M28 48 H36 M28 52 H36',p.D,1);
  o+=aP('M22 24 L'+(18-s*2)+' '+(10-s*3)+' L28 20 Z',p.H)+aM(aP('M22 24 L'+(18-s*2)+' '+(10-s*3)+' L28 20 Z',p.H));
  o+=aE(32,30,13,11,p.c)+aE(32,36,7,4.5,p.L,NS)+aC(29.5,35,.9,'#2A1F3D',NS)+aC(34.5,35,.9,'#2A1F3D',NS);
  if(s>1)o+=aP('M26 20 L28 15 L31 19 L34 14 L36 20 Z',p.D);
  return {b:o,e:[26.5,37.5,28,4],m:[32,39],h:[[10,30],[54,30]],t:[32,14]}},
fumerol:function(p){var s=p.st,o='';
  if(s<2)o+=aB([[29,15,6],[36,8,5],[24,8,4]],'#8E8AA0');
  else o+=aP('M24 24 C20 12 28 10 26 0 C32 6 34 8 34 12 C36 6 40 6 40 0 C46 10 44 18 40 24 Z',p.H);
  o+=aP('M12 60 L21 24 L43 24 L52 60 Z',p.c)+aE(32,24,11,3.5,p.D);
  if(s===1)o+=aL('M18 36 H46 M16 46 H48 M28 24 V36 M38 36 V46 M24 46 V60 M42 46 V60',p.D,1.2);
  if(s>1)o+=aL('M26 26 Q24 34 26 40 M39 26 Q42 34 40 42',p.H,3);
  return {b:o,e:[27,37,40,4.3],m:[32,48],h:[[18,52],[46,52]],t:[32,20]}},
gotim:function(p){var s=p.st,o='';
  if(s>1)o+=aE(32,60,24,4,'none',' stroke="'+p.H+'" stroke-width="2"');
  o+=aP('M32 12 C40 26 50 34 50 45 A18 18 0 0 1 14 45 C14 34 24 26 32 12 Z',p.c)+aE(32,52,9,5,p.L,NS)+aE(22,38,2.5,5,'#fff',NS+' opacity=".7" transform="rotate(25 22 38)"');
  if(s>0)o+=aP('M32 12 C38 4 48 6 46 14 C44 10 38 10 36 16 Z',p.H);
  if(s>1)o+=aP('M14 40 C6 38 6 30 10 26 C10 32 14 34 16 34 Z M50 40 C58 38 58 30 54 26 C54 32 50 34 48 34 Z',p.H);
  return {b:o,e:[26,38,42,4.5],m:[32,49],h:[[20,50],[44,50]],t:[32,10]}},
bufa:function(p){var s=p.st,o='',W=20+s*2;
  var fl=aE(13,54,8,4,p.c,' transform="rotate(-25 13 54)"');o+=fl+aM(fl);
  o+=aP('M'+(32-W)+' 48 Q'+(32-W)+' '+(22-s*2)+' 32 '+(22-s*2)+' Q'+(32+W)+' '+(22-s*2)+' '+(32+W)+' 48 Z',p.D);
  o+=aP('M26 '+(30-s)+' L32 '+(26-s)+' L38 '+(30-s)+' L36 36 L28 36 Z M16 42 L20 34 L26 38 L24 44 Z M48 42 L44 34 L38 38 L40 44 Z',p.c,' stroke-width="1.4"');
  if(s>0)o+=aP('M24 '+(25-s*2)+' L26 '+(16-s*4)+' L30 '+(23-s*2)+' Z M34 '+(23-s*2)+' L38 '+(15-s*4)+' L40 '+(25-s*2)+' Z'+(s>1?' M14 34 L6 28 L14 30 Z M50 34 L58 28 L50 30 Z':''),p.H);
  o+=aE(32,56,13,5,p.L)+aE(32,45,11,10,p.c)+aE(32,50,5,2.5,p.L,NS);
  return {b:o,e:[27,37,43,4],m:[32,49],h:[[18,40],[46,40]],t:[32,18]}},
petxina:function(p){var s=p.st,o='';
  o+=aP('M44 52 L40 62 L46 58 L50 63 L52 56 L58 60 L54 50 Z',p.H);
  o+=aL('M24 40 L20 50 M30 40 L28 50 M36 40 L36 49','#2A1F3D',2);
  [[50,44,6],[50,36,7.5],[45,28,8.5],[36,24,9]].forEach(function(c){o+=aC(c[0],c[1],c[2],p.c)});
  if(s>1)o+=aP('M34 15 L36 8 L40 15 Z M44 19 L48 12 L50 21 Z M52 27 L58 23 L57 31 Z',p.D);
  if(s>0){var cl=aT('M18 40 L10 44',p.c,3)+aC(8,46,5,p.c)+aP('M4 44 Q0 36 6 34 Q7 39 8 42 Z',p.c)+aP('M11 43 Q14 37 9 34 Q8 39 8 42 Z',p.c);o+=s>1?'<g transform="translate(8 44) scale(1.3) translate(-8 -44)">'+cl+'</g>':cl}
  o+=aL('M14 24 Q6 8 0 10 M18 22 Q16 6 8 2','#2A1F3D',1.6);
  o+=aP(s>1?'M12 30 L-2 26 L12 34 Z':'M12 30 L4 27 L12 34 Z','#fff',' stroke-width="1.5"');
  o+=aC(22,32,11,p.c)+aE(24,37,6,3.5,p.L,NS);
  return {b:o,e:[18,27,30,3.8],m:[23,38],h:[[45,28],[50,40]],t:[22,20]}},
nedet:function(p){var s=p.st,o='';
  o+=aT('M46 50 Q60 52 60 38',p.c,6);
  if(s>1)o+=aP('M28 38 L36 24 L42 38 Z',p.D);
  o+=aE(32,48,20,11,p.c)+aE(32,54,12,4,p.L,NS);
  if(s>0)o+=aL('M36 40 L40 46 L44 40',p.D,1.5);
  o+=aC(11,27,3.5,p.c)+aC(25,26,3.5,p.c)+aC(18,36,11,p.c)+aE(15,41,6,4,p.L,NS)+aE(15,38.5,1.8,1.3,'#2A1F3D',NS)+aL('M8 41 L2 40 M8 43 L2 45',p.D,1);
  return {b:o,e:[13,23,33,3.5],m:[16,43],h:[[36,44],[50,48]],t:[18,24]}},
medusina:function(p){var s=p.st,o='',n=s?6:4;
  for(var i=0;i<n;i++){var x=16+i*(32/(n-1));o+=aT('M'+x+' 36 q-4 6 0 12 q4 6 0 '+(8+s*2),p.c,2.6)}
  if(s>1)o+=aP('M24 36 q-2 10 4 18 q2 -10 0 -18 Z M40 36 q2 10 -4 18 q-2 -10 0 -18 Z',p.L);
  o+=aP('M10 37 Q10 12 32 12 Q54 12 54 37 Q48 34 43 38 Q38 34 32 38 Q26 34 21 38 Q16 34 10 37 Z',p.c)+aE(24,20,5,3,'#fff',NS+' opacity=".45"');
  if(s>1)o+=aC(20,17,1.6,'#FFD54A',' stroke-width="1"')+aC(32,13,1.8,'#FFD54A',' stroke-width="1"')+aC(44,17,1.6,'#FFD54A',' stroke-width="1"');
  return {b:o,e:[26,38,26,4.2],m:[32,32],h:[[12,32],[52,32]],t:[32,8]}},
cranquet:function(p){var s=p.st,o='',k=1+s*.12;
  o+=aL('M18 48 L8 56 M20 52 L12 60 M46 48 L56 56 M44 52 L52 60','#2A1F3D',2.5);
  var cl='<g transform="translate(10 32) scale('+k+') translate(-10 -32)">'+aT('M20 44 L12 36',p.c,3)+aC(10,32,6.5,p.c)+aP('M5 29 Q1 20 8 16 Q9 23 11 27 Z',p.c)+aP('M14 28 Q18 20 13 17 Q12 23 11 27 Z',p.c)+'</g>';
  o+=cl+(s>1?'<g transform="translate(54 32) scale(1.25) translate(-54 -32)">'+aM(cl)+'</g>':aM(cl));
  o+=aT('M26 38 V28 M38 38 V28',p.c,2);
  if(s>1)o+=aP('M14 44 L10 38 L18 40 L20 34 L26 38 L32 32 L38 38 L44 34 L46 40 L54 38 L50 44 Z',p.D);
  o+=aE(32,46,18,11,p.c)+aP('M14 44 Q32 30 50 44 Q32 40 14 44 Z',p.D,NS)+aE(32,52,9,3.5,p.L,NS);
  return {b:o,e:[26,38,26,4],m:[32,48],h:[[20,46],[44,46]],t:[32,20]}},
bombolli:function(p){var s=p.st,o='',R=17+s*2;
  if(s>0)o+=aC(52,18,4,p.H,' opacity=".7" stroke-width="1.2"')+aC(12,22,3,p.H,' opacity=".7" stroke-width="1.2"');
  if(s>1)o+=aC(8,40,3.5,p.H,' opacity=".7" stroke-width="1.2"')+aC(56,44,3,p.H,' opacity=".7" stroke-width="1.2"');
  o+=aC(32,40,R,p.H,' fill-opacity=".45" stroke="'+p.D+'"')+aE(32,46,11,10,p.c)+aL('M'+(32-R*.7)+' '+(40-R*.3)+' A'+R*.8+' '+R*.8+' 0 0 1 '+(32-R*.1)+' '+(40-R*.8),'#fff',2.5);
  return {b:o,e:[27.5,36.5,44,3.6],m:[32,50],h:[[32-R+2,48],[32+R-2,48]],t:[32,40-R]}},
popet:function(p){var s=p.st,o='',n=s>1?6:4;
  for(var i=0;i<n;i++){var x=14+i*(36/(n-1)),d=i<n/2?-1:1;o+=aT('M'+x+' 40 Q'+(x+d*2)+' 52 '+(x+d*8)+' 56 Q'+(x+d*12)+' 54 '+(x+d*9)+' 50',p.c,4)}
  o+=aP('M12 42 Q10 '+(12-s*2)+' 32 '+(10-s*2)+' Q54 '+(12-s*2)+' 52 42 Z',p.c)+aE(32,42,18,5,p.c,NS);
  if(s>0)o+=aC(18,24,2,p.L,NS)+aC(46,22,2.4,p.L,NS)+aC(40,16,1.6,p.L,NS);
  if(s>1)o+=aP('M24 12 L28 2 L32 10 L36 2 L40 12 Z',p.D);
  return {b:o,e:[26,38,32,4.6],m:[32,40],h:[[16,30],[48,30]],t:[32,8]}},
brotet:function(p){var s=p.st,o='';
  o+=aL('M32 34 V'+(20-s*3),p.D,3);
  var lf=s?'M32 '+(22-s*3)+' Q18 '+(14-s*4)+' 6 '+(18-s*4)+' Q20 28 32 '+(22-s*3)+' Z':'M32 22 Q20 10 12 18 Q22 24 32 22 Z';
  o+=aP(lf,p.H)+aM(aP(lf,p.H));
  if(s>1)o+=aP('M32 18 Q28 6 32 -2 Q36 6 32 18 Z',p.H);
  o+=aE(32,46,14,13,p.c)+aE(32,51,7,5,p.L,NS);
  if(s>1)o+=aP('M20 56 L16 62 L22 60 Z M44 56 L48 62 L42 60 Z',p.D);
  return {b:o,e:[26,38,44,4.4],m:[32,50],h:[[20,50],[44,50]],t:[32,14]}},
molsa:function(p){var s=p.st,o='';
  if(s>0)o+=aL('M18 38 Q14 26 20 22 Q24 24 21 27 M46 38 Q50 24 44 20 Q40 22 43 25',p.D,2.4);
  o+=aP('M4 60 Q4 '+(36-s*2)+' 32 '+(32-s*2)+' Q60 '+(36-s*2)+' 60 60 Z',p.c);
  o+=aC(14,48,2,p.H,NS)+aC(50,50,2.4,p.H,NS)+aC(20,40,1.8,p.H,NS)+aC(44,40,1.8,p.H,NS)+aC(10,56,1.6,p.H,NS)+aC(54,57,1.6,p.H,NS);
  var fl=function(x,y){return aC(x-2,y,1.8,'#fff',NS)+aC(x+2,y,1.8,'#fff',NS)+aC(x,y-2,1.8,'#fff',NS)+aC(x,y+2,1.8,'#fff',NS)+aC(x,y,1.3,'#F7C948',NS)};
  o+=fl(26,34-s*2)+(s>1?fl(38,33)+fl(16,38):'');
  return {b:o,e:[24,40,46,4.6],m:[32,53],h:[[12,52],[52,52]],t:[32,28]}},
pinyol:function(p){var s=p.st,o='';
  if(s>1)o+=aP('M14 38 L6 34 L14 44 Z M50 38 L58 34 L50 44 Z M18 50 L10 52 L18 56 Z M46 50 L54 52 L46 56 Z',p.D);
  o+=aL('M32 22 Q34 14 40 12',p.D,2.5)+aP('M40 12 Q46 8 48 14 Q42 16 40 12 Z',p.H);
  o+=aP('M32 22 Q50 30 46 48 Q42 60 32 60 Q22 60 18 48 Q14 30 32 22 Z',p.c);
  if(s>0)o+=aL('M20 34 L26 30 L32 34 L38 30 L44 34 M18 44 L25 40 L32 44 L39 40 L46 44 M20 54 L26 50 L32 54 L38 50 L44 54',p.D,1.5);
  else o+=aL('M32 26 Q26 40 32 58',p.L,2);
  return {b:o,e:[26.5,37.5,40,4.2],m:[32,47],h:[[18,42],[46,42]],t:[32,10]}},
arrel:function(p){var s=p.st,o='',w='#8A5A3C';
  o+=aT('M20 56 Q14 60 6 60 M44 56 Q50 60 58 60 M26 58 L22 63 M38 58 L42 63','#6B3E26',2.2);
  if(s>1)o+=aB([[18,18,10],[32,12,12],[46,18,10],[32,24,10]],p.c)+aC(24,14,2,p.H,NS)+aC(40,12,2,p.H,NS);
  o+=aP('M16 60 L19 26 L45 26 L48 60 Z',w)+aE(32,26,13,4,'#C9A06A')+aE(32,26,6,1.8,'none',' stroke="#8A5A3C" stroke-width="1"');
  if(s>0)o+=aL('M22 34 V44 M42 36 V50 M26 50 V58 M38 30 V36',w==='#8A5A3C'?'#6B3E26':w,1.3);
  if(s<2)o+=aP('M24 24 Q20 14 28 16 Q30 20 28 24 Z M36 24 Q36 12 44 14 Q42 20 38 24 Z',p.c);
  o+=aE(32,52,9,4,p.c,NS);
  return {b:o,e:[26,38,38,4.4],m:[32,45],h:[[20,48],[44,48]],t:[32,s>1?2:14]}},
boleto:function(p){var s=p.st,o='',W=22+s*3,Y=34-s;
  o+=aP('M22 60 Q20 44 24 '+Y+' L40 '+Y+' Q44 44 42 60 Z','#FFF1DC');
  o+=aP('M'+(32-W)+' '+Y+' Q'+(32-W+2)+' '+(10-s*2)+' 32 '+(8-s*2)+' Q'+(32+W-2)+' '+(10-s*2)+' '+(32+W)+' '+Y+(s>1?' L'+(32+W-6)+' '+(Y-2)+' L'+(32+W-12)+' '+(Y+1)+' L32 '+(Y-1)+' L'+(32-W+12)+' '+(Y+1)+' L'+(32-W+6)+' '+(Y-2):' Q32 '+(Y+6))+' Z',p.c);
  o+=aC(22,20,3,p.L,NS)+aC(38,15,3.5,p.L,NS)+aC(44,26,2.5,p.L,NS)+aC(28,28,2,p.L,NS);
  return {b:o,e:[27,37,44,4.2],m:[32,51],h:[[14,26],[50,26]],t:[32,4]}},
cucafera:function(p){var s=p.st,o='';
  if(s>1){var wg=aP('M30 36 Q10 10 4 22 Q2 34 26 42 Z',p.H)+aC(14,24,3,p.D,NS)+aP('M28 44 Q8 52 10 58 Q20 60 30 48 Z',p.H);o+=wg+aM(wg)}
  var seg=s>1?[[32,54,7],[32,44,9]]:[[10,52,6.5],[20,50,7.5],[31,48,8.5]];
  seg.forEach(function(c,i){o+=aC(c[0],c[1],c[2],i%2?p.L:p.c)});
  if(s===1)o+=aP('M8 46 L10 40 L13 46 Z M18 43 L20 36 L23 43 Z M29 40 L31 32 L34 40 Z',p.H);
  var hx=s>1?32:45,hy=s>1?30:38;
  o+=aL('M'+(hx-4)+' '+(hy-9)+' Q'+(hx-8)+' '+(hy-18)+' '+(hx-12)+' '+(hy-16)+' M'+(hx+4)+' '+(hy-9)+' Q'+(hx+8)+' '+(hy-18)+' '+(hx+12)+' '+(hy-16),'#2A1F3D',1.8)+aC(hx-12,hy-16,2,p.H,' stroke-width="1.2"')+aC(hx+12,hy-16,2,p.H,' stroke-width="1.2"');
  o+=aC(hx,hy,11,p.c);
  return {b:o,e:[hx-5,hx+5,hy-1,3.6],m:[hx,hy+5],h:s>1?[[12,26],[52,26]]:[[10,52],[31,48]],t:[hx,hy-12]}},
punxetes:function(p){var s=p.st,o='';
  if(s>1)o+=aE(10,30,7,10,p.c)+aE(54,30,7,10,p.c);
  o+=aT('M20 42 H12 Q8 42 8 36 V28 M44 36 H52 Q56 36 56 30 V24',p.c,6);
  o+=aP('M19 60 V26 Q19 14 32 14 Q45 14 45 26 V60 Z',p.c)+aL('M26 20 V58 M38 20 V58',p.D,1.2);
  o+=aL('M19 30 h-3 M19 40 h-3 M19 50 h-3 M45 30 h3 M45 46 h3 M32 14 v-3 M8 26 v-3 M56 22 v-3'+(s>1?' M4 28 h-3 M60 28 h3 M10 20 v-3 M54 20 v-3':''),'#2A1F3D',1.5);
  if(s>0)o+=aC(28,13,3,'#FF7FB0',' stroke-width="1.2"')+aC(36,13,3,'#FF7FB0',' stroke-width="1.2"')+aC(32,10,3,'#FF7FB0',' stroke-width="1.2"')+aC(32,13,1.6,'#F7C948',NS);
  return {b:o,e:[27,37,32,4.3],m:[32,39],h:[[24,50],[40,50]],t:[32,6]}},
bavos:function(p){var s=p.st,o='';var R=14+s*2;
  o+=aT('M14 48 L10 32 M21 48 L21 30',p.c,3);
  o+=aP('M4 58 Q6 46 18 46 L50 46 Q60 50 58 58 Z',p.c);
  o+=aP('M30 '+(38-R)+' Q22 '+(30-R)+' 26 '+(22-R+6)+' Q32 '+(28-R)+' 30 '+(38-R)+' Z',p.L)+aP('M44 '+(38-R)+' Q54 '+(28-R)+' 50 '+(22-R+6)+' Q44 '+(28-R)+' 44 '+(38-R)+' Z',p.L);
  o+=aC(38,38,R,s>1?p.D:'#C9E86A')+aL('M38 38 m-2 0 a2 2 0 1 1 4 0 a5 5 0 1 1 -9 0 a8 8 0 1 1 16 0',s>1?p.H:p.D,2.2);
  if(s>1)o+=aP('M26 30 L22 26 L28 26 Z M50 30 L56 26 L52 32 Z M38 '+(38-R)+' l-3 -5 l6 0 Z',p.H);
  return {b:o,ce:aEye(10,30,3.6,'Defensa',-1,p.c)+aEye(21,28,3.6,'Defensa',1,p.c),m:[15,53],h:[[30,44],[48,44]],t:[16,22]}},
xispa:function(p){var s=p.st,o='',e=s*3;
  o+=aP('M10 48 L'+(6-e)+' 36 L14 38 L'+(12-e)+' '+(24-e)+' L22 32 L'+(26)+' '+(18-e)+' L32 28 L'+(38)+' '+(18-e)+' L42 32 L'+(52+e)+' '+(24-e)+' L50 38 L'+(58+e)+' 36 L54 48 Z',p.D);
  if(s>1)o+=aP('M26 '+(18-e)+' l-2 -5 l4 2 Z M38 '+(18-e)+' l2 -5 l-4 2 Z',p.H);
  o+=aE(32,46,18,14,p.c)+aE(32,53,10,5,p.L,NS);
  if(s>0)o+='<rect x="15" y="44" width="34" height="4" fill="'+p.D+'"'+NS+'/>';
  return {b:o,e:[26,38,40,4.4],m:[32,50],h:[[16,52],[48,52]],t:[32,20]}},
trona:function(p){var s=p.st,o='';
  o+=aP('M44 46 L56 34 L52 34 L60 '+(22-s*3)+' L48 32 L52 32 L42 42 Z',p.H);
  o+='<rect x="24" y="52" width="5" height="9" rx="2" fill="'+p.D+'"/><rect x="40" y="52" width="5" height="9" rx="2" fill="'+p.D+'"/>';
  o+=aE(36,48,14,9,p.c)+aE(36,52,8,3,p.L,NS);
  o+=aP('M12 30 L'+(9-s)+' '+(14-s*2)+' L20 24 Z M26 24 L'+(31+s)+' '+(12-s*2)+' L32 28 Z',p.c);
  o+=aP('M20 40 L14 46 L20 46 L16 52 L28 44 Z',p.H);
  o+=aC(22,34,11,p.c)+aE(22,40,6,4,p.L,NS)+aC(22,38.5,1.4,'#2A1F3D',NS);
  if(s>1)o+=aP('M18 24 l-2 -8 l4 3 l1 -5 l3 8 Z',p.H);
  return {b:o,e:[17.5,26.5,33,3.5],m:[22,42],h:[[34,44],[44,44]],t:[22,20]}},
guspira:function(p){var s=p.st,o='',R=20+s*2,r=10+s;
  if(s>0)o+=aP('M8 22 l1.2 3 l3 1.2 l-3 1.2 l-1.2 3 l-1.2 -3 l-3 -1.2 l3 -1.2 Z M56 24 l1.2 3 l3 1.2 l-3 1.2 l-1.2 3 l-1.2 -3 l-3 -1.2 l3 -1.2 Z','#fff',' stroke-width="1"');
  if(s>1)o+=aC(32,40,R+2,p.H,NS+' opacity=".5"');
  var pt=[];for(var i=0;i<10;i++){var a=-Math.PI/2+i*Math.PI/5,rr=i%2?r:R;pt.push((32+Math.cos(a)*rr).toFixed(1)+' '+(40+Math.sin(a)*rr).toFixed(1))}
  o+=aP('M'+pt.join(' L')+' Z',p.c,' stroke-width="2.5"')+aC(32,44,6,p.L,NS);
  return {b:o,e:[27,37,40,3.8],m:[32,46],h:[[14,34],[50,34]],t:[32,40-R]}},
endollet:function(p){var s=p.st,o='';
  o+=aT('M46 52 Q58 52 56 58 Q54 62 62 62','#4A4660',2);
  if(s===0)o+='<rect x="23" y="14" width="5" height="14" rx="1" fill="#C9C4D6"/><rect x="36" y="14" width="5" height="14" rx="1" fill="#C9C4D6"/>';
  if(s===1)o+='<rect x="26" y="20" width="12" height="7" rx="2" fill="#C9C4D6"/>';
  if(s>1)o+=aL('M32 26 V12','#2A1F3D',2)+aC(32,10,3.5,'#FF5A4E')+'<rect x="10" y="38" width="6" height="14" rx="3" fill="'+p.D+'"/><rect x="48" y="38" width="6" height="14" rx="3" fill="'+p.D+'"/>';
  o+='<rect x="17" y="26" width="30" height="32" rx="'+(s?5:9)+'" fill="'+p.c+'"/>';
  if(s===1)o+='<rect x="22" y="47" width="20" height="7" rx="1.5" fill="#fff" stroke-width="1.2"/><rect x="23.5" y="48.5" width="12" height="4" fill="#3DAA5C"'+NS+'/>';
  if(s>1)o+='<rect x="20" y="32" width="24" height="12" rx="5" fill="#1E1B2E"/>';
  return {b:o,e:s>1?null:[26,38,37,4.2],ce:s>1?aE(26,38,4,2.2,'#7CF0FF',NS)+aE(38,38,4,2.2,'#7CF0FF',NS)+aL('M21 31 L29 34 M43 31 L35 34','#2A1F3D',2):null,m:[32,s===1?44:49],h:[[20,52],[44,30]],t:[32,20]}},
brunzit:function(p){var s=p.st,o='';
  if(s<2){o+=aP('M34 34 Q42 '+(12-s*3)+' 58 '+(12-s*3)+' Q52 28 40 40 Z',p.H)+aL('M38 34 Q46 22 54 18',p.c,1.2)}
  else{var w=aP('M26 38 L2 16 L12 20 L4 8 L18 16 L16 4 L30 30 Z',p.D);o+=w+aM(w)}
  o+=aP('M38 46 L50 62 L44 52 L50 60 L38 52 Z',p.D);
  o+=aP(s>1?'M20 38 L8 42 L20 44 Z':'M20 36 L2 33 L20 41 Z','#4A4660');
  o+=aE(32,42,13,12,p.c)+aE(32,48,7,5,p.L,NS);
  if(s>1)o+=aP('M28 30 L30 22 L33 28 L36 22 L37 31 Z',p.H);
  return {b:o,e:[27,37,39,3.6],m:null,h:[[24,48],[40,48]],t:[32,28]}},
cuquet:function(p){var s=p.st,o='';
  o+=aC(32,48,13+s*3,p.H,NS+' opacity=".55"');
  if(s>0)o+=aL('M22 40 L22 60 M42 40 L42 60 M20 60 H44 M20 40 H44','#4A4660',1.5);
  var w=aE(21,30,7,10,'#fff',' fill-opacity=".7" stroke-width="1.2" transform="rotate(-30 21 30)"');o+=w+aM(w);
  if(s>1){var w2=aE(18,40,6,8,'#fff',' fill-opacity=".7" stroke-width="1.2" transform="rotate(-60 18 40)"');o+=w2+aM(w2)}
  o+=aE(32,49,9,9,'#FFF6B0')+aL('M24 48 H40 M25 53 H39',p.H,1.5);
  o+=aL('M28 24 Q24 14 20 14 M36 24 Q40 14 44 14','#2A1F3D',1.6)+aC(20,14,2,p.H,' stroke-width="1"')+aC(44,14,2,p.H,' stroke-width="1"');
  o+=aC(32,32,10,p.c);
  if(s>1)o+=aP('M10 14 l1.5 3.5 l3.5 1.5 l-3.5 1.5 l-1.5 3.5 l-1.5 -3.5 l-3.5 -1.5 l3.5 -1.5 Z M54 46 l1.2 3 l3 1.2 l-3 1.2 l-1.2 3 l-1.2 -3 l-3 -1.2 l3 -1.2 Z','#FFE27A',' stroke-width="1"');
  return {b:o,e:[27.5,36.5,31,3.4],m:[32,36],h:[[24,50],[40,50]],t:[32,20]}},
imantat:function(p){var s=p.st,o='';
  if(s>0)o+=aL('M4 24 Q0 36 6 46 M60 24 Q64 36 58 46',p.H,2)+aP('M2 14 l2 4 l-3 1 Z M60 12 l2 4 l-3 1 Z','#9AA3B5',' stroke-width="1"');
  if(s>1)o+=aL('M10 8 Q32 -2 54 8',p.H,2);
  o+=aP('M9 16 L9 36 A23 23 0 0 0 55 36 L55 16 L42 16 L42 36 A10 10 0 0 1 22 36 L22 16 Z',p.c);
  o+='<rect x="9" y="'+(10-s)+'" width="13" height="'+(8+s)+'" fill="#E2574C"/><rect x="42" y="'+(10-s)+'" width="13" height="'+(8+s)+'" fill="#C9C4D6"/>';
  if(s>1)o+=aP('M9 30 L3 34 L9 38 Z M55 30 L61 34 L55 38 Z',p.D);
  return {b:o,e:[24.5,39.5,51,3.6],m:null,h:[[15,30],[49,30]],t:[32,6]}},
nuvolet:function(p){var s=p.st,o='',cl=s>1?'#5E5A7A':'#F4F1FA';
  var bolt=function(x,y){return aP('M'+(x+2)+' '+y+' L'+(x-4)+' '+(y+10)+' H'+x+' L'+(x-3)+' '+(y+18)+' L'+(x+6)+' '+(y+6)+' H'+(x+2)+' L'+(x+5)+' '+y+' Z',p.c,' stroke-width="1.6"')};
  o+=bolt(31,42)+(s>0?bolt(16,40):'')+(s>1?bolt(46,40):'');
  o+=aB([[16,36,10],[30,28,14],[46,32,11],[32,40,12],[50,40,8]],cl);
  o+=aE(18,42,3.5,2,p.c,NS+' opacity=".8"')+aE(46,42,3.5,2,p.c,NS+' opacity=".8"');
  return {b:o,e:[26,38,34,4.4],m:[32,41],h:[[14,30],[50,26]],t:[30,14]}},
mentoli:function(p){var s=p.st,o='';
  if(s>0)o+=aE(32,62,12,2,'#2A1F3D',NS+' opacity=".25"')+aL('M12 30 Q8 36 12 42 M52 30 Q56 36 52 42',p.H,2);
  if(s>1)o+=aL('M6 24 Q2 36 6 48 M58 24 Q62 36 58 48',p.H,2);
  var pe=function(a){return '<g transform="rotate('+a+' 32 32)">'+aP('M32 32 Q25 '+(22-s*2)+' 32 '+(12-s*3)+' Q39 '+(22-s*2)+' 32 32 Z','#FFB8E0')+'</g>'};
  o+=pe(-40)+pe(40)+pe(0);
  o+=aE(32,45,14,13-s,p.c)+aE(32,51,8,4.5,p.L,NS)+aC(32,35,1.8,p.H,NS);
  return {b:o,e:[26,38,42,4.5],m:[32,49],h:[[18,48],[46,48]],t:[32,10]}},
somni:function(p){var s=p.st,o='';
  if(s>1)o+=aP('M44 4 A28 28 0 1 0 60 48 A22 22 0 1 1 44 4 Z','#FFE27A');
  if(s===1)o+=aP('M14 36 L6 30 L14 30 L10 22 L20 28 Z M50 36 L58 30 L50 30 L54 22 L44 28 Z',p.D);
  o+=aE(32,45,15,15,p.c)+aE(32,52,8,5,p.L,NS);
  o+=aP('M17 36 Q32 42 47 36 Q48 28 53 20 Q42 31 32 30 Q22 31 11 20 Q16 28 17 36 Z','#FFE27A');
  if(s>1)o+=aP('M8 10 l1.2 3 l3 1.2 l-3 1.2 l-1.2 3 l-1.2 -3 l-3 -1.2 l3 -1.2 Z','#fff',' stroke-width="1"');
  return {b:o,e:[26,38,44,4.5],m:[32,51],h:[[18,52],[46,52]],t:[32,24]}},
ullet:function(p){var s=p.st,o='';
  if(s>1)o+=aP('M12 20 L4 10 L18 14 Z M52 20 L60 10 L46 14 Z M8 40 L0 44 L10 48 Z M56 40 L64 44 L54 48 Z',p.H);
  var f=aP('M14 34 Q2 26 4 40 Q8 36 14 42 Z',p.D);o+=f+aM(f);
  o+=aT('M32 54 Q28 60 34 62',p.c,3);
  o+=aC(32,36,19,p.c);
  if(s>0)o+=aP('M24 52 l2 5 l2 -4 Z M36 52 l2 4 l2 -5 Z','#fff',' stroke-width="1"');
  return {b:o,ce:aC(32,36,12,'#fff',' stroke-width="1.6"')+aC(32,37,7,s>1?'#7CF0FF':'#FFB238',' stroke-width="1"')+aC(32,37,3.6,'#1E1B2E',NS)+aC(29.5,34,1.8,'#fff',NS)+aL('M18 21 L32 27 L46 21','#2A1F3D',2.6),m:null,h:[[16,48],[48,48]],t:[32,16]}},
fantasmet:function(p){var s=p.st,o='',g='#F1E8FF';
  if(s>0)o+=aT('M50 46 Q60 50 58 58',g,4);
  var bot=s>1?' L50 60 L45 52 L40 62 L35 53 L30 62 L25 53 L20 62 L16 52 L14 60':' L50 58 L44 52 L38 58 L32 52 L26 58 L20 52 L14 58';
  o+=aP('M14 '+(s>1?60:58)+' L14 30 Q14 12 32 12 Q50 12 50 30'+bot+' Z',g,' fill-opacity=".95"')+aP('M14 44 Q32 50 50 44 L50 52 Q32 56 14 52 Z',p.L,NS+' opacity=".7"');
  o+=aT('M14 34 Q6 36 8 42',g,4)+aT('M50 34 Q58 30 58 24',g,4);
  if(s>1)o+=aP('M20 14 L22 2 L27 9 L32 0 L37 9 L42 2 L44 14 Q32 10 20 14 Z','#FFD54A');
  var ec=s>1?'#C084FC':'#1E1B2E';
  return {b:o,ce:aE(25,30,4,5.5,ec)+aE(39,30,4,5.5,ec)+aC(24,28.5,1.3,'#fff',NS)+aC(38,28.5,1.3,'#fff',NS)+aL('M19 21 L29 25 M45 21 L35 25','#2A1F3D',2.4),m:[32,40],h:[[20,44],[44,44]],t:[32,10]}},
mussolet:function(p){var s=p.st,o='';
  if(s>1){var w=aP('M18 34 Q0 30 2 50 Q10 44 18 50 Z',p.D)+aC(8,42,1.4,'#FFE27A',NS);o+=w+aM(w)}
  o+=aP('M18 26 L'+(14-s*2)+' '+(10-s*3)+' L26 20 Z M46 26 L'+(50+s*2)+' '+(10-s*3)+' L38 20 Z',p.c);
  o+=aE(32,42,17,18,p.c)+aE(32,50,9,8,p.L,NS)+aL('M28 46 l2 2 l2 -2 M32 52 l2 2 l2 -2 M26 52 l2 2 l2 -2',p.D,1);
  if(s<2){var w1=aP('M16 36 Q10 46 16 56 Q20 48 18 38 Z',p.D);o+=w1+aM(w1)}
  o+=aC(25,34,8,p.L,NS)+aC(39,34,8,p.L,NS)+aP('M30 39 L34 39 L32 44 Z','#F2A33A',' stroke-width="1.2"');
  return {b:o,e:[25,39,34,4.6],m:null,h:[[14,50],[50,50]],t:[32,10]}},
bolavidre:function(p){var s=p.st,o='';
  if(s>1)o+=aE(32,30,28,7,'none',' stroke="'+p.H+'" stroke-width="2"');
  o+=aP(s?'M14 62 L18 52 L22 48 L42 48 L46 52 L50 62 Z':'M18 62 L22 50 L42 50 L46 62 Z','#B5793E')+aL('M20 56 H44',s?'#FFD54A':'#8A5A3C',2);
  o+=aC(32,30,20,p.c,' fill-opacity=".6" stroke="'+p.D+'"')+aL('M20 34 Q28 24 36 32 Q42 38 46 28',p.H,2.5)+aL('M16 24 A17 17 0 0 1 26 13','#fff',3);
  if(s>0)o+=aP('M40 18 l1 2.5 l2.5 1 l-2.5 1 l-1 2.5 l-1 -2.5 l-2.5 -1 l2.5 -1 Z','#fff',NS);
  if(s>1)o+=aP('M8 34 A28 7 0 0 0 56 34','none',' stroke="'+p.H+'" stroke-width="2"');
  return {b:o,e:[25,39,32,4.4],m:[32,40],h:[[14,40],[50,40]],t:[32,8]}},
barretmagic:function(p){var s=p.st,o='',H=14-s*4,hc='#2A2440';
  if(s>1)o+=aP('M14 36 L4 62 L60 62 L50 36 Z',p.D)+aC(10,56,1.4,'#FFE27A',NS)+aC(54,52,1.4,'#FFE27A',NS);
  o+=aE(32,48,14,12,p.c)+aE(32,54,7,4,p.L,NS);
  o+='<g transform="rotate(-8 32 34)"><rect x="20" y="'+H+'" width="24" height="'+(34-H)+'" rx="2" fill="'+hc+'"/><rect x="20" y="28" width="24" height="5" fill="'+p.c+'"'+NS+'/>'+aE(32,35,19,4.5,hc)+aP('M32 '+(H+6)+' l1.5 3.5 l3.8 .4 l-2.9 2.5 l.9 3.7 l-3.3 -2 l-3.3 2 l.9 -3.7 l-2.9 -2.5 l3.8 -.4 Z','#FFD54A',NS)+'</g>';
  if(s>0)o+=aL('M50 56 L60 40','#1E1B2E',2.5)+aL('M59 41.5 L60.5 39','#fff',2.5)+aP('M60 36 l1 2 l2 1 l-2 1 l-1 2 l-1 -2 l-2 -1 l2 -1 Z','#FFE27A',' stroke-width="1"');
  var ec=s>1?'#FFE27A':null;
  return {b:o,e:ec?null:[26,38,45,4.2],ce:ec?aE(26,45,3.8,2.6,ec,' stroke-width="1.4"')+aE(38,45,3.8,2.6,ec,' stroke-width="1.4"')+aL('M21 40 L29 43 M43 40 L35 43','#2A1F3D',2.4):null,m:[32,52],h:[[18,52],[46,52]],t:[32,H-4]}},
dormilega:function(p){var s=p.st,o='';
  if(s>0)o+=aE(30,59,26,5,'#F4F1FA');
  o+=aT('M52 50 Q62 44 58 34 Q54 28 50 34',p.L,5);
  o+=aE(36,48,20,11,p.c)+aE(34,53,12,4,p.L,NS);
  if(s>1)o+=aP('M22 44 Q36 34 56 44 L56 56 Q36 60 22 56 Z',p.D)+aL('M30 40 V58 M40 38 V58 M48 40 V58',p.H,1);
  o+=aC(9,32,4,p.c)+aC(18,40,11,p.c)+aE(16,45,5,3.5,p.L,NS)+aE(15,43,1.6,1.2,'#2A1F3D',NS);
  o+=aP('M8 34 Q10 22 22 22 Q32 22 38 '+(14-s*2)+' Q30 32 28 30 Q20 28 8 34 Z',p.H)+aC(38,14-s*2,3,'#fff',' stroke-width="1.4"');
  return {b:o,ce:aL('M11 39 Q13.5 41.5 16 39 M20 39 Q22.5 41.5 25 39','#2A1F3D',1.8)+aL('M10 37.5 H16 M20 37.5 H26','#2A1F3D',1.2),m:[18,47],h:[[34,44],[46,48]],t:[20,22]}}
};
function artDraw(sp,st,el2,locked,px){
  var S=SPECIES[sp]||SPECIES.espurnet,A=ELS[S.el]||ELS.foc,f=ART[sp]||ART.espurnet;st=Math.max(0,Math.min(2,st||0));
  var r=f({c:A.c,L:A.belly,D:ART_DK[S.el],H:ART_AC[S.el],st:st,role:S.role}),o=r.b;
  if(r.ce)o+=r.ce;else if(r.e)o+=aEye(r.e[0],r.e[2],r.e[3],S.role,-1,A.c)+aEye(r.e[1],r.e[2],r.e[3],S.role,1,A.c);
  if(r.m)o+=aMouth(S.role,r.m[0],r.m[1]);
  if(r.f)o+=r.f;
  if(S.role==='Curador'&&st>0&&r.t)o+=aE(r.t[0],r.t[1]-1,8,2.4,'none',' stroke="#FFD54A" stroke-width="2.2"');
  if(el2&&ELS[el2]&&st>0&&r.h)o+=r.h.map(function(h,i){return aHy(el2,h[0],h[1],i?.8:1)}).join('');
  var sc=[.8,.9,1][st];
  return '<svg class="cr" width="'+px+'" height="'+px+'" viewBox="0 0 64 64" aria-hidden="true"'+(locked?' style="filter:brightness(0) opacity(.22)"':'')+'><g transform="translate(32 63) scale('+sc+') translate(-32 -63)" stroke="#2A1F3D" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">'+o+'</g></svg>';
}
critter=function(el,el2,px,locked,evolved,shape){
  var sp=SP_ORDER.filter(function(s){return SPECIES[s].el===el&&SPECIES[s].shape===shape})[0]||SP_ORDER.filter(function(s){return SPECIES[s].el===el})[0]||'espurnet';
  return artDraw(sp,typeof evolved==='number'?evolved:evolved?(el2?2:1):0,el2,locked,px);
};
spArt=function(s,el2,px,locked,evolved){return artDraw(s,typeof evolved==='number'?evolved:evolved?(el2?2:1):0,el2,locked,px)};
cArt=function(c,px,locked){return artDraw(c.sp,c.stage||0,cEl2(c),locked,px)};
/* the evolution tree only passes evolved=true/false: give it the real stage (0, 1 or 2) */
(function(){try{var src=detailSheet.toString(),n=src.replace('spArt(s,e.el2,52,!ok,i>=0)','spArt(s,e.el2,52,!ok,i<0?0:i===0?1:2)').replace('spArt(s,e.el2,52,false,true)','spArt(s,e.el2,52,false,i===0?1:2)');
  if(n!==src)detailSheet=eval('('+n+')')}catch(e){}})();

