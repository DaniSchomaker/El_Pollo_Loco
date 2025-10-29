class SoundHub {
    static mainTheme = new Audio('../audio/007_2.WAV'); // NAMEN ÄNDERN
    static walking = new Audio('../audio/walking.mp3');
    static jump = new Audio('../audio/jump.mp3');
    static chickenStomp = new Audio('../audio/chickenStomp.mp3');
    static collectCoin = new Audio ('../audio/collectCoin.mp3');
    static collectBottle = new Audio ('../audio/collectBottle.mp3');
    static bottleShattering = new Audio('../audio/bottleShattering.mp3');
    static snoring = new Audio('../audio/snoring.mp3');
    static chickenClucks = new Audio('../audio/chickenClucks.mp3');

    // Array, das alle definierten Audio-Dateien enthält
    static allSounds = [
        SoundHub.mainTheme, 
        SoundHub.walking,
        SoundHub.jump, 
        SoundHub.chickenStomp,
        SoundHub.collectCoin,
        SoundHub.collectBottle,
        SoundHub.bottleShattering,
        SoundHub.snoring,
        SoundHub.chickenClucks
    ];


    // Spielt eine einzelne Audiodatei ab
    static playOne(sound, instrumentId) {  // instrumentId nur wichtig für die Visualisierung
        sound.volume = 0.2;  // Setzt die Lautstärke auf 0.2 = 20% / 1 = 100%
        sound.currentTime = 0;  // Startet ab einer bestimmten stelle (0=Anfang/ 5 = 5 sec.)
        sound.play();  // Spielt das übergebene Sound-Objekt ab
        // const instrumentImg = document.getElementById(instrumentId);  // nur wichtig für die Visualisierung
        // instrumentImg.classList.add('active');  // nur wichtig für die Visualisierung
    }


    // Pausiert das Abspielen aller Audiodateien
    static pauseAll() {
        SoundHub.allSounds.forEach(sound => {
            sound.pause();  // Pausiert jedes Audio in der Liste
        });
        // document.getElementById('volume').value = 0.2;  // Setzt den Sound-Slider wieder auf 0.2
        // const instrumentImages = document.querySelectorAll('.sound_img'); // nur wichtig für die Visualisierung
        // instrumentImages.forEach(img => img.classList.remove('active')); // nur wichtig für die Visualisierung
    }


    // Pausiert das Abspielen einer einzelnen Audiodatei
    static pauseOne(sound, instrumentId) {
        sound.pause();  // Pausiert das übergebene Audio
        // const instrumentImg = document.getElementById(instrumentId); // nur wichtig für die Visualisierung
        // instrumentImg.classList.remove('active'); // nur wichtig für die Visualisierung
    }
}