class Walker {

    constructor(cell) {

        this.cell = cell
    }

    draw() {

        ctx.save()
        ctx.fillStyle = 'green'
        ctx.beginPath()
        // ctx.fillRect(this.cell.x, this.cell.y, cellSize, cellSize)
        ctx.arc(this.cell.x + cellSize / 2 , this.cell.y + cellSize / 2 , 8, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

    }

}