
import promiseSetTimeout from "./PromisedTimeout.js";

import ScenarioManager from "./scenarioManager.js";
// Turn consists of two phases: movement then attack. Attack can be made instead of movement, but it ends turn.
export default class TurnManager {

    state = {
        currentPawn: null,
        currentState: 'none',
        order: null,
        nextPawnIndex: 0,
        roundCount: 1,
        winner: null,
        map: null
    };
    stateHandlers = {
      'currentPawn': [],
      'currentState': [],
      'order': [],
      'nextPawnIndex': []
    };

    turnEndDelay = 1000;
    battlefield = null;
    menuManager = null;

    constructor(battlefield, menuManager) {
        self = this;
        this.battlefield = battlefield;
        this.menuManager = menuManager;
        this.state = new Proxy(this.state, {
            set: (target, property, value) => {
                target[property] = value;
                // For now assume that handlers are argementless
                if (self.stateHandlers[property] !== undefined) self.stateHandlers[property].forEach(h => h());
                return true;
            }
        });
        this.calculateTurnOrder();
    }

    calculateTurnOrder () {
        // Sort pawns by initiative then speed. Save it for future reference
        this.state.order = [...this.battlefield.pawns].sort((x, y) => x.stats.init > y.stats.init ? -1
            : x.stats.init < y.stats.init ? 1
                : x.stats.spd > y.stats.spd ? -1 : x.stats.spd === y.stats.spd ? 0 : 1);
    }

    startNextTurn () {
        if (!this.state.order) throw new Error("Order is not defined yet!");
        if (this.state.nextPawnIndex >= this.state.order.length)
        {
            this.state.nextPawnIndex = 0;
            this.newRound();
        }
        this.state.currentPawn = this.state.order[this.state.nextPawnIndex];
        this.state.currentPawn.showActive();
        this.state.currentState = 'move-phase';
        this.state.nextPawnIndex++;
        let movementCells = this.battlefield.showMovement(this.state.currentPawn, this);
        if (movementCells.length === 0)
            this.startAttackPhase();
        else this.battlefield.showPossibleAttacks(this.state.currentPawn, this);
    }

    async movePawnTo (cell) {
        this.battlefield.hideCellOverlays();
        let path = this.battlefield.findPath(this.state.currentPawn.currentCell, cell, this.state.currentPawn);
        await this.state.currentPawn.move(path);
        this.startAttackPhase();
    }

    // Attack given pawn with current pawn
    // Current implementation does not allow other pawns to intervene in any way
    async attackPawnTo (pawn) {
        this.battlefield.hideCellOverlays();
        await this.state.currentPawn.attack(pawn);
        this.endTurn();
    }

    startAttackPhase () {
        this.state.currentState = 'attack-phase';
        let targets = this.battlefield.showPossibleAttacks(this.state.currentPawn, this);
        if (targets.length === 0)
            this.endTurn();
    }

    async endTurn () {
        this.state.currentState = 'end-phase';
        this.state.currentPawn.hideActive();
        let deadStates = await Promise.all(this.state.order.map(pawn => pawn.isDead()));
        let reduceIndex = 0;
        this.state.order = this.state.order.filter(
            (p, i) => {if (deadStates[i] && i < this.state.nextPawnIndex) reduceIndex++; return !deadStates[i];}
        );
        this.state.nextPawnIndex -= reduceIndex;
        if (this.state.nextPawnIndex >= this.state.order.length)
            this.state.nextPawnIndex = 0;
        // Do something on turn end? Maybe some turn-transition animation?
        if (this.checkGameFinished())
            await promiseSetTimeout(() => this.endGame(), this.turnEndDelay);
        else
            await promiseSetTimeout(() => this.startNextTurn(), this.turnEndDelay);
    }

    checkGameFinished() {
        if (this.state.order.length === 0) return true;
        let firstOwner = this.state.order[0].owner;
        for (let pawn of this.state.order)
            if (pawn.owner !== firstOwner) return false;
        this.state.winner = firstOwner;
        return true;
    }

    newRound () {
        this.state.roundCount++;
        console.log("New round!");
    }

    endGame() {
        if (this.state.winner === 'player')
        {
            document.getElementById('score').innerText = this.calculateScore('player').toString();
            document.getElementById('mapname').innerText = this.state.map;
            this.menuManager.changeState('finish-win');
        }
        else this.menuManager.changeState('finish-lose');
    }

    calculateScore(owner) {
        // Score is calculated based on remaining pawns, their remaining hp and used rounds.
        let remainingPawns = this.state.order.filter(p => p.owner === owner);
        let score = remainingPawns.length * 1000;
        score += remainingPawns.reduce((s, p) => s += Math.floor(p.stats.hp / p.stats.maxHp * 500), 0);
        score += 1 / Math.sqrt(this.state.roundCount) * 5000;
        return score;
    }

    startNewGame = () => {
        this.state.currentState = 'none';
        this.state.order = null;
        this.state.currentPawn = null;
        this.state.nextPawnIndex = 0;
        this.state.roundCount = 1;
        this.state.winner = null;
        this.state.map = null;
        this.battlefield.reset();
        // Pawn placing logic here
        let scenario = ScenarioManager.getRandomScenario();
        this.state.map = scenario.name;
        scenario.preset.forEach(preset => this.battlefield.addPawnTo(preset.class, preset.pos[1], preset.pos[0], preset.owner));
        //

        this.calculateTurnOrder();
        this.startNextTurn();
    }
}