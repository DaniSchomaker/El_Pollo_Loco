/**
 * Represents a game level containing all entities and configuration values.
 */
class Level {
  enemies;
  clouds;
  backgroundObjects;
  coins;
  bottles;
  level_end_x = 2250;
  groundLevel = 430;

  /**
   * Creates a Level instance with all required object collections.
   * @param {any[]} enemies
   * @param {any[]} clouds
   * @param {any[]} backgroundObjects
   * @param {any[]} coins
   * @param {any[]} bottles
   */
  constructor(enemies, clouds, backgroundObjects, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottles = bottles;
  }
}
