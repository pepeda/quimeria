const fs=require('fs');let src=fs.readFileSync(__dirname+'/sim14.js','utf8');
src=src.slice(0,src.indexOf("rep('Foc z1 guardian"));
src+=`for(const H of (process.env.HS||'2.2,2.6').split(',').map(Number)){T.setHard(H);console.log('== HARD_TP',H);
for(const w of ['foc','aigua','planta','llamp','psiquic']){
 rep(w+' guard, lvl2 team, Magica gear',T2,w,3,guard,5,ep(2));
 rep(w+' guard, lvl3 team, Magica gear',T3,w,3,guard,5,ep(2));
 rep(w+' guard, lvl3 team, Epica gear',T3,w,3,guard,5,ep(3));
 rep(w+' guard, lvl3 team, Superepica gear',T3,w,3,guard,5,ep(4));}}`;
src=src.replace("global.__T={","global.__T={setHard:function(v){HARD_TP=v},");
fs.writeFileSync(__dirname+'/sim14z-run.js',src);require('./sim14z-run.js');
