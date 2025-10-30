let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

window.addEventListener("keydown", (e) => {
  // Wenn Taste GEDRÜCKT wird
  if (e.key === " ") {
    keyboard.SPACE = true;
  }

  if (e.key === "ArrowLeft") {
    keyboard.LEFT = true;
  }

  if (e.key === "ArrowUp") {
    keyboard.UP = true;
  }

  if (e.key === "ArrowRight") {
    keyboard.RIGHT = true;
  }

  if (e.key === "ArrowDown") {
    keyboard.DOWN = true;
  }

  if (e.key === "d" || e.key === "D") {
    keyboard.D = true;
  }
});

window.addEventListener("keyup", (e) => {
  // Wenn Taste LOSGELASSEN wird
  if (e.key === " ") {
    keyboard.SPACE = false;
    e.preventDefault();   // Browser soll NICHT seinen eigenen Play/Pause-Quatsch machen
  }

  if (e.key === "ArrowLeft") {
    keyboard.LEFT = false;
  }

  if (e.key === "ArrowUp") {
    keyboard.UP = false;
  }

  if (e.key === "ArrowRight") {
    keyboard.RIGHT = false;
  }

  if (e.key === "ArrowDown") {
    keyboard.DOWN = false;
  }

  if (e.key === "d" || e.key === "D") {
    keyboard.D = false;
  }
});

function toggleSound() {
  const button = document.getElementById("sound_toggle");
  const icon = document.getElementById('sound_icon');
  const isMuted = button.classList.toggle("sound_off"); // CSS-Klasse wechseln

  if (isMuted) {
    SoundHub.isMuted = true;
    SoundHub.pauseAll(); 
    icon.src = './img/soundbar/sound_off.png';
  } else {
    SoundHub.isMuted = false;
    SoundHub.playLoop(SoundHub.mainTheme);
    icon.src = './img/soundbar/sound_on.png';
  }
}
