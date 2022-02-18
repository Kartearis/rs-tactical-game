

import GameManager from "./modules/GameManager.js";
import Battlefield from "./modules/Battlefield.js";

import Warrior from "./modules/classes/Warrior.js";

let manager = null;
let field = null;

window.addEventListener('DOMContentLoaded', () => {
    manager = new GameManager(document.getElementById('game-container'));
    field = new Battlefield(document.getElementById('battlefield'));
    field.addPawnTo(Warrior, 3, 4);
});