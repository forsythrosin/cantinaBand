var $ = require('jquery');
var vec2 = require('gl-matrix').vec2;
var Entity = require('./entity');
var acc = [0, 0.02];
var windowSize;

function PlayerBullet(ws) {
  windowSize = ws;
  Entity.call(this);
  this._pos = vec2.create();
  this._speed = vec2.create();

  var elem = this._domElement = document.createElement('div');
  var $elem = $(elem);
  $elem.css({
    position: 'absolute'
  });
  $elem.addClass('duck');
}

PlayerBullet.prototype = Object.create(Entity.prototype);


PlayerBullet.prototype.setPos = function (pos) {
  vec2.copy(this._pos, pos);
  $(this._domElement).css({
    'left': pos[0] + "px",
    'top': pos[1] + "px"
  });
}

PlayerBullet.prototype.setSpeed = function (speed) {
  vec2.copy(this._speed, speed);
};

PlayerBullet.prototype.step = function () {
  this._speed[0] += acc[0];
  this._speed[1] += acc[1];
  this._pos[0] += this._speed[0];
  this._pos[1] += this._speed[1];
  this.setPos(this._pos); // haha, just to update!
};

PlayerBullet.prototype.isOutOfBounds = function() {
  return (
    this._pos[0] < -56 ||
    this._pos[0] > windowSize[0] ||
    this._pos[1] < -50 ||
    this._pos[1] > windowSize[1]
  );
};


module.exports = PlayerBullet;
