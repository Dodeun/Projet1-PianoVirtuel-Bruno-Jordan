/* je recup toutes les touches de piano */
const keysArray = document.querySelectorAll(".key");
/* chemin vers le piano1 (si jamais on ajoute la feature plus tard); */
const piano1Path = "assets/sounds/piano1";

function setupPiano(array, pianoPath) {
  /* pour chaque touche de l'array de touches */
  for (const element of array) {
    /* creer un new audio qui à pour source le chemin donné dans 
    pianoPath + le nom du fichier qui correspond au data-note */
    const audioKey = new Audio(`${pianoPath}/${element.dataset.note}.mp3`);

    /* ajoutes un eventListener à la touche qui call la fonction playClickedKey quand on click sur la touche */
    element.addEventListener("mousedown", () => {
      console.log(element);
      playClickedKey(audioKey);
    });
  }
}

setupPiano(keysArray, piano1Path);
