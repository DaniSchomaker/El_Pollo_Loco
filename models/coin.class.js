/**
 * Represents a collectible coin object in the game world.
 */
class Coin extends CollectableObject {
  IMAGES = [
    "img/8_coin/coin_1.png",
    "img/8_coin/coin_2.png"
  ];

  offset = {
    top: 55,
    bottom: 55,
    left: 35,
    right: 35,
  };

  /**
   * Creates a Coin with animation and random position.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.img = this.imageCache[this.IMAGES[0]];
    this.setRandomPosition(400, 1800, 100, 200);
    this.animate();
  }

  /**
   * Starts the coin animation loop.
   */
  animate() {
    setStoppableInterval(() => {
      this.playAnimation(this.IMAGES);
    }, 700);
  }
}


