

export default class MenuManager {
    currentState = 'menu';
    possibleStates = [];
    container = null;
    stateHandlers = null;

    constructor(gameContainer) {
        this.container = gameContainer;
        this.stateHandlers = {
            'battle': []
        }
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
        this.handleNewState(state);
        newScreen.classList.add('active');
    }

    handleNewState = (state) => {
        if (this.stateHandlers[state] !== undefined)
            this.stateHandlers[state].forEach(h => h());
    }

    addStateHandler = (state, handler) => {
        if (this.stateHandlers[state])
            this.stateHandlers[state].push(handler);
        else this.stateHandlers[state] = [handler];
    }

    collectPossibleStates = () => {
        this.container.querySelectorAll('.game').forEach(el => {if (el.dataset.state) this.possibleStates.push(el.dataset.state)});
    }

    initializeStateSwitchers = () => this.container.querySelectorAll('[data-nextstate]')
        .forEach(el => el.addEventListener('click', () => this.changeState(el.dataset.nextstate)));

}