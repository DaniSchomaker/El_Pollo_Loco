// class Coin extends CollectableObject {
//   y = 365; // y-Achse aus der Oberklasse wird überschrieben
//   height = 60;
//   width = 60;

//   IMAGES = [
//     "img/8_coin/coin_1.png",
//     "img/8_coin/coin_2.png"
//   ];

//   constructor() {
//     super();
//     this.loadImages(this.IMAGES);
//     this.img = this.imageCache[Coin.IMAGES[0]];   

//     this.x = 400 + Math.floor(Math.random() * 10 * 180);
//     this.y = 100 + Math.floor(Math.random() * 10 * 25);
//     // this.x = 200 + Math.random() * 500; // Startpunkt: 200px + zufälliger Wert zwischen 0 und 500
//     // this.speed = 0.15 + Math.random() * 0.5;

//     // this.animate();
//   }
// }

class Coin extends CollectableObject {
  IMAGES = [ 
    "img/8_coin/coin_1.png",
    "img/8_coin/coin_2.png"
  ];

  constructor() {
    super();
    this.loadImages(this.IMAGES); 
    this.img = this.imageCache[this.IMAGES[0]]; // Startframe setzen ???
    this.x = 400 + Math.floor(Math.random() * 10 * 180);
    this.y = 100 + Math.floor(Math.random() * 10 * 20);
  }
}
