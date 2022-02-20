

import Pawn from '../Pawn.js';
import Stats from './stats/OrcStats.js';

// Orc is berserker warrior. It has small default damage and almost no armor, but its damage is raised with every attack
// and every wound. He also has more hp
export default class Orc extends Pawn {

    customizeForClass () {
        // Load stats and merge them with basic
        Object.assign(this.stats, Stats);
        this.pawnElement.classList.add("orc");
    }

    // constructor(pawnElement, currentCell, owner) {
    //     super(pawnElement, currentCell, owner);
    // }


}