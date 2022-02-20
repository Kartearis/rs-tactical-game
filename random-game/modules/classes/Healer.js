

import Pawn from '../Pawn.js';
import Stats from './stats/HealerStats.js';


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