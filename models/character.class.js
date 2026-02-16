/**
 * Represents the main player character.
 * Handles movement, animations, idle/sleep behavior, throwing cooldowns, and camera control.
 */
class Character extends MovableObject {
  height = 280;
  y = 90;
  speed = 10;
  coins = 0;
  bottles = 0;
  lastThrow = 0;
  MAX_BOTTLES = 5;

  isSleeping = false;
  isWalkingSoundPlaying = false;

  SLEEP_AFTER_SECONDS = 15;
  THROW_COOLDOWN_S = 0.3;
  CAMERA_OFFSET_X = 100;

  JUMP_ASCEND_FRAME = 3;
  JUMP_DESCEND_FRAME = 7;

  deathStarted = false;
  deathStartTime = 0;
  DEATH_ANIMATION_MS = 350;

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

  world;
  offset = { top: 120, bottom: 25, left: 30, right: 30 };
  justStomped = false;

  /**
   * Creates a Character instance, loads images, applies gravity, and starts animations.
   */
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

  /**
   * Starts the character update intervals.
   */
  animate() {
    setStoppableInterval(() => this.handleMovement(), 1000 / 60);
    setStoppableInterval(() => this.updateAnimationState(), 50);
    setStoppableInterval(() => this.updateIdleAnimation(), 300);
  }

  /**
   * Handles movement input and related updates per tick.
   */
  handleMovement() {
    const keys = this.world.keyboard;
    let inputThrow = keys.D;
    if (inputThrow) this.resetSleep();

    let moved = this.handleHorizontalMovement();
    let jumped = this.handleJumpInput();
    let didAction = moved || jumped || inputThrow;

    this.updateWalkingSound(moved);
    this.updateActionTime(didAction);
    this.updateCameraPosition();
    this.lastY = this.y;
  }

  /**
   * Handles horizontal movement based on input.
   * @returns {boolean}
   */
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

  /**
   * Checks whether the character can move right.
   * @returns {boolean}
   */
  canMoveRight() {
    const keys = this.world.keyboard;
    return keys.RIGHT && this.x < this.world.level.level_end_x;
  }

  /**
   * Checks whether the character can move left.
   * @returns {boolean}
   */
  canMoveLeft() {
    const keys = this.world.keyboard;
    return keys.LEFT && this.x > 0;
  }

  /**
   * Handles jump input and triggers a jump if possible.
   * @returns {boolean}
   */
  handleJumpInput() {
    const keys = this.world.keyboard;
    if (!keys.SPACE || this.isAboveGround()) return false;

    this.handleJump();
    return true;
  }

  /**
   * Updates the current non-idle animation state.
   */
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

  /**
   * Determines whether the character is in a jumping state.
   * @returns {boolean}
   */
  isJumpingState() {
    return this.isAboveGround();
  }

  /**
   * Determines whether the character is in a walking state.
   * @returns {boolean}
   */
  isWalkingState() {
    const keys = this.world.keyboard;
    return keys.RIGHT || keys.LEFT;
  }

  /**
   * Adjusts jump animation frames based on vertical speed.
   */
  applyJumpFrameCorrections() {
    if (this.speedY > 0 && this.currentImage > this.JUMP_ASCEND_FRAME) {
      this.currentImage = this.JUMP_ASCEND_FRAME;
    }
    if (this.speedY < 0 && this.currentImage > 4) {
      this.currentImage = this.JUMP_DESCEND_FRAME;
    }
  }

  /**
   * Updates idle/sleep animations depending on player inactivity.
   */
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

  /**
   * Determines whether the character should be considered idle.
   * @param {Keyboard} keys
   * @returns {boolean}
   */
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

  /**
   * Returns seconds since last action.
   * @returns {number}
   */
  getInactiveSeconds() {
    return (Date.now() - this.lastActionTime) / 1000;
  }

  /**
   * Plays the idle animation.
   */
  playIdle() {
    if (this.isSleeping) this.resetSleep();
    this.playAnimation(this.IMAGES_IDLE);
  }

  /**
   * Plays the sleep animation and starts snoring sound if available.
   */
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

  /**
   * Resets sleep state and stops snoring sound if active.
   */
  resetSleep() {
    if (this.isSleeping) {
      this.isSleeping = false;
      if (SoundHub.snoring) {
        SoundHub.pauseOne(SoundHub.snoring);
        SoundHub.snoring.currentTime = 0;
      }
    }
  }

  /**
   * Triggers a jump and handles related sound state.
   */
  handleJump() {
    this.jump();
    SoundHub.playOne(SoundHub.jump);

    if (this.isWalkingSoundPlaying) {
      SoundHub.stopWalking();
      this.isWalkingSoundPlaying = false;
    }
  }

  /**
   * Updates walking sound playback based on movement state.
   * @param {boolean} moving
   */
  updateWalkingSound(moving) {
    if (moving && !this.isWalkingSoundPlaying) {
      SoundHub.startWalking();
      this.isWalkingSoundPlaying = true;
      return;
    }

    if (!moving && this.isWalkingSoundPlaying) {
      SoundHub.stopWalking();
      this.isWalkingSoundPlaying = false;
    }
  }

  /**
   * Updates last action timestamp when any action happened.
   * @param {boolean} didAction
   */
  updateActionTime(didAction) {
    if (didAction) this.lastActionTime = Date.now();
  }

  /**
   * Updates the camera position based on the character x-position.
   */
  updateCameraPosition() {
    this.world.camera_x = -this.x + this.CAMERA_OFFSET_X;
  }

  /**
   * Checks whether the character can throw based on cooldown.
   * @returns {boolean}
   */
  canThrow() {
    let timePassed = (Date.now() - this.lastThrow) / 1000;
    return timePassed > this.THROW_COOLDOWN_S;
  }

  /**
   * Resets sleep state and updates last action time for external actions.
   */
  wakeFromAction() {
    this.resetSleep();
    this.lastActionTime = Date.now();
  }

  /**
   * Initializes the death animation sequence.
   */
  startDeathSequence() {
    if (this.deathStarted) return;
    this.deathStarted = true;
    this.deathStartTime = Date.now();
    this.currentImage = 0;

    SoundHub.stopWalking();
    this.isWalkingSoundPlaying = false;
  }

  /**
   * Checks whether the death animation duration has elapsed.
   * @returns {boolean}
   */
  isDeathAnimationFinished() {
    if (!this.deathStarted) return false;
    return Date.now() - this.deathStartTime >= this.DEATH_ANIMATION_MS;
  }
}
