
function joinGame () {

  let gameId = document.querySelector("#game-id").value;
  let pseudo = document.querySelector("#pseudo").value;
  socket.emit('join game', gameId, pseudo);

}

function createGame() {

  let pseudo = document.querySelector("#pseudo").value;
  socket.emit('create game', pseudo);

}

function showPreview() {

  loginFrame.style.display = "none";
  previewFrame.style.display = "flex";
  chatOpenButton.style.transform = "translateX(0)";
  optionsOpenButton.style.transform = "translateX(0)";
  openPanel("chat");

}

function ready() {

  socket.emit('ready', gameId, playerId);

}

function loadGamePreview(preview) {

  console.log(preview);
  gameId = preview.id;
  gameIdPreview.textContent = gameId;

  for (let p of preview.players) {
    addPlayerPreview(p);
  }

}

function endTurn() {
  if (clientmanager.isOurTurn()) {
    socket.emit('end turn', gameId, playerId);
  } else {
    socket.emit('request end turn', gameId, playerId);
  }
}

function piocheCard() {
  socket.emit('pioche card', gameId, playerId);
}

function rejouer() {

  location.reload();

}

socket.on('you', (youId) => {

  playerId = youId;
  console.log(`your playerID is #${youId} (it's personal, if you give it to others players, they could cheat on you)`);
  showPreview();

});

socket.on('join failed', () => {

  //Faire animation ou mettre message pas bon

});

socket.on('preview', (preview) => {

  loadGamePreview(preview);
  //gameIdPreview.select();
  //document.execCommand('copy'); //pour copier le code de la partie automatiquement

});
