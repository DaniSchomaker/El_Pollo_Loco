class Chicken extends MovableObject {
  y = 365; // y-Achse aus der Oberklasse wird überschrieben
  height = 60;
  width = 60;
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
  ];

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");

    this.x = 200 + Math.random() * 500; // Startpunkt: 200px + zufälliger Wert zwischen 0 und 500
    this.speed = 0.15 + Math.random() * 0.5;

    this.loadImages(this.IMAGES_WALKING);
    this.animate();
  }

  animate() {

    this.moveLeft();

    setInterval(() => { // Bilderanmiation
      let i = this.currentImage % this.IMAGES_WALKING.length; // % "Modulu" = Rest (let i = % 6) --> fängt nach Ende des Arrays immer wieder von vorne an
      let path = this.IMAGES_WALKING[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 200);
  }
}
