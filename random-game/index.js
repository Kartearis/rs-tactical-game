

import GameManager from "./modules/GameManager.js";

let manager = null;

window.addEventListener('DOMContentLoaded', () => {
    manager = new GameManager(document.getElementById('game-container'));
});