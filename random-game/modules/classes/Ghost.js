

import Pawn from '../Pawn.js';
import Stats from './stats/GhostStats.js';
import promiseSetTimeout from "../PromisedTimeout.js";

// Ghost is magic creature using mp to stay alive. It spends a bit of mp to move and attack, and has a chance to
// spend mp to ignore damage of one attack. When it's mp is used it dies.
export default class Ghost extends Pawn {

    customizeForClass () {
        // Load stats and merge them with basic
        Object.assign(this.stats, Stats);
        this.handlers.statchange.mp.push(() => this.checkDeath());
        this.pawnElement.classList.add("ghost");
    }

    dealDamage(targetPawn, attackType) {
        // console.log("Ghost damage");
        super.dealDamage(targetPawn, attackType);
        this.stats.mp -= this.stats.attackCost;
    }

    receiveDamage(damage, attackingPawn, attackType) {
        // console.log("Ghost evade");
        if (Math.floor(Math.random() * 3) === 0)
            this.stats.mp -= this.stats.evadeCost;
        else
            super.receiveDamage(damage, attackingPawn, attackType);
    }

    async moveStep(path, index) {
        // console.log("Ghost move");
        this.stats.mp -= this.stats.moveCost;
        return await super.moveStep(path, index);
    }

    checkDeath () {
        // console.log("Check ghost death");
        // console.log(this.stats);
        if (this.stats.hp <= 0 || this.stats.mp <= 0) {
            console.log("Ghost is dying");
            this.specialStates.dying = true;
            this.die().then((isDead) => this.specialStates.dying = false);
        }
    }

    async isDead () {
        // console.log("Checked ghost death");
        while (this.specialStates.dying)
            await promiseSetTimeout(() => this.specialStates.dying, 50);
        return this.stats.hp <= 0 || this.stats.mp <= 0;
    }

    // constructor(pawnElement, currentCell, owner) {
    //     super(pawnElement, currentCell, owner);
    // }


}