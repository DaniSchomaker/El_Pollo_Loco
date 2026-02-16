/**
 * Represents a collectible bottle object in the game world.
 */
class Bottle extends CollectableObject {
  width = 60;
  height = 90;

  IMAGES = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png"
  ];

  offset = {
    top: 14,
    bottom: 10,
    left: 22,
    right: 18,
  };

  /**
   * Creates a bottle with a random appearance and position.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);

    const randomIndex = Math.floor(Math.random() * this.IMAGES.length);
    this.img = this.imageCache[this.IMAGES[randomIndex]];

    this.setRandomPosition(400, 10 * 180, 335, 20);
  }
}


