

import Pawn from '../Pawn.js';
import Stats from './stats/GoblinStats.js';

// Goblin is agile but weak warrior. It could have inflicted effects, if they were implemented)
export default class Goblin extends Pawn {

    customizeForClass () {
        // Load stats and merge them with basic
        Object.assign(this.stats, Stats);
        this.pawnElement.classList.add("goblin");
    }

    // constructor(pawnElement, currentCell, owner) {
    //     super(pawnElement, currentCell, owner);
    // }


}