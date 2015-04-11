'use strict';

var camera, renderer, scene;
var game;
var raycaster;
var raycaster, mouse;

init();
animate();

function init() {
  var res = 24;

  /**
   * Scene + camera
   */
  camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
  camera.position.set(res/2, res/2, res);
  camera.lookAt(new THREE.Vector3(res/2, res/2, 0));
  camera.up.set(0, 0, 1);

  scene = new THREE.Scene();

  game = new Game(res, 10);
  scene.add(game.world);
  // game.world.rotation.x = -0.25*Math.PI;

  game.onWin(function () {
    console.log('You won!');
    game.nextLevel();
  });
  game.onLost(function () {
    console.log('You lost!');
    game.resetCurrentLevel();
  });

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  function handleWindowResize() {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function handleMouseClick(event) {
    mouse.x = (event.clientX/window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY/window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      if(intersects[0].object === game.board.mesh) {
        var cellIdx = Math.floor(intersects[0].faceIndex/2);
        var cell = game.board.getCellFromLinearIndex(cellIdx);
        game.tick(cell);
      }
    } else {
      // console.log('No pick');
    }
  }

  function handleKeyDown(event) {
    if (event.keyCode === 84) {
      game.teleportPlayer();
    }
  };

  document.addEventListener('click', handleMouseClick, false);
  window.addEventListener('resize', handleWindowResize, false);
  window.addEventListener('keyup', handleKeyDown, false);

  /**
   * Renderer
   */
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor(0x222222, 1);
  document.body.appendChild(renderer.domElement);
}

function animate() {
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

