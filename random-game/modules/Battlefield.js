

class Cell {
    battlefield = null;
    cellElement = null;
    // Each cell can have on pawn at a time
    pawn = null;
    posX = 0;
    posY = 0;
    pathfindingDistance = -1;
    handlers = null;

    constructor(cellElement, battlefield, posX, posY) {
        this.cellElement = cellElement;
        this.battlefield = battlefield;
        this.posX = posX;
        this.posY = posY;
        this.handlers = {
            'leftclick': [],
            'rightclick': []
        };
        this.initializeCell();
    }

    initializeCell = () => {
        this.cellElement.classList.add('cell');
        this.cellElement.addEventListener('click', this.processClick);
    }

    addPawn = (pawnClass, owner) => {
        let pawnElem = document.createElement('div');
        let pawn = new pawnClass(pawnElem, this, owner);
        this.cellElement.append(pawnElem);
        this.pawn = pawn;
        return pawn;
    }

    getAdjacent = () => {
        let adjacent = [];
        if (this.posY > 0)
            adjacent.push(this.battlefield.grid[this.posX][this.posY - 1]);
        if (this.posY < this.battlefield.grid[0].length - 1)
            adjacent.push(this.battlefield.grid[this.posX][this.posY + 1]);
        if (this.posX > 0) {
            adjacent.push(this.battlefield.grid[this.posX - 1][this.posY]);
            if (this.posY > 0)
                adjacent.push(this.battlefield.grid[this.posX - 1][this.posY - 1]);
            if (this.posY < this.battlefield.grid[0].length - 1)
                adjacent.push(this.battlefield.grid[this.posX - 1][this.posY + 1]);
        }
        if (this.posX < this.battlefield.grid.length - 1) {
            adjacent.push(this.battlefield.grid[this.posX + 1][this.posY]);
            if (this.posY > 0)
                adjacent.push(this.battlefield.grid[this.posX + 1][this.posY - 1]);
            if (this.posY < this.battlefield.grid[0].length - 1)
                adjacent.push(this.battlefield.grid[this.posX + 1][this.posY + 1]);
        }
        return adjacent;
    }

    showMovement = (turnManager) => {
        this.cellElement.classList.add('movement');
        this.addHandler('leftclick', (ev, to) => turnManager.movePawnTo(to));
    }

    showTarget = (turnManager, attackingPawn) => {
        this.pawn.showTarget(attackingPawn);
        this.pawn.addHandler('leftclick', (ev, to) => turnManager.attackPawnTo(to));
        this.addHandler('leftclick', (ev, to) => turnManager.attackPawnTo(to.pawn));
    }

    removeOverlays = () => {
        this.cellElement.classList.remove('movement');
        this.clearHandlers('leftclick');
        if (this.pawn) {
            this.pawn.hideTarget();
            this.pawn.clearHandlers('leftclick');
        }

    }

    // Only left click is implemented currently. Handlers must accept event and thisobj as arguments.
    processClick = (event) => {
        for (let handler of this.handlers.leftclick) {
            handler(event, this);
        }
    }

    addHandler = (eventType, handler) => this.handlers[eventType].push(handler);
    clearHandlers = (eventType) => this.handlers[eventType] = [];

    destroy = () => {
        if (this.pawn) this.pawn.destroy();
        this.cellElement.remove();
    }
}


export default class Battlefield {

    fieldElement = null;
    grid = [];
    // This array does not track if pawn is dead (it is only tracked at turn-manager level
    pawns = [];

    constructor(fieldElement) {
        this.fieldElement = fieldElement;
        this.spawnCells();
    }

    // Not universal. Depends on exact dimensions of field and cell
    spawnCells = () => {
        for (let i = 0; i < 9; i++){
            this.grid.push([]);
            for(let j = 0; j < 9; j++)
            {
                let cell = document.createElement('div');
                let cellObject = new Cell(cell, this, i, j);
                this.grid[i].push(cellObject);
                this.fieldElement.append(cell);
            }
        }
    }

    addPawnTo = (pawnClass, posX, posY, owner = 'player') => {
        let pawn = this.grid[posX][posY].addPawn(pawnClass, owner);
        this.pawns.push(pawn);
    }

    showMovement (pawn, turnManager) {
        let cell = pawn.currentCell;
        let allowedCells = this.wideSearch(cell, pawn.stats.spd);
        allowedCells.forEach(c => c.showMovement(turnManager));
        return allowedCells;
    }

    showPossibleAttacks(pawn, turnManager) {
        let cellsInReach = this.wideSearch(pawn.currentCell, pawn.stats.range, false);
        cellsInReach = cellsInReach.filter(c => c.pawn !== null && (pawn.canTargetAllies || c.pawn.owner !== pawn.owner));
        cellsInReach.forEach(c => c.showTarget(turnManager, pawn));
        return cellsInReach;
    }

    hideCellOverlays() {
        this.grid.flat().forEach(c => c.removeOverlays());
    }

    wideSearch(cell, range, ignoreInhabited = true) {
        this.resetCellsPF();
        let queue = [cell];
        cell.pathfindingDistance = 0;
        while (queue.length !== 0) {
            let current = queue.shift();
            let adjacent = current.getAdjacent();
            adjacent.forEach(adj => {
                if (!(ignoreInhabited && adj.pawn !== null)
                    && (adj.pathfindingDistance === -1 || adj.pathfindingDistance > current.pathfindingDistance + 1)) {
                    adj.pathfindingDistance = current.pathfindingDistance + 1;
                    if (adj.pathfindingDistance < range)
                        queue.push(adj);
                }
            });
        }
        this.grid.flat().filter(el => el.pathfindingDistance > 0 && el.pathfindingDistance <= range)
            .forEach(c => c.cellElement.dataset['pf'] = c.pathfindingDistance);
        return this.grid.flat().filter(el => el.pathfindingDistance > 0 && el.pathfindingDistance <= range);
    }

    //Find any suitable path. Range is used to cull far-placed cells. Path cannot contain pawned cells
    findPath(start, finish, pawn, range = null) {
        //TODO: As optimisation, can use previously calculated distances, if they are not tainted.
        // WARNING! For pathfinding after showing movement cells it is tainted, because wideSearch with attack range was also used
        //Calculate distances
        // console.log(start, finish);
        this.wideSearch(start, range !== null ? range : pawn.stats.spd);
        // Find path
        let path = [];
        let current = finish;
        // Ad hoc fix for finding path to cell with pawn. Set current pathfinding distance to minimal of adjacent + 1
        if (current.pathfindingDistance === -1)
            current.pathfindingDistance = current.getAdjacent()
                .reduce((s, x) => s > x.pathfindingDistance && x.pathfindingDistance !== -1 ? x.pathfindingDistance : s, 100) + 1;
        while (current !== start)
        {
            path.unshift(current);
            let adjacent = current.getAdjacent();
            // console.log("Adjacent:");
            current = adjacent.find(c => c === start || (c.pawn === null && c.pathfindingDistance === current.pathfindingDistance - 1));
            if (current === undefined)
                return null;
        }
        return path;
    }

    resetCellsPF() {
        // console.log("PF RESET");
        this.grid.forEach(row => row.forEach(cell => cell.pathfindingDistance = -1));
        // this.grid.forEach(row => row.forEach(cell => cell.cellElement.dataset['pf'] = ""));
    }

    reset() {
        this.grid.flat().forEach(cell => cell.destroy());
        this.grid = [];
        this.pawns = [];
        this.spawnCells();
    }

}