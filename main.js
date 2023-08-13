// use strict

const hasShadows = false;

const octahedrons = [
  [0,0,0,4],
  [1,0,0,1],
  [4,0,0,3],
  [0,2,0,1],
  [0,5,0,3],
  [0,0,3,1],
  [1,1,1,1],
  [1,1,2,1],
  [1,3,1,1],
];


function addSegment(scene, points, color) {
  const lineMaterial = new THREE.LineBasicMaterial({
    color
  });
  const lineGeometry = new THREE.BufferGeometry().setFromPoints( points.map(xs => (new THREE.Vector3(xs[0], xs[1], xs[2]))));
  const line = new THREE.Line( lineGeometry, lineMaterial );
  scene.add( line );
}

function addLight(scene, position, color) {
  const light = new THREE.DirectionalLight( color, 1);
  light.position.set(position[0], position[1], position[2]) ;
  light.castShadow = hasShadows;
  scene.add( light );
}

function addOctahedron(scene, x, y, z, r) {
  const geometry = new THREE.OctahedronGeometry( r, 0 );
  const material = new THREE.MeshStandardMaterial( { color: 0xAAAAAA } );
  const mesh = new THREE.Mesh( geometry, material );
  mesh.position.set(x, y, z)
  mesh.castShadow = hasShadows;
  mesh.receiveShadow = hasShadows;
  scene.add( mesh );
}

function addPlane(scene) {
  const planeGeometry = new THREE.PlaneGeometry( 100, 100, 100, 100 );
  const planeMaterial = new THREE.MeshStandardMaterial( {color: 0x393939, side: THREE.DoubleSide} );
  planeMaterial.blending = THREE.AdditiveBlending;
  const plane = new THREE.Mesh( planeGeometry, planeMaterial );
  plane.rotation.set(Math.PI/2,0,0)
  plane.position.set(0, -5, 0)
  plane.castShadow = false;
  plane.receiveShadow = hasShadows;
  scene.add( plane );
}


function init() {
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = hasShadows;
  renderer.shadowMap.type = THREE.BasicShadowMap;

  var scene = new THREE.Scene();

  addSegment(scene, [[0,0,0],[100,0,0]], 0x3939ff);
  addSegment(scene, [[0,0,0],[0,100,0]], 0xff3939);
  addSegment(scene, [[0,0,0],[0,0,100]], 0x39ff39);

  addLight(scene, [1, 1, 1], 0xaaaaff);
  addLight(scene, [-1, 1, -1], 0xffaaaa);
  addLight(scene, [-1, -1, -1], 0xaaffaa);

  for (const [x, y, z, r] of octahedrons) {
    addOctahedron(scene, x,y,z,r);
  }

  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
  camera.position.set(20, 20, 20);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  var controls = new THREE.OrbitControls(camera);

  return [renderer, scene, camera];
};

function animate(renderer, scene, camera) {

  requestAnimationFrame(function () {
    animate(renderer, scene, camera);
  });

  renderer.render(scene, camera);
}

function onLoad(_event) {
  const [renderer, scene, camera] = init();
  document.body.appendChild(renderer.domElement);
  animate(renderer, scene, camera);
}

addEventListener('load', onLoad);
