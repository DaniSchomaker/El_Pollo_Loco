class Character extends MovableObject {
  height = 280;
  y = 90;
  speed = 10;
  coins = 0;
  bottles = 0;
  lastThrow = 0; // Zeitpunkt des letzten Wurfs in ms
  MAX_BOTTLES = 5;

  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_LONG_IDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
  ];

  world; // damit wir auf das Keyboard aus der World zugreifen können???

  offset = {
    // für die Collidion: innerer roter Kasten
    top: 120,
    bottom: 25,
    left: 30,
    right: 30,
  };

  justStomped = false; // "Flag" --> kurz nach Stomp keinen Gegenschaden kassieren

  //////////////////////////////////////////////////////////////////////////////////////

  constructor() {
    super().loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.applyGravity();
    this.animate();
  }

  animate() {
    this.lastActionTime = Date.now();
    this.isWalkingSoundPlaying = false; // Sound-Flag

    // Bewegung & Kamera (60 FPS)
    setStoppableInterval(() => {
      let didAction = false;
      let moving = false;

      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.moveRight();
        this.otherDirection = false;
        moving = true;
        didAction = true;
      }

      if (this.world.keyboard.LEFT && this.x > 0) {
        this.moveLeft();
        this.otherDirection = true;
        moving = true;
        didAction = true;
      }

      if (this.world.keyboard.SPACE && !this.isAboveGround()) {
        this.jump();
        SoundHub.playOne(SoundHub.jump);

        // --- Laufgeräusch sofort stoppen beim Sprung ---
        if (this.isWalkingSoundPlaying) {
          SoundHub.pauseOne(SoundHub.walking);
          this.isWalkingSoundPlaying = false;
        }

        didAction = true;
      }

      // --- Soundsteuerung für Laufen ---
      if (moving && !this.isWalkingSoundPlaying) {
        SoundHub.playOne(SoundHub.walking);
        this.isWalkingSoundPlaying = true;
      } else if (!moving && this.isWalkingSoundPlaying) {
        SoundHub.pauseOne(SoundHub.walking);
        this.isWalkingSoundPlaying = false;
      }

      // Kamera & Position
      if (didAction) this.lastActionTime = Date.now();
      this.world.camera_x = -this.x + 100;
      this.lastY = this.y;
    }, 1000 / 60);

    // Animationen (20 FPS)
    setStoppableInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
        if (this.speedY > 0 && this.currentImage > 3) this.currentImage = 3;
        if (this.speedY < 0 && this.currentImage > 4) this.currentImage = 7;
        this.playAnimation(this.IMAGES_JUMPING);
      } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playAnimation(this.IMAGES_WALKING);
      
      } else {
        this.playAnimation(this.IMAGES_IDLE);
      }
    }, 50);

    // Idle / Long-Idle (5 FPS)
    setStoppableInterval(() => {
      const k = this.world.keyboard;
      const inactiveSec = (Date.now() - this.lastActionTime) / 1000;
      const isIdle =
        !this.isDead() &&
        !this.isHurt() &&
        !this.isAboveGround() &&
        !k.RIGHT &&
        !k.LEFT &&
        !k.SPACE;

      if (!isIdle) return;
      if (inactiveSec >= 15) {
        this.playAnimation(this.IMAGES_LONG_IDLE);

        if (!SoundHub.isMuted) {
          SoundHub.playOne(SoundHub.snoring);
        }
      } else {
        this.playAnimation(this.IMAGES_IDLE);
      }
    }, 300);
  }

  canThrow() {
    // damit nicht mehrere Flaschen direkt geworfen werden
    let timePassed = Date.now() - this.lastThrow;
    timePassed = timePassed / 1000; // in Sekunden
    return timePassed > 0.3; // 300 ms Cooldown
  }
}
