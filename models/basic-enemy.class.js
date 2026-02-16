/**
 * Base class for enemies.
 * Provides shared movement, animation handling, and death behavior.
 */
class BasicEnemy extends MovableObject {
  /**
   * Starts enemy movement and animation intervals.
   */
  animate() {
    setStoppableInterval(() => {
      if (this.dead) return;
      this.moveLeft();
    }, 1000 / 60);

    setStoppableInterval(() => {
      if (this.dead) {
        this.playAnimation(this.IMAGES_DEAD);
        return;
      }
      this.playAnimation(this.IMAGES_WALKING);
    }, 200);
  }

  /**
   * Triggers the enemy death sequence and schedules removal.
   */
  die() {
    if (this.dead) return;
    this.dead = true;
    this.speed = 0;

    setTimeout(() => {
      this.markedForRemoval = true;
    }, 800);
  }
}
