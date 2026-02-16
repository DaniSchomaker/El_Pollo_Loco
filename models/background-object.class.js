/**
 * Represents a static background element within the game world.
 * Extends MovableObject but does not include movement logic.
 */
class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;

  /**
   * Creates a background object at a given x-position.
   * @param {string} imagePath
   * @param {number} x
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
