/**
 * Represents the game world. Manages the main loop, rendering, collisions,
 * collectibles, throwing mechanics, and endgame handling.
 */
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

  /**
   * Creates a World instance.
   * @param {HTMLCanvasElement} canvas
   * @param {Keyboard} keyboard
   */
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

  /**
   * Links the world instance to the character.
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Starts the update loop.
   */
  run() {
    setStoppableInterval(() => {
      this.updateGameState();
    }, 50);
  }

  /**
   * Updates the current gameplay state.
   */
  updateGameState() {
    this.handleGameplayChecks();
    this.handleGameOverConditions();
  }

  /**
   * Runs regular gameplay checks each tick.
   */
  handleGameplayChecks() {
    this.checkEndbossTrigger();
    this.checkCollisions();
    this.checkBottleHits();
    this.checkThrowObjects();
  }

  /**
   * Evaluates win/lose conditions and triggers endgame sequences.
   */
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

  /**
   * Ends the game immediately.
   * @param {"win"|"lose"} result
   */
  endGame(result) {
    stopGame();
    this.stop();
    showEndscreen(result);
  }

  /**
   * Ends the game after a delay.
   * @param {"win"|"lose"} result
   * @param {number} delayMs
   */
  endGameWithDelay(result, delayMs) {
    this.gameOver = true;
    setTimeout(() => this.endGame(result), delayMs);
  }

  /**
   * Renders the world using requestAnimationFrame.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawWorldWithoutCharacter();
    this.drawStatusBars();
    this.drawCharacterOnTop();

    if (!this.is_running) {
      return;
    }
    this.animation_frame_id = requestAnimationFrame(() => this.draw());
  }

  /**
   * Draws all background and world objects except the character.
   */
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

  /**
   * Draws all status bars.
   */
  drawStatusBars() {
    this.addToMap(this.StatusBarHealth);
    this.addToMap(this.StatusBarCoin);
    this.addToMap(this.StatusBarBottle);
    this.addToMap(this.StatusBarEndboss);
  }

  /**
   * Draws the character after other elements.
   */
  drawCharacterOnTop() {
    if (!this.character) return;
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Draws a single drawable object to the canvas.
   * @param {any} mo
   */
  addToMap(mo) {
    if (!mo || !mo.draw) return;
    if (mo.otherDirection) this.flipImage(mo);

    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) this.flipImageBack(mo);
  }

  /**
   * Flips the drawing context for mirrored rendering.
   * @param {any} mo
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores the drawing context after mirrored rendering.
   * @param {any} mo
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Draws a list of objects.
   * @param {any[]} objects
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  /**
   * Runs collision checks for enemies, coins, and bottles.
   */
  checkCollisions() {
    this.checkEnemyCollision();
    this.checkCoinCollision();
    this.checkBottleCollision();
  }

  /**
   * Handles collisions between the character and enemies.
   */
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

  /**
   * Handles collisions between the character and coins.
   */
  checkCoinCollision() {
    let collected = false;

    this.level.coins = this.level.coins.filter((coin) => {
      if (!collected && this.character.isColliding(coin)) {
        this.character.coins++;
        SoundHub.playOne(SoundHub.collectCoin);
        this.updateCoinBar();
        collected = true;
        return false;
      }
      return true;
    });
  }

  /**
   * Handles collisions between the character and bottles.
   */
  checkBottleCollision() {
    let capacity = this.character.MAX_BOTTLES - this.character.bottles;

    this.level.bottles = this.level.bottles.filter((bottle) => {
      if (capacity > 0 && this.character.isColliding(bottle)) {
        this.character.bottles++;
        capacity--;
        SoundHub.playOne(SoundHub.collectBottle);
        this.updateBottleBar();
        return false;
      }
      return true;
    });
  }

  /**
   * Updates the coin status bar based on collected coins.
   */
  updateCoinBar() {
    const percentage = (this.character.coins / this.totalCoins) * 100;
    this.StatusBarCoin.setPercentage(percentage);
  }

  /**
   * Updates the bottle status bar based on current inventory.
   */
  updateBottleBar() {
    const percentage = (this.character.bottles / this.character.MAX_BOTTLES) * 100;
    this.StatusBarBottle.setPercentage(percentage);
  }

  /**
   * Determines whether the current enemy collision is a stomp.
   * @returns {boolean}
   */
  isStomp() {
    const inAir = this.character.isAboveGround();
    const falling = this.character.speedY < 0;
    return inAir && falling;
  }

  /**
   * Checks for bottle hits against endboss and enemies, and removes finished splashes.
   */
  checkBottleHits() {
    for (const bottle of this.throwableObjects) {
      if (bottle.hasHit) continue;

      if (this.handleBottleHitEndboss(bottle)) {
        bottle.startSplash();
        continue;
      }

      if (this.handleBottleHitEnemy(bottle)) {
        bottle.startSplash();
        continue;
      }
    }

    this.throwableObjects = this.throwableObjects.filter((b) => !b.markedForRemoval);
    this.removeDeadEnemies();
  }

  /**
   * Handles bottle collision against the endboss.
   * @param {ThrowableObject} bottle
   * @returns {boolean}
   */
  handleBottleHitEndboss(bottle) {
    if (!this.endboss.isColliding(bottle)) return false;

    if (!this.endboss.isHurt()) {
      SoundHub.playOne(SoundHub.chickenClucks);
      this.endboss.hit();
      this.StatusBarEndboss.setPercentage(this.endboss.health);
    }
    return true;
  }

  /**
   * Handles bottle collision against enemies.
   * @param {ThrowableObject} bottle
   * @returns {boolean}
   */
  handleBottleHitEnemy(bottle) {
    for (const enemy of this.level.enemies) {
      if (enemy.dead) continue;
      if (!enemy.isColliding(bottle)) continue;

      this.applyBottleHit(enemy);
      SoundHub.playOne(SoundHub.chickenStomp);
      return true;
    }
    return false;
  }

  /**
   * Checks whether the character can throw and spawns a bottle.
   */
  checkThrowObjects() {
    const keys = this.keyboard;
    if (!keys.D) return;
    if (!this.character.canThrow()) return;
    if (this.character.bottles <= 0) return;

    const { x, y } = this.getBottleSpawnPosition();
    const bottle = this.spawnBottle(x, y);
    this.setBottleDirection(bottle);

    this.consumeBottleAndStartCooldown();
    this.updateBottleBar();

    this.character.wakeFromAction();
  }

  /**
   * Calculates the spawn position for a thrown bottle.
   * @returns {{x: number, y: number}}
   */
  getBottleSpawnPosition() {
    const spawnOffsetX = this.character.otherDirection ? -20 : 50;
    return {
      x: this.character.x + spawnOffsetX,
      y: this.character.y + 100,
    };
  }

  /**
   * Spawns a new throwable bottle and registers it in the world.
   * @param {number} x
   * @param {number} y
   * @returns {ThrowableObject}
   */
  spawnBottle(x, y) {
    const bottle = new ThrowableObject(x, y);
    bottle.world = this;
    this.throwableObjects.push(bottle);
    return bottle;
  }

  /**
   * Sets the bottle movement direction depending on character orientation.
   * @param {ThrowableObject} bottle
   */
  setBottleDirection(bottle) {
    if (this.character.otherDirection) {
      bottle.speedX = -10;
      bottle.otherDirection = true;
    } else {
      bottle.speedX = 10;
      bottle.otherDirection = false;
    }
  }

  /**
   * Consumes one bottle and starts the throw cooldown.
   */
  consumeBottleAndStartCooldown() {
    this.character.bottles--;
    this.character.lastThrow = Date.now();
  }

  /**
   * Activates the endboss when the character reaches the trigger position.
   */
  checkEndbossTrigger() {
    if (this.endboss.is_active) {
      return;
    }

    if (this.character.x >= this.endboss.trigger_x) {
      this.endboss.activate();
    }
  }

  /**
   * Applies damage to the character and updates the health status bar.
   */
  applyCharacterDamage() {
    if (this.character.isHurt()) return;

    SoundHub.playOne(SoundHub.hurt);
    this.character.hit();
    this.StatusBarHealth.setPercentage(this.character.health);
  }

  /**
   * Removes enemies that are marked for removal.
   */
  removeDeadEnemies() {
    this.level.enemies = this.level.enemies.filter((e) => !e.markedForRemoval);
  }

  /**
   * Applies a bottle hit to an enemy and triggers its death if needed.
   * @param {any} enemy
   */
  applyBottleHit(enemy) {
    enemy.hit();
    if (enemy.isDead()) {
      enemy.die();
    }
  }

  /**
   * Removes a bottle from the throwable list by index.
   * @param {number} index
   */
  removeBottle(index) {
    this.throwableObjects.splice(index, 1);
  }

  /**
   * Resets world entities and references.
   */
  resetWorld() {
    this.level.enemies = [];
    this.level.coins = [];
    this.level.bottles = [];
    this.throwableObjects = [];
    this.character = null;
  }

  /**
   * Stops rendering and cancels the animation frame.
   */
  stop() {
    this.is_running = false;

    if (this.animation_frame_id) {
      cancelAnimationFrame(this.animation_frame_id);
      this.animation_frame_id = null;
    }
  }
}
