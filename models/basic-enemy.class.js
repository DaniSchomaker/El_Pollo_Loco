class BasicEnemy extends MovableObject {
  // Gemeinsame Bewegung + Animationsumschaltung
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

  // Gemeinsamer Sterbe-Flow (wie zuvor)
  die() {
    if (this.dead) return;
    this.dead = true;
    this.speed = 0;

    setTimeout(() => {
      this.markedForRemoval = true; // World räumt später auf
    }, 800);
  }
}
