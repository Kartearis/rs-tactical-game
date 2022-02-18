

import MenuManager from "./modules/MenuManager.js";
import Battlefield from "./modules/Battlefield.js";
import TurnManager from "./modules/TurnManager.js";

import Warrior from "./modules/classes/Warrior.js";

let manager = null;
let field = null;
let turnManager = null;

window.addEventListener('DOMContentLoaded', () => {
    manager = new MenuManager(document.getElementById('game-container'));
    field = new Battlefield(document.getElementById('battlefield'));
    field.addPawnTo(Warrior, 3, 4);
    turnManager = new TurnManager(field);
    turnManager.calculateTurnOrder();
    turnManager.startNextTurn();
});