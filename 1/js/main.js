var PlayerShip = require('./playerShip');
var $ = require('jquery');
var glMatrix = require('gl-matrix');
var vec2 = require('gl-matrix').vec2;
var Ground = require('./ground'); 
var Shooter = require('./shooter');


var wHeight = $(document).height();
var wWidth = $(document).width();
var windowSize = [wWidth, wHeight];
console.log('ws', windowSize);

var playerShip = new PlayerShip(windowSize);
var ground = new Ground(4, 0.0, 0.3, 1.0);
var ground2 = new Ground(2, 0.2, 0.35, 0.5);
var ground3 = new Ground(1, 0.2, 0.45, 0.25);

var entities = {};
var shooters = {};
var enemyBullets = {};


var movingUp = false;
var movingDown = false;

var spawnShooter = 100;


function add(entity) {
  entities[entity.getId()] = entity;
  $(document.body).append(entity.getDomElement());
}

function addShooter(shooter) {
  shooters[shooter.getId()] = shooter;
  add(shooter);
}


function addEnemyBullet(enemyBullet) {
  enemyBullets[enemyBullet.getId()] = enemyBullet;
  add(enemyBullet);
}


add(playerShip);
add(ground3);
add(ground2);
add(ground);




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

  if (spawnShooter < 0) {
    var pos = vec2.set(vec2.create());
    var s = new Shooter(vec2.set(vec2.create(), window.innerWidth, (1 - Math.random()*0.1) * window.innerHeight), 4, windowSize);
    addShooter(s);
    spawnShooter += 200 + Math.random() * 100;
  }


  Object.keys(shooters).forEach(function (shooterId) {
    var shooter = shooters[shooterId];
    var enemyBullet = shooter.shootMaybe();
    if (enemyBullet) {
      addEnemyBullet(enemyBullet);
    }
  });
  
  playerShip.setSpeed(speed);

  spawnShooter--;
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

