class ThrowableObject extends MovableObject {
  // speedY = 30;
  // speedX = 20;

  speedX = 10; // Standard: nach rechts

  hasHit = false;

  IMAGES_BOTTLE_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png"
  ];

  IMAGES_BOTTLE_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  constructor(x, y) {
    super().loadImage("img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png");
    this.loadImages(this.IMAGES_BOTTLE_ROTATION);
    this.loadImages(this.IMAGES_BOTTLE_SPLASH);
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;
    this.throw();
  }

  throw() {
    this.speedY = 30;
    this.applyGravity();

    // Bewegung (horizontal)
    setInterval(() => {
      if (this.hasHit) return; // nach Treffer: Bewegung stoppen
      this.x += this.speedX;
    }, 25);

    // Flug-Animation (Rotation)
    setInterval(() => {
      if (this.hasHit) return; // nach Treffer: keine Animation mehr
      this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
    }, 80); 

    if (this.hasHit) {console.log("Bottle has hit");
    }
  }

  markHit() {
    this.hasHit = true;
    this.speed = 0;
    this.speedY = 0;
    this.acceleration = 0;
    
    //this.playAnimation(this.IMAGES_SPLASH);
  }
}
