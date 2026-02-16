class Keyboard {
  LEFT = false;
  RIGHT = false;
  UP = false;
  DOWN = false;
  SPACE = false;
  D = false;

  constructor() {
    this.bindKeyboardEvents();
    this.bindTouchEvents();
    this.disableContextMenu();
  }

  /* ========================= */
  /* Keyboard (Desktop)        */
  /* ========================= */

  bindKeyboardEvents() {
    window.addEventListener("keydown", (e) => this.keyDown(e));
    window.addEventListener("keyup", (e) => this.keyUp(e));
  }

  keyDown(e) {
    if (e.key === "ArrowLeft") this.LEFT = true;
    if (e.key === "ArrowRight") this.RIGHT = true;
    if (e.key === "ArrowUp") this.UP = true;
    if (e.key === "ArrowDown") this.DOWN = true;
    if (e.key === " ") this.SPACE = true;
    if (e.key === "d" || e.key === "D") this.D = true;
  }

  keyUp(e) {
    if (e.key === "ArrowLeft") this.LEFT = false;
    if (e.key === "ArrowRight") this.RIGHT = false;
    if (e.key === "ArrowUp") this.UP = false;
    if (e.key === "ArrowDown") this.DOWN = false;
    if (e.key === " ") this.SPACE = false;
    if (e.key === "d" || e.key === "D") this.D = false;
  }

  /* ========================= */
  /* Touch (Mobile)            */
  /* ========================= */

  bindTouchEvents() {
    window.addEventListener("DOMContentLoaded", () => {
      this.bindTouch("button_left", "LEFT");
      this.bindTouch("button_right", "RIGHT");
      this.bindTouch("button_jump", "SPACE");
      this.bindTouch("button_throw", "D");
    });
  }

  disableContextMenu() {
  document.querySelectorAll('.button_mobile').forEach(button => {
    button.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  });
}


  bindTouch(buttonId, keyName) {
    document.getElementById(buttonId)?.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        this[keyName] = true;
      },
      { passive: false },
    );

    document.getElementById(buttonId)?.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
        this[keyName] = false;
      },
      { passive: false },
    );

    document.getElementById(buttonId)?.addEventListener(
      "touchcancel",
      (e) => {
        e.preventDefault();
        this[keyName] = false;
      },
      { passive: false },
    );
  }
}
