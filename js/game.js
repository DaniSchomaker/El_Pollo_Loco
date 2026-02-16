let canvas;
let world;
let keyboard = new Keyboard();

let intervalIds = [];
let i = 1; // brauche ich das?

let gameStarted = false;


function startGame() {
  startNewGame();
}

function startNewGame() {
  stopGame();

  if (world) {
    world.stop();
    world = null;
  }

  initLevel();
  init();

  hideStartScreen();
  hideEndscreen();

  gameStarted = true;
  showMobileControls();

  // Musik fürs Gameplay wieder starten (playLoop macht nix, wenn gemutet)
  SoundHub.playLoop(SoundHub.mainTheme);
}







function openControls() {
  const overlay = document.getElementById("controls_overlay");
  overlay.classList.remove("d_none");
}

function closeControls() {
  const overlay = document.getElementById("controls_overlay");
  overlay.classList.add("d_none");
}

function stopClick(event) {
  event.stopPropagation();
}

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

function showEndscreen(type) {
  const screen = document.getElementById("endscreen");
  const img = document.getElementById("endscreen_img");

  // Auswahl je nach Zustand:
  if (type === "win") {
    img.src = "../img/9_intro_outro_screens/YouWon.png";
  } else {
    img.src = "../img/9_intro_outro_screens/game_over/oh no you lost!.png";
  }

  screen.classList.remove("d_none");

  SoundHub.pauseAll();
  if (type === "win") {
    SoundHub.playOne(SoundHub.win);
  } else {
    SoundHub.playOne(SoundHub.lose);
  }

  hideMobileControls();
}

function restartGame() {
  startNewGame();
}


function setStoppableInterval(fn, time) {
  let id = setInterval(fn, time);
  intervalIds.push(id);
  return id; // brauche ich das? -> dann kann ich auch mal EIN Intervall stoppen?
}

function stopGame() {
  intervalIds.forEach(clearInterval);
  intervalIds = [];
}

function showMobileControls() {
  document.body.classList.add("game_running");
}

function hideMobileControls() {
  document.body.classList.remove("game_running");
}

function backToHome() {
  stopGame();

  if (world) {
    world.stop();
    world = null;
  }

  SoundHub.pauseAll();
  hideMobileControls();

  showStartScreen();
  hideEndscreen();

  gameStarted = false;
}



/* ===== Screens ===== */

function hideStartScreen() {
  document.getElementById("start_screen").classList.add("d_none");
}

function showStartScreen() {
  document.getElementById("start_screen").classList.remove("d_none");
}

function hideEndscreen() {
  document.getElementById("endscreen").classList.add("d_none");
}





