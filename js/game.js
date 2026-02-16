let canvas;
let world;
let keyboard = new Keyboard();

let intervalIds = [];
let gameStarted = false;

/**
 * Starts the game once from the start screen.
 * Prevents re-starting if the game is already running.
 */
function startGame() {
  if (gameStarted) return;
  startNewGame();
}

/**
 * Stops any running game loops, (re)initializes the level and world,
 * and switches the UI into gameplay mode.
 */
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

  SoundHub.playLoop(SoundHub.mainTheme);
}

/**
 * Restarts the game from the endscreen.
 */
function restartGame() {
  startNewGame();
}

/**
 * Stops the current game session and returns to the start screen.
 */
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

/**
 * Initializes the canvas and creates a new World instance.
 */
function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

/**
 * Creates an interval that will be cleared when stopGame() is called.
 * @param {Function} fn
 * @param {number} time
 */
function setStoppableInterval(fn, time) {
  let id = setInterval(fn, time);
  intervalIds.push(id);
}

/**
 * Stops all intervals that were created via setStoppableInterval().
 */
function stopGame() {
  intervalIds.forEach(clearInterval);
  intervalIds = [];
}

/**
 * Shows the endscreen for win/lose, plays sounds, and hides mobile controls.
 * @param {"win"|"lose"} type
 */
function showEndscreen(type) {
  const screen = document.getElementById("endscreen");
  const img = document.getElementById("endscreen_img");

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

/**
 * Opens the controls overlay.
 */
function openControls() {
  const overlay = document.getElementById("controls_overlay");
  overlay.classList.remove("d_none");
}

/**
 * Closes the controls overlay.
 */
function closeControls() {
  const overlay = document.getElementById("controls_overlay");
  overlay.classList.add("d_none");
}

/**
 * Prevents overlay click handlers from firing when clicking inside the card.
 * @param {Event} event
 */
function stopClick(event) {
  event.stopPropagation();
}

/**
 * Enables the mobile controls UI state.
 */
function showMobileControls() {
  document.body.classList.add("game_running");
}

/**
 * Disables the mobile controls UI state.
 */
function hideMobileControls() {
  document.body.classList.remove("game_running");
}

/**
 * Hides the start screen.
 */
function hideStartScreen() {
  document.getElementById("start_screen").classList.add("d_none");
}

/**
 * Shows the start screen.
 */
function showStartScreen() {
  document.getElementById("start_screen").classList.remove("d_none");
}

/**
 * Hides the endscreen.
 */
function hideEndscreen() {
  document.getElementById("endscreen").classList.add("d_none");
}
