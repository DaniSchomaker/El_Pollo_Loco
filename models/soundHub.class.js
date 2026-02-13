class SoundHub {
  static isMuted = false;

  static mainTheme = new Audio("../audio/mainTheme.mp3"); // NAMEN ÄNDERN
  static walking = new Audio("../audio/walking.mp3");
  static jump = new Audio("../audio/jump.mp3");
  static hurt = new Audio("../audio/hurt.mp3");
  static chickenStomp = new Audio("../audio/chickenStomp.mp3");
  static collectCoin = new Audio("../audio/collectCoin.mp3");
  static collectBottle = new Audio("../audio/collectBottle.mp3");
  static bottleShattering = new Audio("../audio/bottleShattering.mp3");
  static snoring = new Audio("../audio/snoring.mp3");
  static chickenClucks = new Audio("../audio/chickenClucks.mp3");
  static win = new Audio("../audio/win.mp3");
  static lose = new Audio("../audio/lose.mp3");

  // Array, das alle definierten Audio-Dateien enthält
  static allSounds = [
    SoundHub.mainTheme,
    SoundHub.walking,
    SoundHub.jump,
    SoundHub.hurt,
    SoundHub.chickenStomp,
    SoundHub.collectCoin,
    SoundHub.collectBottle,
    SoundHub.bottleShattering,
    SoundHub.snoring,
    SoundHub.chickenClucks,
    SoundHub.win,
    SoundHub.lose,
  ];

  // Spielt eine einzelne Audiodatei ab
  static playOne(sound, instrumentId) {
    // brauche ich die ID?
    // instrumentId nur wichtig für die Visualisierung
    if (SoundHub.isMuted) return;
    sound.volume = 0.2;
    sound.currentTime = 0; // Startet ab einer bestimmten stelle (0=Anfang/ 5 = 5 sec.)
    sound.play(); // Spielt das übergebene Sound-Objekt ab
    // const instrumentImg = document.getElementById(instrumentId);  // nur wichtig für die Visualisierung
    // instrumentImg.classList.add('active');  // nur wichtig für die Visualisierung
  }

  static playLoop(sound) {
    if (SoundHub.isMuted) return;
    sound.loop = true;
    sound.volume = 1;
    sound.currentTime = 0;
    sound.play().catch(() => {
      // kein console.warn mehr, stillschweigend ignorieren
    });
  }

  // Pausiert das Abspielen aller Audiodateien
  static pauseAll() {
    SoundHub.allSounds.forEach((sound) => {
      sound.pause(); // Pausiert jedes Audio in der Liste
    });
    // document.getElementById('volume').value = 0.2;  // Setzt den Sound-Slider wieder auf 0.2
    // const instrumentImages = document.querySelectorAll('.sound_img'); // nur wichtig für die Visualisierung
    // instrumentImages.forEach(img => img.classList.remove('active')); // nur wichtig für die Visualisierung
  }

  // Pausiert das Abspielen einer einzelnen Audiodatei --> brauche ich das?
  static pauseOne(sound, instrumentId) {
    sound.pause(); // Pausiert das übergebene Audio
    // const instrumentImg = document.getElementById(instrumentId); // nur wichtig für die Visualisierung
    // instrumentImg.classList.remove('active'); // nur wichtig für die Visualisierung
  }

static toggleSound() {
  const button = document.getElementById("sound_toggle");
  const icon = document.getElementById("sound_icon");
  const isMuted = button.classList.toggle("sound_off");

  SoundHub.isMuted = isMuted;

  if (SoundHub.isMuted) {
    SoundHub.pauseAll();
    icon.src = "./img/icons/sound_off.png";
  } else {
    icon.src = "./img/icons/sound_on.png";

    // MainTheme NUR starten, wenn das Spiel läuft
    if (document.body.classList.contains("game_running")) {
      SoundHub.playLoop(SoundHub.mainTheme);
    }
  }

  SoundHub.saveToLocalStorage();
  button.blur();
}



  static saveToLocalStorage() {
    localStorage.setItem("isMuted", JSON.stringify(SoundHub.isMuted));
  }

static getFromLocalStorage() {
  const storedValue = localStorage.getItem("isMuted");

  SoundHub.isMuted = storedValue === null ? true : JSON.parse(storedValue);

  if (storedValue === null) {
    localStorage.setItem("isMuted", "true");
  }

  const button = document.getElementById("sound_toggle");
  const icon = document.getElementById("sound_icon");

  button.classList.toggle("sound_off", SoundHub.isMuted);
  icon.src = SoundHub.isMuted
    ? "./img/icons/sound_off.png"
    : "./img/icons/sound_on.png";

  SoundHub.pauseAll();
}




static startWalking() {
  if (SoundHub.isMuted) return;

  const walkingSound = SoundHub.walking;
  walkingSound.loop = true;
  walkingSound.volume = 0.5;

  if (walkingSound.paused) {
    walkingSound.currentTime = 0;
    walkingSound.play().catch(() => {});
  }
}

static stopWalking() {
  const walkingSound = SoundHub.walking;
  walkingSound.pause();
  walkingSound.currentTime = 0;
}


}
