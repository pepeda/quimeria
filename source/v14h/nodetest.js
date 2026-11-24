process.argv[2]=require('path').resolve(__dirname,'test.html');const ev=require('../council-v13/harness/h.js');
console.log(ev('G.screen="casa";G.built.portal=1;G.built.salaAigua=1;render();[scCasa().indexOf("h14builds")>0,houseSvg(G.built,G.owned).indexOf("0 0 366 434")>0,cap()]'));
