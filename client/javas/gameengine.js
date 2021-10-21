
class Family {

  id = -1;
  size = 0; //prend toutes les cards en comptant les jokers
  cards = [];
  jokers = [];
  firsteffective = null;
  lasteffective = null;
  type = "clear"; //clear, "one", "x4", "suite"
  divs = [];
  addingFunc = addingCardInFamilyCreator;
  removingFunc = removingCardFromFamilyCreator;
  displayingFunc = displayingCardFromFamilyCreator;
  waitBeforeModification = false;

  constructor(id, addingFunc, removingFunc, displayingFunc) {
    this.id = id;
    this.addingFunc = addingFunc;
    this.removingFunc = removingFunc;
    this.displayingFunc = displayingFunc;
  }

  copyFromFamilyPreview(family) { //family = preview
    this.type = family.type;
    this.cards = [];
    this.jokers = [];
    this.divs = [];
    for (let c of family.cards) {
      let div = createCardDiv(c);
      let preview = getCardPreview(div);
      this.cards.push(preview);
      this.divs.push(div);
    }
    for (let j of family.jokers) {
      let div = createCardDiv(j);
      let preview = getCardPreview(div);
      this.jokers.push(preview);
      this.divs.push(div);
    }
    this.firsteffective = this.cards[0];
    this.lasteffective = this.cards[this.cards.length-1];
  }

  get id() {
    return this.id;
  }

  set type(val) {
    this.type = val;
  }

  getPreview() {
    return {
      cards: this.cards,
      jokers: this.jokers,
      type: this.type
    }
  }

  reinit() {
    this.size = 0;
    this.cards = [];
    this.jokers = [];
    this.firsteffective = null;
    this.lasteffective = null;
    this.type = "clear";
    this.divs = [];
  }

  reinitJoker(j) {
    let index = this.cards.findIndex(c => c.id === j.id);
    if (index !== -1) {
      console.log("reiniting joker");
      this.cards.splice(index, 1);
      this.jokers.push(j);
      j.div.setAttribute("number", "-1");
      j.div.setAttribute("color", "-1");
      j.div.textContent = "";
    }
  }

  add(c, jokerInChange) { //c = preview, jokerInChange = ancien joker
    console.log("in adding process");
    if (!this.waitBeforeModification) {
      if (this.cards.some(ca => ca.joker === true && ca.color === c.color && ca.number === c.number)) {
        let jokerIndex = this.cards.findIndex(ca => ca.joker === true && ca.color === c.color && ca.number === c.number);
        if (jokerIndex !== -1) {
          let joker = this.cards[jokerIndex];
          this.cards[jokerIndex] = c;
          joker.color = -1;
          joker.number = -1;
          displayCard(joker);
        }
      } else if (c.joker === true && !jokerInChange) {
        this.jokers.push(c);
      } else {
        if (c.number < this.firsteffective.number) {
          this.cards.unshift(c);
          this.firsteffective = c;
        } else {
          this.cards.push(c);
          this.lasteffective = c;
        }
      }
      this.size++;
      this.divs.push(c.div);
      this.updateType();
      this.updateDisplay();
      this.addingFunc(c.div, this);
      console.log("adding card: " + c);
    } else {
      this.addingFunc(c.div, this);
    }
  }

  remove(c) { // c = preview
    console.log("in removing process");
    if (!this.waitBeforeModification) {
      if (c.joker === true) this.reinitJoker(c);
      this.cards = removeFromList(this.cards, c)
      this.jokers = removeFromList(this.jokers, c)
      this.divs = removeFromList(this.divs, c)
      this.size--; //mise à jour de size
      eleindrag = null; //pour éviter l'effet ping-pong
      this.updateType();
      this.updateEffective();
      this.searchJokerAfterRemoving(c);
      this.updateDisplay();
      this.removingFunc(c.div, this);
      console.log("removed card: " + c);
    } else {
      this.removingFunc(c.div, this);
    }
  }

  tryToRemove(card) { // card = div
    if (this.divs.includes(card)) {
      let c = getCardPreview(card);
      if (this.type !== "suite") {
        this.remove(c);
      } else {
        if (this.firsteffective.id === c.id || this.lasteffective.id === c.id) {
          this.remove(c);
        }
      }
    }
  }

  clear() {
    let limit = familyCreatorContainer.children.length;
    for (let i = 0; i<limit; i++) {
      let card = familyCreatorContainer.children[0];
      let c = getCardPreview(card);
      this.remove(c);
    }
    this.reinit();
    console.log("cleared inbuildfamily");
  }

  tryToAdd(card) { //card = div
    console.log('try to add');
    let c = getCardPreview(card);
    if (this.cards.some(ca => ca.joker === true && ca.color === c.color && ca.number === c.number)) {
      this.add(c);
    } if (c.joker === true) {
      if (this.type !== "x4") {
        if (this.size < 13) this.add(c)
      } else {
        if (this.size < 4) this.add(c);
      }
    } else {
      if (this.type === "clear") {
        this.firsteffective = c;
        this.lasteffective = c;
        this.add(c);
      } else if (this.type === "one") {
        if (this.firsteffective.number === c.number) { //x4 ou rien
          if (this.firsteffective.color !== c.color) {
            this.add(c);
          }
        } else if (this.firsteffective.color === c.color) { //suite ou rien
          this.tryToAddInSuiteFamily(c);
          console.log("coucou");
        } else {
          console.log('try to add to one but all different from firsteffective');
        }
      } else if (this.type === "x4" && c.number === this.firsteffective.number && this.size < 4) {
        let error = false;
        for (let ca of this.cards) {
          if (ca.color === c.color) error = true;
        }
        if (!error) {
          this.add(c);
        }
      } else if (this.type === "suite" && c.color === this.firsteffective.color && this.size < 13) {
        this.tryToAddInSuiteFamily(c);
      }
    }
  }

  tryToAddInSuiteFamily(c) {
    if (c.number < this.firsteffective.number) {
      let decalage = this.firsteffective.number - c.number;
      if (decalage - 1 <= this.jokers.length) {
        for (let i = 1; i<decalage; i++) {
          let joker = this.jokers[0];
          joker = this.transformJoker(joker, c.color, this.firsteffective.number - i)
          this.cards.unshift(joker);
          this.jokers.splice(0, 1);
        }
        this.add(c);
        console.log("adding card to family 'suite'");
      }
    } else if (c.number > this.lasteffective.number) {
      console.log("coucou2");
      let decalage = c.number - this.lasteffective.number;
      console.log("test " + decalage + " et " + this.jokers.length);
      if (decalage - 1 <= this.jokers.length) {
        console.log("coucou3");
        for (let i = 1; i<decalage; i++) {
          let joker = this.jokers[0];
          joker = this.transformJoker(joker, c.color, this.lasteffective.number + i)
          this.cards.push(joker);
          this.jokers.splice(0, 1);
        }
        console.log("coucou4");
        this.add(c);
        console.log("adding card to family 'suite'");
      }
    }
  }

  searchJokerAfterRemoving(c) { //c = card removing
    console.log("searching joker after removing");
    if (this.firsteffective !== null && this.lasteffective !== null) {
      if (c.id === this.firsteffective.id) {
        console.log("testing firsteffective");
        let i = 0;
        while(i < this.cards.length && this.cards[0].joker === true) {
          this.reinitJoker(this.cards[0]);
          i++;
        }
      } else if (c.id === this.lasteffective.id) {
        console.log("testing lasteffective");
        let i = this.cards.length-1;
        while(i >= 0 && this.cards[i].joker === true) {
          this.reinitJoker(this.cards[i]);
          i--;
        }
      }
      this.updateType();
      this.updateEffective();
    }
  }

  updateType() {
    if (this.cards.length === 0) {
      this.type = "clear";
    } else if (this.cards.length === 1) {
      this.type = "one";
    } else if (this.firsteffective.color === this.lasteffective.color) {
      this.type = "suite";
    } else if (this.firsteffective.number === this.lasteffective.number) {
      this.type = "x4";
    }
    console.log("family set to type: " + this.type);
  }

  updateEffective() {
    if (this.type === "clear") {
      this.firsteffective = null;
      this.lasteffective = null;
    } else if (this.type === "one") {
      this.firsteffective = this.cards[0];
      this.lasteffective = this.cards[0];
    } else {
      this.firsteffective = this.cards[0];
      this.lasteffective = this.cards[this.cards.length-1];
    }
  }

  transformJoker(j, color, number) { //transforme les joker neutre en "vrai" carte et retire de la liste jokers
    j.div.setAttribute("number", number);
    j.div.setAttribute("color", color);
    j.div.textContent = number + "";
    j.number = number;
    j.color = color;
    return j;
  }

  updateDisplay() {
    let divsInOrder = [];
    for (let c of this.cards) {
      divsInOrder.push(c.div);
    }
    for (let j of this.jokers) {
      divsInOrder.push(j.div);
    }
    this.displayingFunc(divsInOrder, this);
  }

}

tmp_id = 0;
function testJoker() {
  j = {
    id: tmp_id,
    number: -1,
    color: -1,
    joker: true,
    jokercolor: "black"
  }
  tmp_id++;
  displayCard(j);
}

function testCard(number, color) {
  j = {
    id: tmp_id,
    number: number,
    color: color,
    joker: false
  }
  tmp_id++;
  displayCard(j);
}
