/* const */
const keyboard = document.querySelector(".keyboard"); // On recupere le piano dans le DOM
const keysArray = document.querySelectorAll(".key"); // On recupere les touches de pianos dans le DOM
const pianosList = document.querySelectorAll('input[name="piano"]');
const recordBtn = document.querySelector(".controls__record"); // On recupere le bouton record dans le DOM
const playBtn = document.querySelector(".controls__play"); // On recupere le bouton play dans le DOM
const volumeSlider = document.querySelector("#volume"); // On recupere le slider dans le DOM
const shortcutBtn = document.querySelector(".shortcut__btn"); // on recupere le bouton des raccourcis clavier dans le DOM
const shortcutInfoList = document.querySelectorAll(".key__shortcut"); // on recupere les span contennant l'information des raccourcis clavier
const pianoChecked = document.querySelector('input[name="piano"]:checked');

let pianoPath = `assets/sounds/${pianoChecked.value}`;
const audioObject = {};
const keysObject = {};
const recordObject = {};

let pianoVolume = volumeSlider.value;
let startTimeOfRecording = 0;
let playingRecord = false;
let recordTimeLength = 0;
let rainIncrement = 0;

const keyboardReferences = {
	Q: "Do",
	Z: "Do!",
	S: "Re",
	E: "Re!",
	D: "Mi",
	F: "Fa",
	T: "Fa!",
	G: "Sol",
	Y: "Sol!",
	H: "La",
	U: "La!",
	J: "Si",
};

// Prépare l'objet des notes avec le nom de la note comme clé - à besoin du chemin vers les notes de piano choisies, le volume souhaité, la liste des touches de piano
function prepareNotes(pianoPathInput, volumeInput, pianoKeysArray) {
	// Boucle sur chaque touche du piano
	for (const pianoKey of pianoKeysArray) {
		const audioKey = new Audio(
			`${pianoPathInput}/${pianoKey.dataset.note}.mp3`,
		);
		audioKey.volume = volumeInput;
		audioObject[pianoKey.dataset.note] = audioKey; // Ajoute a l'objet audioObject une paire clé: valeur; exemple: "Sol": <audio src="pianoPathInput/Sol.mp3" ...>
	}
}

// Prépare l'objet des touches de piano avec le nom de la note comme clé
function prepareKeys(pianoKeysArray) {
	for (const pianoKey of pianoKeysArray) {
		keysObject[pianoKey.dataset.note] = pianoKey;
	}
}

// Gestion clicks souris
function setupMouseClick(piannoKeysArray) {
	for (const pianoKey of piannoKeysArray) {
		pianoKey.addEventListener("mousedown", () => {
			const note = pianoKey.dataset.note; // exemple: note = "Sol" quand j'appuis sur la touche qui à un data-note = "Sol"
			playClickedNote(note);
		});
	}
}

// Gestion clavier
function handleKeyPress(pushedKeyboardKey) {
	const note = keyboardReferences[pushedKeyboardKey]; // exemple: const note = keyboardRefences["Q"]; note = "Do"
	if (note) {
		playClickedNote(note);
	}
}

function setupKeydownListener() {
	document.addEventListener("keydown", (e) => {
		if (e.repeat) return; // pour ne pas rejouer la note tant qu'on garde la touche enfoncée
		handleKeyPress(e.key.toUpperCase()); // dans l'objet e on recupere la valeur de la touche clavier qu'on met en majuscule
	});
}

// Jouer une note
function playClickedNote(clickedNote) {
	const audio = audioObject[clickedNote]; // on récupere <audio src="pianoPathInput/Sol.mp3" ...> grace à sa clé audioObject["Sol"]
	audio.currentTime = 0; // on remet l'audio au debut
	audio.play();
	keysAnimation(clickedNote);
	if (isRecording()) {
		recordPlayedKey(clickedNote);
	}
}

// Gestion volume
volumeSlider.addEventListener("touchend", (e) => {
	pianoVolume = e.target.value;
	prepareNotes(pianoPath, pianoVolume, keysArray);
});

volumeSlider.addEventListener("mouseup", (e) => {
	pianoVolume = e.target.value;
	prepareNotes(pianoPath, pianoVolume, keysArray);
});

// Gestion choix piano
for (const pianoType of pianosList) {
	pianoType.addEventListener("click", () => {
		const newPiano = `assets/sounds/${pianoType.value}`;
		if (newPiano !== pianoPath) {
			pianoPath = newPiano;
			prepareNotes(pianoPath, pianoVolume, keysArray);
		}
	});
}

// Gestion raccourcis clavier
shortcutBtn.addEventListener("click", () => {
	shortcutBtn.classList.toggle("shortcut__btn--active");
	keyboard.classList.toggle("key__shortcut--active");
});

// Gestion bouton enregistrement
function setupRecordBtn() {
	recordBtn.addEventListener("click", () => {
		recordBtn.classList.toggle("controls__record--active");
		if (isRecording()) {
			// Vide l'objet si il y avait deja un enregistrement
			const props = Object.getOwnPropertyNames(recordObject);
			for (let i = 0; i < props.length; i++) {
				delete recordObject[props[i]];
			}
			startTimeOfRecording = performance.now();
			playBtn.disabled = true;
		} else {
			playBtn.disabled = false;
		}
	});
}

function isRecording() {
	const recording = recordBtn.classList.contains("controls__record--active");
	return recording;
}

// Gestion enregistrement
function recordPlayedKey(clickedNote) {
	const timeClicked = performance.now() - startTimeOfRecording;
	if (!(clickedNote in recordObject)) {
		recordObject[clickedNote] = [];
	}
	recordObject[clickedNote].push(timeClicked);
}

// Gestion playback
function playback(record) {
	recordTimeLength = 0;
	for (const note in record) {
		for (const noteTime of record[note]) {
			delayNote(note, noteTime);
			if (recordTimeLength < noteTime) {
				recordTimeLength = noteTime;
			}
		}
	}
}

// Gestion note delay
function delayNote(notePlayed, notePlayedTime) {
	setTimeout(() => playClickedNote(notePlayed), notePlayedTime);
}

// Bouton play bloqué pendant l'écoute
function lockPlay(recordDuration) {
	playBtn.computedStyleMap.pointerEvents = "none";
	setTimeout(() => {
		recordBtn.disabled = false;
		playBtn.computedStyleMap.pointerEvents = "auto";
		playBtn.classList.remove("controls__play--active");
		EmojiRain.stop(rainIncrement);
		rainIncrement++;
		playingRecord = false;
	}, recordDuration + 1000);
}

// Gestion bouton play
playBtn.addEventListener("click", () => {
	if (!playingRecord) {
		playingRecord = true;
		recordBtn.disabled = true;
		playBtn.classList.add("controls__play--active");
		animDuringPlay();
		playback(recordObject);
		lockPlay(recordTimeLength);
	}
});

// Animation des touches
function keysAnimation(clickedNote) {
	toggleActiveClass(clickedNote);
	setTimeout(() => {
		toggleActiveClass(clickedNote);
	}, "500");
}

// Toggle class de la touche du piano joué
function toggleActiveClass(notePlayed) {
	const keyPressedElement = keysObject[notePlayed];
	const keyIsWhite = keyPressedElement.classList.contains("key__white");
	if (keyIsWhite) {
		keyPressedElement.classList.toggle("key__white--active");
	} else {
		keyPressedElement.classList.toggle("key__black--active");
	}
}

// Annim pendant que la musique joue
function animDuringPlay() {
	EmojiRain.start(document.body, {
		duration: 0,
		dropsPerSecond: 15,
		dropSize: 40,
		speedMin: 1500,
		speedMax: 3000,
		emoji: {
			"🎵": 10,
			"🎶": 2,
			"🎹": 2,
			"😎": 1,
		},
	});
}
// AJOUTER EmojiRain.stop() pour que l'animation s'arrete

prepareNotes(pianoPath, pianoVolume, keysArray);
prepareKeys(keysArray);
setupMouseClick(keysArray);
setupKeydownListener();
setupRecordBtn();
