class Bottle extends CollectableObject {
  width = 60;
  height = 90;

  IMAGES = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png"
  ];

  offset = {
    // für die Collidion: innerer roter Kasten
    top: 10,
    bottom: 10,
    left: 22,
    right: 18,
  };

  constructor() {
    super();
    this.loadImages(this.IMAGES);

    // Zufälliges Startbild (entweder 0 oder 1)
    const randomIndex = Math.floor(Math.random() * this.IMAGES.length);
    this.img = this.imageCache[this.IMAGES[randomIndex]];

    this.x = 400 + Math.floor(Math.random() * 10 * 180);
    this.y = 335 + Math.floor(Math.random() * 20);
  }
}
