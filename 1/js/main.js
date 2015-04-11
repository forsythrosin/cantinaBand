var PlayerShip = require('./playerShip');
var $ = require('jquery');
var glMatrix = require('gl-matrix');
var vec2 = require('gl-matrix').vec2;
//var Ground = require('ground'); 

var playerShip = new PlayerShip();
//var ground = new Ground();

var entities = {}
var movingUp = false;
var movingDown = false;


function add(entity) {
  entities[entity.getId()] = entity;
  $(document.body).append(entity.getDomElement());
}

add(playerShip);
//add(ground);

window.requestAnimationFrame(function loop() {

  Object.keys(entities).forEach(function (id) {
    var entity = entities[id];
    entity.step();
  });

  var speed = vec2.create();
  if (movingUp) {
    speed[1] += 5;
  }
  if (movingDown) {
    speed[1] -= 5;
  }
  
  playerShip.setSpeed(speed)
  
  window.requestAnimationFrame(loop);
});




$(document.body).keydown(function (event) {
  
  var speed = vec2.create();  
  if (event.which === 32) { // space
    var bullet = playerShip.shoot();
    add(bullet);
  }
  
  if (event.which === 40) {
    movingUp = true;
  }
  if (event.which === 38) {
    movingDown = true;
  }
});


$(document.body).keyup(function (event) {
  if (event.which === 40) {
    movingUp = false;
  }
  if (event.which === 38) {
    movingDown = false;
  }
});
