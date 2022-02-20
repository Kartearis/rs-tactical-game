
import promiseSetTimeout from "./PromisedTimeout.js";

// Pawn is basic cell-placeable element. In this project it also implements basic character behaviour
// Arrow methods behave as non-virtual, usual xxx(){} as virtual
export default class Pawn {

    pawnElement = null;
    currentCell = null;
    handlers = null;
    animation = null;

    stats = null;
    skills = null;
    tags = null;
    owner = null;

    specialStates = null;

    constructor(pawnElement, currentCell, owner="player") {
        this.pawnElement = pawnElement;
        this.currentCell = currentCell;
        this.owner = owner;
        this.tags = [];
        this.specialStates = {
            dying: false
        };
        this.stats = {
            hp: 0,
            maxHp: 0,
            mp: 0,
            maxMp: 0,
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
                'hp': [this.updateHpInfo, this.checkDeath],
                'mp': [this.updateMpInfo]
            }
        };
        this.animation = {
            stepDelay: 200
        };
        this.customizeForClass();
        this.initializePawn();
        this.addHandlersToStatChange();
    }

    // Special method to inject more initialization into basic constructor before calling initializePawn and proxying stats
    customizeForClass () {};

    initializePawn = () => {
        this.pawnElement.classList.add('pawn');
        if (this.owner !== 'player') this.pawnElement.classList.add('opposite');
        this.pawnElement.addEventListener('click', this.processClick);
        if (this.stats.maxMp !== 0)
            this.pawnElement.style.setProperty('--divider', 2);
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
    clearHandlers = (eventType) => this.handlers[eventType] = [];

    addHandlersToStatChange = () => {
        let self = this;
        this.stats = new Proxy(this.stats, {
            set: (target, property, value) => {
                target[property] = value;
                // For now assume that handlers are argumentless
                if (self.handlers.statchange[property] !== undefined) self.handlers.statchange[property].forEach(h => h());
                return true;
            }
        });
    }

    destroy = () => {
        this.pawnElement.remove();
    }


    updateHpInfo = () => {
        this.pawnElement.dataset['hp'] = this.stats.hp;
        this.pawnElement.style.setProperty('--current-hp',this.stats.hp / this.stats.maxHp * 100 + '%');
    }
    updateMpInfo = () => {
        // if no mp is present, do not update anything
        if (this.stats.maxMp === 0) return;
        this.pawnElement.dataset['mp'] = this.stats.mp;
        this.pawnElement.style.setProperty('--current-mp', this.stats.mp / this.stats.maxMp * 100 + '%');
    }

    checkDeath = () => {
        if (this.stats.hp <= 0) {
            this.specialStates.dying = true;
            this.die().then((isDead) => this.specialStates.dying = false);
        }
    }

    die = async () => {
        // Animate death
        this.currentCell.pawn = null;
        this.pawnElement.remove();
    }

    // Implements half-bysy wait for death animation to end
    isDead = async () => {
        while (this.specialStates.dying)
            await promiseSetTimeout(() => this.specialStates.dying, 50);
        return this.stats.hp <= 0;
    }

    // More game-related methods below

    showTarget = (attackingPawn) => {
        this.pawnElement.style.setProperty('--target-color', attackingPawn.owner === this.owner ? 'green' : 'crimson');
        this.currentCell.cellElement.style.setProperty('--target-color', attackingPawn.owner === this.owner ? 'green' : 'crimson');
        this.currentCell.cellElement.classList.add('targetable');
        this.pawnElement.classList.add('targetable');
    }

    hideTarget = () => {
        this.currentCell.cellElement.classList.remove('targetable');
        this.pawnElement.classList.remove('targetable');
    }

    showActive = () => {
        this.pawnElement.classList.add('active');
    }

    hideActive = () => {
        this.pawnElement.classList.remove('active');
    }


    // Move pawn along route of cells
    move = async (path) => {
        return await promiseSetTimeout(() => this.#moveStep(path, 0), this.animation.stepDelay);
    }

    #moveStep = async (path, index) => {
        this.#moveToCell(path[index]);
        if (path.length > index + 1)
            return await promiseSetTimeout(() => this.#moveStep(path, index + 1), this.animation.stepDelay);
        return true;
    }

    #moveToCell = cell => {
        // Any animation may go here
        // Remove self ref from previous cell
        this.currentCell.pawn = null;
        // Change self cell ref
        this.currentCell = cell;
        // Change new cell pawn ref to self
        cell.pawn = this;
        // Make dom changes
        cell.cellElement.append(this.pawnElement);

    }

    // Attack given pawn
    attack = async (pawn) => {
        // Determine if attack is melee or ranged
        let type = 'melee';
        if (Math.abs(pawn.currentCell.posX - this.currentCell.posX) > 1
            || Math.abs(pawn.currentCell.posY - this.currentCell.posY) > 1)
            type = 'ranged';
        // Start animation if any
        // Deal damage
        this.dealDamage(pawn, type);
    }

    dealDamage(targetPawn, attackType) {
        let damage = (attackType === 'ranged' ? this.stats.dmgR : this.stats.dmgM) * (0.75 + Math.random() / 2);
        targetPawn.receiveDamage(Math.floor(damage), this, attackType);
    }

    receiveDamage(damage, attackingPawn, attackType) {
        let reducedDamage = damage - Math.round((0.75 + Math.random() / 2) * this.stats.def);
        this.stats.hp -= reducedDamage;
    }


}