

import Pawn from '../Pawn.js';
import Stats from './stats/PirateStats.js';

// Pirate is strong ranged unit. It deals a lot of damage, but can only attack once per two turns (spends every other turn reloading)
export default class Pirate extends Pawn {

    reloading = false;

    customizeForClass () {
        // Load stats and merge them with basic
        Object.assign(this.stats, Stats);
        this.pawnElement.classList.add("pirate");
    }

    initializeSounds() {
        super.initializeSounds();
        this.soundPlayer.clearSounds("dealDamageRanged");
        this.soundPlayer.addSound("dealDamageRanged", "./assets/game/sounds/pirate_bullet.wav");
        this.soundPlayer.addSound("reloadStart", "./assets/game/sounds/pirate_reload_start.wav");
        this.soundPlayer.addSound("reloadEnd", "./assets/game/sounds/pirate_reload_end.wav");
    }


    // Reload requires attacking, melee attack is also impossible
    async attack(pawn) {
        if (!this.reloading)
            await super.attack(pawn);
        else {
            await this.soundPlayer.promisedPlaySound("reloadStart");
            await this.soundPlayer.promisedPlaySound("reloadEnd");
            this.reloading = false;
        }
    }

    dealDamage(targetPawn, attackType) {
        if (attackType === 'ranged')
            this.reloading = true;
        super.dealDamage(targetPawn, attackType);
    }

    // constructor(pawnElement, currentCell, owner) {
    //     super(pawnElement, currentCell, owner);
    // }


}