

import Pawn from '../Pawn.js';
import Stats from './stats/HealerStats.js';

// Healer is support class. It can target its allies but instead of damage it heals them (using its heal stat).
// It inflicts reduced damage to enemies
export default class Healer extends Pawn {

    customizeForClass () {
        // Load stats and merge them with basic
        Object.assign(this.stats, Stats);
        this.pawnElement.classList.add("healer");
    }

    // constructor(pawnElement, currentCell, owner) {
    //     super(pawnElement, currentCell, owner);
    // }


}