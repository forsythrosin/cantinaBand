var nextId = 0;

function Entity() {
  this._id = nextId++;
}



Entity.prototype.getDomElement = function () {
  return this._domElement;
};

Entity.prototype.getId = function () {
  return this._id;
}

Entity.prototype.step = function () {
  throw "Entity needs to implement step function, yao.";
}

module.exports = Entity;
