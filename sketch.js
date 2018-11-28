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
        return;
    }
}

class Food {
    constructor(size) {
        this.location = new Point(random(50, size - 49), random(50, size - 49));
        this.size = size
        return;
    }

    move() {
        this.location.x = random(50, this.size - 49);
        this.location.y = random(50, this.size - 49);
        return;
    }
}

class Snake {
    constructor(size, resolution) {
        this.size = size;
        this.resolution = resolution;
        this.gameover = true;
        this.pendingFood = 0;
        this.direction;
        this.body;
        this.score = 0;
        this.hasMoved = false;
        this.paused = false;
        return;
    }

    startGame() {
        if (!this.gameover) return;
        this.pendingFood = 25;
        this.direction = directions.east;
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
        this.hasMoved = true;
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
            if (Math.abs(head.x - segment.x) <= this.resolution / 2 &&
                Math.abs(head.y - segment.y) <= this.resolution / 2) {
                this.gameover = true;
                return;
            }
        }
        return;
    }

    detectFood(food) {
        const head = this.body[this.body.length - 1];
        if (Math.abs(head.x - food.location.x) <= this.resolution &&
            Math.abs(head.y - food.location.y) <= this.resolution) {
            food.move();
            this.pendingFood += 10;
            this.score++;
        }
        return;
    }
}

const SIZE = 750;
const RESOLUTION = 10;
let snake;
let food;

function setup() {
    createCanvas(SIZE, SIZE);
    background(51);

    snake = new Snake(SIZE, RESOLUTION);
    food = new Food(SIZE);
    snake.startGame();

    noStroke();
    rectMode(CENTER);
    textFont('Arial');
    textSize(50);
    textAlign(CENTER);
    return;
}

function draw() {
    if (snake.paused) {
        text('Paused', SIZE/2, SIZE/2)
    } else if (snake.gameover) {
        fill(255, 0, 0);
    } else {
        background(51);
        fill(255);
        snake.move();
        snake.detectDeath();
        snake.detectFood(food);
    }
    for (const segment of snake.body) {
        rect(segment.x, segment.y, RESOLUTION, RESOLUTION);
    }
    rect(food.location.x, food.location.y, RESOLUTION, RESOLUTION);
    text(snake.score.toString(), 25, 50);
    return;
}

function keyPressed(event) {
    if (snake.hasMoved) {
        key = event.code;
        if (key === 'ArrowUp' && snake.direction !== directions.south) snake.direction = directions.north;
        else if (key === 'ArrowDown' && snake.direction !== directions.north) snake.direction = directions.south;
        else if (key === 'ArrowRight' && snake.direction !== directions.west) snake.direction = directions.east;
        else if (key === 'ArrowLeft' && snake.direction !== directions.east) snake.direction = directions.west;
        snake.hasMoved = false;
    }
    if (key === 'Enter') snake.startGame();
    else if (key === 'Escape') snake.paused = !snake.paused;
    return;
}
