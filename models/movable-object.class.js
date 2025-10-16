class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false; // Bild spiegeln (wenn linke Pfeiltaste gedrückt wird)

  // Gravitation
  speedY = 0; // Geschwindigkeit Y-Achse --> Wie schnell etwas herunterfällt
  acceleration = 2.5; // Beschleunigung

  // für Collision --> ggf. umlagern in Klasse "CollidableObject"
  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  energy = 100;
  lastHit = 0;

  //////////////////////////////////////////////////////////

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    // Abfrage, ob der Character in der Luft ist
    return this.y < 147;
  }



  // character.isColliding(chicken);
  isColliding(mo) {
    // Offset für den roten inneren Kasten (statt der äußere blaue)
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left && //(warum +???) checken, ob rechte Seite des Characters > linke Seite Chicken // Offset --> "innerer roter Kasten in dem äußeren blauben"
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top && // Character UNTEN > Chicken OBEN
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right && // Character LINKE Seite < Chicken RECHTE Seite
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    ); // Character OBEN < Chicken UNTEN
  }

  hit() {
    this.energy -= 5;
    if(this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime(); // so speichert man einen Zeitpunkt (in Zahlenform)
    }
  }

  isDead() {
    return this.energy == 0;
  }

  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit; // aktueller Zeitpunkt ./. Zeitpunkt des letzten Treffers (in ms)
    timePassed = timePassed / 1000; // Millisekunden in Sekunden umrechnen
    return timePassed < 1; // wenn wir innerhalb der letzten 1 Sekunde getroffen wurden --> true
  }


  playAnimation(images) {
    let i = this.currentImage % images.length; // % "Modulu" = Rest (let i = % 6) --> fängt nach Ende des Arrays immer wieder von vorne an
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  jump() {
    this.speedY = 30;
  }
}
