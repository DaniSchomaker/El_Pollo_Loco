/**
 * Central audio manager for the game.
 * Handles mute state, playback (single/loop), persistence, and common sound helpers.
 */
class SoundHub {
  static isMuted = false;

  static mainTheme = new Audio("../audio/mainTheme.mp3");
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

  /**
   * Plays a single sound once.
   * @param {HTMLAudioElement} sound
   * @param {string} [instrumentId]
   */
  static playOne(sound, instrumentId) {
    if (SoundHub.isMuted) return;
    sound.volume = 0.2;
    sound.currentTime = 0;
    sound.play();
  }

  /**
   * Plays a sound in a loop.
   * @param {HTMLAudioElement} sound
   */
  static playLoop(sound) {
    if (SoundHub.isMuted) return;
    sound.loop = true;
    sound.volume = 1;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  /**
   * Pauses all registered sounds.
   */
  static pauseAll() {
    SoundHub.allSounds.forEach((sound) => {
      sound.pause();
    });
  }

  /**
   * Pauses a single sound.
   * @param {HTMLAudioElement} sound
   * @param {string} [instrumentId]
   */
  static pauseOne(sound, instrumentId) {
    sound.pause();
  }

  /**
   * Toggles mute state, updates UI, and persists the setting.
   */
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

      if (document.body.classList.contains("game_running")) {
        SoundHub.playLoop(SoundHub.mainTheme);
      }
    }

    SoundHub.saveToLocalStorage();
    button.blur();
  }

  /**
   * Saves the current mute state to localStorage.
   */
  static saveToLocalStorage() {
    localStorage.setItem("isMuted", JSON.stringify(SoundHub.isMuted));
  }

  /**
   * Loads mute state from localStorage and updates UI accordingly.
   */
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

  /**
   * Starts the walking sound loop if not muted.
   */
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

  /**
   * Stops the walking sound and resets playback time.
   */
  static stopWalking() {
    const walkingSound = SoundHub.walking;
    walkingSound.pause();
    walkingSound.currentTime = 0;
  }
}
