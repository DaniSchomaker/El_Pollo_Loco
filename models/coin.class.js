class Coin extends CollectableObject {
  IMAGES = [
    "img/8_coin/coin_1.png",
    "img/8_coin/coin_2.png"
  ];

  offset = {
    // für die Collision: innerer roter Kasten
    top: 55,
    bottom: 55,
    left: 35,
    right: 35,
  };

  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.img = this.imageCache[this.IMAGES[0]];
    this.setRandomPosition(400, 1800, 100, 200);
    this.animate();
  }

  animate() {
    setStoppableInterval(() => {
      this.playAnimation(this.IMAGES);
    }, 700);
  }
}

