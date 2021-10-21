class ClientManager {

  userId;
  ingameId;
  turnofclient = false;
  players = [];
  hand = [];
  familys = [];

  constructor(gamepreview, playerpreview) {
    this.userId = playerpreview.id;
    this.ingameId = playerpreview.ingameId;
    this.hand = playerpreview.hand;
    this.players = gamepreview.players;
    let indice = this.players.findIndex(p => p.ingameId === this.ingameId);
    if (indice !== undefined) {
      this.players.splice(indice, 1);
    }
  }

  getFamily(familyId) {
    let family = this.familys.find(f => f.id === familyId);
    return family; //peut retourner null / undefined
  }

  addFamily(family) {
    this.familys.push(family);
  }

  updateAdv(player) {
    let adv = this.players.find(p => p.ingameId === player.ingameId);
    if (adv !== undefined) {
      adv = player;
      displayAdv(adv);
    }
  }

  showHand() {
    updateCards({hand: this.hand});
  }

  updateAllAdv(game) {
    for (let p of game.players) {
      this.updateAdv(p);
    }
  }

  ourTurn() {
    this.turnofclient = true;
    updateTurnButtons(this.turnofclient);
  }

  notOurTurn() {
    this.turnofclient = false;
    updateTurnButtons(this.turnofclient);
  }

  isOurTurn() {
    return this.turnofclient;
  }

  displayNewFamily(family) {
    let newfamily = new Family(family.id, addingCardInBoardFamily, removingCardFromBoardFamily, displayingCardFromBoardFamily);
    this.addFamily(newfamily);
    newfamily.copyFromFamilyPreview(family);
    newfamily.waitBeforeModification = true;
    newfamily.updateDisplay();
  }

  updateFamily(family) { //family = preview
    let fam = this.getFamily(family.id);
    fam.copyFromFamilyPreview(family);
    fam.updateDisplay();
  }

  breakFamily(family) { //family = preview
    let familyDiv = document.getElementById(family.id);
    familyDiv.parentElement.removeChild(familyDiv);
    let index = this.familys.findIndex(f => f.id === family.id);
    if (index !== -1) {
      this.familys.splice(index, 1);
      console.log(`famille ${family.id} détruite`);
    }
  }

}
