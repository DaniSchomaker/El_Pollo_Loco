class StatusBar extends DrawableObject {
  percentage = 0;

  constructor() {
    super();
    this.width = 200;
    this.height = 60;
    this.images = [];
  }

  load(images) {
    this.images = images;
    this.loadImages(images);
  }

  // // setPercentage (50);
  setPercentage(percentage) {
    this.percentage = percentage; // => Zahl zwischen 0 und 5 ermitteln
    let path = this.IMAGES[this.resolveImageIndex()]; // das passende Bild wird rausgesucht
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5; // denn ich möchte das 5. Bild
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
