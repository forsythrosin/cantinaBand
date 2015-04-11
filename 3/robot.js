'use strict';

var Robot = function (x, y) {
  this.x = x;
  this.y = y;

  this.alive = true;

  this.mesh = new RobotMesh();
  this.mesh.move(x, y);
};

Robot.prototype.move = function (x, y, board) {
  if (this.alive) {
    this.x = x;
    this.y = y;

    this.mesh.move(x, y);
    board.getCell(x, y).occupied = true;
  }
};

Robot.prototype.stepTowards = function (x, y, board) {
  // chessboard dist
  var dx = x - this.x;
  var dy = y - this.y;

  var k = Math.abs(dy/dx);

  var stepX = k < 2 ? Math.sign(dx) : 0;
  var stepY = k > 0.5 ? Math.sign(dy) : 0;

  this.move(this.x + stepX, this.y + stepY, board);
};

Robot.prototype.destroy = function () {
  this.alive = false;
};
