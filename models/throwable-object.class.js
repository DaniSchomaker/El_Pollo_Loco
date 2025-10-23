class ThrowableObject extends MovableObject {
  // speedY = 30;
  // speedX = 20;

  hasHit = false;

  constructor(x, y) {
    super().loadImage("img/6_salsa_bottle/salsa_bottle.png");
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;
    this.throw();
  }

  throw() {
    this.speedY = 30;
    this.applyGravity();
    setInterval(() => {
        this.x += 10;
    }, 25);

  }

    markHit() {
    this.hasHit = true;
    this.speed = 0;
    this.speedY = 0;
    this.acceleration = 0;
    // Optional: Splash anzeigen oder später entfernen
    // this.playAnimation(this.IMAGES_SPLASH);
  }
}
