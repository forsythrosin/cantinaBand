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

var audioController = require('./audioController');
audioController.initialize(false);

audioController.onUpStart(function() {
  movingUp = true;
  $('.spaceship').addClass('scream');
  //console.log('upStart');
}).onUpEnd(function() {
  movingUp = false;
  $('.spaceship').removeClass('scream');
  //console.log('upEnd');
}).onDownStart(function() {
  movingDown = true;
  $('.spaceship').addClass('scream');
  //console.log('downStart');
}).onDownEnd(function() {
  movingDown = false;
  $('.spaceship').removeClass('scream');
  //console.log('downEnd');
}).onShoot(function() {
  var bullet = playerShip.shoot();
  $('.spaceship').removeClass('scream');
  add(bullet);
  //console.log('shoot');
});


window.requestAnimationFrame(function loop() {
  audioController.step();

  Object.keys(entities).forEach(function (id) {
    var entity = entities[id];
    entity.step();
  });

  var speed = vec2.create();
  if (movingDown) {
    speed[1] += 5;
  }
  if (movingUp) {
    speed[1] -= 5;
  }
  
  playerShip.setSpeed(speed);
  
  window.requestAnimationFrame(loop);
});




$(document.body).keydown(function (event) {
  
  var speed = vec2.create();  
  if (event.which === 32) { // space
    var bullet = playerShip.shoot();
    add(bullet);
  }
  
  if (event.which === 40) {
    movingDown = true;
    $('.spaceship').addClass('scream');
  }
  if (event.which === 38) {
    movingUp = true;
    $('.spaceship').addClass('scream');
  }
});


$(document.body).keyup(function (event) {
  if (event.which === 40) {
    movingDown = false;
    $('.spaceship').removeClass('scream');
  }
  if (event.which === 38) {
    movingUp = false;
    $('.spaceship').removeClass('scream');
  }
});

