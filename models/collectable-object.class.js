/**
 * Base class for collectible objects.
 * Provides shared positioning logic.
 */
class CollectableObject extends DrawableObject {
  /**
   * Sets a random position within a defined rectangular area.
   * @param {number} baseX
   * @param {number} rangeX
   * @param {number} baseY
   * @param {number} rangeY
   */
  setRandomPosition(baseX, rangeX, baseY, rangeY) {
    this.x = baseX + Math.floor(Math.random() * rangeX);
    this.y = baseY + Math.floor(Math.random() * rangeY);
  }
}
