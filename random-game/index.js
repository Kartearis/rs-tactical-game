
console.log(`
-[x] Вёрстка +10
    -[x] реализован интерфейс игры +5
    -[x] в футере приложения есть ссылка на гитхаб автора приложения, год создания приложения, логотип курса со ссылкой на курс +5
-[x] Логика игры. Ходы, перемещения фигур, другие действия игрока подчиняются определённым свойственным игре правилам +10
-[x] Реализовано завершение игры при достижении игровой цели +10
-[x] По окончанию игры выводится её результат, например, количество ходов, время игры, набранные баллы, выигрыш или поражение и т.д +10
-[x] Результаты последних 10 игр сохраняются в local storage. Есть таблица рекордов, в которой сохраняются результаты предыдущих 10 игр +10
-[x] Анимации или звуки, или настройки игры. Баллы начисляются за любой из перечисленных пунктов +10
-[x] Очень высокое качество оформления приложения и/или дополнительный не предусмотренный в задании функционал, улучшающий качество приложения +10
    высокое качество оформления приложения предполагает собственное оригинальное оформление равное или отличающееся в лучшую сторону по сравнению с демо

Итого – 70 баллов
`);

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