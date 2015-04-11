'use strict';

var RobotMesh = function () {
  THREE.Mesh.call(this);

  this.type = 'RobotMesh';

  this.geometry = new THREE.BoxGeometry(1, 1, 1);
  this.material = new THREE.MeshBasicMaterial({color: 0x009900});

  var moveAnchor = new THREE.Matrix4();
  moveAnchor.makeTranslation(0.5, 0.5, 0);
  this.geometry.applyMatrix(moveAnchor);
};

RobotMesh.prototype = Object.create(THREE.Mesh.prototype);

RobotMesh.prototype.move = function (x, y) {
  this.position.x = x;
  this.position.y = y;
};
