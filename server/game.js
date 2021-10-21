
var utils = require("./utils.js");
var gamemecanism = require("./gamemecanism.js");

class Card {

  id = -1;
  number = 0;
  color = "blue";

  constructor(id, number, color) {
    this.id = id;
    this.number = number;
    this.color = color;
  }

  get number() {
    return this.number;
  }

  set number(val) {
    this.number = val;
  }

  get color() {
    return this.color;
  }

  set color(val) {
    this.color = val;
  }

  getPreview() {
    let preview = {
      id: this.id,
      number: this.number,
      color: this.color
    }
    return preview;
  }

  isJoker() {
    return false;
  }

}

class Joker extends Card {

  #jokercolor = "black or red";

  constructor(id, jokercolor) {
    super(id, -1, -1);
    this.#jokercolor = jokercolor;
  }

  get jokercolor() {
    return this.#jokercolor;
  }

  set jokercolor(val) {
    this.#jokercolor = val;
  }

  get number() {
    return this.number;
  }

  set number(val) {
    this.number = val;
  }

  get color() {
    return this.color;
  }

  set color(val) {
    this.color = val;
  }

  getPreview() {
    let preview = {
      id: this.id,
      jokercolor: this.jokercolor,
      number: this.number,
      color: this.color
    }
    return preview
  }

  reset() {
    this.number = -1;
    this.color = -1;
  }

  transformInto(number, color) {
    if (this.number === -1 && this.color === -1) {
      this.number = number;
      this.color = color;
    }
  }

  isJoker() {
    return true;
  }

}

class Family {

  #id = -1;
  #creator = "Pierrot le créateur"; //juste names
  #contributors = []; //just names
  #cards = []; //cards here
  #jokers = []; //jokers here
  #type = "clear";
  #notsure = false;
  #previoustate = null; //si notsure alors previoustate sauvegarde la position avant changement

  constructor(id, player, family) {
    this.#id = id;
    this.#creator = player.name;
    this.#cards = player.removeCardsFromHand(family.cards);
    for (let c of family.cards) {
      if (c.joker === true) {
        let card = this.#cards.find(ca => ca.id === c.id);
        if (card !== undefined) {
          card.transformInto(c.number, c.color);
          //card.jokercolor = c.jokercolor;
        }
      }
    }
    this.#jokers = player.removeCardsFromHand(family.jokers);
    this.#type = family.type;
    console.log(`new family #${id} created`);
  }

  get id() {
    return this.#id;
  }

  get cards() {
    return this.#cards;
  }

  get jokers() {
    return this.#jokers;
  }

  get type() {
    return this.#type;
  }

  set type(val) {
    this.#type = val;
  }

  get creator() {
    return this.#creator;
  }

  get contributors() {
    return this.#contributors;
  }

  set contributors(val) {
    this.contributors = val;
  }

  get notsure() {
    return this.#notsure;
  }

  set notsure(val) {
    this.#notsure = val;
  }

  getSize() {
    return (this.cards.length + this.jokers.length);
  }

  getCardListPreview(list) {
    let preview = [];
    for (let l of list)  {
      preview.push(l.getPreview());
    }
    return preview;
  }

  getPreview() {
    let preview = {
      id: this.id,
      creator: this.creator,
      contributors: this.contributors,
      type: this.type
    };
    preview.cards = this.getCardListPreview(this.cards);
    preview.jokers = this.getCardListPreview(this.jokers);
    return preview;
  }

  addContributor(contrib) { //contrib = player class
    if (!this.contributors.includes(contrib.name)) {
      this.contributors.push(contrib.name);
    }
  }

  getCard(cardId) {
    let card = this.cards.find(c => c.id === cardId);
    if (card === undefined) {
      card = this.jokers.find(j => j.id === cardId);
    }
    return card;
  }

  hasCard(cardId) {
    return ((this.cards.find(c => c.id === cardId) !== null) || (this.jokers.find(j => j.id === cardId) !== null))
  }

  removeCard(player, card) {
    if (this.hasCard(card)) {
      this.notsure = true;
      if (this.previoustate !== null) {
          this.previoustate = this.getPreview(); //save previous state
      }
      let index = this.cards.findIndex(c => c.id === card.id);
      if (index === -1) {
        index = this.jokers.findIndex(j => j.id === card.id);
        this.jokers.splice(index, 1);
      } else {
        this.cards.splice(index, 1);
        this.updateType();
        if (this.type === "suite") {
          if (index <= 0) {
            while (this.cards[0].isJoker()) {
              let joker = this.cards[0];
              joker.reset();
              this.cards.splice(0, 1);
              this.jokers.push(joker);
            }
          } else if (index >= this.cards.length-1) {
            while (this.cards[this.cards.length-1].isJoker()) {
              let joker = this.cards[this.cards.length-1];
              joker.reset();
              this.cards.splice(this.cards.length-1, 1);
              this.jokers.push(joker);
            }
          }
          this.updateType();
        }
      }
      player.addTempCard(card);
      this.addContributor(player);
      console.log(`carte #${card.id} retiré de la famille #${this.id}`);
    }
  }

  updateType() {
    if (this.cards.length === 1) {
      this.type = "one";
    } else if (this.cards.length <= 0) {
      this.type = "clear";
    }
  }

  transformJoker(j, number, color) { //j = class
    j.number = number;
    j.color = color;
    return j;
  }

  addCard(player, card) {
    if (player.hasCard(card.id)) {
      if (card.isJoker()) {
        this.jokers.push(card);
        console.log(`joker #${card.id} ajouté à la famille #${this.id}`);
      } else {
        if (this.cards.some(c => c.isJoker() && c.color === card.color && c.number === card.number)) {
          let jokerIndex = this.cards.findIndex(c => c.isJoker() && c.color === card.color && c.number === card.number);
          if (jokerIndex !== -1) {
            let jokerToGive = this.cards[jokerIndex];
            this.cards[jokerIndex] = card;
            jokerToGive.reset();
            player.addCard(jokerToGive);
          }
        } else if (this.type === "x4") {
          this.cards.push(card);
        } else if (this.type === "suite") {
          if (card.number < this.cards[0].number) {
            let decalage = this.cards[0].number - card.number;
            if (decalage > 1 && this.jokers.length >= decalage-1) {
              for (let i = 0; i<decalage-1; i++) {
                this.cards.unshift(this.transformJoker(this.jokers[0], this.cards[0].number - 1, card.color));
                this.jokers.splice(0, 1);
              }
            }
            this.cards.unshift(card);
          } else if (card.number > this.cards[this.cards.length-1].number) {
            let decalage = card.number - this.cards[this.cards.length-1].number;
            if (decalage > 1 && this.jokers.length >= decalage-1) {
              for (let i = 0; i<decalage-1; i++) {
                this.cards.push(this.transformJoker(this.jokers[0], this.cards[0].number + i, card.color));
                this.jokers.splice(0, 1);
              }
            }
            this.cards.push(card);
          }
        } else if (this.type === "one") {
          if (card.color === this.cards[0].color) {
            if (card.number < this.cards[0].number) {
              let decalage = this.cards[0].number - card.number;
              if (decalage > 1 && this.jokers.length >= decalage-1) {
                for (let i = 1; i<decalage; i++) {
                  this.cards.unshift(this.transformJoker(this.jokers[0], this.cards[0].number - 1, card.color));
                  this.jokers.splice(0, 1);
                }
              }
              this.cards.unshift(card);
            } else if (card.number > this.cards[0].number) {
              let decalage = card.number - this.cards[0].number;
              if (decalage > 1 && this.jokers.length >= decalage-1) {
                for (let i = 1; i<decalage; i++) {
                  this.cards.push(this.transformJoker(this.jokers[0], this.cards[0].number + i, card.color));
                  this.jokers.splice(0, 1);
                }
              }
              this.cards.push(card);
            }
            this.type = "suite";
          } else if (card.number === this.cards[0].number) {
            if (!this.cards.some(c => c.color === card.color)) {
              this.cards.push(card);
              this.type = "x4";
            }
          }
        } else if (this.type === "clear") {
          this.cards.push(card);
          this.type = "one";
        }
        console.log(`carte #${card.id} ajouté à la famille #${this.id}`);
      }
      player.removeCardFromHand(card.id);
      this.addContributor(player);
    }
  }

  reloadPreviousState() {
    if (this.notsure) {
      this.cards = this.previoustate.cards;
      this.jokers = this.previoustate.jokers;
      this.type = this.previoustate.type;
      this.notsure = false;
      this.previoustate = null;
    }
  }

  tryToRemove(player, card) {
    let canRemove = false;
    if (this.getSize() > 3) {
      if (this.type === "x4" || this.type === "one" || this.type === "clear") {
        canRemove = true;
      } else if (this.type === "suite") {
        if (this.jokers.find(j => j.id === card.id) !== undefined) {
          canRemove = true;
        } else if (this.cards[0].id === card.id || this.cards[this.cards.length-1].id === card.id) {
          canRemove = true;
        }
      } else {
        console.log(`type de famille inconnu: ${this.type}`);
      }
    }
    return canRemove;
  }

  tryToAdd(player, card) { //player et card = Class
    let canAdd = false;
    if (this.cards.some(c => c.isJoker() && c.color === card.color && c.number === card.number)) {
      canAdd = true;
    } else if (this.type === "x4")  {
      if (this.getSize() < 4) {
        if (card.isJoker()) {
          canAdd = true;
        } else {
          canAdd = !this.cards.some(c => c.color === card.color);
        }
      }
    } else if (this.type === "suite") {
      if (this.getSize() < 13) {
        if (card.isJoker()) {
          canAdd = true;
        } else {
          if (this.cards[0].number - this.jokers.length - 1 <= card.number) {
            canAdd = true;
          } else if (this.cards[this.cards.length-1].number + this.jokers.length + 1 >= card.number) {
            canAdd = true;
          }
        }
      }
    } else if (this.type === "one") {
      if (card.isJoker()) {
        if (this.getSize() < 13) {
          canAdd = true;
        }
      } else {
        if (card.color === this.cards[0].color) {
          if (this.getSize() < 13) {
            if (this.cards[0].number - this.jokers.length - 1 <= card.number) {
              canAdd = true;
            } else if (this.cards[this.cards.length-1].number + this.jokers.length + 1 >= card.number) {
              canAdd = true;
            }
          }
        } else if (card.number === this.cards[0].number) {
          if (this.getSize() < 4) {
            canAdd = !this.cards.some(c => c.color === card.color);
          }
        }
      }
    } else if (this.type === "clear") {
      canAdd = (this.getSize() < 13);
    } else {
      console.log(`type de famille inconnu: ${this.type}`);
    }
    return canAdd;
  }

  break(player) {
    for (let c of this.cards) {
      if (c.isJoker()) {
        c.reset();
      }
      player.addTempCard(c);
    }
    for (let j of this.jokers) {
      player.addTempCard(j);
    }
  }

}

class Player {

  #id = 0;
  #name = "new player";
  #cards = [];
  #socket = null;
  #ready = false;
  #ingameId = -1;
  #hasposed = false;
  #turnstates = {
    cardstake: [],
    haspioched: false,
    hasposedthisturn: false
  }

  constructor(id, name, socket, ingameId) {
    this.#id = id;
    if (name !== "") {
      this.#name = name;
    } else {
      this.#name = utils.aleapseudos[utils.rand(0, utils.aleapseudos.length)];
    }
    this.#socket = socket;
    this.#ingameId = ingameId;
    console.log(`new player #${id}!`)
  }

  get id() {
    return this.#id;
  }

  get cards() {
    return this.#cards;
  }

  get socket() {
    return this.#socket;
  }

  get ready() {
    return this.#ready;
  }

  get name() {
    return this.#name;
  }

  get turnstates() {
    return this.#turnstates;
  }

  set turnstates(val) {
    this.#turnstates = val;
  }

  set name(name) {
    this.#name = name;
  }

  set ready(val) {
    this.#ready = val;
  }

  get hasposed() {
    return this.#hasposed;
  }

  set hasposed(val) {
    this.#hasposed = val;
  }

  getPreview(showHand) {
    let preview = {
      ingameId: this.#ingameId,
      name: this.#name,
      ready: this.#ready,
      nbr_cards: this.#cards.length
    }
    if (showHand !== undefined) {
      preview.hand = this.getHandPreview();
      preview.id = this.id;
    }
    return preview;
  }

  getHandPreview() {
    let hand = [];
    for (let c of this.cards) {
      hand.push(c.getPreview());
    }
    return hand;
  }

  getCard(idOrNumber, color) {
    if (!color) {
      return this.#cards.find(c => c.id === idOrNumber);
    } else {
      return this.#cards.find(c => c.number === idOrNumber && c.color === color);
    }
  }

  hasCard(cardId) {
    return this.cards.some(c => c.id === cardId);
  }

  addCard(card, checkIfAlreadyHas) {
    if (checkIfAlreadyHas === undefined || !this.#cards.includes(card)) {
      this.#cards.push(card);
      this.socket.emit('update cards', this.getPreview(true));
    }
  }

  addTempCard(card) { //card = card class | ajoute à la main mais met dans temp
    this.addCard(card);
    this.turnstates.cardstake.push(card);
  }

  removeCardFromHand(cardId) {
    let index = this.#cards.findIndex(c => c.id === cardId);
    if (index === -1) {
      console.log(`player #${this.#id} n'a pas la carte #${cardId}`);
    } else {
      let card = this.cards[index];
      let indexInCardsTaken = this.turnstates.cardstake.findIndex(c => c.id === cardId);
      if (indexInCardsTaken !== -1) {
        this.turnstates.cardstake.splice(indexInCardsTaken, 1);
      }
      this.cards.splice(index, 1);
      return card;
    }
  }

  removeCardsFromHand(cards) { //cards est une liste de preview
    let removedCards = [];
    for (let c of cards) {
      let inremoving = this.removeCardFromHand(c.id);
      if (inremoving !== undefined) {
          removedCards.push(inremoving);
      }
    }
    return removedCards;
  }

  hasCardsInHand(cards) { // cards est une liste de preview
    let noerror = true;
    for (let card of cards) {
      if (noerror) {
        noerror = this.hasCard(card.id);
      }
    }
    if (noerror === false) {
      console.log(`le joueur #${this.id} n'a pas toutes les cartes demandées`);
    }
    return noerror;
  }

  getCardsFromHand(cards) {
    let result = [];
    for (let card of cards) {
      let index = this.cards.findIndex(c => c.id === card.id);
      if (index !== -1) {
        result.push(this.hand[i]);
      }
    }
  }

  reinitTurnState() {
    this.turnstates = {
      cardstake: [],
      haspioched: false,
      hasposedthisturn: false
    }
  }

  posed() {
    this.hasposed = true;
    this.turnstates.hasposedthisturn = true;
  }

  hasPosed() {
    return this.hasposed;
  }

  pioched() {
    this.turnstates.haspioched = true;
  }

  hasPioched() {
    return this.turnstates.haspioched;
  }

  canChangeHisTurn() {
    return (this.turnstates.cardstake.length <= 0 && (this.turnstates.haspioched || this.turnstates.hasposedthisturn))
  }

  canPioche() {
    return (this.turnstates.cardstake.length <= 0 && !this.turnstates.haspioched && !this.turnstates.hasposedthisturn)
  }

  wantCreateTakenFamily(family) { //family = list of all family cards
    return (family.every(c => this.turnstates.cardstake.includes(c)))
  }

}

class Game {

  #id = 0;
  #hasstarted = false;
  #players = []; // [Player, Player, Player]
  #pioche = [];
  #familys = [];
  #nbplayerswhohasjoined = 0;
  #hostid = -1;
  #turnof = -1;
  #beginofturn = -1;
  #options = {
    nbplayermax: 8,
    nbplayertobegin: 2,
    multiplierpioche: 2,
    nbcardinfirsthand: 13,
    ptstopose: 0,
    timeofturn: 2 * 60 * 1000 //2min = 120.000 milliseconds
  }
  #turnstates = {
    notsurefamilys: []
  }

  constructor(id) {
    this.#id = id;
  }

  get id() {
    return this.#id;
  }

  get hostid() {
    return this.#hostid;
  }

  set hostid(id) {
    this.#hostid = id;
    let host = this.getPlayer(id);
    this.emitToAllPlayers('change host', host.getPreview());
    host.socket.emit('become host', [host.getPreview(), this.getPreview()]);
    console.log(`nouvel hote de partie #${this.id}: #${id}`);
  }

  get players() {
    return this.#players;
  }

  get pioche() {
    return this.#pioche;
  }

  get familys() {
    return this.#familys;
  }

  get turnof() {
    return this.#turnof;
  }

  set turnof(val) {
    this.#turnof = val;
  }

  get beginofturn() {
    return this.#beginofturn;
  }

  set beginofturn(val) {
    this.#beginofturn = val;
  }

  get nbplayerswhohasjoined() {
    return this.#nbplayerswhohasjoined;
  }

  get options() {
    return this.#options;
  }

  get nbplayermax() {
    return this.#options.nbplayermax;
  }

  get nbplayertobegin() {
    return this.#options.nbplayertobegin;
  }

  get multiplierpioche() {
    return this.#options.multiplierpioche;
  }

  get nbcardinfirsthand() {
    return this.#options.nbcardinfirsthand;
  }

  get timeofturn() {
    return this.#options.timeofturn;
  }

  get turnstates() {
    return this.#turnstates;
  }

  set turnstates(val) {
    this.#turnstates = val;
  }

  setOption(option, val) {
    let res = 'success';
    if (option === "nbplayermax") {
      if (val >= 2) this.#options.nbplayermax = val;
      else res = 'wrong value';
    } else if (option === "nbplayertobegin") {
      if (val >= 2) this.#options.nbplayertobegin = val;
      else res = 'wrong value';
    } else if (option === "multiplierpioche") {
      if (val >= 1) this.#options.multiplierpioche = val;
      else res = 'wrong value';
    } else {
      res = 'undefined option';
    }
    return res;
  }

  getPlayer(id) {
    let player = this.#players.find(p => p.id === id);
    if (player === undefined) {
      console.log(`player #${id} inconnu`);
    } else {
      return player;
    }
  }

  addPlayer(player) {
    if (!this.hasstarted) {
      this.emitToAllPlayers('player join', player.getPreview());
      this.#players.push(player);
      player.socket.emit('preview', this.getPreview());
      this.#nbplayerswhohasjoined += 1;
      console.log(`le joueur #${player.id} a rejoint la partie #${this.#id}`);
      if (this.getNbPlayers() === 1) {
        this.hostid = player.id;
      }
    }
  }

  removePlayer(index, reason) {
    let player = this.#players[index];
    if (player.id === this.turnof) { //si était son tour
      this.changeTurn();
    }
    this.#players.splice(index, 1);
    this.emitToAllPlayers('player leave', player.getPreview())
    console.log(`player #${player.id} retiré de la game #${this.#id} (par ${reason})`);
    if (player.id === this.hostid && this.getNbPlayers() >= 1) { //si était hote
      this.hostid = this.players[0].id;
    }
  }

  getFamily(familyId) {
    let family = this.familys.find(f => f.id === familyId);
    if (family === undefined) {
      console.log(`family #${familyId} pas trouvée`);
    } else {
      return family;
    }
  }

  addFamily(family, player) { //family est un preview de inbuildfamily
    let id = utils.generateuniqueidin(this.familys, 5);
    let newfamily = new Family(id, player, family); //retirer automatiquement les cartes de la main du joueur
    this.familys.push(newfamily);
    player.socket.emit('family accepted');
    this.emitToAllPlayers('new family created', newfamily.getPreview());
  }

  removeFamily(familyId) {
    let index = this.familys.findIndex(f => f.id === familyId);
    if (index !== -1) {
      let family = this.familys[index];
      this.familys.splice(index, 1);
      this.emitToAllPlayers('family destroyed', family.getPreview());
      console.log(`family #${familyId} détruite`);
    }
  }

  getNbPlayers() {
    return this.#players.length;
  }

  getPlayersPreview() {
    let pls = [];
    for (let p of this.#players) {
      pls.push(p.getPreview());
    }
    return pls;
  }

  getPiochePreview() {
    let cards = [];
    for (let c of this.#pioche) {
      cards.push(c.getPreview());
    }
    return cards;
  }

  getPreview(showPioche) {
    let preview = {
      id: this.#id,
      hasstarted: this.#hasstarted,
      players: this.getPlayersPreview(),
      taillepioche: this.pioche.length,
      nbplayerswhohasjoined: this.nbplayerswhohasjoined,
      options: this.options
    }
    if (showPioche !== undefined) preview.pioche = this.getPiochePreview();
    return preview;
  }

  registerNewPlayer(name, socket) {
    if (this.#hasstarted) {
      console.log(`la game #${this.#id} a déjà commencé`);
      return null;
    } else {
      let id = utils.playeridcreator();
      while (this.#players.some(p => p.id === id)) {
        id = utils.playeridcreator();
      }
      let newplayer = new Player(id, name, socket, this.nbplayerswhohasjoined);
      this.addPlayer(newplayer);
      return newplayer;
    }
  }

  removePlayerFromId(id) {
    let index = this.#players.findIndex(p => p.id === id);
    this.removePlayer(index, "méthode par id");
  }

  removePlayerFromSocket(socket) {
    let index = this.#players.findIndex(p => p.socket === socket);
    this.removePlayer(index, "méthode par socket");
  }

  emitToAllPlayers(eventname, val) {
    for (let p of this.#players) {
      p.socket.emit(eventname, val);
    }
  }

  canStart() {
    return (this.#players.every(p => p.ready === true) && this.getNbPlayers() >= this.nbplayertobegin);
  }

  readyPlayer(playerId) {
    let player = this.getPlayer(playerId);
    if (player !== undefined) {
      player.ready = !player.ready;
      console.log(`player #${playerId} a mit ready: ${player.ready}`);
      this.emitToAllPlayers('player ready', player.getPreview());
      if (this.canStart()) {
        this.start();
      }
    }
  }

  changeOptions(playerId, option, value) {
    let player = this.getPlayer(playerId);
    if (player !== undefined && this.hostid === player.id) {
      let res = this.setOption(option, value);
      if (res !== "success") {
        console.log(`host #${player.id} make option mistake: ${res}`);
        player.socket.emit('error option', [player.getPreview(), res]);
      } else {
        console.log(`host #${player.id} set option '${option}' to '${value}'`);
        this.emitToAllPlayers('change options', [player.getPreview(), option, value]);
      }
    }
  }

  drawCard(player, nbCards) {
    if (nbCards === undefined) nbCards = 1;
    for (let i = 0; i<nbCards; i++) {
      let index = utils.rand(0, this.pioche.length-1);
      let card = this.pioche[index];
      player.addCard(card);
      this.#pioche.splice(index, 1);
    }
  }

  generatePioche() {
    let jokercolors = ["black", "red"];
    for (let i = 0; i<this.multiplierpioche; i++) {
      for (let c of utils.colors) {
        for (let n = 1; n<=13; n++) {
          let id = utils.generateuniqueidin(this.pioche);
          this.#pioche.push(new Card(id, n, c));
        }
      }
      this.#pioche.push(new Joker(utils.generateuniqueidin(this.pioche), jokercolors[i%jokercolors.length]));
    }
    console.log(`pioche game #${this.id} generated`);
  }

  generateHands() {
    let i = 0;
    for (let player of this.players) {
        this.drawCard(player, this.nbcardinfirsthand);
        /*player.addCard(new Card(i + "", 1, "blue"));
        player.addCard(new Card(i+1 + "", 2, "blue"));
        player.addCard(new Card(i+2 + "", 3, "blue"));
        player.addCard(new Card(i+3 + "", 4, "blue"));
        player.addCard(new Joker(i+4 + "", "red"));
        player.addCard(new Joker(i+5 + "", "red"));
        player.addCard(new Joker(i+6 + "", "black"));
        i++;*/
    }
    this.drawCard(this.players[0]); //Le premier commence avec une carte en plus
    console.log(`hands game #${this.id} generated`);
  }

  start() {
    this.#hasstarted = true;
    this.generatePioche();
    this.generateHands();
    for (let p of this.players) {
      p.socket.emit('game start', this.getPreview(), p.getPreview("showHand"));
    }
    console.log(`game #${this.id} started`);
    this.changeTurn();
  }

  setTurnTo(player) {
    this.turnof = player.id;
    this.emitToAllPlayers('turn of', player.getPreview());
    player.socket.emit('your turn', player.getPreview("showHand"));
  }

  isTurnOf(player) {
    return (this.turnof === player.id);
  }

  reinitTurnState() {
    this.turnstates = {
      notsurefamilys: []
    }
  }

  changeTurn() {
    if (this.turnof === -1) {
      this.setTurnTo(this.players[0]);
    } else {
      let oldplayer = this.getPlayer(this.turnof);
      oldplayer.reinitTurnState();
      if (this.turnstates.notsurefamilys.length > 0) {
        for (f of this.turnstates.notsurefamilys) {
          f.reloadPreviousState();
        }
        this.reinitTurnState();
      }
      let index = this.players.findIndex(p => p.id === this.turnof);
      index = (index+1)%this.getNbPlayers();
      this.setTurnTo(this.players[index]);
    }
    this.beginofturn = Date.now();
  }

  sendMessage(playerId, content) {
    let player = this.getPlayer(playerId);
    if (player !== undefined) {
      this.emitToAllPlayers('new message', [player.getPreview(), content]);
    }
  }

  createNewFamily(playerId, family) { //family contient cards, jokers et type
    let player = this.getPlayer(playerId);
    if (player !== undefined) {
      if (this.isTurnOf(player)) {
        if (player.hasCardsInHand(family.cards) && player.hasCardsInHand(family.jokers)) {
          if (gamemecanism.canCreateFamily(family, this.options.ptstopose)) {
            let allfamilycards = family.cards.concat(family.jokers);
            if (!player.wantCreateTakenFamily(allfamilycards)) {
              player.posed();
            }
            this.addFamily(family, player);
            this.emitToAllPlayers('update card number', player.getPreview());
          }
        }
      } else {
        player.socket.emit('not your turn');
      }
    }
  }

  endTurnOf(playerId) {
    let player = this.getPlayer(playerId);
    if (player !== undefined) {
      if (this.isTurnOf(player) && player.canChangeHisTurn()) {
        if (player.cards.length <= 0) {
          this.emitToAllPlayers('game ended', player.getPreview());
          player.socket.emit('game won', player.getPreview(true));
        } else {
          this.changeTurn();
        }
      } else {
        player.socket.emit('cannot change your turn');
      }
    }
  }

  requestEndTurn() {
    let now = Date.now();
    if (now - this.beginofturn > this.options.timeofturn) {
      console.log(`time elapsed: ${now - this.beginofturn}/${this.options.timeofturn}`);
      let player = this.getPlayer(this.turnof);
      //remettre les pieces que tu as prises sur le plateau et piocher si n'a rien poser
      this.changeTurn();
    }
  }

  piocheCard(playerId) {
    let player = this.getPlayer(playerId);
    if (player !== undefined) {
      if (this.isTurnOf(player) && player.canPioche()) {
        this.drawCard(player);
        player.pioched();
        this.emitToAllPlayers('update card number', player.getPreview());
        this.endTurnOf(playerId);
      }
    }
  }

  removeFromFamily(playerId, familyId, cardId) {
    let player = this.getPlayer(playerId);
    if (player !== undefined) {
      let family = this.getFamily(familyId);
      if (family !== undefined) {
        if (this.isTurnOf(player) && family.hasCard(cardId) && player.hasPosed()) {
          let card = family.getCard(cardId);
          if (family.tryToRemove(player, card)) {
            family.removeCard(player, card);
            this.emitToAllPlayers('update family', family.getPreview());
            player.socket.emit('update cards', player.getPreview(true));
            this.emitToAllPlayers('update card number', player.getPreview());
          }
        }
      }
    }
  }

  addToFamily(playerId, familyId, cardId) {
    let player = this.getPlayer(playerId);
    if (player !== undefined) {
      let family = this.getFamily(familyId);
      if (family !== undefined) {
        if (this.isTurnOf(player) && player.hasCard(cardId) && player.hasPosed()) {
          let card = player.getCard(cardId);
          if (family.tryToAdd(player, card)) {
            family.addCard(player, card);
            player.socket.emit('update cards', player.getPreview(true));
            this.emitToAllPlayers('update card number', player.getPreview());
            this.emitToAllPlayers('update family', family.getPreview());
          } else {
            console.log('try to add not successed');
          }
        } else {
          console.log('turn states not passed');
        }
      }
    }
  }

  breakFamily(playerId, familyId) {
    let player = this.getPlayer(playerId);
    if (player !== undefined) {
      let family = this.getFamily(familyId);
      if (family !== undefined) {
        if (this.isTurnOf(player) && player.hasPosed()) {
          family.break(player);
          this.removeFamily(familyId); // <- emit 'family destroyed'
        }
      }
    }
  }

}

const gameManager = class GameManager {

  #games = [];

  getGame(id, usedby) {
    let game = this.#games.find(g => g.id === id);
    if (game === undefined) {
      console.log(`game #${id} pas trouvée (${usedby})`);
    } else {
      console.log(`game #${id} trouvée (${usedby})`);
      return game;
    }
  }

  getGameWhereIsPlayer(socket) {
    let game = this.#games.find(g => g.players.some(p => p.socket === socket));
    return game;
  }

  getGamePreview(id) {
    let game = this.getGame(id, 'preview');
    return game.getPreview();
  }

  createGame(creator, socket) {
    let id = utils.idcreator();
    while (this.#games.some(g => g.id == id)) {
      id = utils.idcreator();
    }
    let newgame = new Game(id);
    this.#games.push(newgame);
    console.log(`game #${id} crée !`);
    let player = newgame.registerNewPlayer(creator, socket);
    socket.emit('you', player.id);
    return {
      gameId: id,
      player: player
    }
  }

  joinGame(id, joiner, socket) {
    let game = this.getGame(id, 'join game');
    if (game === undefined) {
      socket.emit('join failed');
    } else {
      let player = game.registerNewPlayer(joiner, socket);
      if (player === null) {
        socket.emit('join failed');
      } else {
        socket.emit('you', player.id);
      }
      return player;
    }
  }

  removeGame(id, reason) {
    let index = this.#games.findIndex(g => g.id == id);
    this.#games.splice(index, 1);
    console.log(`game #${id} supprimée (${reason})`);
  }

  removePlayerFromGamesBySocket(socket) {
    let game = this.getGameWhereIsPlayer(socket);
    if (game !== undefined) {
        game.removePlayerFromSocket(socket);
        if (game.getNbPlayers() <= 0) {
          if (game.timeoutid !== -1) clearTimeout(game.timeoutid);
          this.removeGame(game.id, 'plus de joueur');
        }
    }
  }

  readyPlayerFromGame(gameId, playerId) {
    let game = this.getGame(gameId, 'ready');
    if (game !== undefined) {
      game.readyPlayer(playerId);
    }
  }

  sendMessage(gameId, playerId, content) {
    let game = this.getGame(gameId, 'send message');
    if (game !== undefined) {
      game.sendMessage(playerId, content);
    }
  }

  changeOptions(gameId, playerId, option, value) {
    let game = this.getGame(gameId, 'change options');
    if (game !== undefined) {
      game.changeOptions(playerId, option, value);
    }
  }

  createNewFamily(gameId, playerId, newfamily) {
    let game = this.getGame(gameId, 'new family request');
    if (game !== undefined) {
      game.createNewFamily(playerId, newfamily);
    }
  }

  endTurn(gameId, playerId) {
    let game = this.getGame(gameId, 'end turn request');
    if (game !== undefined) {
      game.endTurnOf(playerId);
    }
  }

  requestEndTurn(gameId) {
    let game = this.getGame(gameId, 'other player want end turn');
    if (game !== undefined) {
      game.requestEndTurn();
    }
  }

  piocheCard(gameId, playerId) {
    let game = this.getGame(gameId, 'pioche request');
    if (game !== undefined) {
      game.piocheCard(playerId);
    }
  }

  removeFromFamily(gameId, playerId, familyId, cardId) {
    let game = this.getGame(gameId, 'try to remove from family');
    if (game !== undefined) {
      game.removeFromFamily(playerId, familyId, cardId);
    }
  }

  addToFamily(gameId, playerId, familyId, cardId) {
    let game = this.getGame(gameId, 'try to add to family');
    if (game !== undefined) {
      game.addToFamily(playerId, familyId, cardId);
    }
  }

  breakFamily(gameId, playerId, familyId) {
    let game = this.getGame(gameId, 'try to break family');
    if (game !== undefined) {
      game.breakFamily(playerId, familyId);
    }
  }

}

module.exports = {
  GameManager: gameManager
}
