

export default class MenuManager {
    currentState = 'menu';
    possibleStates = [];
    container = null;

    constructor(gameContainer) {
        this.container = gameContainer;
        this.collectPossibleStates();
        this.initializeStateSwitchers();
    }

    changeState = state => {
        if (!this.possibleStates.includes(state))
            throw new Error("Exception trying to switch to impossible state " + state);
        this.currentState = state;
        this.container.querySelectorAll('.game').forEach(el => el.classList.remove('active'));
        let newScreen = this.container.querySelector(`.game[data-state=${state}]`);
        if (!newScreen) throw new Error("Screen element not found for state " + state);
        newScreen.classList.add('active');
    }

    collectPossibleStates = () => {
        this.container.querySelectorAll('.game').forEach(el => {if (el.dataset.state) this.possibleStates.push(el.dataset.state)});
    }

    initializeStateSwitchers = () => this.container.querySelectorAll('[data-nextstate]')
        .forEach(el => el.addEventListener('click', () => this.changeState(el.dataset.nextstate)));

}