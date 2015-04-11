var $ = require('jquery');
var vec2 = require('gl-matrix').vec2;
var Entity = require('./entity');

function PlayerBullet() {
  Entity.call(this);
  this._pos = vec2.create();
  this._speed = vec2.create();

  var elem = this._domElement = document.createElement('div');
  var $elem = $(elem);
  $elem.css({
    width: 20,
    height: 20,
    backgroundColor: '#900',
    position: 'absolute'
  });
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
  this._pos[0] += this._speed[0];
  this._pos[1] += this._speed[1];
  this.setPos(this._pos); // haha, just to update!
};


module.exports = PlayerBullet;
