class ChickenSmall extends BasicEnemy {
  y = 378;
  height = 45;
  width = 45;
  health = 20;

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png"
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  offset = { top: 5, bottom: 10, left: 10, right: 10 };

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);

    this.x = 200 + Math.random() * 2000;
    this.speed = 0.3 + Math.random() * 0.5;

    this.animate(); // kommt jetzt aus BasicEnemy
  }
}
