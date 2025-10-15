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
    this.checkCollisions();
  }
''
  setWorld() {
    this.character.world = this; // mit "this" wird die aktuelle Instanz der World übergeben???
  }

  checkCollisions() {
    setInterval(() => {
      this.level.enemies.forEach((enemy)=>{
        if(this.character.isColliding(enemy)) {
          console.log('collision with Character ', enemy)
        }
      })
    }, 200); 
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
      this.flipImage(mo);

    }

    mo.draw(this.ctx);

    mo.drawFrame(this.ctx); // Zeichnung von "Boxen" für die Collision
    



    if (mo.otherDirection) {
      // Falls der Context oben geändert wurde --> RÜCKGÄNGIG machen
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
      this.ctx.save(); // Aktueller Stand vom Context (ctx) wird gespeichert
      this.ctx.translate(mo.width, 0); // Da gespiegelt wird, muss das Objekt verschoben werden (um die Breite des Elements)
      this.ctx.scale(-1, 1); // Alles wird gespiegelt 
      mo.x = mo.x * -1; // X-Koordinate wird gespiegelt
  }

  flipImageBack(mo) {
      mo.x = mo.x * -1;
      this.ctx.restore(); 
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }
}
