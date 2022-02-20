

import Pawn from '../Pawn.js';
import Stats from './stats/GoblinStats.js';


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