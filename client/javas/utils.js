
function max(a, b) {
  let res = a;
  if (b > a) res = b;
  return res;
}

function removeFromList(list, val) {
  let index = list.findIndex(e => e.id === val.id);
  if (index !== -1) {
    list.splice(index, 1);
  }
  return list;
}

function checkEnter(event, func) {

  if (event.keyCode === 13) {
    let args = [];
    for (let i = 2; i<arguments.length; i++) { //renvoie les arguments moins 'event' et 'func'
      args.push(arguments[i]);
    }
    func(args);
  }

}

function replaceClass(ele, old, neww) {

  if (ele.classList.contains(old)) {
    ele.classList.remove(old);
  }
  ele.classList.add(neww);

}

function removeClasses(ele, list) {
  for (c of list) {
    if (ele.classList.contains(c)) {
      ele.classList.remove(c);
    }
  }
}

function fromPxToInt(styleStr) {
  return styleStr.substr(0, styleStr.length-2);
}

function openPanel(id) {

  let panel = document.querySelector(`#${id}`);
  if (panel.getAttribute("panel-state") === "closed") {
    panel.setAttribute("panel-state", "open");
    panel.style.transform = `translateX(0)`;
  } else {
    panel.setAttribute("panel-state", "closed");
    panel.style.transform = `translateX(${panel.getAttribute("panel-translation-x")})`;
  }

}

function hideHand() {

  let calcul = handDiv.getBoundingClientRect().height - maxHandHide;
  if (handDiv.style.bottom !== "-" + calcul + "px") {
    handDiv.style.bottom = "-" + calcul + "px";
    handHideButton.textContent = "Afficher";
  } else {
    handDiv.style.bottom = "0px";
    handHideButton.textContent = "Cacher";
  }

}

function updateTurnButtons(ourturn) { //ourturn = boolean

  if (ourturn === true) {
    piocheCardButton.disabled = false;
    endTurnButton.disabled = false;
    endTurnButton.textContent = "Finir son tour";
  } else {
    piocheCardButton.disabled = true;
    endTurnButton.disabled = true;
    endTurnButton.textContent = "Demander la fin du tour";
    setTimeout(function () {
      endTurnButton.disabled = false;
    }, options.timeofturn);
  }
}
