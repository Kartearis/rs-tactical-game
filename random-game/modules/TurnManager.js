
import promiseSetTimeout from "./PromisedTimeout.js";
// Turn consists of two phases: movement then attack. Attack can be made instead of movement, but it ends turn.
export default class TurnManager {

    state = {
        currentPawn: null,
        currentState: 'none',
        order: null,
        nextPawnIndex: 0,
        roundCount: 1
    };
    stateHandlers = {
      'currentPawn': [],
      'currentState': [],
      'order': [],
      'nextPawnIndex': []
    };

    turnEndDelay = 1000;
    battlefield = null;

    constructor(battlefield) {
        self = this;
        this.battlefield = battlefield;
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
        this.state.order = [...this.battlefield.pawns].sort((x, y) => x.stats.init > y.stats.init ? 1
            : x.stats.init < y.stats.init ? -1
                : x.stats.spd > y.stats.spd ? 1 : x.stats.spd === y.stats.spd ? 0 : -1);
    }

    startNextTurn () {
        if (!this.state.order) throw new Error("Order is not defined yet!");
        if (this.state.nextPawnIndex >= this.state.order.length)
        {
            this.state.nextPawnIndex = 0;
            this.newRound();
        }
        this.state.currentPawn = this.state.order[this.state.nextPawnIndex];
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
        // Do something on turn end? Maybe some turn-transition animation?
        // TODO: CHECK END OF GAME HERE!
        await promiseSetTimeout(() => this.startNextTurn(), this.turnEndDelay);
    }

    newRound () {
        this.state.roundCount++;
        console.log("New round!");
    }
}