

import Pawn from '../Pawn.js';
import Stats from './stats/AmazonStats.js';

// Amazon is fast and furious melee attacker. Has less damage than some other melees, but deals it to several character at once.
export default class Amazon extends Pawn {

    customizeForClass () {
        // Load stats and merge them with basic
        Object.assign(this.stats, Stats);
        this.pawnElement.classList.add("amazon");
    }

    // constructor(pawnElement, currentCell, owner) {
    //     super(pawnElement, currentCell, owner);
    // }


}