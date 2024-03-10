function createGrid() {

    let grid = []
    let rowIndex = 0
    let columnIndex = 0;

    for (let i = 0; i < canvas.width; i += cellSize) {

        for (let j = 0; j < canvas.height; j += cellSize) {


            if (columnIndex > canvas.width / cellSize - 1) {

                columnIndex = 0

            }

            let c = new Cell(j, i, rowIndex, columnIndex)
            grid.push(c)

            columnIndex++

        }

        rowIndex++

    }


    return grid

}

function draw(grid, ctx) {

    grid.forEach(cell => {

        ctx.save()
        ctx.lineCap = 'round'
        ctx.strokeStyle = 'black'
        ctx.lineWidth = '3'

        if (cell.borders[0]) {

            //TOP

            ctx.beginPath()
            ctx.moveTo(cell.x, cell.y)
            ctx.lineTo(cell.x + cellSize, cell.y)
            ctx.stroke()

        }
        if (cell.borders[1]) {

            //RIGHT

            ctx.beginPath()
            ctx.moveTo(cell.x + cellSize, cell.y)
            ctx.lineTo(cell.x + cellSize, cell.y + cellSize)
            ctx.stroke()

        }

        if (cell.borders[2]) {

            //BOTTOM

            ctx.beginPath()
            ctx.moveTo(cell.x + cellSize, cell.y + cellSize)
            ctx.lineTo(cell.x, cell.y + cellSize)
            ctx.stroke()

        }

        if (cell.borders[3]) {

            //LEFT

            ctx.beginPath()
            ctx.moveTo(cell.x, cell.y)
            ctx.lineTo(cell.x, cell.y + cellSize)
            ctx.stroke()

        }

        ctx.restore()

    });

}

function getNeighbour(cell) {

    let neighbours = []

    if (Grid[Grid.indexOf(cell) + 1] && Grid[Grid.indexOf(cell) + 1].row === cell.row) {

        neighbours.push(Grid[Grid.indexOf(cell) + 1])

    }
    if (Grid[Grid.indexOf(cell) - 1] && Grid[Grid.indexOf(cell) - 1].row === cell.row) {

        neighbours.push(Grid[Grid.indexOf(cell) - 1])

    }
    if (Grid[Grid.indexOf(cell) + canvas.height / cellSize] && Grid[Grid.indexOf(cell) + canvas.height / cellSize].column === cell.column) {

        neighbours.push(Grid[Grid.indexOf(cell) + canvas.height / cellSize])

    }
    if (Grid[Grid.indexOf(cell) - canvas.height / cellSize] && Grid[Grid.indexOf(cell) - canvas.height / cellSize].column === cell.column) {

        neighbours.push(Grid[Grid.indexOf(cell) - canvas.height / cellSize])

    }


    return neighbours

}

function createMaze() {

    return new Promise((resolve) => {


        let current = Grid[0]
        let stack = []

        const Search = setInterval(() => {

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            ctx.save()
            ctx.fillStyle = 'red'
            ctx.beginPath()
            ctx.fillRect(current.x, current.y, cellSize, cellSize)
            ctx.restore()

            let possibles = []
            let Neighbours = getNeighbour(current)


            for (let i = 0; i < Neighbours.length; i++) {

                if (!Neighbours[i].visited) {

                    possibles.push(Neighbours[i])

                }

            }

            current.visited = true

            let Next = possibles[Math.floor(Math.random() * possibles.length)]

            if (possibles.length > 0) {


                if (Next.row === current.row + 1) {

                    current.borders[2] = false;
                    Next.borders[0] = false;

                }
                if (Next.row === current.row - 1) {

                    current.borders[0] = false;
                    Next.borders[2] = false;

                }
                if (Next.column === current.column + 1) {

                    current.borders[1] = false;
                    Next.borders[3] = false;

                }
                if (Next.column === current.column - 1) {

                    current.borders[3] = false;
                    Next.borders[1] = false;

                }

                current = Next

                stack.push(current)


            } else if (stack.length > 0) {

                current = stack.pop()

            }
            else {

                clearInterval(Search)
                resolve()

            }

            draw(Grid, ctx)

        }, 10);

    })
}


function PathFindingBF(Grid, Goal, ctx) {

    return new Promise((resolve) => {


        const queue = [];

        const search = setInterval(() => {

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let sortList = [];
            let possibles = [];

            const currentCell = queue.shift();

            if (!currentCell) {
                clearInterval(search);
                return;
            }

            currentCell.walked = true;

            if (Goal.walked) {

                let pathCell = Goal;
                while (pathCell !== Grid[0]) {
                    ctx.save();
                    ctx.fillStyle = 'tomato';
                    ctx.fillRect(pathCell.x, pathCell.y, cellSize, cellSize);
                    ctx.restore();
                    pathCell = pathCell.parent;
                }

                console.log(queue.length);

                clearInterval(search);
                resolve()

            }

            if (currentCell.borders[0] === false) {
                sortList.push(Grid[Grid.indexOf(currentCell) - canvas.height / cellSize]);
            }
            if (currentCell.borders[1] === false) {
                sortList.push(Grid[Grid.indexOf(currentCell) + 1]);
            }
            if (currentCell.borders[2] === false) {
                sortList.push(Grid[Grid.indexOf(currentCell) + canvas.height / cellSize]);
            }
            if (currentCell.borders[3] === false) {
                sortList.push(Grid[Grid.indexOf(currentCell) - 1]);
            }

            for (let i = 0; i < sortList.length; i++) {

                if (!sortList[i].walked) {

                    possibles.push(sortList[i]);
                    queue.push(sortList[i]);
                    sortList[i].parent = currentCell;


                }

            }

            for (let i = 0; i < Grid.length; i++) {

                if (Grid[i].walked && !Grid[i].isFinal) {

                    ctx.save();
                    ctx.fillStyle = 'rgba(255,0,0,0.4)';
                    ctx.beginPath();
                    ctx.fillRect(Grid[i].x, Grid[i].y, cellSize, cellSize);
                    ctx.restore();

                }

                if (Grid[i].isFinal) {

                    ctx.save();
                    ctx.fillStyle = 'rgba(0,200,0,1)';
                    ctx.beginPath();
                    ctx.fillRect(Grid[i].x, Grid[i].y, cellSize, cellSize);
                    ctx.restore();

                }

            }

            draw(Grid, ctx);

        }, 20);

        queue.push(Grid[0]);

    })

}


function PathFindingDF(Grid, Goal, ctx) {

    return new Promise((resolve) => {

        let currentCell = Grid[0]

        let stack = []

        const search = setInterval(() => {

            ctx.clearRect(0, 0, canvas.width, canvas.height)
            let sortList = []
            let possibles = []

            ctx.save()
            ctx.beginPath()
            ctx.fillStyle = 'rgba(0,0,0,0.4)'
            ctx.fillRect(currentCell.x, currentCell.y, cellSize, cellSize)
            ctx.restore()

            currentCell.walked = true;

            if (Goal.walked) {

                for (let i = 0; i < stack.length; i++) {

                    ctx.save()
                    ctx.fillStyle = 'tomato'
                    ctx.beginPath()
                    ctx.fillRect(stack[i].x, stack[i].y, cellSize, cellSize)
                    ctx.restore()

                }

                console.log(stack.length)

                clearInterval(search)
                resolve()

            }


            if (currentCell.borders[0] === false) {

                sortList.push(Grid[Grid.indexOf(currentCell) - canvas.height / cellSize])

            }
            if (currentCell.borders[1] === false) {

                sortList.push(Grid[Grid.indexOf(currentCell) + 1])

            }
            if (currentCell.borders[2] === false) {

                sortList.push(Grid[Grid.indexOf(currentCell) + canvas.height / cellSize])

            }
            if (currentCell.borders[3] === false) {

                sortList.push(Grid[Grid.indexOf(currentCell) - 1])

            }

            for (let i = 0; i < sortList.length; i++) {

                if (sortList[i].walked === false) {

                    possibles.push(sortList[i])

                }

            }



            let Next = possibles[Math.floor(Math.random() * possibles.length)]

            if (possibles.length > 0) {

                stack.push(currentCell)
                currentCell = Next

            } else if (stack.length > 0) {

                currentCell = stack.pop()

            } else {

                clearInterval(search)

            }

            for (let i = 0; i < Grid.length; i++) {

                if (Grid[i].walked && !Grid[i].isFinal) {

                    ctx.save()
                    ctx.fillStyle = 'rgba(255,0,0,0.4)'
                    ctx.beginPath()
                    ctx.fillRect(Grid[i].x, Grid[i].y, cellSize, cellSize)
                    ctx.restore()

                }

                if (Grid[i].isFinal) {

                    ctx.save()
                    ctx.fillStyle = 'rgba(0,200,0,1)'
                    ctx.beginPath()
                    ctx.fillRect(Grid[i].x, Grid[i].y, cellSize, cellSize)
                    ctx.restore()

                }

            }

            draw(Grid, ctx)

        }, 20)

    })

}