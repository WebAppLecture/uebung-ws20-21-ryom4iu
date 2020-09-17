import { GameTemplate } from "./GameTemplate.js";
import { GameObject, Ball } from "../GameObject.js";
import { Paddle } from "./Pong.js";

export class FallingStones extends GameTemplate {
  start() {
    this.gameOver = false;
    this.paddleSpeed = 5;
    this.stoneSpeed = 2;
    this.maxStoneSpeed = 3;
    this.paddle = new Paddle(200 - 50 / 2, 500 - 50, 50, 50, this.paddleSpeed);
    this.bullets = [];
    this.stones = [];
    this.canShoot = true;
    this.points = 0;
    this.lives = 5;
    // speed up every 10 seconds
    this.speedUpTimer = setInterval(() => {
      this.stoneSpeed = Math.min(this.stoneSpeed * 1.01, this.maxStoneSpeed);
    }, 10000);
    this.stoneTimer = setInterval(this.spawnStone.bind(this), this.stoneInterval);
  }

  end() {
    clearInterval(this.stoneTimer);
    clearInterval(this.speedUpTimer);
    clearTimeout(this.bulletTimer);
    this.gameOver = true;
    this.gameOverText = ["GAME OVER", "Points: " + this.points, "Restart: E"];
  }

  bindControls() {
    this.inputBinding = {
      "left": this.paddle.left.bind(this.paddle),
      "right": this.paddle.right.bind(this.paddle),
      "secondary": this.shootBullet.bind(this),
    };
  }

  update(ctx) {
    this.paddle.update(ctx);
    this.updateBullets(ctx);
    this.updateStones(ctx);
  }

  draw(ctx) {
    this.paddle.draw(ctx);
    this.drawLives(ctx);
    this.drawBullets(ctx);
    this.drawStones(ctx);
  }

  shootBullet(ctx) {
    if (!this.canShoot)
      return;
    this.canShoot = false;
    this.bullets.push(new Ball(
        this.paddle.x + this.paddle.width / 2 - 10 / 2,
        this.paddle.y - 10,
        10, 10, "#6bd26b", 0, -4));
    this.bulletTimer = setTimeout(() => { this.canShoot = true; }, this.shootTimeout);
  }

  spawnStone(ctx) {
    const size = { w: 50, h: 100 };
    this.stones.push(new Ball(
        Math.floor(Math.random() * (400 - size.w)),
        0, size.w, size.h, "#6bd26b", 0, this.stoneSpeed));
  }

  updateBullets(ctx) {
    // using filter to prevent holes
    this.bullets = this.bullets.filter((bullet) => {
      bullet.update(ctx);
      // find the first colliding stone (-1 if none)
      let collidx = this.stones.findIndex((stone) => stone && GameObject.rectangleCollision(bullet, stone));
      if (collidx !== -1) {
        this.stones.splice(collidx, 1);
        ++this.points;
        return false;
      }
      return !bullet.borderCollision(ctx);
    });
  }

  updateStones(ctx) {
    // using filter to prevent holes
    this.stones = this.stones.filter((stone) => {
      stone.update(ctx);
      let collisions = stone.borderCollision(ctx);
      if (collisions && collisions.includes(Ball.COLLISIONS.DOWN)) {
        if (!--this.lives)
          this.end();
        return false;
      }
      return true;
    });
  }

  drawLives(ctx) {
    ctx.fillStyle = "#000000";
    ctx.font = "30px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.lives,
      this.paddle.x + this.paddle.width / 2,
      this.paddle.y + this.paddle.height / 2);
  }

  drawBullets(ctx) {
    for (let bullet of this.bullets)
      bullet.draw(ctx);
  }

  drawStones(ctx) {
    for (let stone of this.stones)
      stone.draw(ctx);
  }

  static get NAME() {
    return "Falling Stones";
  }

  static get MODES() {
    return [
      {
        NAME: "easy",
        parameters: {
          "shootTimeout": 400,
          "stoneInterval": 2000,
        }
      }, {
        NAME: "medium",
        parameters: {
          "shootTimeout": 600,
          "stoneInterval": 1500,
        }
      }, {
        NAME: "hard",
        parameters: {
          "shootTimeout": 800,
          "stoneInterval": 1000,
        }
      },
    ];
  }
}
