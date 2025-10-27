class Chicken extends MovableObject {
  y = 365; // y-Achse aus der Oberklasse wird überschrieben
  height = 60;
  width = 60;
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);

    this.x = 200 + Math.random() * 500; // Startpunkt: 200px + zufälliger Wert zwischen 0 und 500
    this.speed = 0.15 + Math.random() * 0.5;

    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.dead) return;
      this.moveLeft();
    }, 1000 / 60); // Alle 1000/60 Millisekunden wird das zwischen {} ausgeführt

    setInterval(() => {
      // Bilderanmiation
      if (this.dead) {
        this.playAnimation(this.IMAGES_DEAD);
        return;
      }
      this.playAnimation(this.IMAGES_WALKING);
    }, 200);
  }

    die() {
    this.health = 0;
    this.speed = 0;
    this.dead = true;

    // nach kurzer Zeit entfernen
    setTimeout(() => {
      this.markedForRemoval = true;
    }, 800);
  }
}

