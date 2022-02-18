

import Pawn from '../Pawn.js';
import Stats from './stats/WarriorStats.js';


export default class Warrior extends Pawn {

    customizeForClass () {
        // Load stats and merge them with basic
        Object.assign(this.stats, Stats);
        console.log(this.stats);
    }

    constructor(pawnElement, currentCell) {
        super(pawnElement, currentCell);
    }


}