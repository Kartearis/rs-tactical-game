
// Simple class to control records saved in local storage
// Should actually check if it is available, but not in current implementation
export default class ScoreManager {

    score = null;
    scoreLabel = null;
    scoreElement = null;
    maxRecords = 10;

    constructor(scoreElement, scoreLabel) {
        this.scoreElement = scoreElement;
        this.scoreLabel = scoreLabel;
        this.loadScore();
    }

    loadScore = () => {
        if (localStorage[this.scoreLabel])
            this.score = JSON.parse(localStorage[this.scoreLabel]);
        else this.score = [];
        this.updateScoreDisplay();
    }

    saveScore = () => {
        localStorage[this.scoreLabel] = JSON.stringify(this.score);
    }

    addRecord = (record) => {
        record.date = (new Date()).toLocaleString();
        this.score.unshift(record);
        this.score = this.score.slice(0, Math.min(this.score.length, this.maxRecords));
        this.saveScore();
        this.updateScoreDisplay();
    }

    makeScoreRow = (n, record) => {
        return `
            <tr>
                <td>${n}</td>
                <td>${record.map}</td>
                <td>${record.score}</td>
                <td>${record.date}</td>
            </tr>
        `;
    }

    updateScoreDisplay = () => {
        this.scoreElement.innerHTML = "";
        for (let i = 0; i < this.score.length; i++)
        {
            this.scoreElement.insertAdjacentHTML('beforeend', this.makeScoreRow(i+1, this.score[i]));
        }
    }



}