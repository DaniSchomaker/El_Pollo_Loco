class Character extends MovableObject {
  // ——— Eigenschaften & Konstanten ———
  height = 280;
  y = 90; // Muss noch geändert werden
  speed = 10;
  coins = 0;
  bottles = 0;
  lastThrow = 0; // Zeitpunkt des letzten Wurfs in ms
  MAX_BOTTLES = 5;

  // Zustandsflags
  isSleeping = false;
  isWalkingSoundPlaying = false;

  // Konfiguration
  SLEEP_AFTER_SECONDS = 15;
  THROW_COOLDOWN_S = 0.3;
  CAMERA_OFFSET_X = 100;

  // (1) Benannte Jump-Frames statt Magic Numbers
  JUMP_ASCEND_FRAME = 3;
  JUMP_DESCEND_FRAME = 7;

  deathStarted = false;
  deathStartTime = 0;
  DEATH_ANIMATION_MS = 350;

  // ——— Sprites ———
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
  IMAGES_SLEEP = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
  ];

  // ——— World & Kollision ———
  world; // Zugriff auf's Keyboard über world
  offset = { top: 120, bottom: 25, left: 30, right: 30 };
  justStomped = false; // kurz nach Stomp keinen Gegenschaden kassieren

  // ——— Konstruktor ———
  constructor() {
    super().loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_SLEEP);
    this.applyGravity();

    this.lastActionTime = Date.now();
    this.animate();
  }

  // ——— Hauptschleifen ———
  animate() {
    setStoppableInterval(() => this.handleMovement(), 1000 / 60);
    setStoppableInterval(() => this.updateAnimationState(), 50);
    setStoppableInterval(() => this.updateIdleAnimation(), 300);
  }

  // ——— Bewegung/Input ———
  handleMovement() {
    const keys = this.world.keyboard;
    let inputThrow = keys.D;
    if (inputThrow) this.resetSleep(); // (2) lokal bleibt bestehen; an Quelle s.u.

    let moved = this.handleHorizontalMovement();
    let jumped = this.handleJumpInput();
    let didAction = moved || jumped || inputThrow;

    this.updateWalkingSound(moved);
    this.updateActionTime(didAction);
    this.updateCameraPosition();
    this.lastY = this.y;
  }

  handleHorizontalMovement() {
    let moved = false;

    if (this.canMoveRight()) {
      this.moveRight();
      this.otherDirection = false;
      moved = true;
    }

    if (this.canMoveLeft()) {
      this.moveLeft();
      this.otherDirection = true;
      moved = true;
    }

    return moved;
  }

  canMoveRight() {
    const keys = this.world.keyboard;
    return keys.RIGHT && this.x < this.world.level.level_end_x;
  }

  canMoveLeft() {
    const keys = this.world.keyboard;
    return keys.LEFT && this.x > 0;
  }

  handleJumpInput() {
    const keys = this.world.keyboard;
    if (!keys.SPACE || this.isAboveGround()) return false;

    this.handleJump();
    return true;
  }

  // ——— Animationszustände (ohne Idle) ———
  updateAnimationState() {
    if (this.isDead()) {
      this.startDeathSequence();
      this.playAnimation(this.IMAGES_DEAD);
      return;
    }

    if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
      return;
    }

    if (this.isJumpingState()) {
      this.applyJumpFrameCorrections();
      this.playAnimation(this.IMAGES_JUMPING);
      return;
    }

    if (this.isWalkingState()) {
      this.playAnimation(this.IMAGES_WALKING);
      return;
    }
  }

  isJumpingState() {
    return this.isAboveGround();
  }

  isWalkingState() {
    const keys = this.world.keyboard;
    return keys.RIGHT || keys.LEFT;
  }

  applyJumpFrameCorrections() {
    if (this.speedY > 0 && this.currentImage > this.JUMP_ASCEND_FRAME) {
      this.currentImage = this.JUMP_ASCEND_FRAME;
    }
    if (this.speedY < 0 && this.currentImage > 4) {
      this.currentImage = this.JUMP_DESCEND_FRAME;
    }
  }

  // ——— Idle / Sleep ———
  updateIdleAnimation() {
    const keys = this.world.keyboard;

    if (!this.isIdleState(keys)) {
      this.resetSleep();
      return;
    }

    const inactiveSeconds = this.getInactiveSeconds();

    if (inactiveSeconds >= this.SLEEP_AFTER_SECONDS) {
      this.playSleep();
    } else {
      this.playIdle();
    }
  }

  // Idle/Sleep-Helfer
  isIdleState(keys) {
    return (
      !this.isDead() &&
      !this.isHurt() &&
      !this.isAboveGround() &&
      !keys.RIGHT &&
      !keys.LEFT &&
      !keys.SPACE &&
      !keys.D
    );
  }

  getInactiveSeconds() {
    return (Date.now() - this.lastActionTime) / 1000;
  }

  playIdle() {
    if (this.isSleeping) this.resetSleep();
    this.playAnimation(this.IMAGES_IDLE);
  }

  playSleep() {
    if (!this.isSleeping) {
      this.isSleeping = true;
      if (SoundHub.snoring) {
        SoundHub.snoring.loop = true;
        SoundHub.playOne(SoundHub.snoring);
      }
    }
    this.playAnimation(this.IMAGES_SLEEP);
  }

  resetSleep() {
    if (this.isSleeping) {
      this.isSleeping = false;
      if (SoundHub.snoring) {
        SoundHub.pauseOne(SoundHub.snoring);
        SoundHub.snoring.currentTime = 0;
      }
    }
  }

  // ——— Sonstige Helfer ———
  handleJump() {
    this.jump();
    SoundHub.playOne(SoundHub.jump);

    // (3) Walking-Sound über Hub kapseln
    if (this.isWalkingSoundPlaying) {
      SoundHub.stopWalking();
      this.isWalkingSoundPlaying = false;
    }
  }

  updateWalkingSound(moving) {
    if (moving && !this.isWalkingSoundPlaying) {
      SoundHub.startWalking(); // (3)
      this.isWalkingSoundPlaying = true;
      return;
    }

    if (!moving && this.isWalkingSoundPlaying) {
      SoundHub.stopWalking(); // (3)
      this.isWalkingSoundPlaying = false;
    }
  }

  updateActionTime(didAction) {
    if (didAction) this.lastActionTime = Date.now();
  }

  updateCameraPosition() {
    this.world.camera_x = -this.x + this.CAMERA_OFFSET_X;
  }

  canThrow() {
    let timePassed = (Date.now() - this.lastThrow) / 1000;
    return timePassed > this.THROW_COOLDOWN_S;
  }

  // (2) Quelle-API: kann von World bei Wurf/anderen Aktionen aufgerufen werden
  wakeFromAction() {
    this.resetSleep();
    this.lastActionTime = Date.now();
  }

  startDeathSequence() {
    if (this.deathStarted) return;
    this.deathStarted = true;
    this.deathStartTime = Date.now();
    this.currentImage = 0;

    SoundHub.stopWalking();
    this.isWalkingSoundPlaying = false;
  }

  isDeathAnimationFinished() {
    if (!this.deathStarted) return false;
    return Date.now() - this.deathStartTime >= this.DEATH_ANIMATION_MS;
  }
}
