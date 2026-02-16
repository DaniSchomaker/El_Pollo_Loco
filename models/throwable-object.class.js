/**
 * Represents a throwable bottle object with rotation and splash animations.
 */
class ThrowableObject extends MovableObject {
  height = 60;
  width = 50;
  speedX = 10;

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
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGES_BOTTLE_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /**
   * Creates a ThrowableObject at the given position and starts the throw behavior.
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    super().loadImage(
      "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
    );
    this.loadImages(this.IMAGES_BOTTLE_ROTATION);
    this.loadImages(this.IMAGES_BOTTLE_SPLASH);
    this.x = x;
    this.y = y;
    this.throw();
  }

  /**
   * Starts movement, gravity, and rotation animation until the bottle hits something.
   */
  throw() {
    this.speedY = 30;
    this.applyGravity();

    setStoppableInterval(() => {
      if (this.hasHit) return;
      this.x += this.speedX;

      const ground = this.world.level.groundLevel;
      if (this.y + this.height >= ground) {
        this.startSplash();
      }
    }, 25);

    setStoppableInterval(() => {
      if (this.hasHit) return;
      this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
    }, 80);
  }

  /**
   * Starts the splash animation, stops movement, and marks the object for removal.
   */
  startSplash() {
    this.hasHit = true;
    SoundHub.playOne(SoundHub.bottleShattering);

    this.speed = 0;
    this.speedY = 0;
    this.acceleration = 0;

    let i = 0;
    let intervalTimerSplash = setStoppableInterval(() => {
      if (i >= this.IMAGES_BOTTLE_SPLASH.length) {
        clearInterval(intervalTimerSplash);
        this.markedForRemoval = true;
        return;
      }
      let path = this.IMAGES_BOTTLE_SPLASH[i++];
      this.img = this.imageCache[path];
    }, 80);
  }
}
