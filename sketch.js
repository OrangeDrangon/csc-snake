const directions = {
    'north': 0,
    'south': 1,
    'east': 2,
    'west': 3,
};

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Snake {
    constructor(size, resolution) {
        this.size = size;
        this.resolution = resolution;
        this.gameover = true;
        this.pendingFood = 0;
        this.direction = directions.east;
        this.body = new Array(0);
        return;
    }

    startGame() {
        if (!this.gameover) return;
        this.pendingFood = 25;
        this.body = new Array(0);
        this.body.push(new Point(this.size / 2, this.size / 2));
        this.gameover = false;
        return;
    }

    move() {
        if (this.gameover) return;
        const head = this.body[this.body.length - 1];

        if (this.direction === directions.north) {
            this.body.push(new Point(head.x, head.y - this.resolution));
        } else if (this.direction === directions.south) {
            this.body.push(new Point(head.x, head.y + this.resolution));
        } else if (this.direction === directions.east) {
            this.body.push(new Point(head.x + this.resolution, head.y));
        } else if (this.direction === directions.west) {
            this.body.push(new Point(head.x - this.resolution, head.y));
        }

        if (this.pendingFood === 0) {
            this.body.splice(0, 1);
        } else {
            this.pendingFood--;
        }
        return;
    }

    detectDeath() {
        if (this.body.length < 25) return;
        const head = this.body[this.body.length - 1];
        if (head.x > this.size || head.x < 0 || head.y > this.size || head.y < 0) {
            this.gameover = true;
            return;
        }
        for (let i = 0; i < this.body.length - 1; i++) {
            const segment = this.body[i];
            if (Math.abs(head.x - segment.x) <= this.resolution/2 && Math.abs(head.y - segment.y) <= this.resolution/2) {
                    this.gameover = true;
                    return;
                }
        }
        return;
    }
}

const SIZE = 500;
const RESOLUTION = 3;
let snake;

function setup() {
    createCanvas(SIZE, SIZE);
    background(51);

    snake = new Snake(SIZE, RESOLUTION);
    snake.startGame();

    noStroke();
    rectMode(CENTER);
}

function draw() {
    if (!snake.gameover) {
        background(51);
        fill(255);
        snake.move();
        snake.detectDeath();

    } else {
        fill(255, 0, 0);
    }
    for (const segment of snake.body) {
        rect(segment.x, segment.y, RESOLUTION, RESOLUTION);
    }
}

function keyPressed(event) {
    key = event.code;
    if (key === 'ArrowUp' && snake.direction !== directions.south) snake.direction = directions.north;
    else if (key === 'ArrowDown' && snake.direction !== directions.north) snake.direction = directions.south;
    else if (key === 'ArrowRight' && snake.direction !== directions.west) snake.direction = directions.east;
    else if (key === 'ArrowLeft' && snake.direction !== directions.east) snake.direction = directions.west;
}
