class Cloud extends MovableObject {
  y = 50;
  width = 500;
  height = 250;

  constructor(path, x) {
    super().loadImage(path);
    this.x = x;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveLeft();

      if (this.x + this.width < 0) {
        // damit sich die Wolken wiederholen, wenn sie durchgelaufen sind
        this.x = 720 * 4;
      }
    }, 1000 / 60); // Alle 1000/60 Millisekunden wird das zwischen {} ausgeführt
  }
}
