

import GameManager from "./modules/GameManager.js";
import Battlefield from "./modules/Battlefield.js";

let manager = null;
let field = null;

window.addEventListener('DOMContentLoaded', () => {
    manager = new GameManager(document.getElementById('game-container'));
    field = new Battlefield(document.getElementById('battlefield'));
});