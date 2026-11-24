'use strict';
/* ================= COMMENTS ================= */
var F=load(F_KEY)||{who:'',items:[]};
var TYPES=["M’agrada","No m’agrada","Canviaria","Idea","No quadra"],curType=TYPES[0];
function contextText(){
  var s=G.screen,r=run();
  if(s==='run'&&r){var e=r.event,t=ELS[r.world].mon+', lloc '+(r.i+1)+' de '+r.slots.length+(r.cave?' (dins la cova)':'');
    if(e){if(e.type==='scene'&&r.scene)t+=' · '+SCENES[r.scene].n;else t+=' · '+({battle:'batalla contra '+(e.enemy&&e.enemy.n),wild:'bestiola salvatge',fork:'cruïla',guardianPre:'abans del guardià',note:'avís',card:'carta de troballa'}[e.type]||e.type)}
    return t}
  if(s==='mon'||s==='equip')return (s==='mon'?'Dins el ':'Triant l’equip per al ')+ELS[G.world].mon;
  if(G.detail)return 'Fitxa de '+(ownsSp(G.detail)?SPECIES[G.detail].n:'una bestiola que no tens');
  return {casa:'Casa',explorar:'Mapa dels mons',bestioles:'Pantalla de bestioles',motxilla:'Motxilla',resum:'Resum d’expedició'}[s]||s;
}
function saveF(){save(F_KEY,F)}
function renderTypes(){
  $('types').replaceChildren();
  TYPES.forEach(function(t){var b=document.createElement('button');b.type='button';b.className='chip';b.textContent=t;b.setAttribute('aria-pressed',String(t===curType));b.addEventListener('click',function(){curType=t;renderTypes()});$('types').appendChild(b)});
}
function renderF(){
  var L=$('fbList');L.replaceChildren();
  if(!F.items.length){var p=document.createElement('p');p.className='muted';p.textContent='Encara no hi ha comentaris. Escriu el primer mentre jugues.';L.appendChild(p)}
  F.items.forEach(function(it){
    var d=document.createElement('div');d.className='fb';
    var top=document.createElement('div');top.className='row';top.style.gap='6px';
    var tg=document.createElement('span');tg.className='tag';tg.textContent=it.type;top.appendChild(tg);
    var x=document.createElement('button');x.type='button';x.className='fb-x';x.textContent='Esborra';x.setAttribute('aria-label','Esborra aquest comentari');
    x.addEventListener('click',function(){F.items=F.items.filter(function(z){return z.id!==it.id});saveF();renderF()});top.appendChild(x);
    var tx=document.createElement('div');tx.textContent=it.text;
    var cx=document.createElement('div');cx.className='ctx';cx.textContent=it.ctx;
    d.appendChild(top);d.appendChild(tx);d.appendChild(cx);L.appendChild(d);
  });
  L.scrollTop=L.scrollHeight;
  $('fbWa').href='https://wa.me/?text='+encodeURIComponent(exportText().slice(0,3500));
  var tb=document.querySelector('[data-act="chat"]');if(tb)tb.textContent='Comentaris ('+F.items.length+')';
}
function exportText(){
  var lines=['Comentaris de Quimèria','Qui: '+(F.who||'(sense nom)'),'Data: '+new Date().toLocaleString('ca-ES'),
    'Partida: '+G.completed+' expedicions, '+SP_ORDER.filter(ownsSp).length+' de '+SP_ORDER.length+' bestioles, '+formsOwned()+' evolucions, '+G.coins+' monedes',''];
  F.items.forEach(function(it,i){lines.push((i+1)+'. ['+it.type+'] '+it.text);lines.push('   On: '+it.ctx)});
  if(!F.items.length)lines.push('(Cap comentari)');
  return lines.join('\n');
}
$('who').value=F.who||'';
$('who').addEventListener('input',function(){F.who=$('who').value.slice(0,40);saveF();renderF()});
$('fbForm').addEventListener('submit',function(ev){ev.preventDefault();var t=$('fbText').value.trim();if(!t)return;
  F.items.push({id:Date.now().toString(36),type:curType,text:t.slice(0,1500),ctx:contextText(),at:new Date().toISOString()});saveF();$('fbText').value='';renderF();
  $('fbMsg').textContent='Comentari desat.';if(window.matchMedia('(max-width:840px)').matches)setTimeout(function(){$('chat').classList.remove('open')},600)});
$('fbCopy').addEventListener('click',function(){
  var txt=exportText(),out=$('fbOut'),msg=$('fbMsg');
  function fallback(){out.hidden=false;out.value=txt;out.focus();out.select();msg.textContent='Selecciona el text de dalt i copia’l (Ctrl+C, o mantenint premut al mòbil). Després enganxa’l a Claude o envia’l per WhatsApp.'}
  try{navigator.clipboard.writeText(txt).then(function(){out.hidden=true;msg.textContent='Copiat! Ara enganxa’l a la conversa amb Claude o envia’l per WhatsApp.'},fallback)}catch(e){fallback()}
});
var clearArm=false;
$('fbClear').addEventListener('click',function(){if(!clearArm){clearArm=true;$('fbClear').textContent='Segur? Toca un altre cop per esborrar-los tots';return}clearArm=false;$('fbClear').textContent='Esborra tots els comentaris';F.items=[];saveF();renderF()});
$('chatClose').addEventListener('click',function(){$('chat').classList.remove('open')});

