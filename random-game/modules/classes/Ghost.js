

import Pawn from '../Pawn.js';
import Stats from './stats/GhostStats.js';

// Ghost is magic creature using mp to stay alive. It spends a bit of mp to move and attack, and has a chance to
// spend mp to ignore damage of one attack. When it's mp is used it dies.
export default class Ghost extends Pawn {

    customizeForClass () {
        // Load stats and merge them with basic
        Object.assign(this.stats, Stats);
        this.pawnElement.classList.add("ghost");
    }

    // constructor(pawnElement, currentCell, owner) {
    //     super(pawnElement, currentCell, owner);
    // }


}