

import Pawn from '../Pawn.js';
import Stats from './stats/ElfStats.js';

// Elf is caster character. It has mp and spends it to make powerfull spells, dealing area damage. When mp is empty, uses
// lesser spells for free
export default class Elf extends Pawn {

    customizeForClass () {
        // Load stats and merge them with basic
        Object.assign(this.stats, Stats);
        this.pawnElement.classList.add("elf");
    }

    // constructor(pawnElement, currentCell, owner) {
    //     super(pawnElement, currentCell, owner);
    // }


}