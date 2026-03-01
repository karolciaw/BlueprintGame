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
}
export default GameScene;
