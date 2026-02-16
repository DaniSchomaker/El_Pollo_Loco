/**
 * Represents a moving cloud in the background.
 */
class Cloud extends MovableObject {
  y = 50;
  width = 500;
  height = 250;

  /**
   * Creates a Cloud instance at a given x-position.
   * @param {string} path
   * @param {number} x
   */
  constructor(path, x) {
    super().loadImage(path);
    this.x = x;
    this.animate();
  }

  /**
   * Starts horizontal movement and loops the cloud when it leaves the screen.
   */
  animate() {
    setStoppableInterval(() => {
      this.moveLeft();

      if (this.x + this.width < 0) {
        this.x = 720 * 4;
      }
    }, 1000 / 60);
  }
}
