/**
 * Base class for status bars.
 * Handles percentage state and image resolution.
 */
class StatusBar extends DrawableObject {
  percentage = 0;

  /**
   * Creates a StatusBar with default dimensions.
   */
  constructor() {
    super();
    this.width = 200;
    this.height = 60;
    this.images = [];
  }

  /**
   * Loads status bar images.
   * @param {string[]} images
   */
  load(images) {
    this.images = images;
    this.loadImages(images);
  }

  /**
   * Sets the current percentage and updates the displayed image.
   * @param {number} percentage
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Resolves the image index based on the current percentage.
   * @returns {number}
   */
  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage >= 80) {
      return 4;
    } else if (this.percentage >= 60) {
      return 3;
    } else if (this.percentage >= 40) {
      return 2;
    } else if (this.percentage >= 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
