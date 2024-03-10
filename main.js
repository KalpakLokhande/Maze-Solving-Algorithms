const canvas = document.getElementById('canvas')
const canvasDF = document.getElementById('canvasDF')
const canvasBF = document.getElementById('canvasBF')

const clr = document.getElementById('clr')
const solve = document.getElementById('solve')


canvas.height = 400;
canvas.width = 400;
const ctx = canvas.getContext("2d")
canvasDF.height = 400;
canvasDF.width = 400;
const ctxDF = canvasDF.getContext("2d")
canvasBF.height = 400;
canvasBF.width = 400;
const ctxBF = canvasBF.getContext("2d")

const cellSize = 20
let Grid;


clr.onclick = () => {

    localStorage.clear()

    location.reload()

}


Grid = createGrid()
current = Grid[0]

createMaze().then(() => {

    draw(Grid, ctxDF)
    draw(Grid, ctxBF)

    let gridForDF = JSON.parse(JSON.stringify(Grid))
    let goalDF = gridForDF[gridForDF.length - 1]
    let gridForBF = JSON.parse(JSON.stringify(Grid))
    let goalBF = gridForBF[gridForBF.length - 1]


    solve.onclick = () => {
        
        let time = Date.now()

        PathFindingDF(gridForDF, goalDF, ctxDF).then(() => document.getElementById("DFTime").innerHTML = `Time : ${(Date.now() - time) / 1000}` + 's')
        PathFindingBF(gridForBF, goalBF, ctxBF).then(() => document.getElementById("BFTime").innerHTML = `Time : ${(Date.now() - time) / 1000}` + 's')

    }

})





let Goal = Grid[Grid.length - 1]

function Seeker(cell) {

    this.cell = cell;

}

let s = new Seeker(Grid[0])
