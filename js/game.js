let canvas;
let world;
let keyboard = new Keyboard();

let intervalIDs = [];
let i = 1;

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

// function startGame() {
    
    // document.getElementById('end_screen_winner').classList.add('d_none');
    // document.getElementById('gameOverScreen').classList.add('d_none');
    // document.getElementById('startScreenContainer').classList.add('d_none');
    // document.getElementById('hud').classList.remove('d_none');
    // document.getElementById('canvas').style.display = "block";

    // init();
// }

function showEndscreen(type) {
  const screen = document.getElementById('endscreen');
  const img = document.getElementById('endscreen_img');

  // Auswahl je nach Zustand:
  if (type === 'win') {
    img.src = '../img/9_intro_outro_screens/YouWon.png';
  } else {
    img.src = '../img/9_intro_outro_screens/game_over/oh no you lost!.png';
  }

  screen.classList.remove('d_none');

  SoundHub.pauseAll(); 
}

function startGame() {
  location.reload();  
}