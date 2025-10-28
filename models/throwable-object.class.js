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

// startSplash() {
//   if (this.hasHit) return;
//   this.hasHit = true;

//   // Bewegung stoppen
//   this.speed = 0;
//   this.speedY = 0;
//   this.acceleration = 0;

//   // Splash einmalig abspielen (dauert automatisch so lang wie Frames vorhanden sind)
//   this.playAnimationOnce(this.IMAGES_BOTTLE_SPLASH);

//   // nach kurzer Zeit entfernen (z. B. 500–800 ms)
//   setTimeout(() => {
//     this.markedForRemoval = true;
//   }, 800);
// }


startSplash() {
  // if (this.hasHit) return;
  this.hasHit = true;

  // Bewegung stoppen
  this.speed = 0;
  this.speedY = 0;
  this.acceleration = 0;

  // Splash-Frames EINMAL abspielen, dann Flasche entfernen
  let i = 0;
  const frames = this.IMAGES_BOTTLE_SPLASH;
  const timer = setInterval(() => {
    if (i >= frames.length) {
      clearInterval(timer);
      this.markedForRemoval = true; // World filtert später raus
      return;
    }
    const path = frames[i++];
    const img = this.imageCache?.[path];
    if (img) this.img = img; // defensiv
  }, 80); 
}

}
