class Cell {

    constructor(x, y, row, column) {

        this.x = x;
        this.y = y;
        this.row = row
        this.column = column;

        this.visited = false;
        this.walked = false;
        this.isFinal = false;

        this.borders = [true, true, true, true]

    }

}