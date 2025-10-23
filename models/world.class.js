class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0; // Kamera soll später verschoben werden
  StatusBarHealth = new StatusBarHealth();
  StatusBarCoin = new StatusBarCoin();
  StatusBarBottle = new StatusBarBottle();
  StatusBarEndboss = new StatusBarEndboss();
  throwableObjects = [];

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld(); // "Hilfe", um die Welt an Objekte zu übergeben (Charakter?)
    this.run(); // vorher: checkCollisions()
    this.totalCoins = this.level.coins.length; // Gesamtanzahl an Coins, die im Spiel vorhanden sind
    this.totalBottles = this.level.bottles.length;
    this.endboss = this.level.enemies[this.level.enemies.length - 1]; // der letzte Eintrag in meinem Array Enemies ist der Endboss
  }
  "";
  setWorld() {
    this.character.world = this; // mit "this" wird die aktuelle Instanz der World übergeben???
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkEndbossHitByBottle();
      this.checkEnemyHitByBottle();
      this.checkThrowObjects();
    }, 200); // Kann es an diesem Wert liegen, dass es manchmal harkt?
  }

  checkCollisions() {
    this.checkEnemyCollision();
    this.checkCoinCollision();
    this.checkBottleCollision();
  }

  checkEnemyCollision() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {

        // das reicht irgendwie noch nicht, wenn ich druchlaufe, dann wird das auch ausgelöst
        const jumpedOnEnemy = 
          this.character.speedY < 0 && // sicherstellen, dass Character von oben runterfällt
          this.character.y + this.character.height - this.character.offset.bottom > enemy.y + enemy.offset.top; // Collision Character UNTEN & Chicken OBEN

      if (jumpedOnEnemy) {
        console.log("Jump-Attacke auf Enemy!");
        enemy.health = 0;
        enemy.speed = 0;
        enemy.dead = true;
        enemy.playAnimation(enemy.IMAGES_DEAD);

        // if (enemy.isDead()) {
        //   this.removeEnemy(enemy);
        // }

        // this.character.jump(); // Bounce
      } else {

        this.character.hit();
        this.StatusBarHealth.setPercentage(this.character.health);
        }
      }
    });
  }

  // this.y + this.height - this.offset.bottom > mo.y + mo.offset.top

  // checkEndbossHitByBottle() {
  //   this.throwableObjects.forEach((bottle) => {
  //     if (this.endboss.isColliding(bottle)) {
  //       console.log("Endboss wurde getroffen!");
  //       console.log(this.endboss.health);
  //       this.endboss.hit();
  //       this.StatusBarEndboss.setPercentage(this.endboss.health);
  //     }
  //   });
  // }

checkEndbossHitByBottle() {
  for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
    const bottle = this.throwableObjects[i];

    if (this.endboss.isColliding(bottle)) {
      // Nur Schaden, wenn keine i-Frames aktiv
      if (!this.endboss.isHurt()) {
        this.endboss.hit();
        this.StatusBarEndboss.setPercentage(this.endboss.health);
      }

      // Flasche nach dem ersten Treffer entfernen → kein Multi-Hit
      this.throwableObjects.splice(i, 1);
    }
  }
}




  checkEnemyHitByBottle() {
  this.throwableObjects.forEach((bottle) => {
    this.level.enemies.forEach((enemy) => {

      if (enemy.isColliding(bottle)) {
        console.log("Enemy wurde getroffen!", enemy);

        enemy.hit(); // zieht Health ab 

        // Optional: Gegner löschen, wenn tot
        // if (enemy.isDead()) {
        //   this.removeEnemy(enemy);
        // }

      }
    });
  });
}


// removeEnemy(enemy) {
//   const index = this.level.enemies.indexOf(enemy);
//   if (index > -1) {
//     this.level.enemies.splice(index, 1);
//   }
// }

  checkCoinCollision() {
    this.level.coins.forEach((coin, index) => {
      // INDEX, damit der richtige Coin gelöscht wird
      if (this.character.isColliding(coin)) {
        this.character.coins++;

        const percentage = (this.character.coins / this.totalCoins) * 100;
        this.StatusBarCoin.setPercentage(percentage);

        this.level.coins.splice(index, 1); // Coin verschwindet
      }
    });
  }

  checkBottleCollision() {
    this.level.bottles.forEach((bottle, index) => {
      // INDEX, damit die richtige Bottle gelöscht wird
      if (this.character.isColliding(bottle)) {
        this.character.bottles++;

        const percentage = (this.character.bottles / this.totalBottles) * 100;
        this.StatusBarBottle.setPercentage(percentage);

        this.level.bottles.splice(index, 1); // Bottle verschwindet
      }
    });
  }

  checkThrowObjects() {
    if (this.keyboard.D) {
      if (this.character.bottles > 0) {
        let bottle = new ThrowableObject(
          this.character.x + 50,
          this.character.y + 100
        );
        this.throwableObjects.push(bottle);
        this.character.bottles--;
        const percentage = (this.character.bottles / this.totalBottles) * 100; // doppelt --> refactor?
        this.StatusBarBottle.setPercentage(percentage);
      } else {
        console.log("Keine Bottle verfügbar"); ///// LÖSCHEN
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // das alte Bild gelöscht

    this.ctx.translate(this.camera_x, 0); // verschiebt die Kamera nach links s.u.
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds); // ALLE Objekte eines Arrays

    this.ctx.translate(-this.camera_x, 0); // Back
    this.addToMap(this.StatusBarHealth); // durch diese Einrahmung bleibt die Statusbar immer an der gleichen Stelle
    this.addToMap(this.StatusBarCoin);
    this.addToMap(this.StatusBarBottle);
    this.addToMap(this.StatusBarEndboss);
    this.ctx.translate(this.camera_x, 0); // Forwards

    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addToMap(this.character); // nur EINER
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects); // warum ohne "level"?

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
