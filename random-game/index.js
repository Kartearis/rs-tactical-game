

import MenuManager from "./modules/MenuManager.js";
import Battlefield from "./modules/Battlefield.js";
import TurnManager from "./modules/TurnManager.js";

import Warrior from "./modules/classes/Warrior.js";
import Spearman from "./modules/classes/Spearman.js";
import Orc from "./modules/classes/Orc.js";
import Elf from "./modules/classes/Elf.js";
import Pirate from "./modules/classes/Pirate.js";
import Healer from "./modules/classes/Healer.js";
import Amazon from "./modules/classes/Amazon.js";
import Troll from "./modules/classes/Troll.js";
import Ghost from "./modules/classes/Ghost.js";
import Goblin from "./modules/classes/Goblin.js";
import Archer from "./modules/classes/Archer.js";

let manager = null;
let field = null;
let turnManager = null;

window.addEventListener('DOMContentLoaded', () => {
    manager = new MenuManager(document.getElementById('game-container'));
    field = new Battlefield(document.getElementById('battlefield'));
    turnManager = new TurnManager(field, manager);
    manager.addStateHandler('battle', turnManager.startNewGame);
    // field.addPawnTo(Spearman, 0, 0);
    // field.addPawnTo(Warrior, 1, 0);
    // field.addPawnTo(Archer, 2, 0);
    // field.addPawnTo(Orc, 3, 0);
    // field.addPawnTo(Goblin, 4, 0);
    // field.addPawnTo(Elf, 5, 0);
    // field.addPawnTo(Pirate, 6, 0);
    // field.addPawnTo(Healer, 7, 0);
    // field.addPawnTo(Amazon, 8, 0);
    // field.addPawnTo(Troll, 2, 2);
    // field.addPawnTo(Ghost, 4, 2);
    // field.addPawnTo(Warrior, 0, 8, 'ai');
    // field.addPawnTo(Spearman, 1, 8, 'ai');
    // field.addPawnTo(Archer, 2, 8, 'ai');
    // field.addPawnTo(Orc, 3, 8, 'ai');
    // field.addPawnTo(Goblin, 4, 8, 'ai');
    // field.addPawnTo(Elf, 5, 8, 'ai');
    // field.addPawnTo(Pirate, 6, 8, 'ai');
    // field.addPawnTo(Healer, 7, 8, 'ai');
    // field.addPawnTo(Amazon, 8, 8, 'ai');
    // field.addPawnTo(Troll, 2, 6, 'ai');
    // field.addPawnTo(Ghost, 4, 6, 'ai');
});