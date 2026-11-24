'use strict';
/* drop critters of unknown species only now, after every species file has run (doing it at load lost the later species).
   Keep this here, at the very end: the save is read in 04-state.js, before 13-more-critters-and-talents.js adds species. */
G.owned=G.owned.filter(function(c){return SPECIES[c.sp]});G.niu=G.niu.filter(function(c){return SPECIES[c.sp]});if(!G.owned.length)G.owned=newGame().owned;
renderTypes();render();renderF();
