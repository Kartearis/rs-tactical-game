

import MenuManager from "./modules/MenuManager.js";
import Battlefield from "./modules/Battlefield.js";
import TurnManager from "./modules/TurnManager.js";
import ScoreManager from "./modules/ScoreManager.js";

let manager = null;
let field = null;
let turnManager = null;
let scoreManager = null;

window.addEventListener('DOMContentLoaded', () => {
    manager = new MenuManager(document.getElementById('game-container'));
    field = new Battlefield(document.getElementById('battlefield'));
    scoreManager = new ScoreManager(document.getElementById('scores-container'), '9d9e8788-1a87-4b68-9581-bd67fc4d8ac4' + '::HighScores');
    turnManager = new TurnManager(field, manager, scoreManager);
    manager.addStateHandler('battle', turnManager.startNewGame);
});