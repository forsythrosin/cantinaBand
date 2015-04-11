'use strict';

var PlayerMesh = function () {
  THREE.Mesh.call(this);

  this.type = 'PlayerMesh';

  this.geometry = new THREE.BoxGeometry(1, 1, 1);
  this.material = new THREE.MeshBasicMaterial({color: 0x990000});

  var moveAnchor = new THREE.Matrix4();
  moveAnchor.makeTranslation(0.5, 0.5, 0);
  this.geometry.applyMatrix(moveAnchor);
};

PlayerMesh.prototype = Object.create(THREE.Mesh.prototype);

PlayerMesh.prototype.move = function (x, y) {
  this.position.x = x;
  this.position.y = y;
};
