let canvas;
let world;
let keyboard = new Keyboard();

let intervalIds = [];
let i = 1; // brauche ich das?

let gameStarted = false;

function startGame() {
  if (gameStarted) {
    return;
  }

  gameStarted = true;
  hideStartScreen();
  init();
  showMobileControls();
}

function hideStartScreen() {
  const startScreen = document.getElementById("start_screen");
  startScreen.classList.add("d_none");
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

// function startGame() {

// document.getElementById('end_screen_winner').classList.add('d_none');
// document.getElementById('gameOverScreen').classList.add('d_none');
// document.getElementById('startScreenContainer').classList.add('d_none');
// document.getElementById('hud').classList.remove('d_none');
// document.getElementById('canvas').style.display = "block";

// init();
// }

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
  hideMobileControls();
  const endscreen = document.getElementById("endscreen");
  endscreen.classList.add("d_none");

  stopGame();
  world.stop();

  initLevel();
  gameStarted = false;
  startGame();

  if (!SoundHub.isMuted) {
    SoundHub.playLoop(SoundHub.mainTheme);
  }
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
