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
  // gameOver = false;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld(); // "Hilfe", um die Welt an Objekte zu übergeben (Charakter?)
    this.run(); // vorher: checkCollisions()
    this.totalCoins = this.level.coins.length; // Gesamtanzahl an Coins, die im Spiel vorhanden sind
    this.endboss = this.level.enemies[this.level.enemies.length - 1]; // der letzte Eintrag in meinem Array Enemies ist der Endboss
  }
  "";
  setWorld() {
    this.character.world = this; // mit "this" wird die aktuelle Instanz der World übergeben???
  }

  // ===== Game Loop / Rendering =====
  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkEndbossHitByBottle();
      this.checkEnemyHitByBottle();
      this.checkThrowObjects();

      if (this.character.isDead()) {
        showEndscreen("lose");
      }

      if (this.endboss.isDead()) {
        showEndscreen("win");
      }
    }, 50); // An diesem Wert liegt es, wenn es harkt
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

  // ===== Gameplay =====
  checkCollisions() {
    this.checkEnemyCollision();
    this.checkCoinCollision();
    this.checkBottleCollision();
  }

  checkEnemyCollision() {
    this.level.enemies.forEach((enemy) => {
      if (!this.character.isColliding(enemy)) return;
      if (enemy.dead) return;

      if (this.isStomp(enemy)) {
        enemy.health = 0;
        SoundHub.playOne(SoundHub.chickenStomp);
        enemy.die(); // Chicken --> Animation, entfernen

        return;
      }

      this.applyCharacterDamage();
    });

    this.removeDeadEnemies();
  }

  checkEndbossHitByBottle() {
    for (let i = 0; i < this.throwableObjects.length; i++) {
      const bottle = this.throwableObjects[i];

      if (bottle.hasHit) continue; // mehrfaches Triggern wird verhindert (sonst wird Splash-Sound mehrfach abgespielt)

      if (this.endboss.isColliding(bottle)) {
        if (!this.endboss.isHurt()) {
          // dein Hurt-Cooldown

          SoundHub.playOne(SoundHub.chickenClucks);
          this.endboss.hit();
          this.StatusBarEndboss.setPercentage(this.endboss.health);
        }
        bottle.startSplash(); // Splash anzeigen
      }
    }

    // Aufräumen: Splash-Fertig → entfernen
    this.throwableObjects = this.throwableObjects.filter(
      (bottle) => !bottle.markedForRemoval
    );
  }

  checkEnemyHitByBottle() {
    for (let i = 0; i < this.throwableObjects.length; i++) {
      const bottle = this.throwableObjects[i];
      let bottleUsed = false;

      this.level.enemies.forEach((enemy) => {
        if (bottleUsed) return; // Flasche nur 1x wirksam
        if (enemy.dead) return; // tote Gegner ignorieren
        if (bottle.hasHit) return; // bereits im Splash
        if (!enemy.isColliding(bottle)) return;

        this.applyBottleHit(enemy);
        bottle.startSplash();
        bottleUsed = true;
        SoundHub.playOne(SoundHub.chickenStomp);
      });

      if (bottleUsed) {
        this.removeBottle(i);
        i--; // verhindert Überspringen des nächsten Elements
      }
    }

    this.removeDeadEnemies(); // identisch zu Enemy-Collision
  }

  checkCoinCollision() {
    this.level.coins.forEach((coin, index) => {
      // INDEX, damit der richtige Coin gelöscht wird
      if (this.character.isColliding(coin)) {
        this.character.coins++;
        SoundHub.playOne(SoundHub.collectCoin);

        const percentage = (this.character.coins / this.totalCoins) * 100;
        this.StatusBarCoin.setPercentage(percentage);

        this.level.coins.splice(index, 1); // Coin verschwindet
      }
    });
  }

  checkBottleCollision() {
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        // Inventar voll? --> Keine Bottle einsammeln
        if (this.character.bottles >= this.character.MAX_BOTTLES) {
          return;
        }

        // Bottle einsammeln
        this.character.bottles++;
        SoundHub.playOne(SoundHub.collectBottle);

        // StatusBarBottle updaten (5 Bottles = 100%)
        const percentage =
          (this.character.bottles / this.character.MAX_BOTTLES) * 100;
        this.StatusBarBottle.setPercentage(percentage);

        // Bottle entfernen
        this.level.bottles.splice(index, 1);
      }
    });
  }

  checkThrowObjects() {
    if (this.keyboard.D) {
      // Prüfen, ob Wurf möglich ist (cooldown)
      if (!this.character.canThrow()) {
        return;
      }

      if (this.character.bottles > 0) {
        let bottleX;
        let bottleY = this.character.y + 100;

        // Startpunkt abhängig von Blickrichtung
        if (this.character.otherDirection) {
          // Character schaut nach LINKS → Bottle links spawnen
          bottleX = this.character.x - 20;
        } else {
          // Character schaut nach RECHTS → Bottle rechts spawnen
          bottleX = this.character.x + 50;
        }

        // Flasche erzeugen
        let bottle = new ThrowableObject(bottleX, bottleY);
        bottle.world = this; // <— wichtig: damit die Flasche auf level.groundLevel zugreifen kann ///////////////
        this.throwableObjects.push(bottle); ///////////////////////

        // Richtung der Flasche setzen
        if (this.character.otherDirection) {
          bottle.speedX = -10;
          bottle.otherDirection = true;
        } else {
          bottle.speedX = 10;
          bottle.otherDirection = false;
        }

        this.throwableObjects.push(bottle);

        // Bottle-Anzahl reduzieren
        this.character.bottles--;

        // Cooldown starten
        this.character.lastThrow = Date.now();

        // StatusBar aktualisieren
        const percentage =
          (this.character.bottles / this.character.MAX_BOTTLES) * 100;
        this.StatusBarBottle.setPercentage(percentage);
      }
    }
  }

  // ===== Helpers =====
  // Prüft, ob ein Stomp vorliegt
  isStomp(enemy) {
    // brauche ich hier den Übergabeparameter?
    const inAir = this.character.isAboveGround();
    const falling = this.character.speedY < 0;

    return inAir && falling;
  }

  // Wendet Schaden auf Spieler an
  applyCharacterDamage() {
    if (this.character.isHurt()) return; // i-frames: schon kürzlich getroffen → nix tun

    SoundHub.playOne(SoundHub.hurt);
    this.character.hit();
    this.StatusBarHealth.setPercentage(this.character.health);
  }

  // Entfernt erledigte Gegner
  removeDeadEnemies() {
    this.level.enemies = this.level.enemies.filter((e) => !e.markedForRemoval);
  }

  // wendet den Flaschen-Treffer auf einen Gegner an (Schaden + ggf. töten)
  applyBottleHit(enemy) {
    enemy.hit(); // Gegner verliert Health

    if (enemy.isDead()) {
      enemy.die(); // Gegner führt eigene Sterbe-Animation aus und markiert sich zum Entfernen
    }
  }

  // entfernt eine bereits "verbrauchte" Flasche aus dem Array
  removeBottle(index) {
    this.throwableObjects.splice(index, 1);
  }

//   endGame() {
//   this.gameOver = true;

//   this.level.enemies = [];
//   this.level.coins = [];
//   this.level.bottles = [];
//   this.throwableObjects = [];

//   // Character + Endboss "deaktivieren"
//   this.character = null;
//   this.endboss = null;
// }
}
