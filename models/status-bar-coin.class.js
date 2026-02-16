/**
 * Status bar displaying the current coin percentage.
 */
class StatusBarCoin extends StatusBar {
  IMAGES = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png"
  ];

  /**
   * Creates a StatusBarCoin instance and initializes it with 0%.
   */
  constructor() {
    super();
    this.x = 20;
    this.y = 50;
    this.load(this.IMAGES);
    this.setPercentage(0);
  }
}
