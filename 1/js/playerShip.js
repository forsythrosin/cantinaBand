var $ = require('jquery');
var PlayerBullet = require('./playerBullet');
var vec2 = require('gl-matrix').vec2;
var Entity = require('./entity');

var bulletSpeed = vec2.set(vec2.create(), 4, 0);


function PlayerShip () {
  Entity.call(this);
  this._pos = vec2.create();
  this._speed = vec2.create();

  var elem = this._domElement = document.createElement('div');
  var $elem = $(elem);
  $elem.css({
    width: 20,
    height: 20,
    backgroundColor: '#444',
    position: 'absolute'
  });
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
  this.setPos(this._pos); // haha, just to update!
};

PlayerShip.prototype.shoot = function () {
  var bullet = new PlayerBullet();
  console.log(this.getPos());
  bullet.setPos(this.getPos());
  bullet.setSpeed(bulletSpeed);
  return bullet;
}

module.exports = PlayerShip;
