import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene")
  }
  preload() {
    this.load.spritesheet("player", "assets/duckPlayerRun1Down.png", {
      frameWidth: 20,
      frameHeight: 20,
    });

    this.load.image("tileset", "assets/tileset.png");
    // created with Tiled tilemap editor
    this.load.tilemapTiledJSON("map", "assets/map.json");

    this.load.image("coin", "assets/rubberDuck.png");
    this.load.image("enemy", "assets/enemy.png");


    this.load.audio("jump", ["assets/jump.ogg", "assets/jump.mp3"]);
    this.load.audio("coin", ["rubberDuck.ogg", "rubberDuck.mp3"]);
    this.load.audio("dead", ["assets/dead.ogg", "assets/dead.mp3"]);

    this.load.image("pixel", "assets/pixel.png");
  }
  // create the player sprite
  create() {
    // create the player sprite
    this.player = this.physics.add.sprite(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "player",
    );

    // player movement animations
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", { frames: ["assets/DuckPlayerRunRight1.png", "assets/DuckPlayerRunRight2.png"] }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", { frames: ["assets/DuckPlayerRunLeft1.png", "assets/DuckPlayerRunLeft2.png"] }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("player", { frames: ["assets/DuckPlayerRunUp1.png", "assets/DuckPlayerRunUp2.png"] }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("player", { frames: ["assets/DuckPlayerRunDown1.png", "assets/DuckPlayerRunDown2.png"] }),
      frameRate: 8,
      repeat: -1,
    });

    // create arrow keys
    this.cursors = this.input.keyboard.createCursorKeys();

    this.createWalls();

    // Make the player collide with walls
    this.physics.add.collider(this.player, this.walls);

    this.coin = this.physics.add.sprite(0, 0, "coin");
    this.moveCoin();

    // Display the score
    this.scoreLabel = this.add.text(30, 25, "score: 0", {
      font: "18px Arial",
      fill: "#ffffff",
    });

    this.score = 0;

    this.lives = 3;
    this.livesLabel = this.add.text(30, 50, "", {
      font: "18px Arial",
      fill: "#ffffff",
    });
    this.updateLivesLabel();
    this.livesLabel.setText("lives: " + this.lives);


    // add enemies!
    this.enemies = this.physics.add.group();
    // call this.addEnemy() once every 2.2 seconds
    this.time.addEvent({
      delay: 2200,
      callback: () => this.addEnemy(),
      loop: true,
    });
    // Make the enemies and walls collide
    this.physics.add.collider(this.enemies, this.walls);
    // If the player collides with an enemy, restart the game
    this.physics.add.collider(this.player, this.enemies, () => {
      this.handlePlayerDeath();
    });


    this.coinSound = this.sound.add("coin");
    this.deadSound = this.sound.add("dead");

    // particles for when the player dies
    // the initial location doesn't matter -- we'll set the location
    // in handlePlayerDeath()
    this.emitter = this.add.particles(0, 0, "pixel", {
      // how many particles
      quantity: 15,
      // min/max speed of the particles, in pixels per second
      speed: { min: -150, max: 150 },
      // scale the particles from 2x original size to 0.1x
      scale: { start: 2, end: 0.1 },
      // how long the particles last, milliseconds
      lifespan: 800,
      // don't start the explosion right away
      emitting: false,
    });
  }

  /**
   * Creates the walls of the game
   */
  createWalls() {
    // create the tilemap
    let map = this.add.tilemap("map");

    // Add the tileset to the map
    // the first parameter is the name of the tileset in Tiled
    // the second parameter is the name of the tileset in preload()
    let tileset = map.addTilesetImage("tileset", "tileset");
    this.walls = map.createLayer("Level 1", tileset);

    // Enable collisions for the first tile (the blue walls)
    this.walls.setCollision(1);
  }
  /**
   * Phaser calls this function once a frame (60 times a second).
   *
   * Use this function to move the player in response to actions,
   * check for win conditions, etc.
   */
  update() {
    if (!this.player.active) {
      // the player is dead
      return;
    }

    this.movePlayer();
    this.checkCoinCollisions();

    // If the player goes out of bounds (ie. falls through a hole),
    // the player dies
    if (this.player.y > this.game.config.height || this.player.y < 0) {
      this.handlePlayerDeath();
    }
  }

  /**
   * Handles moving the player with the arrow keys
   */
  movePlayer() {
    // check for active input
    if (this.cursors.left.isDown) {
      // move left
      this.player.body.velocity.x = -200;
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      // move right
      this.player.body.velocity.x = 200;
      this.player.anims.play("right", true);
    } else {
      // stop moving in the horizontal
      this.player.body.velocity.x = 0;
      this.player.setFrame(0);
    }

    if (this.cursors.up.isDown) {
      // move up
      this.player.body.velocity.y = -200;
      this.player.anims.play("up", true);
    } else if (this.cursors.down.isDown) {
      // move down
      this.player.body.velocity.y = 200;
      this.player.anims.play("down", true);
    } else {
      // stop moving in the vertical
      this.player.body.velocity.y = 0;
    }
  }

  /**
   * Check to see whether the player has collided with any coins
   */
  checkCoinCollisions() {
    if (this.physics.overlap(this.player, this.coin)) {
      // the player has taken a coin!
      // add 5 to the score
      this.score += 5;
      // update the score label
      this.scoreLabel.setText("score: " + this.score);
      // move the coin to a new spot
      this.moveCoin();
      this.coinSound.play();
    }
  }

  /**
   * Move the coin to a different random location
   */
  moveCoin() {
    let positions = [
      { x: 120, y: 135 },
      { x: 680, y: 135 },
      { x: 120, y: 295 },
      { x: 680, y: 295 },
      { x: 120, y: 455 },
      { x: 680, y: 455 },
    ];
    positions = positions.filter(
      (p) => !(p.x == this.coin.x && p.y == this.coin.y),
    );

    let newPosition = Phaser.Math.RND.pick(positions);
    this.coin.setPosition(newPosition.x, newPosition.y);
    this.coin.setScale(0);
  }


  /**
   * Create a new enemy
   */
  addEnemy() {
    if (this.level == 1) {
      let enemy1 = this.enemies.create(400, 300, "enemy");
      enemy1.body.bounce.x = 1;
      enemy1.body.velocity.x = 100;
      let enemy2 = this.enemies.create(400, 300, "enemy");
      enemy2.body.bounce.x = 1;
      enemy2.body.velocity.x = 100;
      let enemy3 = this.enemies.create(400, 300, "enemy");
      enemy3.body.bounce.x = 1;
      enemy3.body.velocity.x = 100;


      //copy this for other enemies
    }

    if (this.level == 2) {

      let enemy4 = this.enemies.create(400, 300, "enemy");
      enemy4.body.bounce.x = 1;
      enemy4.body.velocity.x = 100;
      let enemy5 = this.enemies.create(400, 300, "enemy");
      enemy5.body.bounce.x = 1;
      enemy5.body.velocity.x = 100;
      let enemy6 = this.enemies.create(400, 300, "enemy");
      enemy6.body.bounce.x = 1;
      enemy6.body.velocity.x = 100;
    }

    if (this.level == 3) {

      let enemy7 = this.enemies.create(400, 300, "enemy");
      enemy7.body.bounce.x = 1;
      enemy7.body.velocity.x = 100;
      let enemy8 = this.enemies.create(400, 300, "enemy");
      enemy8.body.bounce.x = 1;
      enemy8.body.velocity.x = 100;
      let enemy9 = this.enemies.create(400, 300, "enemy");
      enemy9.body.bounce.x = 1;
      enemy9.body.velocity.x = 100;
    }
  }
  /*
  * Called when the player dies. Restart the game
  */

  handlePlayerDeath() {
    this.scene.restart();
    consol.log("i'm dead");
    this.deadSound.play();
    this.emitter.explode(this.emitter.quantity, this.player.x, this.player.y);

    // we can't immediately restart the scene; otherwise our particles will disappear
    // delete the player
    this.player.setVisible(false);
    this.player.setActive(false);
    // delete all the enemies
    this.enemies.clear(true, true);

    // TODO 7.4: decrement lives and update the lives label
    this.lives -= 1;
    this.updateLivesLabel();
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (this.lives > 0) {
          this.player.setVisible(true);
          this.player.setActive(true);
          this.player.setPosition(
            this.game.config.width / 2,
            this.game.config.height / 2,
          );
        } else {
          this.scene.start("welcomeScene");
        }
      },
    });


    // restart the scene after 1 second
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        // TODO 7.5: we don't just want to restard, we want to change based on if we have lives left!! 
        if (this.lives > 0) {
          // TODO 7.6: set what we want to do if there are still lives left
        } else {
          // TODO 7.7: what do you want to do instead? maybe go back to welcomescene?
          this.scene.restart()
        }
      }
    });

  }
}
export default GameScene; 