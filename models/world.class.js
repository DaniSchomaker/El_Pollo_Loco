class World {
  character = new Character();
  enemies = [new Chicken(), new Chicken(), new Chicken()];
  clouds = [new Cloud()];
  backgroundObjects = [
    new BackgroundObject("img/5_background/layers/air.png", 0),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0), // "0" für die X-Achse, Y-Achse wird über die Klassen gesetzt
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
  ];
  canvas;
  ctx;
  keyboard;
  camera_x = -100; // Kamera soll nach links verschoben werden

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld(); // "Hilfe", um die Welt an Objekte zu übergeben (Charakter?)
  }

  setWorld() {
    this.character.world = this; // mit "this" wird die aktuelle Instanz der World übergeben???
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // das alte Bild gelöscht

    this.ctx.translate(this.camera_x, 0); // verschiebt die Kamera nach links

    this.addObjectsToMap(this.backgroundObjects);

    this.addToMap(this.character); // nur EINER
    this.addObjectsToMap(this.clouds); // ALLE Objekte eines Arrays
    this.addObjectsToMap(this.enemies); 

    this.ctx.translate(-this.camera_x, 0); // zurück verschieben ???

    // Die draw-Methode wird immer wieder aufgerufen (zB 60fps) --> so akzeotieren
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addToMap(mo) {
    // "mo" für movableObject

    if (mo.otherDirection) {
      // Bild wird gespiegelt
      this.ctx.save(); // Aktueller Stand vom Context (ctx) wird gespeichert
      this.ctx.translate(mo.width, 0); // Da gespiegelt wird, muss das Objekt verschoben werden (um die Breite des Elements)
      this.ctx.scale(-1, 1); // Alles wird gespiegelt 
      mo.x = mo.x * -1; // X-Koordinate wird gespiegelt
    }

    this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);

    if (mo.otherDirection) {
      // Falls der Context oben geändert wurde --> RÜCKGÄNGIG machen
      mo.x = mo.x * -1;
      this.ctx.restore(); 
    }
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }
}
