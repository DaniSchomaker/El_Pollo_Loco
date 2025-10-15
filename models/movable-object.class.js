class MovableObject {
  x = 120;
  y = 280;
  img;
  height = 150;
  width = 100;
  imageCache = {}; // Bilder für die Laufanimation in einem JSON
  currentImage = 0;
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

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(arr) {
    // Bilder für die Anmiationen werden geladen
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    // für Collision ("blaue Boxen zeichnen")

    if (this instanceof Character || this instanceof Chicken) {
      // "instanceof" --> gilt nur für die Unterklassen von mo "Character" & "Chicken"
      ctx.beginPath();
      ctx.lineWidth = "5";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }

    // NUR HILFE für das Offset, kann später gelöscht werden!
    if (this instanceof Character || this instanceof Chicken) {
      ctx.beginPath();
      ctx.lineWidth = "5";
      ctx.strokeStyle = "red";
      ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - this.offset.left - this.offset.right, this.height - this.offset.top - this.offset.bottom);
      ctx.stroke();
    }
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
    }
  }

  isDead() {
    return this.energy == 0;
  }




  playAnimation(images) {
    let i = this.currentImage % this.IMAGES_WALKING.length; // % "Modulu" = Rest (let i = % 6) --> fängt nach Ende des Arrays immer wieder von vorne an
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
