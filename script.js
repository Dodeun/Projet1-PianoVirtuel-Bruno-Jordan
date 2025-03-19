const keysArray = document.querySelectorAll(".key"); // On recupere les touches de pianos dans le dom
const recordBtn = document.querySelector(".controls__record");
const piano1Path = "assets/sounds/classic";
const pianoVolume = 0.3;
const audioObject = {};
const keysObject = {};
const recordObject = {};

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

// Gestion choix piano

// Gestion raccourcis clavier

// Gestion bouton enregistrement
function setupRecordBtn() {
	recordBtn.addEventListener("click", () => {
		recordBtn.classList.toggle("controls__record--active");
		// IF NOT RECORDING
		if (isRecording()) {
			const props = Object.getOwnPropertyNames(recordObject);
			for (let i = 0; i < props.length; i++) {
				delete recordObject[props[i]];
			}
			console.log("Debut de l'enregistrement");
		} else {
			console.log("Fin d'enregistrement:");
			console.log(recordObject);
		}
	});
}

function isRecording() {
	const recording = recordBtn.classList.contains("controls__record--active");
	return recording;
}

// Gestion enregistrement
function recordPlayedKey(clickedNote) {
	const timeClicked = performance.now();
	if (!(clickedNote in recordObject)) {
		recordObject[clickedNote] = [];
	}
	recordObject[clickedNote].push(timeClicked);
	console.log(recordObject);
}

// Gestion timeur

// Gestion playback

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

prepareNotes(piano1Path, pianoVolume, keysArray);
prepareKeys(keysArray);
setupMouseClick(keysArray);
setupKeydownListener();
setupRecordBtn();
