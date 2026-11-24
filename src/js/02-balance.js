'use strict';
/* ================= BALANCE: every number to tune after watching the player ================= */
/* Words in the game: "nivell" = level (1-20), "forma" = form (1-4). In the code a critter has
   lvl (1-20), xp (experience towards the next level) and stage (0-3, so forma = stage+1). */
var BAL={
  /* ---- levels and experience ---- */
  LEVEL_MAX:20,
  FORM_CAP:[5,10,15,20],        /* highest level for forma 1, 2, 3, 4 */
  XP_FIRST:10,                  /* XP to go from level 1 to level 2 */
  XP_GROWTH:1.12,               /* each next level needs 12% more XP */
  XP_RUN_WON:20,                /* XP for each critter of the team after a finished (won) expedition */
  XP_RUN_LOST:10,               /* XP for each critter of the team when the expedition is lost or left */
  XP_FOOD:16,                   /* XP for one food ration */
  XP_FOOD_OWN:24,               /* XP for one food ration of the critter's own element */
  XP_TENNIS:10,                 /* XP for the critter that plays tennis at home (tennis court) */
  XP_LAB:10,                    /* XP for the critter that does experiments at home (lab) */

  /* ---- strength: life, attack, defence and healing of a critter ----
     role base x (1 + STAT_PER_LEVEL x (level-1)) x FORM_MULT[form]. Both branches of an evolution are equal. */
  STAT_PER_LEVEL:0.06,
  FORM_MULT:[1,1.15,1.35,1.6],
  FATIGUE:[3,5,8,10],           /* expeditions in a row before a critter must rest, per form */

  /* ---- evolving: needs a level and copies (other critters of the same species, which are used up) ----
     EVOLVE[stage] is the rule to go from that stage to the next one: forma 1->2, 2->3, 3->4.
     copyForm: the copies must be at least this form. The game uses the copies with the lowest form and level. */
  EVOLVE:[{level:5,copies:1,copyForm:1},{level:10,copies:2,copyForm:2},{level:15,copies:2,copyForm:3}],

  /* ---- forma 4 aura: team members of the aura's element get more attack and defence (percent) ---- */
  AURA_ONE:8,                   /* critter with one element */
  AURA_TWO:5,                   /* critter with two elements: 5% to each element */
  AURA_MAX:16,                  /* most aura percent for one element, when several critters have an aura */

  /* ---- end-of-run chest (only after a won expedition) ----
     It starts Normal; each tap tries to raise it one tier with these chances; when a try fails it opens. */
  CHEST_UP:[0.80,0.60,0.40,0.20],          /* Normal->Refinat, Refinat->Màgic, Màgic->Èpic, Èpic->Superèpic. Shares of chests: 20 / 32 / 28.8 / 15.36 / 3.84 % */
  /* What each tier holds. coins: [min,max]. food/critters/items: chance p to get any, then n:[min,max].
     itemTiers: each item rolls its own tier with these weights: [[tier, weight], ...] where tier is
     0 Normal, 1 Refinada, 2 Màgica, 3 Èpica, 4 Superèpica, or 'legend' = a legend-set piece of that world
     (a Superèpica item if you already have every piece of that world).
     CHEST_FOOD_HOME: chance that a food ration is of the world just played (else any element).
     Critters are random species of the world just played (no favouring of species you own). */
  CHEST:[
    {coins:[30,50],  food:{p:0.5, n:[1,3]}, critters:{p:0.4,n:[1,2]}, items:{p:0.15,n:[1,1]}, itemTiers:[[0,1]]},
    {coins:[60,90],  food:{p:0.75,n:[3,5]}, critters:{p:0.8,n:[2,3]}, items:{p:0.4, n:[1,1]}, itemTiers:[[0,0.6],[1,0.4]]},
    {coins:[100,150],food:{p:1,   n:[4,6]}, critters:{p:1,  n:[2,4]}, items:{p:1,   n:[1,2]}, itemTiers:[[1,0.7],[2,0.3]]},
    {coins:[200,300],food:{p:1,   n:[6,8]}, critters:{p:1,  n:[4,6]}, items:{p:1,   n:[2,3]}, itemTiers:[[2,0.7],[3,0.3]]},
    {coins:[500,500],food:{p:1,   n:[10,10]},critters:{p:1, n:[8,8]}, items:{p:1,   n:[4,4]}, itemTiers:[[3,0.6],[4,0.3],['legend',0.1]]}
  ],
  CHEST_FOOD_HOME:0.75,

  /* ---- zones: 5 per world, FIXED difficulty (enemies do not change with your team) ----
     Enemy strength: L = TIER of the world + ZONE_L[zone] (the final guardian +0.6). Then for each world and zone
     the enemies' life, attack and defence are multiplied by ZONE[world][zone] = [life, attack, defence]. */
  ZONE_L:[0,0.8,1.6,2.4,3.2],
  ZONE:{
    foc:    [[1,1,1],[2.7,1.55,1],[4.2,1.85,1.1],[7.6,3.1,1.3],[10,3.6,1.5]],
    aigua:  [[1.05,1,1],[2.7,1.55,1],[3.8,1.8,1.1],[6.6,2.9,1.3],[10,3.6,1.5]],
    planta: [[1.7,1.3,1],[2.3,1.45,1],[4,1.85,1.1],[7,2.9,1.3],[9.5,3.5,1.5]],
    llamp:  [[1.6,1.3,1],[1.9,1.35,1],[3.1,1.65,1.1],[4.9,2.35,1.3],[8,3.2,1.5]],
    psiquic:[[1.6,1.3,1],[1.9,1.4,1],[3.2,1.75,1.1],[6.2,2.75,1.3],[9,3.4,1.5]]
  },
  ZONE_BONUS:[40,70,110,260,400]  /* coins for finishing a zone */
};
