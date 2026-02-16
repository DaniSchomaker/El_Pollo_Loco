/**
 * Represents the endboss enemy with activation, alert, attack, hurt, and death states.
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
   * Creates an Endboss instance, loads images, and starts animation logic.
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
   * Activates the endboss behavior and schedules alert and attack timings.
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
   * Applies damage and sets hurt timing.
   */
  hit() {
    super.hit();
    const now = Date.now();
    this.hurt_until = now + this.hurt_duration_ms;
    this.attack_until = 0;
  }

  /**
   * Starts animation state updates and movement/attack timing.
   */
  animate() {
    setStoppableInterval(() => {
      const now = Date.now();

      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
        return;
      }

      if (now < this.hurt_until) {
        this.playAnimation(this.IMAGES_HURT);
        return;
      }

      if (this.is_active && now < this.alert_until) {
        this.playAnimation(this.IMAGES_ALERT);
        return;
      }

      if (this.is_active && now < this.attack_until) {
        this.playAnimation(this.IMAGES_ATTACK);
        return;
      }

      this.playAnimation(this.IMAGES_WALKING);
    }, 200);

    setStoppableInterval(() => {
      if (!this.is_active) return;
      if (this.isDead()) return;

      const now = Date.now();

      if (now < this.alert_until) return;

      if (now >= this.next_attack_at && now >= this.hurt_until) {
        this.attack_until = now + this.attack_duration_ms;
        this.next_attack_at = now + this.attack_cooldown_ms;
      }

      this.moveLeft();
    }, 50);
  }
}
