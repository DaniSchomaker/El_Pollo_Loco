/**
 * Status bar displaying the endboss health percentage.
 */
class StatusBarEndboss extends StatusBar {
  IMAGES = [
    "img/7_statusbars/2_statusbar_endboss/blue/blue0.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue20.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue100.png"
  ];

  /**
   * Creates a StatusBarEndboss instance initialized at 100%.
   */
  constructor() {
    super();
    this.x = 495;
    this.y = 7;
    this.load(this.IMAGES);
    this.setPercentage(100);
  }
}
