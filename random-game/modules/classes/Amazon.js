

import Pawn from '../Pawn.js';
import Stats from './stats/AmazonStats.js';

// Amazon is fast and furious melee attacker. Has less damage than some other melees, but deals it to several character at once.
export default class Amazon extends Pawn {

    customizeForClass () {
        // Load stats and merge them with basic
        Object.assign(this.stats, Stats);
        this.pawnElement.classList.add("amazon");
    }

    initializeSounds() {
        super.initializeSounds();
        this.soundPlayer.clearSounds('receiveDamageMelee');
        this.soundPlayer.clearSounds('receiveDamageRanged');
        this.soundPlayer.clearSounds('dealDamageMelee');
        this.soundPlayer.addSound('receiveDamageMelee', "./assets/game/sounds/female_grunt.mp3", {volume: 0.6});
        this.soundPlayer.addSound('receiveDamageRanged', "./assets/game/sounds/female_grunt.mp3", {volume: 0.6});
        this.soundPlayer.addSound('dealDamageMelee', "./assets/game/sounds/Spin_attack.wav");

    }

    dealDamage(targetPawn, attackType) {
        let adjacentEnemies = this.currentCell.getAdjacent().filter(c => c.pawn !== null && c.pawn.owner !== this.owner).map(c => c.pawn);
        adjacentEnemies.forEach(enemy => super.dealDamage(enemy, attackType));
    }

    // constructor(pawnElement, currentCell, owner) {
    //     super(pawnElement, currentCell, owner);
    // }


}