

import Pawn from '../Pawn.js';
import Stats from './stats/PirateStats.js';

// Pirate is strong ranged unit. It deals a lot of damage, but can only attack once per two turns (spends every other turn reloading)
export default class Pirate extends Pawn {

    customizeForClass () {
        // Load stats and merge them with basic
        Object.assign(this.stats, Stats);
        this.pawnElement.classList.add("pirate");
    }

    // constructor(pawnElement, currentCell, owner) {
    //     super(pawnElement, currentCell, owner);
    // }


}