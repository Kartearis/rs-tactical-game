

// Pawn is basic cell-placeable element. In this project it also implements basic character behaviour
// Arrow methods behave as non-virtual, usual xxx(){} as virtual
export default class Pawn {

    pawnElement = null;
    currentCell = null;
    handlers = null

    stats = null
    skills = null

    constructor(pawnElement, currentCell) {
        this.pawnElement = pawnElement;
        this.currentCell = currentCell;
        this.stats = {
            hp: 0,
            mp: 0,
            dmgM: 0,
            dmgR: 0,
            def: 0,
            spd: 0,
            init: 0,
            range: 1
        };
        this.skills = [];
        this.handlers = {
            'leftclick': [],
            'rightclick': [],
            'statchange': {
                'hp': [this.updateHpInfo],
                'mp': [this.updateMpInfo]
            }
        };
        this.customizeForClass();
        this.initializePawn();
        this.addHandlersToStatChange();
    }

    // Special method to inject more initialization into basic constructor before calling initializePawn and proxying stats
    customizeForClass () {};

    initializePawn = () => {
        this.pawnElement.classList.add('pawn');
        this.pawnElement.addEventListener('click', this.processClick);
        this.updateHpInfo();
        this.updateMpInfo();
    }

    // Only left click is implemented currently. Handlers must accept event and thisobj as arguments.
    processClick = (event) => {
        for (let handler of this.handlers.leftclick) {
            handler(event, this);
        }
    }

    addHandler = (eventType, handler) => this.handlers[eventType].push(handler);
    clearHandlers = (eventType) => this.handlers[eventType].clear();

    addHandlersToStatChange = () => {
        self = this;
        this.stats = new Proxy(this.stats, {
            set: (target, property, value) => {
                target[property] = value;
                // For now assume that handlers are argementless
                if (self.handlers.statchange[property] !== undefined) self.handlers.statchange[property].forEach(h => h());
                return true;
            }
        });
    }


    updateHpInfo = () => this.pawnElement.dataset['hp'] = this.stats.hp;
    updateMpInfo = () => this.pawnElement.dataset['mp'] = this.stats.mp;

    // More game-related methods below

}