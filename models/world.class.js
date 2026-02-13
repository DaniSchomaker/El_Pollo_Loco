class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  StatusBarHealth = new StatusBarHealth();
  StatusBarCoin = new StatusBarCoin();
  StatusBarBottle = new StatusBarBottle();
  StatusBarEndboss = new StatusBarEndboss();
  throwableObjects = [];
  gameOver = false;
  is_running = true;
  animation_frame_id = null;

  // ===== Konstruktor & Setup =====
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.setWorld();
    this.run();
    this.totalCoins = this.level.coins.length;
    this.endboss = this.level.enemies[this.level.enemies.length - 1];
    this.draw();
  }

  setWorld() {
    this.character.world = this;
  }

  // ===== Game Loop / Update =====
  run() {
    setStoppableInterval(() => {
      this.updateGameState();
    }, 50);
  }

  updateGameState() {
    this.handleGameplayChecks();
    this.handleGameOverConditions();
  }

  handleGameplayChecks() {
    this.checkEndbossTrigger();
    this.checkCollisions();
    this.checkBottleHits();
    this.checkThrowObjects();
  }

handleGameOverConditions() {
  if (this.character.isDead()) {
    this.gameOver = true;

    this.character.startDeathSequence();

    if (this.character.isDeathAnimationFinished()) {
      this.endGame("lose");
    }

    return;
  }

  if (this.endboss.isDead() && !this.gameOver) {
    this.endGameWithDelay("win", 700);
  }
}


  endGame(result) {
    stopGame();
    this.stop();
    showEndscreen(result);
  }

  endGameWithDelay(result, delayMs) {
    this.gameOver = true;
    setTimeout(() => this.endGame(result), delayMs);
  }

  // ===== Rendering =====
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawWorldWithoutCharacter();
    this.drawStatusBars();
    this.drawCharacterOnTop(); // damit der Character VOR der StatusBar ist

    if (!this.is_running) {
      return;
    }
    this.animation_frame_id = requestAnimationFrame(() => this.draw());
  }

  drawWorldWithoutCharacter() {
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);

    this.ctx.translate(-this.camera_x, 0);
  }

  drawStatusBars() {
    this.addToMap(this.StatusBarHealth);
    this.addToMap(this.StatusBarCoin);
    this.addToMap(this.StatusBarBottle);
    this.addToMap(this.StatusBarEndboss);
  }

  drawCharacterOnTop() {
    if (!this.character) return;
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.ctx.translate(-this.camera_x, 0);
  }

  addToMap(mo) {
    if (!mo || !mo.draw) return; // Guard
    if (mo.otherDirection) this.flipImage(mo);

    mo.draw(this.ctx);
    mo.drawFrame(this.ctx); // Kollisionsrahmen (ggf. später per Flag steuerbar)

    if (mo.otherDirection) this.flipImageBack(mo);
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  // ===== Gameplay: Kollisionen & Aufsammeln =====
  checkCollisions() {
    this.checkEnemyCollision();
    this.checkCoinCollision();
    this.checkBottleCollision();
  }

  checkEnemyCollision() {
    this.level.enemies.forEach((enemy) => {
      if (enemy.dead) return;
      if (!this.character.isColliding(enemy)) return;

      if (this.isStomp()) {
        SoundHub.playOne(SoundHub.chickenStomp);
        enemy.die();
        return;
      }

      this.applyCharacterDamage();
    });

    this.removeDeadEnemies();
  }

  checkCoinCollision() {
    let collected = false;

    this.level.coins = this.level.coins.filter((coin) => {
      if (!collected && this.character.isColliding(coin)) {
        this.character.coins++;
        SoundHub.playOne(SoundHub.collectCoin);
        this.updateCoinBar();
        collected = true; // pro Tick reicht ein Coin
        return false; // Coin entfernen
      }
      return true; // Coin behalten
    });
  }

  checkBottleCollision() {
    let capacity = this.character.MAX_BOTTLES - this.character.bottles;

    this.level.bottles = this.level.bottles.filter((bottle) => {
      if (capacity > 0 && this.character.isColliding(bottle)) {
        this.character.bottles++;
        capacity--;
        SoundHub.playOne(SoundHub.collectBottle);
        this.updateBottleBar();
        return false; // Bottle entfernen
      }
      return true; // Bottle behalten
    });
  }

  updateCoinBar() {
    const percentage = (this.character.coins / this.totalCoins) * 100;
    this.StatusBarCoin.setPercentage(percentage);
  }

  updateBottleBar() {
    const percentage =
      (this.character.bottles / this.character.MAX_BOTTLES) * 100;
    this.StatusBarBottle.setPercentage(percentage);
  }

  isStomp() {
    const inAir = this.character.isAboveGround();
    const falling = this.character.speedY < 0;
    return inAir && falling;
  }

  // ===== Bottle-Hits: Boss/Gegner =====
  checkBottleHits() {
    for (const bottle of this.throwableObjects) {
      if (bottle.hasHit) continue;

      // 1) Endboss-Treffer prüfen
      if (this.handleBottleHitEndboss(bottle)) {
        bottle.startSplash(); // setzt markedForRemoval = true
        continue;
      }

      // 2) Gegner-Treffer prüfen (ein Gegner pro Flasche)
      if (this.handleBottleHitEnemy(bottle)) {
        bottle.startSplash();
        continue;
      }
    }

    // Aufräumen (Splash fertig --> raus)
    this.throwableObjects = this.throwableObjects.filter(
      (b) => !b.markedForRemoval,
    );
    this.removeDeadEnemies();
  }

  handleBottleHitEndboss(bottle) {
    if (!this.endboss.isColliding(bottle)) return false;

    if (!this.endboss.isHurt()) {
      SoundHub.playOne(SoundHub.chickenClucks);
      this.endboss.hit();
      this.StatusBarEndboss.setPercentage(this.endboss.health);
    }
    return true;
  }

  handleBottleHitEnemy(bottle) {
    for (const enemy of this.level.enemies) {
      if (enemy.dead) continue;
      if (!enemy.isColliding(bottle)) continue;

      this.applyBottleHit(enemy);
      SoundHub.playOne(SoundHub.chickenStomp);
      return true; // genau ein Gegner pro Flasche
    }
    return false;
  }

  // ===== Werfen: Orchestrator + Helfer =====
  checkThrowObjects() {
    const keys = this.keyboard;
    if (!keys.D) return; // keine Wurf-Taste
    if (!this.character.canThrow()) return; // Cooldown
    if (this.character.bottles <= 0) return; // kein Inventar

    const { x, y } = this.getBottleSpawnPosition();
    const bottle = this.spawnBottle(x, y);
    this.setBottleDirection(bottle);

    this.consumeBottleAndStartCooldown();
    this.updateBottleBar();

    this.character.wakeFromAction();
  }

  /* ===== Helfer ===== */

  getBottleSpawnPosition() {
    const spawnOffsetX = this.character.otherDirection ? -20 : 50;
    return {
      x: this.character.x + spawnOffsetX,
      y: this.character.y + 100,
    };
  }

  spawnBottle(x, y) {
    const bottle = new ThrowableObject(x, y);
    bottle.world = this;
    this.throwableObjects.push(bottle);
    return bottle;
  }

  setBottleDirection(bottle) {
    if (this.character.otherDirection) {
      bottle.speedX = -10;
      bottle.otherDirection = true;
    } else {
      bottle.speedX = 10;
      bottle.otherDirection = false;
    }
  }

  consumeBottleAndStartCooldown() {
    this.character.bottles--;
    this.character.lastThrow = Date.now();
  }

  checkEndbossTrigger() {
    if (this.endboss.is_active) {
      return;
    }

    if (this.character.x >= this.endboss.trigger_x) {
      this.endboss.activate();
    }
  }

  // ===== Weitere Helfer & Reset =====
  applyCharacterDamage() {
    if (this.character.isHurt()) return;

    SoundHub.playOne(SoundHub.hurt);
    this.character.hit();
    this.StatusBarHealth.setPercentage(this.character.health);
  }

  removeDeadEnemies() {
    this.level.enemies = this.level.enemies.filter((e) => !e.markedForRemoval);
  }

  applyBottleHit(enemy) {
    enemy.hit();
    if (enemy.isDead()) {
      enemy.die();
    }
  }

  removeBottle(index) {
    this.throwableObjects.splice(index, 1);
  }

  resetWorld() {
    this.level.enemies = [];
    this.level.coins = [];
    this.level.bottles = [];
    this.throwableObjects = [];
    this.character = null;
  }

  stop() {
    this.is_running = false;

    if (this.animation_frame_id) {
      cancelAnimationFrame(this.animation_frame_id);
      this.animation_frame_id = null;
    }
  }
}
