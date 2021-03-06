var Entity = require('./entity');
var $ = require('jquery');
var EnemyBullet = require('./enemyBullet');
var vec2 = require('gl-matrix').vec2;
var windowSize;

function Shooter(pos, speed, ws) {
  windowSize = ws;
  Entity.call(this);
  this._speed = speed;
  
  this._pos = pos;
  var elem = this._domElement = document.createElement('div');
  this._shootTimer = Math.random() * 100;

  $(elem).css({
    position: 'absolute',
  });
  $(elem).addClass('missilo');

  $(this._domElement).css({
    'left': this._pos[0] + "px",
    'top': this._pos[1] + "px"
  });

}

Shooter.prototype = Object.create(Entity.prototype);


Shooter.prototype.shootMaybe = function() {
  if (this._shootTimer <= 0) {
    this._shootTimer += 100 + Math.random()*80;
    var eb = new EnemyBullet(windowSize);
    var pos = vec2.clone(this.getPos());
    pos[1] -= 80;
    var speed = vec2.set(vec2.create(), -4, -3);
    eb.setPos(pos);
    eb.setSpeed(speed);
    return eb;
  }
}


Shooter.prototype.getPos = function () {
  return this._pos;
}


Shooter.prototype.step = function () {
  this._pos[0] -= this._speed;
  $(this._domElement).css({
    'left': this._pos[0] + "px",
    'top': this._pos[1] + "px"
  });
  this._shootTimer--;
}

module.exports = Shooter;
