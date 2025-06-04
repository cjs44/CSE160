import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

// canvas
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

// perspective camera
const fov = 45;
const aspect = 2;
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 10, 20);

// orbit control
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 5, 0);
controls.update();

// scene
const scene = new THREE.Scene();

// lighting
// directional
const colord = 0xFFFFFF;
const intensityd = 3;
const lightd = new THREE.DirectionalLight(colord, intensityd);
lightd.position.set(-1, 2, 4);
scene.add(lightd);
// ambient
const colora = 0xFFFFFF;
const intensitya = 1;
const lighta = new THREE.AmbientLight(colora, intensitya);
scene.add(lighta);
// spot
const colors = 0xFFFFFF;
const intensitys = 7;
const lights = new THREE.DirectionalLight(colors, intensitys);
lights.position.set(-1, 1, 5);
lights.target.position.set(-4, 7, 0);
scene.add(lights);
scene.add(lights.target);
// help from chatgpt with making it look more real
lights.angle = Math.PI / 12;
lights.penumbra = 0.1;
lights.decay = 2;
lights.distance = 4;
const spotHelper = new THREE.SpotLightHelper(lights);
scene.add(spotHelper);

// checker plane
const planeSize = 40;
const loaderP = new THREE.TextureLoader();
const textureP = loaderP.load('img/checker.png');
textureP.wrapS = THREE.RepeatWrapping;
textureP.wrapT = THREE.RepeatWrapping;
textureP.magFilter = THREE.NearestFilter;
textureP.colorSpace = THREE.SRGBColorSpace;
const repeats = planeSize / 2;
textureP.repeat.set(repeats, repeats);
const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshPhongMaterial({
  map: textureP,
  side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(planeGeo, planeMat);
mesh.rotation.x = Math.PI * -.5;
scene.add(mesh);

// box geometry
const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

// texture
// const loader = new THREE.TextureLoader();
// const texture = loader.load('img/wood.jpg');
// texture.colorSpace = THREE.SRGBColorSpace;

// basic material
// const material = new THREE.MeshPhongMaterial({color: 0x44aa88});

// texture material
// const materialT = new THREE.MeshBasicMaterial({
//   map: texture,
// });

// mesh
// const cubeT = new THREE.Mesh(geometry, materialT);

// add to scene and render
// scene.add(cubeT);
// renderer.render(scene, camera);

// textured cube
const loader = new THREE.TextureLoader();
loader.load('img/wood.jpg', (texture) => {
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshStandardMaterial({
    map: texture,
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  cubes.push(cube);
});

// animate
function render(time) {
  time *= 0.001;  // convert time to seconds

  cubes.forEach((cube, ndx) => {
    const speed = 1 + ndx * .1;
    const rot = time * speed;
    cube.rotation.x = rot;
    cube.rotation.y = rot;
  });

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);

// color cube
function makeInstance(geometry, color, x) {
  const material = new THREE.MeshPhongMaterial({ color });

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.position.x = x;

  return cube;
}

// three cubes
const cubes = [
  // makeInstance(geometry, 0x44aa88, 0),
  makeInstance(geometry, 0x8844aa, -2),
  makeInstance(geometry, 0xaa8844, 2),
];

// textured 3d model
const loader2 = new GLTFLoader();
loader2.load(
	// resource URL
	'models/artstatue.glb',
	// called when the resource is loaded
	function ( gltf ) {
    const model = gltf.scene;
    model.position.set(-2, -2, -2);
    model.scale.set(0.01, 0.01, 0.01);

		scene.add( model );

		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);

// cube and sphere to light
{
  const cubeSize = 4;
  const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'});
  const mesh = new THREE.Mesh(cubeGeo, cubeMat);
  mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
  scene.add(mesh);
}
{
  const sphereRadius = 3;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
  const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
  const mesh = new THREE.Mesh(sphereGeo, sphereMat);
  mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
  scene.add(mesh);
}