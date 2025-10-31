class ThrowableObject extends MovableObject {
  height = 60;
  width = 50;
  speedX = 10; // Standard: nach rechts
  // GROUND_LEVEL = 370;

  offset = {
    top: 20, 
    bottom: 20,
    left: 15,
    right: 15,
  };

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
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png"
  ];

  constructor(x, y) {
    super().loadImage(
      "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png"
    );
    this.loadImages(this.IMAGES_BOTTLE_ROTATION);
    this.loadImages(this.IMAGES_BOTTLE_SPLASH);
    this.x = x;
    this.y = y;
    this.throw();
  }

  throw() {
    this.speedY = 30;
    this.applyGravity();

    // const GROUND_LEVEL = 430;

    // Bewegung (horizontal)
    setStoppableInterval(() => {
      if (this.hasHit) return; // nach Treffer: Bewegung stoppen
      this.x += this.speedX;

      // Prüfen, ob Flasche auf den Boden trifft → Splash abspielen
      const ground = this.world.level.groundLevel; // vereinfachen?
      if (this.y + this.height >= ground) {
        this.startSplash();
      }
    }, 25);

    // Flug-Animation (Rotation)
    setStoppableInterval(() => {
      if (this.hasHit) return; // nach Treffer: keine Animation mehr
      this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
    }, 80);
  }

  startSplash() {
    // if (this.hasHit) return;
    this.hasHit = true;
    SoundHub.playOne(SoundHub.bottleShattering);

   
    // Bewegung stoppen
    this.speed = 0;
    this.speedY = 0;
    this.acceleration = 0;
    

    // Splash-Frames EINMAL abspielen, dann Flasche entfernen
    let i = 0;
    // let frames = this.IMAGES_BOTTLE_SPLASH;
    let intervalTimerSplash = setStoppableInterval(() => {
      if (i >= this.IMAGES_BOTTLE_SPLASH.length) {
        clearInterval(intervalTimerSplash);
        this.markedForRemoval = true; // World filtert später raus
        return;
      }
      let path = this.IMAGES_BOTTLE_SPLASH[i++]; // Nächsten Splash-Frame-Pfad aus dem Array holen und Index hochzählen
      this.img = this.imageCache[path]; // Bild aus dem Cache laden und als aktuelles Sprite setzen
    }, 80);
  }
}
