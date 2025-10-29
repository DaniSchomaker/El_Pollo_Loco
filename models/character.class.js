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
    "img/2_character_pepe/2_walk/W-26.png"
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
    "img/2_character_pepe/3_jump/J-39.png"
  ];

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png"
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png"
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
    "img/2_character_pepe/1_idle/idle/I-10.png"
  ];

  IMAGES_LONG_IDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png"
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
    let lastActionTime = Date.now(); // merkt sich, wann zuletzt etwas getan wurde

    // === Bewegung & Kamera (60 FPS) ===
    setInterval(() => {
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.moveRight();
        this.otherDirection = false;
        lastActionTime = Date.now();
      }

      if (this.world.keyboard.LEFT && this.x > 0) {
        this.moveLeft();
        this.otherDirection = true;
        lastActionTime = Date.now();
      }

      if (this.world.keyboard.SPACE && !this.isAboveGround()) {
        this.jump();
        lastActionTime = Date.now();
      }

      this.world.camera_x = -this.x + 100;
      this.lastY = this.y; // merkt Y-Position für Stomp-Erkennung
    }, 1000 / 60);

    // === Standard-Animationen (20 FPS) ===
    setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
        return;
      }

      if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
        return;
      }

      if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
        return;
      }

      if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playAnimation(this.IMAGES_WALKING);
        return;
      }
    }, 50);

    // === Idle & Long-Idle (langsamer, 5 FPS) ===
    setInterval(() => {
      const inactiveFor = (Date.now() - lastActionTime) / 1000; // Sekunden seit letzter Aktion

      const isIdleState =
        !this.isDead() &&
        !this.isHurt() &&
        !this.isAboveGround() &&
        !this.world.keyboard.RIGHT &&
        !this.world.keyboard.LEFT &&
        !this.world.keyboard.SPACE;

      if (!isIdleState) return; // nur wenn nichts passiert

      if (inactiveFor >= 15) {
        // nach 15 Sekunden
        this.playAnimation(this.IMAGES_LONG_IDLE);
      } else {
        this.playAnimation(this.IMAGES_IDLE);
      }
    }, 200);
  }

  canThrow() {
    // damit nicht mehrere Flaschen direkt geworfen werden
    let timePassed = Date.now() - this.lastThrow;
    timePassed = timePassed / 1000; // in Sekunden
    return timePassed > 0.3; // 300 ms Cooldown
  }
}
