
function changeOptions(ele) {

  let option = ele[0].id;
  let value = ele[0].value;
  console.log(option + " " + value);
  socket.emit('change options', gameId, playerId, option, value);

}

function getCardPreview(card) {
  return {
    id: card.id,
    number: parseInt(card.getAttribute("number")), //int
    color: card.getAttribute("color"),
    joker: card.getAttribute("joker") === "true", //boolean
    div: card, //html element
    jokercolor: card.getAttribute("jokercolor")
  }
}

function createCardDiv(c) { //c = preview
  let div = document.createElement("div");
  div.classList.add("card");
  div.id = c.id;
  div.setAttribute("number", c.number);
  div.setAttribute("color", c.color);
  div.setAttribute("onmousedown", "dragstart(event, this)");
  div.setAttribute("onmouseenter", "applyHover(event, this)");
  div.setAttribute("onclick", "selectCard(event, this)");
  if (c.jokercolor !== undefined) {
    div.setAttribute("joker", "true");
    div.setAttribute("jokercolor", c.jokercolor);
    if (c.number !== -1) {
      div.textContent = c.number;
    }
  } else {
    div.setAttribute("joker", "false");
    div.textContent = c.number;
  }
  return div;
}

function displayCard(c) { //c = preview

  let cardDiv = document.getElementById(`${c.id}`);
  if (cardDiv === null || cardDiv.parentElement.id !== handCardContainer.id) {
    let div = createCardDiv(c);
    handCardContainer.appendChild(div);
    return div;
  }

}

function displayAdv(adv) {

  let advHand = document.querySelector(`#ingameid-${adv.ingameId}`);
  if (advHand !== null) {
    advHand.querySelector("p").textContent = `${adv.nbr_cards} cartes`;
  } else {
    let div = document.createElement("div");
    div.classList.add("game-adv");
    div.id = `ingameid-${adv.ingameId}`;

    let h4 = document.createElement("h4");
    h4.textContent = adv.name;
    h4.classList.add("adv-name");
    div.appendChild(h4);

    let p = document.createElement("p");
    p.textContent = `${adv.nbr_cards} cartes`;
    p.classList.add("adv-nbcards");
    div.appendChild(p);

    advContainer.appendChild(div);
  }

}

function gameStart(preview, you) {

  previewFrame.style.display = "none";
  gameFrame.style.display = "flex";

  console.log(preview);
  console.log(you);

  clientmanager = new ClientManager(preview, you);
  clientmanager.showHand();
  clientmanager.updateAllAdv(preview);

}

socket.on('change options', (list) => {

  let player = list[0];
  let option = list[1];
  let value = list[2];
  let message = `${player.name} a mit l'option '${option}' à ${value} !`;
  document.querySelector(`#${option}`).value = value;
  displayNewMessage(player, message, "admin");

});

socket.on('error option', (list) => {

  let player = list[0];
  let error = list[1];
  let message = `Mince :/, une erreur est survenue: ${error}`;
  displayNewMessage(player, message, "error");

});

socket.on('game start', (gamepreview, playerpreview) => {

  gameStart(gamepreview, playerpreview);
  console.log("game start");

});

socket.on('new family created', (family) => {

  console.log('new family created');
  console.log(family);
  clientmanager.displayNewFamily(family);

});

socket.on('update card number', (player) => {

  clientmanager.updateAdv(player);

});

socket.on('game ended', (player) => {

  console.log('game ended');
  endGame.classList.add("show");
  endGameTitle.textContent = `⏰ La partie est terminée ! C'est ${player.name} qui a gagné !`;
  endGame.style.backgroundColor = "#f39c12";

});

socket.on('game won', (player) => {

  endGameTitle.textContent = `🎉 Bravo ! Vous avez gagné !`;
  endGame.style.backgroundColor = "#2ecc71";

});
