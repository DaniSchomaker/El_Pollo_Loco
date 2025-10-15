class Cloud extends MovableObject {
  y = 50;
  width = 500;
  height = 250;

  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");

    this.x = Math.random() * 500;

    this.animate();
  }

  animate() {
    setInterval(() => {
      //vordefinierte Funktion "setInterval()"
      this.moveLeft();
    }, 1000 / 60); // Alle 1000/60 Millisekunden wird das zwischen {} ausgeführt
  }
}
