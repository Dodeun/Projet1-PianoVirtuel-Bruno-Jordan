/* recuperation de l'element body dans le DOM */
const body = document.querySelector("body");
console.log("Body element");
console.log(body);

/* recuperation de toutes les touches de piano */
const keysArray = document.querySelectorAll(".key");
console.log("Keys list");
console.log(keysArray);

/* chemin vers les fichiers audio de piano1 */
const piano1Path = "assets/sounds/piano1";
/* valeur par défaut du volume du clavier */
const pianoVolume = 0.5;

const audioArray = [];

const keyboardReferences = {
  Q: 0,
  Z: 1,
  S: 2,
  E: 3,
  D: 4,
  F: 5,
  T: 6,
  G: 7,
  Y: 8,
  H: 9,
  U: 10,
  J: 11,
};

/* creer et assigne un element audio pour chaque touche de piano, en fonction du choix de piano */
function setupPianoAudios(keysList, pianoPathInput, volumeInput) {
  /* boucle sur chaque touche de la liste de touches */
  for (const key of keysList) {
    /* creer un new audio qui à pour source le chemin donné dans 
        pianoPath + le nom du fichier qui correspond au data-note */
    const audioKey = new Audio(`${pianoPathInput}/${key.dataset.note}.mp3`);
    audioArray.push(audioKey);

    /* ajuste le volume de la note en fonction des options du piano */
    audioKey.volume = volumeInput;

    /* ajoutes un eventListener à la touche qui call la fonction playClickedKey quand on click sur la touche */
    key.addEventListener("mousedown", () => {
      /* lances la fonction qui joues la note */
      playOnClick(audioKey);
      console.log(audioKey);
      console.log(audioKey.volume);
    });
  }
}

/* jouer la note de la touche cliquée */
function playOnClick(clickedKey) {
  /* mets le "player" de la note clické a 0.5 secondes du debut */
  clickedKey.currentTime = 0.5;

  /* joues la note */
  clickedKey.play();
}

/* jouer la note correspond a la touche clavier  */
function playOnKeyboardPress(clickedKeyboardKey) {
  const note = audioArray[keyboardReferences[clickedKeyboardKey]];
  note.currentTime = 0.5;
  note.play();
  /* audioArray[keyboardReferences.clickedKeyboardKey].play(); */
}

body.addEventListener("keypress", (e) => {
  playOnKeyboardPress(e.key.toUpperCase());
});

setupPianoAudios(keysArray, piano1Path, pianoVolume);
