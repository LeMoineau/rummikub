

const canCreateFamily = function(family, ptstopose) { //family est preview de inbuildfamily
  if (family.cards.length + family.jokers.length >= 3) {
    let noerror = true;
    let points = 0;
    if (family.type === "x4") {
      if (family.cards.length + family.jokers.length <= 4) {
        let colorAlreadySeen = [];
        for (let c of family.cards) {
          if (!colorAlreadySeen.includes(c.color)) {
            colorAlreadySeen.push(c.color);
          } else {
            noerror = false;
          }
          points += c.number;
        }
        for (let j of family.jokers) {
          points += family.cards[0].number;
        }
        return noerror && (points >= ptstopose);
      }
    } else if (family.type === "suite") {
      if (family.cards.length + family.jokers.length  <= 13) {
        let points = family.cards[0].number;
        for (let i = 0; i<family.cards.length-1; i++) {
          if (family.cards[i].number >= family.cards[i+1].number) {
            noerror = false;
          }
          points += family.cards[i+1].number;
        }
        for (let i = 0; i<family.jokers.length; i++) {
          points += family.cards[family.cards.length-1].number + i + 1;
        }
        return noerror && (points >= ptstopose);
      }
    } else if (family.type === "clear") {
      return true; //car que des jokers
    } else if (family.type === "one") {
      let points = 0;
      if (family.cards[0].number <= 13 - family.jokers.length) {
        for (let i = 0; i<family.jokers.length; i++) {
          points += family.cards[0].number + i + 1;
        }
      } else {
        points = family.cards[0].number * (family.jokers.length+1);
      }
      return (points >= ptstopose);
    } else {
      console.log(`mauvais type de famille lors du check: "${family.type}"`);
    }
  }
  return false;
}

module.exports = {
  canCreateFamily: canCreateFamily
}
