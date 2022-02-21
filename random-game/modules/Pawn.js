
import promiseSetTimeout from "./PromisedTimeout.js";
import SoundPlayer from "./SoundPlayer.js";
import {clamp} from "./smallThings.js";

// Pawn is basic cell-placeable element. In this project it also implements basic character behaviour
// Arrow methods behave as non-virtual, usual xxx(){} as virtual
export default class Pawn {

    pawnElement = null;
    currentCell = null;
    handlers = null;
    animation = null;
    soundPlayer = null;

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
                'hp': [this.updateHpInfo, () => this.checkDeath()],
                'mp': [this.updateMpInfo]
            }
        };
        this.animation = {
            stepDelay: 200
        };
        this.soundPlayer = new SoundPlayer();
        this.customizeForClass();
        this.initializePawn();
        this.initializeSounds();
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

    initializeSounds(){
        this.soundPlayer.addSound('step', "./assets/game/sounds/leaf_step.wav");
        this.soundPlayer.addSound('receiveDamageMelee', "./assets/game/sounds/grunt.wav");
        this.soundPlayer.addSound('blockDamage', "./assets/game/sounds/chainmail_block.wav");
        this.soundPlayer.addSound('receiveDamageRanged', "./assets/game/sounds/grunt.wav");
        this.soundPlayer.addSound('receiveDamageRanged', "./assets/game/sounds/cartoon_arrow.wav");
        this.soundPlayer.addSound('dealDamageMelee', "./assets/game/sounds/sword_stab.wav");
        this.soundPlayer.addSound('dealDamageRanged', "./assets/game/sounds/arrow_shoot.mp3");
        this.soundPlayer.addSound('die', "./assets/game/sounds/body_drop_quick.wav");
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

    checkDeath () {
        if (this.stats.hp <= 0) {
            this.specialStates.dying = true;
            this.die().then((isDead) => this.specialStates.dying = false);
        }
    }

    die = async () => {
        // Animate death
        await this.soundPlayer.promisedPlaySound('die');
        this.currentCell.pawn = null;
        this.pawnElement.remove();
    }

    // Implements half-bysy wait for death animation to end
    async isDead () {
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
        return await promiseSetTimeout(() => this.moveStep(path, 0), this.animation.stepDelay);
    }

    async moveStep (path, index) {
        this.soundPlayer.playSound('step');
        this.moveToCell(path[index]);
        if (path.length > index + 1)
            return await promiseSetTimeout(() => this.moveStep(path, index + 1), this.animation.stepDelay);
        return true;
    }

    moveToCell = cell => {
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
        if (type === 'melee')
            await this.soundPlayer.playSound('dealDamageMelee');
        else await this.soundPlayer.playSound('dealDamageRanged');
        // Deal damage
        this.dealDamage(pawn, type);
    }

    dealDamage(targetPawn, attackType) {
        let damage = clamp((attackType === 'ranged' ? this.stats.dmgR : this.stats.dmgM) * (0.75 + Math.random() / 2), 0, Infinity);
        targetPawn.receiveDamage(Math.floor(damage), this, attackType);
    }

    receiveDamage(damage, attackingPawn, attackType) {
        let reducedDamage = clamp(damage - Math.round((0.75 + Math.random() / 2) * this.stats.def), 0, Infinity);
        if (reducedDamage > 0) {
            if (attackType === 'melee')
                this.soundPlayer.playSound('receiveDamageMelee');
            else this.soundPlayer.playSound('receiveDamageRanged');
        }
        else this.soundPlayer.playSound('blockDamage');

        this.stats.hp -= reducedDamage;
    }

    // Current ai implementation is vastly ineffective, paths are calculated several times per turn
    async processTurnMove(turnManager) {
        // console.log("Processing movement");
        let field = this.currentCell.battlefield;
        // Check targets in range (get all cells with pawns within range)
        let targetsInRange = field.wideSearch(this.currentCell, this.stats.range, false)
            .filter(c => c.pawn !== null && c.pawn.owner !== this.owner).map(c => c.pawn);
        if (targetsInRange.length > 0) {
            // If can attack without moving - proceed
            let target = this.selectTarget(targetsInRange);
            turnManager.attackPawnTo(target);
            return;
        }
        // console.log("No targets - trying to move");
        // If no targets in range - check targets in move range + range
        // Warning! targetsInRange may contain unreachable targets (within radius). Should eliminate them on selection
        targetsInRange = field.wideSearch(this.currentCell, this.stats.spd + this.stats.range, false)
            .filter(c => c.pawn !== null && c.pawn.owner !== this.owner).map(c => c.pawn);
        if (targetsInRange.length > 0) {
            // If there is target, reachable after movement - proceed with movement and attacking
            let target = this.selectTargetOnMove(targetsInRange, field, this.stats.spd + this.stats.range);
            if (target !== null){
                // If path is longer than spd, move spd cells. Else move to the end except last cell (that is target pawn)
                let path = target.path.length > this.stats.spd ? target.path.slice(0, this.stats.spd) : target.path.slice(0, target.path.length - 1);
                turnManager.movePawnTo(path[path.length - 1]);
                return;
            }
            // Else try last if
        }
        // console.log("Cannot reach this turn");
        // If there is no such target - scan all map for targets
        targetsInRange = field.wideSearch(this.currentCell, 9, false)
            .filter(c => c.pawn !== null && c.pawn.owner !== this.owner).map(c => c.pawn);
        if (targetsInRange.length > 0) {
            // If there is target to which it is possible to move - proceed with movement (first spd cells of path)
            let target = this.selectTargetOnMove(targetsInRange, field, 9);
            // console.log(target);
            if (target !== null) {
                // If path is longer than spd, move spd cells. Else move to the end except last cell (that is target pawn)
                let path = target.path.length > this.stats.spd ? target.path.slice(0, this.stats.spd) : target.path.slice(0, target.path.length - 1);
                turnManager.movePawnTo(path[path.length - 1]);
                return;
            }
        }
        // Else end turn
        turnManager.endTurn();
    }

    processTurnAttack(turnManager) {
        let field = this.currentCell.battlefield;
        // Check targets in range (get all cells with pawns within range)
        let targetsInRange = field.wideSearch(this.currentCell, this.stats.range, false)
            .filter(c => c.pawn !== null && c.pawn.owner !== this.owner).map(c => c.pawn);
        if (targetsInRange.length > 0) {
            // If can attack something - proceed
            let target = this.selectTarget(targetsInRange);
            turnManager.attackPawnTo(target);
            return;
        }
        turnManager.endTurn();
    }

    selectTarget(targets) {
        // Select target with the least hp. Targets must have at least one element
        let selected = targets[0];
        for (let target of targets)
            if (target.stats.hp < selected.stats.hp)
                selected = target;
        return selected;
    }

    selectTargetOnMove(targets, field, range) {
        // Select target based on its rating and passability. Targets must have at least one element
        let selected = null;
        for (let target of targets) {
            let path = field.findPath(this.currentCell, target.currentCell, this, range);
            if (path === null) continue;
            let rating = target.stats.hp * 2 + path.length * 10;
            // console.log(rating);
            if (selected === null || selected.rating > rating)
                selected = {rating: rating, target: target, path: path};
        }
        return selected === null ? null : selected;
    }


}