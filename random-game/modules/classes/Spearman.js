

import Pawn from '../Pawn.js';
import Stats from './stats/SpearmanStats.js';

// Spearman is armored unit with powerfull attack at short range and weak attack in melee.
export default class Spearman extends Pawn {

    customizeForClass () {
        // Load stats and merge them with basic
        Object.assign(this.stats, Stats);
        this.pawnElement.classList.add("spearman");
    }

    // constructor(pawnElement, currentCell, owner) {
    //     super(pawnElement, currentCell, owner);
    // }


}