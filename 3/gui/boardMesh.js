'use strict';

var BoardMesh = function (res) {
  THREE.Mesh.call(this);

  this.type = 'BoardMesh';

  this.geometry = new THREE.PlaneGeometry(res, res, res, res);

  this.materials = [];

  this.materials.push( new THREE.MeshBasicMaterial({color: 0xcccccc, side: THREE.DoubleSide}));
  this.materials.push( new THREE.MeshBasicMaterial({color: 0x555555, side: THREE.DoubleSide}));

  var l = this.geometry.faces.length/2;

  for( var i = 0; i < l; i++) {
    var j = i * 2;
    this.geometry.faces[j].materialIndex = ((i + Math.floor(i/res)) % 2);
    this.geometry.faces[j + 1].materialIndex = ((i + Math.floor(i/res)) % 2);
  }

  this.material = new THREE.MeshFaceMaterial(this.materials);

  var moveAnchor = new THREE.Matrix4();
  moveAnchor.makeTranslation(res/2, res/2, 0);
  this.geometry.applyMatrix(moveAnchor);
};

BoardMesh.prototype = Object.create(THREE.Mesh.prototype);
