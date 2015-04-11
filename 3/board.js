'use strict';

var Board = function (res) {
  this.grid = [];
  this.res = res || 100;

  this.mesh = new BoardMesh(res);

  this.init();
};

Board.prototype.init = function () {
  for (var x = 0; x < this.res; x++) {
    var col = [];
    for (var y = 0; y < this.res; y++) {
      col.push(new Cell(x, y));
    }
    this.grid.push(col);
  }
};

Board.prototype.isLegalMove = function (x, y) {
  if (this.getCell(x, y).isOccupied) {
    return false;
  }
  return true;
};

Board.prototype.getCell = function (x, y) {
  if (x < this.res && y < this.res && x >= 0 && y >= 0) {
    return this.grid[x][y];
  }
  return false;
};

Board.prototype.getCellFromLinearIndex = function (idx) {
  return this.getCell(idx%this.res, Math.floor(idx/this.res));
};

Board.prototype.getRandomEmptyCell = function () {
  var x = Math.floor(Math.random() * this.res);
  var y = Math.floor(Math.random() * this.res);

  var cell = this.getCell(x, y);
  if (cell.isOccupied) {
    return this.getRandomEmptyCell();
  }
  return cell;
};

Board.prototype.unoccupyAllCells = function () {
  this.grid.forEach(function (c) {
    c.isOccupied = false;
  });
};
