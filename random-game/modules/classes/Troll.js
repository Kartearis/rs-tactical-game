

import Pawn from '../Pawn.js';
import Stats from './stats/TrollStats.js';

// Troll is massive tanky lump of meat, regenerating at every turn. It deals a lot of damage but is quite slow
export default class Troll extends Pawn {

    customizeForClass () {
        // Load stats and merge them with basic
        Object.assign(this.stats, Stats);
        this.pawnElement.classList.add("troll");
    }

    // constructor(pawnElement, currentCell, owner) {
    //     super(pawnElement, currentCell, owner);
    // }


}