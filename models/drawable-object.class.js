/**
 * Base class for all drawable game objects.
 * Handles image loading, drawing, and animation playback.
 */
class DrawableObject {
  x = 120;
  y = 280;
  img;
  height = 150;
  width = 100;
  imageCache = {};
  currentImage = 0;

  /**
   * Loads a single image.
   * @param {string} path
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Loads multiple images into the internal cache.
   * @param {string[]} arr
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Draws the current image onto the canvas.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Optional debug frame drawing (currently inactive).
   * @param {CanvasRenderingContext2D} ctx
   */
  drawFrame(ctx) {}

  /**
   * Plays an animation by cycling through a list of images.
   * @param {string[]} images
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }
}
