class CollectableObject extends DrawableObject {
  
  // Setzt die Objektposition zufällig innerhalb eines Rechtecks
  // baseX / baseY = Startkoordinaten
  // rangeX / rangeY = Zufallsbereich
  setRandomPosition(baseX, rangeX, baseY, rangeY) {
    this.x = baseX + Math.floor(Math.random() * rangeX);
    this.y = baseY + Math.floor(Math.random() * rangeY);
  }
}