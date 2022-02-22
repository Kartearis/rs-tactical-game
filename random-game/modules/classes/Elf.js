

import Pawn from '../Pawn.js';
import {clamp} from "../smallThings.js";
import Stats from './stats/ElfStats.js';

// Elf is caster character. It has mp and spends it to make powerfull spells, dealing area damage. When mp is empty, uses
// lesser spells for free
export default class Elf extends Pawn {

    customizeForClass () {
        // Load stats and merge them with basic
        Object.assign(this.stats, Stats);
        this.pawnElement.classList.add("elf");
    }

    initializeSounds() {
        super.initializeSounds();
        this.soundPlayer.clearSounds('dealDamageRanged');
        this.soundPlayer.addSound('dealDamageRanged', './assets/game/sounds/magic_missiles.wav');
        this.soundPlayer.addSound('castMelee', './assets/game/sounds/elf_teleport.ogg');
        this.soundPlayer.addSound('castRanged-impact', './assets/game/sounds/elf_fireball_impact.wav');
        this.soundPlayer.addSound('castRanged-start', './assets/game/sounds/elf_fireball_whoosh.wav');
        this.soundPlayer.addSound('castDefence', './assets/game/sounds/elf_shield.wav', {volume: 0.7});

    }

    async attack (pawn) {
        // Determine if attack is melee or ranged
        let type = 'melee';
        if (Math.abs(pawn.currentCell.posX - this.currentCell.posX) > 1
            || Math.abs(pawn.currentCell.posY - this.currentCell.posY) > 1)
            type = 'ranged';
        // Start animation if any
        // Some though is required to awaiting. Sounds are usually longer than required, maybe make promise resolve at specified
        // audio.currentTime?
        if (this.stats.mp > this.stats.spellCost){
            if (type === 'ranged') {
                this.stats.mp -= this.stats.spellCost;
                // Deals damage to everyone(!) around ranged target
                let adjacentEnemies = pawn.currentCell.getAdjacent().filter(c => c.pawn !== null).map(c => c.pawn);
                adjacentEnemies.push(pawn);
                await this.soundPlayer.promisedPlaySound('castRanged-start');
                adjacentEnemies.forEach(enemy => {
                    let damage = clamp(this.stats.dmgR * 3 * (0.75 + Math.random() / 2), 0, Infinity);
                    enemy.receiveDamage(Math.floor(damage), this, type);
                });
                this.soundPlayer.playSound('castRanged-impact');
            }
            else {
                this.stats.mp -= this.stats.spellCost;
                await this.soundPlayer.promisedPlaySound('castMelee');
                // Deals ranged damage to melee target and teleports it to random cell on field
                super.dealDamage(pawn, 'ranged');
                let cellX = Math.floor(Math.random() * 9);
                let cellY = Math.floor(Math.random() * 9);
                while (this.currentCell.battlefield.grid[cellX][cellY].pawn !== null)
                {
                    cellX = Math.floor(Math.random() * 9);
                    cellY = Math.floor(Math.random() * 9);
                }
                pawn.currentCell.pawn = null;
                pawn.currentCell = this.currentCell.battlefield.grid[cellX][cellY];
                pawn.currentCell.cellElement.append(pawn.pawnElement);
            }
        }
        else {
            if (type === 'melee')
                this.soundPlayer.playSound('dealDamageMelee');
            else this.soundPlayer.playSound('dealDamageRanged');
            this.dealDamage(pawn, type);
        }
    }

    receiveDamage(damage, attackingPawn, attackType) {
        if (this.stats.mp > 0)
        {
            this.soundPlayer.playSound('castDefence');
            if (this.stats.mp >= damage / 4)
            {
                damage = Math.floor(damage/2);
                this.stats.mp -= damage / 2;
            }
            else {
                damage = Math.floor(damage - this.stats.mp * 2);
                this.stats.mp = 0;
            }
        }
        super.receiveDamage(damage, attackingPawn, attackType);
    }

    // constructor(pawnElement, currentCell, owner) {
    //     super(pawnElement, currentCell, owner);
    // }


}