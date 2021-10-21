
/*
* code_size = 4
* player id size = 9
* card id size = 6
* family id size = 5
*/
const ID_SIZE = 4;
const aleapseudos = ["Rober", "Pierrot", "Boufi", "Popol", "Louis", "Audreynounette", "Testeur", "bon toutou."]

const idcreator = function() {
  let id;
  //id = Math.random().toString(36).substr(2, 9);
  id = Math.random().toString(36).toUpperCase().substr(2, ID_SIZE);
  return id;
}

const idcreatorwithsize = function(size) {

  let id = Math.random().toString(36).substr(2, size);
  return id;

}

const playeridcreator = function() {
  let id;
  id = Math.random().toString(36).substr(2, 9);
  return id;
}

const rand = function(min, max) {
  return Math.floor(Math.random() * Math.floor(max)) + min; //return value in [min, max]
}

const elapsedtime = function(date) {
  let now = Date.now();
  return now - date;
}

const generateuniqueidin = function(list, size) {
  if (!size) size = 6;
  let id = idcreatorwithsize(size);
  while (list.find(e => e.id === id) !== undefined) {
    id = idcreatorwithsize(size);
  }
  return id;
}

const colors = ["red", "orange", "blue", "black"];

module.exports = {
  idcreator: idcreator,
  playeridcreator: playeridcreator,
  generateuniqueidin: generateuniqueidin,
  rand: rand,
  elapsedtime: elapsedtime,
  colors: colors,
  aleapseudos: aleapseudos
}
