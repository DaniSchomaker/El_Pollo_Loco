/**
 * Represents the endboss enemy with activation, alert, attack, hurt, and death states.
 * Handles animation switching, movement logic, and timed combat behavior.
 */
class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 60;

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  offset = { top: 160, bottom: 100, left: 60, right: 40 };

  is_active = false;
  trigger_x = 1600;

  alert_until = 0;
  hurt_until = 0;
  attack_until = 0;
  next_attack_at = 0;

  attack_duration_ms = 800;
  attack_cooldown_ms = 2500;
  hurt_duration_ms = 600;
  alert_duration_ms = 1200;

  /**
   * Creates an Endboss instance.
   * Loads all animation images, sets initial position and speed,
   * and starts animation and movement intervals.
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);

    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);

    this.x = 2500;
    this.speed = 4;

    this.animate();
  }

  /**
   * Activates the endboss behavior.
   * Starts the alert phase and schedules the first possible attack.
   * Does nothing if already active.
   *
   * @returns {void}
   */
  activate() {
    if (this.is_active) return;

    this.is_active = true;

    const now = Date.now();
    this.alert_until = now + this.alert_duration_ms;
    this.next_attack_at =
      now + this.alert_duration_ms + this.attack_cooldown_ms;
  }

  /**
   * Applies damage to the endboss.
   * Triggers the hurt phase and interrupts any ongoing attack.
   *
   * @returns {void}
   */
  hit() {
    super.hit();
    const now = Date.now();
    this.hurt_until = now + this.hurt_duration_ms;
    this.attack_until = 0;
  }

  /**
   * Starts animation and movement update intervals.
   * Animation runs slower than movement logic.
   *
   * @returns {void}
   */
  animate() {
    setStoppableInterval(() => this.updateAnimation(), 200);
    setStoppableInterval(() => this.updateMovement(), 50);
  }

  /**
   * Updates the current animation state depending on boss status and timers.
   * Priority order:
   * Dead → Hurt → Alert → Attack → Walking
   *
   * @returns {void}
   */
  updateAnimation() {
    const now = Date.now();

    if (this.shouldPlayDead()) {
      this.playAnimation(this.IMAGES_DEAD);
      return;
    }

    if (this.shouldPlayHurt(now)) {
      this.playAnimation(this.IMAGES_HURT);
      return;
    }

    if (this.shouldPlayAlert(now)) {
      this.playAnimation(this.IMAGES_ALERT);
      return;
    }

    if (this.shouldPlayAttack(now)) {
      this.playAnimation(this.IMAGES_ATTACK);
      return;
    }

    this.playAnimation(this.IMAGES_WALKING);
  }

  /**
   * Updates movement and attack timing.
   * Handles attack triggering and horizontal movement.
   *
   * @returns {void}
   */
  updateMovement() {
    if (!this.canMove()) return;

    const now = Date.now();

    if (this.isStillAlerting(now)) return;

    if (this.shouldTriggerAttack(now)) {
      this.triggerAttack(now);
    }

    this.moveLeft();
  }

  /**
   * Determines whether the dead animation should be played.
   *
   * @returns {boolean}
   */
  shouldPlayDead() {
    return this.isDead();
  }

  /**
   * Determines whether the hurt animation should be played.
   *
   * @param {number} now - Current timestamp.
   * @returns {boolean}
   */
  shouldPlayHurt(now) {
    return now < this.hurt_until;
  }

  /**
   * Determines whether the alert animation should be played.
   *
   * @param {number} now - Current timestamp.
   * @returns {boolean}
   */
  shouldPlayAlert(now) {
    return this.is_active && now < this.alert_until;
  }

  /**
   * Determines whether the attack animation should be played.
   *
   * @param {number} now - Current timestamp.
   * @returns {boolean}
   */
  shouldPlayAttack(now) {
    return this.is_active && now < this.attack_until;
  }

  /**
   * Checks whether the boss is allowed to move.
   *
   * @returns {boolean}
   */
  canMove() {
    return this.is_active && !this.isDead();
  }

  /**
   * Determines whether the boss is still in the alert phase.
   *
   * @param {number} now - Current timestamp.
   * @returns {boolean}
   */
  isStillAlerting(now) {
    return now < this.alert_until;
  }

  /**
   * Determines whether a new attack should be triggered.
   *
   * @param {number} now - Current timestamp.
   * @returns {boolean}
   */
  shouldTriggerAttack(now) {
    return now >= this.next_attack_at && now >= this.hurt_until;
  }

  /**
   * Triggers an attack phase and schedules the next attack window.
   *
   * @param {number} now - Current timestamp.
   * @returns {void}
   */
  triggerAttack(now) {
    this.attack_until = now + this.attack_duration_ms;
    this.next_attack_at = now + this.attack_cooldown_ms;
  }
}
