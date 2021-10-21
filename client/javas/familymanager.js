
familyCreatorDiv.addEventListener('mouseup', (evt) => {

  if (eleindrag !== null) {

    inbuildfamily.tryToAdd(eleindrag);
    dragover();

  }

});

inbuildfamily = new Family("inbuildfamily", addingCardInFamilyCreator, removingCardFromFamilyCreator, displayingCardFromFamilyCreator);

function openFamilyCreator() {

  if (!familyCreatorDiv.classList.contains("show")) {
    familyCreatorDiv.classList.add("show");
  } else {
    removeCardsFromFamilyCreator();
    familyCreatorDiv.classList.remove("show");
  }

}

function removeOneCardFromFamilyCreator(card) {
  inbuildfamily.tryToRemove(card);
}

function removeCardsFromFamilyCreator() {
  inbuildfamily.clear();
}

function addingCardInFamilyCreator(card, family) { //card = div
  card.classList.add("in-family-creator");
  if (family.size >= 3) {
    familyCreatorValidButton.style.transform = "scale(1)";
  }
}

function removingCardFromFamilyCreator(card, family) { //card = div
  handCardContainer.appendChild(card); //ajout à la main
  removeClasses(card, ["in-family-creator"]);
  if (family.size < 3) { //update le bouton pour envoyer création de famille
    familyCreatorValidButton.style.transform = "scale(0)";
  }
}

function displayingCardFromFamilyCreator(cards, family) { //card = list of divs
  familyCreatorContainer.textContent = "";
  for (let d of cards) {
    familyCreatorContainer.appendChild(d);
  }
}

function addingCardInBoardFamily(card, family) { //card = div, family = Family class

  socket.emit('add to family', gameId, playerId, family.id, card.id);
  console.log('emit try to add')

}

function removingCardFromBoardFamily(card, family) { //card = div, family = Family class

  socket.emit('remove from family', gameId, playerId, family.id, card.id);
  console.log('emit try to remove')

}

function displayingCardFromBoardFamily(cards, family) {

  let familyContainer = document.getElementById(`${family.id}`);
  let familyCardContainer = document.getElementById(`${family.id}-card-container`);
  if (familyContainer === null) {
    familyContainer = document.createElement('div');
    familyContainer.classList.add('family-container');
    familyContainer.id = `${family.id}`;
    familyContainer.setAttribute("onmouseup", "onFamilyMouseUp(event, this)");

    familyCardContainer = document.createElement('div');
    familyCardContainer.classList.add("family-card-container");
    familyCardContainer.id = `${family.id}-card-container`;
    familyContainer.appendChild(familyCardContainer);

    let breakButton = document.createElement('button');
    breakButton.classList.add("family-break-button");
    breakButton.id = `${family.id}-break-button`;
    breakButton.textContent = "Casser la Famille";
    breakButton.setAttribute("onclick", `breakFamily("${family.id}")`);
    familyContainer.appendChild(breakButton);

    plateauDiv.appendChild(familyContainer);
  }
  familyCardContainer.textContent = "";
  for (let c of cards) {
    if (!c.classList.contains("in-board-family")) {
      c.classList.add("in-board-family");
      c.setAttribute("from-family", family.id);
    }
    familyCardContainer.appendChild(c);
  }

}

function onFamilyMouseUp(evt, familyDiv) {

  if (indrag) {
    let familyId = familyDiv.id;
    let family = clientmanager.getFamily(familyId);
    if (family !== undefined) {
      family.tryToAdd(eleindrag)
    }
    dragover();
  }

}

function breakFamily(familyId) {

  socket.emit('break family', gameId, playerId, familyId);
  console.log('emit break family');

}

function sendRequestForNewFamily() {

  socket.emit('new family', gameId, playerId, inbuildfamily.getPreview());

}

socket.on('family accepted', () => {

  console.log('family accepted');
  inbuildfamily.reinit();
  familyCreatorContainer.textContent = "";
  openFamilyCreator(); //ferme la fenetre

});

socket.on('update family', (family) => { //family = preview

  console.log('update family');
  console.log(family);
  clientmanager.updateFamily(family);

});

socket.on('family destroyed', (family) => {

  console.log('family destroyed');
  console.log(family);
  clientmanager.breakFamily(family);

});
