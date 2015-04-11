'use strict';

var ScrapMesh = function () {
  THREE.Mesh.call(this);

  this.type = 'ScrapMesh';

  this.geometry = new THREE.BoxGeometry(1, 1, 1);
  this.material = new THREE.MeshBasicMaterial({color: 0x000099});

  var moveAnchor = new THREE.Matrix4();
  moveAnchor.makeTranslation(0.5, 0.5, 0);
  this.geometry.applyMatrix(moveAnchor);
};

ScrapMesh.prototype = Object.create(THREE.Mesh.prototype);
