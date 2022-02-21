

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

    dealDamage(targetPawn, attackType) {
        if (this.stats.mp > this.stats.spellCost){
            if (attackType === 'ranged') {
                this.stats.mp -= this.stats.spellCost;
                // Deals damage to everyone(!) around ranged target
                let adjacentEnemies = targetPawn.currentCell.getAdjacent().filter(c => c.pawn !== null).map(c => c.pawn);
                adjacentEnemies.push(targetPawn);
                adjacentEnemies.forEach(enemy => {
                    let damage = clamp(this.stats.dmgR * 3 * (0.75 + Math.random() / 2), 0, Infinity);
                    enemy.receiveDamage(Math.floor(damage), this, attackType);
                });
            }
            else {
                this.stats.mp -= this.stats.spellCost;
                // Deals ranged damage to melee target and teleports it to random cell on field
                super.dealDamage(targetPawn, 'ranged');
                let cellX = Math.floor(Math.random() * 9);
                let cellY = Math.floor(Math.random() * 9);
                while (this.currentCell.battlefield.grid[cellX][cellY].pawn !== null)
                {
                    cellX = Math.floor(Math.random() * 9);
                    cellY = Math.floor(Math.random() * 9);
                }
                targetPawn.currentCell.pawn = null;
                targetPawn.currentCell = this.currentCell.battlefield.grid[cellX][cellY];
                targetPawn.currentCell.cellElement.append(targetPawn.pawnElement);
            }
        }
        else super.dealDamage(targetPawn, attackType);
    }

    receiveDamage(damage, attackingPawn, attackType) {
        if (this.stats.mp > 0)
        {
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