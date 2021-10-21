
function sendMessage() {

  if (chatInput.value.length > 1) {
    socket.emit('send message', gameId, playerId, chatInput.value);
    chatInput.value = "";
  }

}

function checkNotif() {

  if (chatOpenButton.classList.contains("notif")) {
    chatOpenButton.classList.remove("notif");
  }

}

function displayNewMessage(player, content, perm) {

  console.log('new message: ' + content);
  console.log(player);
  if (chat.getAttribute("panel-state") !== "open") {
    chatOpenButton.classList.add("notif");
  }
  let div = document.createElement("div");
  div.classList.add("chat-message");
  if (perm !== undefined) {
    if (perm === "admin") {
      div.classList.add("admin");
    } else if (perm === "error") {
      div.classList.add("error");
    }
  }

  if (perm === undefined) {
    let sender = document.createElement("span");
    sender.classList.add("sender");
    sender.textContent = player.name;
    div.appendChild(sender);
  }

  let cont = document.createElement("span");
  cont.classList.add("content");
  cont.textContent = content;
  div.appendChild(cont);

  chatMessagesContainer.appendChild(div);
  div.scrollIntoView();

}

socket.on('new message', (list) => {

  player = list[0];
  content = list[1];
  displayNewMessage(player, content);

});
