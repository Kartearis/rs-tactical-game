
import SoundPlayer from "./SoundPlayer.js";

export default class MenuManager {
    currentState = 'menu';
    possibleStates = [];
    container = null;
    stateHandlers = null;
    soundPlayer = null;

    settings = null;

    constructor(gameContainer) {
        this.container = gameContainer;
        this.stateHandlers = {
            'battle': []
        }
        this.handlers = {
            'muted': [this.handleMute]
        };
        this.soundPlayer = new SoundPlayer();
        let self = this;
        this.settings = new Proxy({
            'muted': true
        }, {
            set: (target, property, value) => {
                target[property] = value;
                // For now assume that handlers are argumentless
                if (self.handlers[property] !== undefined) self.handlers[property].forEach(h => h());
                return true;
            }
        });
        this.initializeSounds();
        this.collectPossibleStates();
        this.initializeStateSwitchers();
    }

    initializeSounds = () => {
        this.soundPlayer.addSound('menu-click', "./assets/game/sounds/Weapon_Impact_Parry_01.wav");
        this.soundPlayer.addSound('menu-bgm', "./assets/game/bgm/Main_menu_theme.mp3");
        this.soundPlayer.addSound('battle-bgm', "./assets/game/bgm/Battle_bgm.mp3");
        this.addStateHandler('battle', this.playBattleBGM);
        document.getElementById('menu-mute').addEventListener('click',() => this.settings.muted = !this.settings.muted);
    }

    handleMute = () => {
        console.log("Mute changed");
        if (this.settings.mute)
            this.soundPlayer.stopPlayback('menu-bgm');
        else this.soundPlayer.playSound('menu-bgm');
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
        .forEach(el => el.addEventListener('click', () =>
        {
            this.changeState(el.dataset.nextstate);
            this.playMenuClick();
        }));

    playMenuClick = () => {
        this.soundPlayer.playSound('menu-click');
    }

    playMenuBGM = () => {
        this.soundPlayer.playSound('menu-bgm');
    }

    playBattleBGM = () => {
        this.soundPlayer.playSound('battle-bgm');
    }
}