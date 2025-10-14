class MovableObject {
  x = 120;
  y = 280;
  img;
  height = 150;
  width = 100;
  imageCache = {}; // Bilder für die Laufanimation in einem JSON
  currentImage = 0;
  speed = 0.15;
  otherDirection = false; // Bild spiegeln (wenn linke Pfeiltaste gedrückt wird)

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(arr) {
    // Bilder für die Anmiationen werden geladen
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  playAnimation(images) {
    let i = this.currentImage % this.IMAGES_WALKING.length; // % "Modulu" = Rest (let i = % 6) --> fängt nach Ende des Arrays immer wieder von vorne an
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  moveRight() {
    console.log("moving right");
  }

  moveLeft() {
    setInterval(() => {
      //vordefinierte Funktion "setInterval()"
      this.x -= this.speed; // Der Wert der x-Achse verringert sich --> "Bewegung nach links"
    }, 1000 / 60); // Alle 1000/60 Millisekunden wird das zwischen {} ausgeführt
  }
}
