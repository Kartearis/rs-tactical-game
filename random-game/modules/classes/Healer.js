

import Pawn from '../Pawn.js';
import Stats from './stats/HealerStats.js';

// Healer is support class. It can target its allies but instead of damage it heals them (using its heal stat).
// It inflicts reduced damage to enemies
export default class Healer extends Pawn {

    canTargetAllies = true;

    customizeForClass () {
        // Load stats and merge them with basic
        Object.assign(this.stats, Stats);
        this.pawnElement.classList.add("healer");
    }

    initializeSounds() {
        super.initializeSounds();
        this.soundPlayer.addSound('heal', "./assets/game/sounds/heal.wav");
        this.soundPlayer.clearSounds('dealDamageRanged');
        this.soundPlayer.addSound('dealDamageRanged', "./assets/game/sounds/fairy_ranged.wav");
    }

    async attack(pawn) {
        if (pawn.owner !== this.owner)
            await super.attack(pawn);
        else {
            pawn.stats.hp += this.stats.heal;
            await this.soundPlayer.promisedPlaySound('heal');
        }
    }

    dealDamage(targetPawn, attackType) {
        if (targetPawn.owner !== this.owner)
            super.dealDamage(targetPawn, attackType);
        else {
            this.soundPlayer.promisedPlaySound('heal')
                .then(() => targetPawn.stats.hp += this.stats.heal);
        }
    }

    // constructor(pawnElement, currentCell, owner) {
    //     super(pawnElement, currentCell, owner);
    // }


}