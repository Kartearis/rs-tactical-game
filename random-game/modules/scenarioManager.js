
import Warrior from "./classes/Warrior.js";
import Spearman from "./classes/Spearman.js";
import Orc from "./classes/Orc.js";
import Elf from "./classes/Elf.js";
import Pirate from "./classes/Pirate.js";
import Healer from "./classes/Healer.js";
import Amazon from "./classes/Amazon.js";
import Troll from "./classes/Troll.js";
import Ghost from "./classes/Ghost.js";
import Goblin from "./classes/Goblin.js";
import Archer from "./classes/Archer.js";
// Positions are x, y, not like in battlefield class
const scenarios = [
    {
        name: 'Forest ambush',
        preset: [
            {class: Warrior, pos: [2, 4], owner: 'player'},
            {class: Warrior, pos: [2, 6], owner: 'player'},
            {class: Elf, pos: [1, 5], owner: 'player'},
            {class: Archer, pos: [2, 0], owner: 'ai'},
            {class: Archer, pos: [5, 1], owner: 'ai'},
            {class: Archer, pos: [6, 3], owner: 'ai'},
            {class: Archer, pos: [8, 4], owner: 'ai'},
            {class: Archer, pos: [6, 5], owner: 'ai'},
            {class: Archer, pos: [5, 7], owner: 'ai'},
            {class: Archer, pos: [2, 8], owner: 'ai'},
        ]
    },
    {
        name: 'Battle of walls',
        preset: [
            {class: Warrior, pos: [1, 3], owner: 'player'},
            {class: Warrior, pos: [1, 4], owner: 'player'},
            {class: Warrior, pos: [1, 5], owner: 'player'},
            {class: Warrior, pos: [1, 6], owner: 'player'},
            {class: Spearman, pos: [0, 3], owner: 'player'},
            {class: Spearman, pos: [0, 4], owner: 'player'},
            {class: Spearman, pos: [0, 5], owner: 'player'},
            {class: Spearman, pos: [0, 6], owner: 'player'},
            {class: Warrior, pos: [7, 3], owner: 'ai'},
            {class: Warrior, pos: [7, 4], owner: 'ai'},
            {class: Warrior, pos: [7, 5], owner: 'ai'},
            {class: Warrior, pos: [7, 6], owner: 'ai'},
            {class: Spearman, pos: [8, 3], owner: 'ai'},
            {class: Spearman, pos: [8, 4], owner: 'ai'},
            {class: Spearman, pos: [8, 5], owner: 'ai'},
            {class: Spearman, pos: [8, 6], owner: 'ai'},
        ]
    },
    {
        name: 'Pirates vs Goblins',
        preset: [
            {class: Amazon, pos: [2, 3], owner: 'player'},
            {class: Amazon, pos: [2, 5], owner: 'player'},
            {class: Pirate, pos: [1, 3], owner: 'player'},
            {class: Pirate, pos: [1, 4], owner: 'player'},
            {class: Pirate, pos: [1, 5], owner: 'player'},
            {class: Goblin, pos: [4, 0], owner: 'ai'},
            {class: Goblin, pos: [4, 1], owner: 'ai'},
            {class: Goblin, pos: [4, 2], owner: 'ai'},
            {class: Goblin, pos: [4, 3], owner: 'ai'},
            {class: Goblin, pos: [4, 4], owner: 'ai'},
            {class: Goblin, pos: [4, 5], owner: 'ai'},
            {class: Goblin, pos: [4, 6], owner: 'ai'},
            {class: Goblin, pos: [4, 7], owner: 'ai'},
            {class: Goblin, pos: [4, 8], owner: 'ai'},
        ]
    },
    {
        name: 'Ghostbusters',
        preset: [
            {class: Elf, pos: [0, 3], owner: 'player'},
            {class: Healer, pos: [0, 5], owner: 'player'},
            {class: Warrior, pos: [2, 3], owner: 'player'},
            {class: Orc, pos: [2, 5], owner: 'player'},
            {class: Ghost, pos: [5, 2], owner: 'ai'},
            {class: Ghost, pos: [6, 3], owner: 'ai'},
            {class: Ghost, pos: [7, 4], owner: 'ai'},
            {class: Ghost, pos: [6, 5], owner: 'ai'},
            {class: Ghost, pos: [5, 6], owner: 'ai'},
        ]
    },
    {
        name: 'A bit of trolling',
        preset: [
            {class: Archer, pos: [0, 3], owner: 'player'},
            {class: Archer, pos: [0, 4], owner: 'player'},
            {class: Archer, pos: [0, 5], owner: 'player'},
            {class: Healer, pos: [1, 4], owner: 'player'},
            {class: Warrior, pos: [2, 4], owner: 'player'},
            {class: Troll, pos: [4, 4], owner: 'ai'},
        ]
    },

];

export default class ScenarioManager {

    static getRandomScenario = () => {
        let choice = Math.floor(Math.random() * scenarios.length);
        return scenarios[choice];
    }

}