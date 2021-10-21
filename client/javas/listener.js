
const heightcard = 120;
const widthcard = heightcard - heightcard/4;

var indrag = false;
var eleindrag = null;

function calcCoord(evt, ele, withoutHandCalcul) {

  if (!withoutHandCalcul) {
    let rect = handDiv.getBoundingClientRect();
    ele.style.left = evt.clientX - widthcard/2 + "px";
    ele.style.top = evt.clientY - heightcard/2 - rect.top + "px";
  } else {
    ele.style.left = evt.clientX - widthcard/2 + "px";
    ele.style.top = evt.clientY - heightcard/2 + "px";
  }

}

function copyCard(ele) {

  cardDecoy.style.display = "flex";
  cardDecoy.setAttribute("color", ele.getAttribute("color"));
  cardDecoy.setAttribute("number", ele.getAttribute("number"));
  cardDecoy.setAttribute("joker", ele.getAttribute("joker"));
  cardDecoy.setAttribute("jokercolor", ele.getAttribute("jokercolor"));
  cardDecoy.textContent = ele.textContent;

}

function selectCard(evt, ele) {

  console.log("info de la carte: ");
  console.log(ele.id);
  console.log(ele.getAttribute("number"));
  console.log(ele.getAttribute("color"));

  if (ele.classList.contains("in-family-creator")) {
    removeOneCardFromFamilyCreator(ele);
  } else if (ele.classList.contains("in-board-family")) {
    familyOwner = clientmanager.getFamily(ele.getAttribute("from-family"));
    removingCardFromBoardFamily(ele, familyOwner);
  }

}

function dragstart(evt, ele) {

  if (!ele.classList.contains("in-family-creator") && !ele.classList.contains("in-board-family")) {

    ele.classList.add("draggable");
    eleindrag = ele;
    indrag = true;
    evt.stopPropagation();
    calcCoord(evt, ele);
    copyCard(ele);
    calcCoord(evt, cardDecoy, true);

  }

}

function applyHover(evt, ele) {

  if (indrag === true) {

    function mouseMoveLis(evt) {
      let rect = ele.getBoundingClientRect();
      let target = evt.target;

      if (!target.classList.contains("in-family-creator") && !target.classList.contains("in-board-family")) {
        if (evt.clientX < rect.left + rect.width/2) {
          replaceClass(target, 'card-hovered-right', 'card-hovered-left');
        } else {
          replaceClass(target, 'card-hovered-left', 'card-hovered-right');
        }
      }
    }

    function mouseUpLis(evt) {
      let target = evt.target;

      if (target.classList.contains('card-hovered-left')) {
        target.parentNode.insertBefore(eleindrag, target);
      } else if (target.classList.contains('card-hovered-right')) {
        target.after(eleindrag);
      }

      removeClasses(target, ['card-hovered-left', 'card-hovered-right']);
    }

    function mouseLeaveLis(evt) {
      removeClasses(ele, ['card-hovered-left', 'card-hovered-right']);
      ele.removeEventListener('mousemove', mouseMoveLis);
      ele.removeEventListener('mouseup', mouseUpLis);
      ele.removeEventListener('mouseleave', mouseLeaveLis);
    }

    ele.addEventListener('mousemove', mouseMoveLis);
    ele.addEventListener('mouseup', mouseUpLis);
    ele.addEventListener('mouseleave', mouseLeaveLis);

  }

}

function drag(evt) {

  if (indrag === true && eleindrag !== null && eleindrag.classList.contains("draggable")) {
    calcCoord(evt, eleindrag);
    calcCoord(evt, cardDecoy, true);
  }

}

function dragover(event) {

  indrag = false;
  if (eleindrag !== null && eleindrag.classList.contains("draggable")) {
      eleindrag.classList.remove("draggable");
      cardDecoy.style.display = "none";
  }

}

document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', dragover);
document.addEventListener('mouseleave', dragover);
