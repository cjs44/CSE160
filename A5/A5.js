import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// canvas
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(900, 450);

// perspective camera
const fov = 45;
const aspect = 2;
const near = 0.1;
const far = 250;
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
const intensitys = 150;
const lights = new THREE.SpotLight(colors, intensitys);
lights.position.set(-4, 1, 0);
const target = new THREE.Object3D();
target.position.set(-5.5, 4.5, -8);
scene.add(target);
lights.target = target;
// help from chatgpt with making it look more real
lights.angle = Math.PI / 12;
lights.penumbra = 0.1;
lights.decay = 1;
lights.distance = 15;
scene.add(lights);
const spotHelper = new THREE.SpotLightHelper(lights);
// scene.add(spotHelper);

// skybox but it is a sphere
const loaderS = new THREE.TextureLoader();
const textureS = loaderS.load('img/skybox.png');
const SsphereRadius = 50;
const SsphereWidthDivisions = 60;
const SsphereHeightDivisions = 40;
const SsphereGeo = new THREE.SphereGeometry(SsphereRadius, SsphereWidthDivisions, SsphereHeightDivisions);
const SsphereMat = new THREE.MeshBasicMaterial({
  map: textureS,
  side: THREE.BackSide
});
const Smesh = new THREE.Mesh(SsphereGeo, SsphereMat);
scene.add(Smesh);

// wood floor plane
const planeSize = 40;
const loaderP = new THREE.TextureLoader();
const textureP = loaderP.load('img/floor.jpg');
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

// textured cubes for bench
const loader = new THREE.TextureLoader();
loader.load('img/wood.jpg', (texture) => {
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshStandardMaterial({
    map: texture,
  });
  const cube1 = new THREE.Mesh(geometry, material);
  cube1.position.set(0, 2, 0);
  cube1.scale.set(6, 1, 3);
  scene.add(cube1);
  const cube2 = new THREE.Mesh(geometry, material);
  cube2.position.set(-2.5, 0.8, 1);
  cube2.scale.set(1, 1.5, 1);
  scene.add(cube2);
  const cube3 = new THREE.Mesh(geometry, material);
  cube3.position.set(-2.5, 0.8, -1);
  cube3.scale.set(1, 1.5, 1);
  scene.add(cube3);
  const cube4 = new THREE.Mesh(geometry, material);
  cube4.position.set(2.5, 0.8, -1);
  cube4.scale.set(1, 1.5, 1);
  scene.add(cube4);
  const cube5 = new THREE.Mesh(geometry, material);
  cube5.position.set(2.5, 0.8, 1);
  cube5.scale.set(1, 1.5, 1);
  scene.add(cube5);
  // cubes.push(cube);
});

// sphere with spotlight
{
  const sphereRadius = 3;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
  const sphereMat = new THREE.MeshPhongMaterial({ color: '#6c1aab' });
  const mesh = new THREE.Mesh(sphereGeo, sphereMat);
  mesh.position.set(-6, sphereRadius + 2, -10);
  scene.add(mesh);
}

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
function makeInstance(geometry, color, x, y, z) {
  const material = new THREE.MeshPhongMaterial({ color });

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.position.x = x;
  cube.position.y = y;
  cube.position.z = z;

  return cube;
}

// three cubes
const cubes = [
  makeInstance(geometry, 0x0044aa, -8, 1, 2),
  makeInstance(geometry, 0x139c53, -10, 2, 3),
  makeInstance(geometry, 0xa83275, -12, 3, 4)
];

// forest of cones
{
  const radius = 4;
  const height = 8;
  const radialSegments = 16;
  const geometry = new THREE.ConeGeometry(radius, height, radialSegments);
  const mat = new THREE.MeshPhongMaterial({ color: '#3c5e38' });
  const mesh1 = new THREE.Mesh(geometry, mat);
  mesh1.position.set(10, 4.1, 10);
  mesh1.scale.set(0.5, 1, 0.5)
  scene.add(mesh1);
  const mesh2 = new THREE.Mesh(geometry, mat);
  mesh2.position.set(9, 3.3, 8);
  mesh2.scale.set(0.3, 0.8, 0.3)
  scene.add(mesh2);
  const mesh3 = new THREE.Mesh(geometry, mat);
  mesh3.position.set(8, 3, 10);
  mesh3.scale.set(0.6, 0.7, 0.6)
  scene.add(mesh3);
  const mesh4 = new THREE.Mesh(geometry, mat);
  mesh4.position.set(11, 3.3, 8);
  mesh4.scale.set(0.3, 0.8, 0.3)
  scene.add(mesh4);
}

// snowman
{
  const sphereRadius = 3;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
  const sphereMat = new THREE.MeshPhongMaterial({ color: '#4f1427' });
  const mesh1 = new THREE.Mesh(sphereGeo, sphereMat);
  mesh1.position.set(-12, 3, 12);
  mesh1.scale.set(0.8, 0.8, 0.8);
  scene.add(mesh1);
  const mesh2 = new THREE.Mesh(sphereGeo, sphereMat);
  mesh2.position.set(-12, 6, 12);
  mesh2.scale.set(0.6, 0.6, 0.6);
  scene.add(mesh2);
  const mesh3 = new THREE.Mesh(sphereGeo, sphereMat);
  mesh3.position.set(-12, 8.5, 12);
  mesh3.scale.set(0.4, 0.4, 0.4);
  scene.add(mesh3);
}

// stairs
{
  const cubeSize = 1;
  const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const cubeMat = new THREE.MeshPhongMaterial({ color: '#2e2528' });
  const mesh1 = new THREE.Mesh(cubeGeo, cubeMat);
  mesh1.position.set(4, 0.6, -15);
  mesh1.scale.set(5, 1, 1);
  scene.add(mesh1);
  const mesh2 = new THREE.Mesh(cubeGeo, cubeMat);
  mesh2.position.set(4, 1.1, -16);
  mesh2.scale.set(5, 2, 1);
  scene.add(mesh2);
  const mesh3 = new THREE.Mesh(cubeGeo, cubeMat);
  mesh3.position.set(4, 1.6, -17);
  mesh3.scale.set(5, 3, 1);
  scene.add(mesh3);
  const mesh4 = new THREE.Mesh(cubeGeo, cubeMat);
  mesh4.position.set(4, 2.1, -18);
  mesh4.scale.set(5, 4, 1);
  scene.add(mesh4);
  const mesh5 = new THREE.Mesh(cubeGeo, cubeMat);
  mesh5.position.set(4, 2.6, -19);
  mesh5.scale.set(5, 5, 1);
  scene.add(mesh5);
}

// textured 3d model
const loader2 = new GLTFLoader();
loader2.load(
  // resource URL
  'models/artstatue.glb',
  // called when the resource is loaded
  function (gltf) {
    const model = gltf.scene;
    model.position.set(11, 3, -6);
    model.scale.set(0.01, 0.01, 0.01);

    scene.add(model);

    gltf.animations; // Array<THREE.AnimationClip>
    gltf.scene; // THREE.Group
    gltf.scenes; // Array<THREE.Group>
    gltf.cameras; // Array<THREE.Camera>
    gltf.asset; // Object

  },
  // called while loading is progressing
  function (xhr) {

    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

  },
  // called when loading has errors
  function (error) {

    console.log('An error happened');

  }
);

loader2.load(
  // resource URL
  'models/Wallpainting.glb',
  // called when the resource is loaded
  function (gltf) {
    const model = gltf.scene;
    model.position.set(4, 7, -20);
    model.scale.set(0.3, 0.3, 0.3);
    model.rotation.y = Math.PI;

    scene.add(model);

    gltf.animations; // Array<THREE.AnimationClip>
    gltf.scene; // THREE.Group
    gltf.scenes; // Array<THREE.Group>
    gltf.cameras; // Array<THREE.Camera>
    gltf.asset; // Object

  },
  // called while loading is progressing
  function (xhr) {

    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

  },
  // called when loading has errors
  function (error) {

    console.log('An error happened');

  }
);
