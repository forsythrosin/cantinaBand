'use strict';

var Player = function (x, y) {
  this.x = x;
  this.y = y;

  this.mesh = new PlayerMesh();
};

Player.prototype.move = function (x, y, board) {
  if (this.isLegalMove(x, y, board)) {
    this.x = x;
    this.y = y;

    this.mesh.move(x, y);
    board.getCell(x, y).occupied = true;
    return true;
  }
  return false;
};

Player.prototype.isLegalMove = function (x, y, board) {
  if (Math.abs(this.x - x) > 1) return false;
  if (Math.abs(this.y - y) > 1) return false;

  return board.isLegalMove(x, y);
};

Player.prototype.teleport = function (board) {
  var cell = board.getRandomEmptyCell();
  this.x = cell.x;
  this.y = cell.y;
  this.mesh.move(cell.x, cell.y);
};
