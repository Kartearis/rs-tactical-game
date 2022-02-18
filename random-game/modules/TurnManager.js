

// Turn consists of two phases: movement then attack. Attack can be made instead of movement, but it ends turn.
export default class TurnManager {

    state = {
        currentPawn: null,
        currentState: 'none',
        order: null,
        nextPawnIndex: 0
    };
    stateHandlers = {
      'currentPawn': [],
      'currentState': [],
      'order': [],
      'nextPawnIndex': []
    };


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
        this.state.currentPawn = this.state.order[this.state.nextPawnIndex];
        this.state.currentState = 'move-phase';
        this.state.nextPawnIndex++;
        this.battlefield.showMovement(this.state.currentPawn, this);
        // Also show available targets here
    }

    async movePawnTo (cell) {
        this.battlefield.hideCellOverlays();
        let path = this.battlefield.findPath(this.state.currentPawn.currentCell, cell, this.state.currentPawn);
        await this.state.currentPawn.move(path);
        this.state.currentState = 'attack-phase';
    }
}