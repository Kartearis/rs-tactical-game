

import MenuManager from "./modules/MenuManager.js";
import Battlefield from "./modules/Battlefield.js";
import TurnManager from "./modules/TurnManager.js";

let manager = null;
let field = null;
let turnManager = null;

window.addEventListener('DOMContentLoaded', () => {
    manager = new MenuManager(document.getElementById('game-container'));
    field = new Battlefield(document.getElementById('battlefield'));
    turnManager = new TurnManager(field, manager);
    manager.addStateHandler('battle', turnManager.startNewGame);
});