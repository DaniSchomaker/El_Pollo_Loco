class Chicken extends BasicEnemy {
  y = 365;
  height = 60;
  width = 60;
  health = 20;

  offset = { top: 10, bottom: 10, left: 10, right: 10 };

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);

    this.x = 200 + Math.random() * 2000;
    this.speed = 0.1 + Math.random() * 0.5;

    this.animate(); // kommt jetzt aus BasicEnemy
  }
}

