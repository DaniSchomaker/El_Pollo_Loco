/**
 * Base class for movable game objects.
 * Adds physics, collision detection, and basic movement utilities.
 */
class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;

  speedY = 0;
  acceleration = 2.5;

  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  health = 100;
  lastHit = 0;

  /**
   * Applies gravity to the object via a fixed interval.
   */
  applyGravity() {
    setStoppableInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Determines whether the object is above the ground level.
   * @returns {boolean}
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y + this.height < this.world.level.groundLevel;
    }
  }

  /**
   * Checks collision with another movable object using offsets.
   * @param {any} mo
   * @returns {boolean}
   */
  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }

  /**
   * Applies damage and updates hit timestamp.
   */
  hit() {
    this.health -= 20;
    if (this.health < 0) {
      this.health = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Checks whether the object is dead.
   * @returns {boolean}
   */
  isDead() {
    return this.health <= 0;
  }

  /**
   * Checks whether the object was recently hit.
   * @returns {boolean}
   */
  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    timePassed = timePassed / 1000;
    return timePassed < 1;
  }

  /**
   * Moves the object to the right.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Applies an upward impulse to the object.
   */
  jump() {
    this.speedY = 30;
  }
}
