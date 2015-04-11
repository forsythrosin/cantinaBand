'use strict';

var Game = function (res, robotCount) {
  this.res = res || 100;
  this.robotCount = robotCount || 5;

  this.scrap = [];
  this.level = 1;

  this.world = new THREE.Object3D();
  this.init();

  this.winSubscribers = [];
  this.lostSubscribers = [];

  this.won = false;
  this.lost = false;
};

Game.prototype.init = function () {
  this.player = new Player();
  this.board = new Board(this.res);


  this.world.add(this.player.mesh);
  this.world.add(this.board.mesh);

  this.player.move(this.res/2, this.res/2, this.board);
  this.initRobots();
};

Game.prototype.initRobots = function () {
  this.robots = [];

  for (var i = 0; i < this.robotCount*this.level; i++) {
    var c = this.board.getRandomEmptyCell();
    var r = new Robot(c.x, c.y);
    this.world.add(r.mesh);
    this.robots.push(r);
  }
};

Game.prototype.tick = function (cell) {
  if (this.player.move(cell.x, this.res - 1 - cell.y, this.board)) {
    this.board.unoccupyAllCells();
    this.moveRobots();
    this.checkWinCondition();
  }
};

Game.prototype.checkWinCondition = function () {
  if (this.isLost()) {
    this.lost = true;
    this.lostSubscribers.forEach(function (ls) {
      ls.fn.call(ls.ctx);
    });
  } else if (this.isWon()) {
    this.won = true;
    this.winSubscribers.forEach(function (ws) {
      ws.fn.call(ws.ctx);
    });
  }
};

Game.prototype.moveRobots = function () {
  var self = this;

  this.robots.forEach(function (r) {
    r.stepTowards(this.player.x, this.player.y, this.board);
  }.bind(this));

  var collisions = {};
  this.robots.forEach(function (r) {
    var rpos = [r.x, r.y].join('');
    collisions[rpos] = collisions[rpos] || [];
    collisions[rpos].push(r);
  });

  var keys = Object.keys(collisions);
  keys.forEach(function (k) {
    var collision = collisions[k];
    if (collision.length > 1) {
      var scrapX, scrapY;
      collision.forEach(function (robot) {
        scrapX = robot.x;
        scrapY = robot.y;
        robot.destroy();
        var mesh = self.world.getObjectByName(robot.id);
        if (mesh) {
          self.world.remove(mesh);
        }
      });
      self.placeScrap(scrapX, scrapY);
    }
  });
};

Game.prototype.isWon = function () {
  var i = this.robots.length;
  while (i--) {
    if (this.robots[i].alive) {
      return false;
    }
  }
  return true;
};

Game.prototype.onWin = function (fn, ctx) {
  this.winSubscribers.push({fn: fn, ctx: ctx});
};

Game.prototype.isLost = function () {
  var i = this.robots.length;
  while (i--) {
    var r = this.robots[i];
    if (r.x == this.player.x && r.y == this.player.y) {
      return true;
    }
  }
  return false;
};

Game.prototype.onLost = function (fn, ctx) {
  this.lostSubscribers.push({fn: fn, ctx: ctx});
};

Game.prototype.placeScrap = function (x, y) {
  var scrap = new ScrapMesh();
  scrap.position.x = x;
  scrap.position.y = y;
  this.scrap = [];
  this.world.add(scrap);
  this.board.getCell(x, y).occupied = true;
};

Game.prototype.nextLevel = function () {
  this.level++;
  this.resetCurrentLevel();
};

Game.prototype.resetCurrentLevel = function () {
  var children = [];
  this.world.children.forEach(function (c) {
    children.push(c);
  });

  children.forEach(function (c) {
    this.world.remove(c);
  }.bind(this));

  this.init();
};

Game.prototype.teleportPlayer = function () {
  this.board.unoccupyAllCells();
  this.moveRobots();
  this.player.teleport(this.board);
  this.checkWinCondition();
};
