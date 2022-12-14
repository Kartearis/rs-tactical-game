

import Pawn from '../Pawn.js';
import Stats from './stats/ArcherStats.js';

// Archer is basic ranged character. Very weak in melee, but fast and can attack at great range
export default class Archer extends Pawn {

    customizeForClass () {
        // Load stats and merge them with basic
        Object.assign(this.stats, Stats);
        this.pawnElement.classList.add("archer");
    }

    // constructor(pawnElement, currentCell, owner) {
    //     super(pawnElement, currentCell, owner);
    // }


}