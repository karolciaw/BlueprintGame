import Phaser from "phaser";
import GameScene from "./gameScene";

// TODO 1: Move this GameScene into gameScene.js, a new file
class SceneName extends Phaser.Scene {
	constructor() {
		super( "SceneName" );
	}
	preload() {
	// called at the beginning to load assets
		this.load.image("logo", "asset_link_here.png");
		this.load.image("enemy", "assets/enemy.png");
	}
	createLogo() {
	// called after preload method
		this.add.image(400, 300, "logo");
	}
	
	updateLivesLabel() {
		this.livesLabel.setText("lives: " + this.lives);
	}
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

addEnemy() {
	if (this.level == 1){
		let enemy = this.enemies.create(400,300, "enemy");
		enemy.body.bounce.x = 1;
		enemy.body.velocity.x = 100;
		let enemy = this.enemies.create(400,300, "enemy");
		enemy.body.bounce.x = 1;
		enemy.body.velocity.x = 100;
		let enemy = this.enemies.create(400,300, "enemy");
		enemy.body.bounce.x = 1;
		enemy.body.velocity.x = 100;

		
//copy this for other enemies
	}

	if (this.level == 2){

		let enemy = this.enemies.create(400,300,"enemy");
		enemy.body.bounce.x = 1;
		enemy.body.velocity.x = 100;
		let enemy = this.enemies.create(400,300, "enemy");
		enemy.body.bounce.x = 1;
		enemy.body.velocity.x = 100;
		let enemy = this.enemies.create(400,300, "enemy");
		enemy.body.bounce.x = 1;
		enemy.body.velocity.x = 100;


	}

	if (this.level == 3){		

		let enemy = this.enemies.create(400,300, "enemy");
		enemy.body.bounce.x = 1;
		enemy.body.velocity.x = 100;
		let enemy = this.enemies.create(400,300, "enemy");
		enemy.body.bounce.x = 1;
		enemy.body.velocity.x = 100;
		let enemy = this.enemies.create(400,300, "enemy");
		enemy.body.bounce.x = 1;
		enemy.body.velocity.x = 100;


	}

}


	
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
				this.scene.start("WelcomeScene");
			}
		},
	});
}
} 
// TODO 2: Update app.js to IMPORT the GameScene from gameScene.js


	/**
	 * Called once. Create any objects you need here!
	 */
	

	
		// TODO 7.2: add liveslabel variable (text shown) an update for it

		// create the player sprite
		this.player = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height / 2, "player");

		// player movement animations
		this.anims.create({
			key: "right",
			frames: this.anims.generateFrameNumbers("player", { frames: [1, 2] }),
			frameRate: 8,
			repeat: -1,
		});
		this.anims.create({
			key: "left",
			frames: this.anims.generateFrameNumbers("player", { frames: [3, 4] }),
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
	

	

	/**
	 * Creates the walls of the game
	 */
	

	/**
	 * Phaser calls this function once a frame (60 times a second).
	 *
	 * Use this function to move the player in response to actions,
	 * check for win conditions, etc.
	 */
	

	/**
	 * Handles moving the player with the arrow keys
	 */
	

	/**
	 * Check to see whether the player has collided with any coins
	 */
	

	/**
	 * Move the coin to a different random location
	 */
	

	/**
	 * Create a new enemy
	 */
	
	/*
	* Called when the player dies. Restart the game
	*/
		



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
	


// TODO 3: Add WelcomeScene
class WelcomeScene extends Phaser.Scene {
	// you want a constructor(), preload(), and create() function

	// TODO 4: Add a create() function that displays a welcome message.
	// TODO 6: Add logic to start the game (switching scenes) to the create() function
}

// config! 
const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 560,
	// TODO 5: Add WelcomeScene to the list of scenes. Think about the order!
	scene: [GameScene], 
	physics: {
		default: "arcade",
	},
	backgroundColor: "#3498db",
};

const game = new Phaser.Game(config);
