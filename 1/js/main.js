var PlayerShip = require('./playerShip');
var $ = require('jquery');
var glMatrix = require('gl-matrix');
var vec2 = require('gl-matrix').vec2;
var Ground = require('./ground'); 

var playerShip = new PlayerShip();
var ground = new Ground(4, 0.0, 0.3, 1.0);
var ground2 = new Ground(2, 0.2, 0.35, 0.5);
var ground3 = new Ground(1, 0.2, 0.45, 0.25);

var entities = {}
var movingUp = false;
var movingDown = false;


function add(entity) {
  entities[entity.getId()] = entity;
  $(document.body).append(entity.getDomElement());
}

add(playerShip);
add(ground3);
add(ground2);
add(ground);




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
