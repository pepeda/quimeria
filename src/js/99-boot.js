'use strict';
/* drop critters of unknown species only now, after every species file has run (doing it at load lost the later species) */
G.owned=G.owned.filter(function(c){return SPECIES[c.sp]});if(!G.owned.length)G.owned=newGame().owned;
renderTypes();render();renderF();
