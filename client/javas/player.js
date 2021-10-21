
function addPlayerPreview(player) {
  let previewId = `preview-player-${player.ingameId}`;
  if (document.querySelector(`#${previewId}`) === null) {
    let div = document.createElement('div');
    div.textContent = player.name;
    div.id = previewId;
    div.classList.add("player-preview");
    div.setAttribute("ready", player.ready);
    playersPreviewContainer.appendChild(div);
  }
}

function removePlayerPreview(player) {
  let previewId = `preview-player-${player.ingameId}`;
  if (document.querySelector(`#${previewId}`) !== null) {
    let div = document.querySelector(`#${previewId}`);
    playersPreviewContainer.removeChild(div);
  }
}

function changeHost(player) {
  previewOptions.setAttribute("state", "nohost");
  for (inp of previewOptions.querySelectorAll("input")) {
    inp.disabled = true;
  }
}

function becomeHost(player, preview) {
  previewOptions.setAttribute("state", "host");
  for (inp of previewOptions.querySelectorAll("input")) {
    inp.disabled = false;
  }
  nbplayermaxOption.value = preview.nbplayermax; //si host vient de rejoindre
  nbplayertobeginOption.value = preview.nbplayertobegin;
  multiplierpiocheOption.value = preview.multiplierpioche;
}

function readyPlayerPreview(player) {
  let previewId = `preview-player-${player.ingameId}`;
  if (document.querySelector(`#${previewId}`) !== null) {
    let div = document.querySelector(`#${previewId}`);
    div.setAttribute("ready", player.ready);
    readyButton.setAttribute("ready", player.ready);
  }
}

function displayCardAdversaire(card) {
  let div = document.createElement("div");
  div.classList.add("card");
}

function updateCards(player) {
  let toDelete = [];
  for (let div of handCardContainer.children) {
    if (!player.hand.some(c => c.id === div.id)){
      toDelete.push(div);
    }
  }
  for (let div of toDelete) {
    div.parentElement.removeChild(div);
  }
  for (let c of player.hand) {
    displayCard(c);
  }
}

socket.on('player join', (player) => {
  addPlayerPreview(player);
  console.log("join");
  console.log(player);
});

socket.on('player leave', (player) => {
  removePlayerPreview(player);
  console.log("leave");
  console.log(player);
});

socket.on('change host', (player) => {
  //faire animation/affichage de changement d'hote
  console.log('change host');
});

socket.on('become host', (list) => {
  let player = list[0];
  let gamepreview = list[1];
  becomeHost(player, gamepreview);
  console.log('become host');
});

socket.on('player ready', (player) => {
  readyPlayerPreview(player);
  console.log("ready");
});

socket.on('turn of', (player) => {

  console.log('not your turn, turn of:');
  console.log(player);
  clientmanager.updateAdv(player);
  clientmanager.notOurTurn()

});

socket.on('your turn', (player) => {

  console.log('your turn!');
  console.log(player);
  clientmanager.ourTurn();

});

socket.on('not your turn', () => {

  console.log("ce n'est pas encore votre tour");
  let message = `ce n'est pas votre tour, encore un peu de patience !`;
  displayNewMessage("player", message, "admin");

});

socket.on('update cards', (player) => {

  console.log('update cards');
  console.log(player);
  updateCards(player);

});

socket.on('cannot change your turn', () => {

  let message = "Vous ne pouvez pas terminer votre tour. Veuillez poser toutes les cartes que vous avez prit du plateau ou piocher si vous n'en avez pas prise";
  displayNewMessage("player", message, "admin");

});
