

class Cell {
    battlefield = null;
    cellElement = null;
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

    addPawn = (pawnClass) => {
        let pawnElem = document.createElement('div');
        let pawn = new pawnClass(pawnElem, this);
        this.cellElement.append(pawnElem);
        return pawn;
    }

    getAdjacent = () => {
        let adjacent = [];
        if (this.posX > 0) {
            adjacent.push(this.battlefield.grid[this.posX - 1][this.posY]);
            if (this.posY > 0) {
                adjacent.push(this.battlefield.grid[this.posX - 1][this.posY - 1]);
                adjacent.push(this.battlefield.grid[this.posX][this.posY - 1]);
            }
            if (this.posY < this.battlefield.grid[0].length) {
                adjacent.push(this.battlefield.grid[this.posX - 1][this.posY + 1]);
                adjacent.push(this.battlefield.grid[this.posX][this.posY + 1]);
            }
        }
        if (this.posX < this.battlefield.grid.length - 1) {
            adjacent.push(this.battlefield.grid[this.posX + 1][this.posY]);
            if (this.posY > 0)
                adjacent.push(this.battlefield.grid[this.posX + 1][this.posY - 1]);
            if (this.posY < this.battlefield.grid[0].length)
                adjacent.push(this.battlefield.grid[this.posX + 1][this.posY + 1]);
        }
        return adjacent;
    }

    showMovement = (turnManager) => {
        this.cellElement.classList.add('movement');
        this.addHandler('leftclick', (ev, to) => turnManager.movePawnTo(to));
    }

    removeOverlays = () => {
        this.cellElement.classList.remove('movement');
        this.clearHandlers('leftclick');
    }

    // Only left click is implemented currently. Handlers must accept event and thisobj as arguments.
    processClick = (event) => {
        for (let handler of this.handlers.leftclick) {
            handler(event, this);
        }
    }

    addHandler = (eventType, handler) => this.handlers[eventType].push(handler);
    clearHandlers = (eventType) => this.handlers[eventType] = [];
}


export default class Battlefield {

    fieldElement = null;
    grid = [];
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

    addPawnTo = (pawnClass, posX, posY) => {
        let pawn = this.grid[posX][posY].addPawn(pawnClass);
        this.pawns.push(pawn);
    }

    showMovement (pawn, turnManager) {
        let cell = pawn.currentCell;
        let allowedCells = this.wideSearch(cell, pawn.stats.spd);
        allowedCells.forEach(c => c.showMovement(turnManager));
    }

    hideCellOverlays() {
        this.grid.flat().forEach(c => c.removeOverlays());
    }

    // TODO: Do not use cells with pawn for pf
    wideSearch(cell, range) {
        this.resetCellsPF();
        let queue = [cell];
        cell.pathfindingDistance = 0;
        while (queue.length !== 0) {
            let current = queue.shift();
            let adjacent = current.getAdjacent();
            adjacent.forEach(adj => {
                if (adj.pathfindingDistance === -1 || adj.pathfindingDistance > current.pathfindingDistance + 1) {
                    adj.pathfindingDistance = current.pathfindingDistance + 1;
                    if (adj.pathfindingDistance < range)
                        queue.push(adj);
                }
            });
        }
        return this.grid.flat().filter(el => el.pathfindingDistance !== -1 && el.pathfindingDistance <= range);
    }

    //Find any suitable path. Range is used to cull far-placed cells
    // TODO: Do not use cells with pawn for pf
    findPath(start, finish, pawn) {
        //TODO: As optimisation, can use previously calculated distances, if they are not tainted
        //Calculate distances
        this.wideSearch(start, pawn.stats.spd);
        // Find path
        let path = [];
        let current = finish;
        while (current !== start)
        {
            path.unshift(current);
            let adjacent = current.getAdjacent();
            current = adjacent.find(c => c.pathfindingDistance === current.pathfindingDistance - 1);
        }
        return path;
    }

    resetCellsPF() {
        this.grid.forEach(row => row.forEach(cell => cell.pathfindingDistance = -1));
    }

}