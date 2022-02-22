

import Pawn from '../Pawn.js';
import Stats from './stats/TrollStats.js';

// Troll is massive tanky lump of meat, regenerating at every turn. It deals a lot of damage but is quite slow
export default class Troll extends Pawn {

    customizeForClass () {
        // Load stats and merge them with basic
        Object.assign(this.stats, Stats);
        this.pawnElement.classList.add("troll");
    }

    initializeSounds() {
        super.initializeSounds();
        this.soundPlayer.addSound("regenerate", "./assets/game/sounds/regenerate.wav");
        this.soundPlayer.clearSounds('dealDamageMelee');
        this.soundPlayer.clearSounds('receiveDamageMelee');
        this.soundPlayer.clearSounds('receiveDamageRanged');
        this.soundPlayer.clearSounds('blockDamage');
        this.soundPlayer.addSound("receiveDamageMelee", "./assets/game/sounds/TrollGrunt.wav", {volume: 0.6});
        this.soundPlayer.addSound("receiveDamageRanged", "./assets/game/sounds/TrollGrunt.wav", {volume: 0.6});
        this.soundPlayer.addSound("dealDamageMelee", "./assets/game/sounds/heavy_impact.wav");
        this.soundPlayer.addSound("blockDamage", "./assets/game/sounds/troll_blocked.wav");
    }

    turnStart() {
        super.turnStart();
        this.soundPlayer.playSound('regenerate');
        this.stats.hp += this.stats.regen;
    }

    // constructor(pawnElement, currentCell, owner) {
    //     super(pawnElement, currentCell, owner);
    // }


}