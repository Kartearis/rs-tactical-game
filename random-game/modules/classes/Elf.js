

import Pawn from '../Pawn.js';
import Stats from './stats/ElfStats.js';


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