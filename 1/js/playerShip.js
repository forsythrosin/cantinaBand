var $ = require('jquery');
var PlayerBullet = require('./playerBullet');
var vec2 = require('gl-matrix').vec2;
var Entity = require('./entity');

var bulletSpeed = vec2.set(vec2.create(), 7, 0);
var bulletOffset = [196, 70];

var windowSize;

function PlayerShip (ws) {
  windowSize = ws;
  Entity.call(this);
  this._pos = vec2.create();
  this.setPos([20,0]);
  this._speed = vec2.create();

  var elem = this._domElement = document.createElement('div');
  var $elem = $(elem);
  $elem.css({
    position: 'absolute'
  });
  $elem.addClass('spaceship');
};

PlayerShip.prototype = Object.create(Entity.prototype);


PlayerShip.prototype.setPos = function (pos) {
  vec2.copy(this._pos, pos);
  $(this._domElement).css({
    'left': pos[0] + "px",
    'top': pos[1] + "px"
  });
};

PlayerShip.prototype.getPos = function () {
  return this._pos;
}

PlayerShip.prototype.setSpeed = function (speed) {
  vec2.copy(this._speed, speed);
};

PlayerShip.prototype.addSpeed = function (speed) {
  this._speed[0] += speed[0];
  this._speed[1] += speed[1];
}

PlayerShip.prototype.step = function () {
  this._pos[0] += this._speed[0];
  this._pos[1] += this._speed[1];
  if (this._pos[1] < 0) this._pos[1] = 0;
  if (this._pos[1] > windowSize[1] - 200) this._pos[1] = windowSize[1] - 200;
  this.setPos(this._pos); // haha, just to update!
};

PlayerShip.prototype.shoot = function () {
  var bullet = new PlayerBullet(windowSize);
  var bulletPos = vec2.clone(this.getPos());
  bulletPos[0] += bulletOffset[0];
  bulletPos[1] += bulletOffset[1];
  bullet.setPos(bulletPos);
  bullet.setSpeed(bulletSpeed);
  return bullet;
}

module.exports = PlayerShip;
