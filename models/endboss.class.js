class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 60;

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  offset = {
    top: 120,
    bottom: 80,
    left: 35,
    right: 30,
  };

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.x = 2500;
    // this.health = 100;
    this.animate();
  }

  animate() {
    setInterval(() => {
      // Bilderanmiation
      this.playAnimation(this.IMAGES_WALKING);
    }, 200);

    // setInterval(() => {
    //  if (this.isDead()) {
    //     this.playAnimation(this.IMAGES_DEAD);
    //   } else if (this.isHurt()) {
    //     this.playAnimation(this.IMAGES_HURT);
    //   } else if (this.isAboveGround()) {
    //     this.playAnimation(this.IMAGES_JUMPING);
    //   } else {
    //     if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
    //       // Wenn rechte ODER linke Pfeiltaste gedrückt wird

    //       //Walk animation
    //       this.playAnimation(this.IMAGES_WALKING);
    //     }
    //   }
    // }, 50);
  }
}
