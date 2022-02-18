

class Cell {
    cellElement = null;
    posX = 0;
    posY = 0;
    constructor(cellElement, posX, posY) {
        this.cellElement = cellElement;
        this.posX = posX;
        this.posY = posY;
        this.initializeCell();
    }

    initializeCell = () => {
        this.cellElement.classList.add('cell');
    }

    addPawn = (pawnClass) => {
        let pawnElem = document.createElement('div');
        let pawn = new pawnClass(pawnElem, this);
        this.cellElement.append(pawnElem);
        return pawn;
    }
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
                let cellObject = new Cell(cell, i, j);
                this.grid[i].push(cellObject);
                this.fieldElement.append(cell);
            }
        }
    }

    addPawnTo = (pawnClass, posX, posY) => {
        let pawn = this.grid[posX][posY].addPawn(pawnClass);
        this.pawns.push(pawn);
    }

}