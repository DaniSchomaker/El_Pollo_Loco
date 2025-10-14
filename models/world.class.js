class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0; // Kamera soll später verschoben werden

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld(); // "Hilfe", um die Welt an Objekte zu übergeben (Charakter?)
  }
''
  setWorld() {
    this.character.world = this; // mit "this" wird die aktuelle Instanz der World übergeben???
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // das alte Bild gelöscht

    this.ctx.translate(this.camera_x, 0); // verschiebt die Kamera nach links s.u.

    this.addObjectsToMap(this.level.backgroundObjects);

    this.addToMap(this.character); // nur EINER
    this.addObjectsToMap(this.level.clouds); // ALLE Objekte eines Arrays
    this.addObjectsToMap(this.level.enemies); 

    this.ctx.translate(-this.camera_x, 0); // zurück verschieben ??? s.o.

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
