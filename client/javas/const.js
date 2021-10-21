
var socket = io();
var playerId = -1;
var gameId = -1;
var clientmanager;
var inbuildfamily;
var yourturn = false;
var options = {
  timeofturn: 120 * 1000 //120 seconds = 2min
}

const cardDecoy = document.querySelector("#card-decoy");

const loginFrame = document.querySelector("#login-frame");

const previewFrame = document.querySelector("#preview-frame");
const playersPreviewContainer = document.querySelector("#players-preview");
const gameIdPreview = document.querySelector("#gameId-preview");
const previewOptions = document.querySelector("#preview-options");
const optionsOpenButton = document.querySelector("#preview-options-button");
const nbplayermaxOption = document.querySelector("#nbplayermax");
const nbplayertobeginOption = document.querySelector("#nbplayertobegin");
const multiplierpiocheOption = document.querySelector("#multiplierpioche");
const readyButton = document.querySelector("#preview-ready-button");

const chatOpenButton = document.querySelector("#chat-open-button")
const chatInput = document.querySelector("#chat-sender");
const chatMessagesContainer = document.querySelector("#chat-messages");

const gameFrame = document.querySelector("#game-frame");
const handDiv = document.querySelector("#hand");
const handCardContainer = document.querySelector("#hand-card-container");
const handHideButton = document.querySelector("#hand-hide-button");
const piocheCardButton = document.querySelector("#pioche-card-button");
const endTurnButton = document.querySelector("#end-turn-button");
const advContainer = document.querySelector("#game-advs");
const plateauDiv = document.querySelector("#plateau");

const familyCreatorDiv = document.querySelector("#family-creator");
const familyCreatorCloseButton = document.querySelector("#family-creator-close-button");
const familyCreatorContainer = document.querySelector("#new-family-container");
const familyCreatorValidButton = document.querySelector("#family-creator-valid-button");

const endGame = document.querySelector("#end-game");
const endGameTitle = document.querySelector("#end-game-title");
