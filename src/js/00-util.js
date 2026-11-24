'use strict';
var S_KEY='bestioles-joc-v1', F_KEY='bestioles-comentaris-v1';
var storageOk=true;
function load(k){try{var v=localStorage.getItem(k);return v?JSON.parse(v):null}catch(e){storageOk=false;return null}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){storageOk=false}}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function rnd(n){return Math.floor(Math.random()*n)}
function pickOne(a){return a[rnd(a.length)]}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=rnd(i+1),t=a[i];a[i]=a[j];a[j]=t}return a}
var RM=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

