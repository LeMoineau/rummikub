var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var gameLib = require('./game.js');

let dir = __dirname.split("\\");
dir.pop();
const dirname = dir.join("/"); //dirname = "D:/Prog/Rummikub"

var gameManager = new gameLib.GameManager(); //contient toutes les games (en cours ou pas)

app.use(express.static(dirname + '/client')); //pour prendre les fichiers static des pages html

app.get('/', (req, res) => {
  res.sendFile(dirname + "/client/index.html");
});

io.on('connection', (socket) => {

  let socket_id = socket.conn.id;
  let ip_address = socket.handshake.address;
  console.log(`user #${socket_id} (${ip_address}) connected !`);

  socket.on('create game', (name) => {
    gameManager.removePlayerFromGamesBySocket(socket);
    gameManager.createGame(name, socket);
  });

  socket.on('join game', (gameId, name) => {
    gameManager.removePlayerFromGamesBySocket(socket);
    gameManager.joinGame(gameId, name, socket);
  });

  socket.on('ready', (gameId, playerId) => {
    gameManager.readyPlayerFromGame(gameId, playerId);
  });

  socket.on('send message', (gameId, playerId, messageContent) => {
    gameManager.sendMessage(gameId, playerId, messageContent);
  });

  socket.on('change options', (gameId, playerId, option, value) => {
    gameManager.changeOptions(gameId, playerId, option, value);
  });

  socket.on('new family', (gameId, playerId, family) => {
    gameManager.createNewFamily(gameId, playerId, family);
  });

  socket.on('end turn', (gameId, playerId) => {
    gameManager.endTurn(gameId, playerId);
  });

  socket.on('request end turn', (gameId) => {
    gameManager.requestEndTurn(gameId);
  });

  socket.on('pioche card', (gameId, playerId) => {
    gameManager.piocheCard(gameId, playerId);
  });

  socket.on('remove from family', (gameId, playerId, familyId, cardId) => {
    gameManager.removeFromFamily(gameId, playerId, familyId, cardId);
  })

  socket.on('add to family', (gameId, playerId, familyId, cardId) => {
    gameManager.addToFamily(gameId, playerId, familyId, cardId);
  });

  socket.on('break family', (gameId, playerId, familyId) => {
    gameManager.breakFamily(gameId, playerId, familyId);
  });

  socket.on('disconnect', () => {
    gameManager.removePlayerFromGamesBySocket(socket);
    console.log(`user #${socket_id} (${ip_address}) disconnected !`);
  });

});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
