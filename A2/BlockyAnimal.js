// This is supposed to be an otter

// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  `attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotation;
  void main() {
    gl_Position = u_GlobalRotation * u_ModelMatrix * a_Position;
  }`;

// Fragment shader program
var FSHADER_SOURCE =
  `precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`;

// Global vars
let canvas;
let gl;
let a_Position;
let u_FragColor;

// Setup WebGL with canvas
function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

// Connect vars to GLSL
function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Get the storage location of u_GlobalRotation
  u_GlobalRotation = gl.getUniformLocation(gl.program, 'u_GlobalRotation');
  if (!u_GlobalRotation) {
    console.log('Failed to get the storage location of u_GlobalRotation');
    return;
  }

  // Set initial value for this matrix to identify
  var identifyM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identifyM.elements);
}

let g_globalAngle = 0;
let g_joint1Angle = 0;
let g_joint2Angle = 0;
let g_rightArmAngle = 0;
let g_leftArmAngle = 0;
let g_rightLegAngle = 0;
let g_leftLegAngle = 0;

let g_animateJoint1 = false;
let g_animateJoint2 = false;
let g_animateRightArm = false;
let g_animateLeftArm = false;
let g_animateRightLeg = false;
let g_animateLeftLeg = false;

let g_mouseAngleX = 0;
let g_mouseAngleY = 0;
let g_mouseDown = false;
// have to track where it is clicked and calculate position off of that
let g_clickX = 0;
let g_clickY = 0;

function addActionsForUI() {
  // camera angle slider
  document.getElementById('angleSlide').addEventListener('input', function () { g_globalAngle = this.value; renderScene(); });
  // joint 1 - tail base - angle
  document.getElementById('joint1Slide').addEventListener('input', function () { g_joint1Angle = this.value; renderScene(); });
  // joint 1 - animate buttons
  document.getElementById('joint1On').onclick = function () { g_animateJoint1 = true; };
  document.getElementById('joint1Off').onclick = function () { g_animateJoint1 = false; };
  // joint 2 - tail end - angle
  document.getElementById('joint2Slide').addEventListener('input', function () { g_joint2Angle = this.value; renderScene(); });
  // joint 2 - animate buttons
  document.getElementById('joint2On').onclick = function () { g_animateJoint2 = true; };
  document.getElementById('joint2Off').onclick = function () { g_animateJoint2 = false; };
  // right arm - angle
  document.getElementById('rightArmSlide').addEventListener('input', function () { g_rightArmAngle = this.value; renderScene(); });
  // right arm - animate buttons
  document.getElementById('rightArmOn').onclick = function () { g_animateRightArm = true; };
  document.getElementById('rightArmOff').onclick = function () { g_animateRightArm = false; };
  // left arm - angle
  document.getElementById('leftArmSlide').addEventListener('input', function () { g_leftArmAngle = this.value; renderScene(); });
  // left arm - animate buttons
  document.getElementById('leftArmOn').onclick = function () { g_animateLeftArm = true; };
  document.getElementById('leftArmOff').onclick = function () { g_animateLeftArm = false; };
  // right leg - angle
  document.getElementById('rightLegSlide').addEventListener('input', function () { g_rightLegAngle = this.value; renderScene(); });
  // right leg - animate buttons
  document.getElementById('rightLegOn').onclick = function () { g_animateRightLeg = true; };
  document.getElementById('rightLegOff').onclick = function () { g_animateRightLeg = false; };
  // left leg - angle
  document.getElementById('leftLegSlide').addEventListener('input', function () { g_leftLegAngle = this.value; renderScene(); });
  // left leg - animate buttons
  document.getElementById('leftLegOn').onclick = function () { g_animateLeftLeg = true; };
  document.getElementById('leftLegOff').onclick = function () { g_animateLeftLeg = false; };
}

function main() {
  // call setup and connect functs
  setupWebGL();
  connectVariablesToGLSL();

  // setup for HTML UI
  addActionsForUI();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Mouse movement
  mouseAngleControl(canvas);

  // Clear <canvas>
  // renderScene();
  requestAnimationFrame(tick);
}

var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

function tick() {
  g_seconds = performance.now() / 1000.0 - g_startTime;
  updateAnimationAngles();
  renderScene();
  requestAnimationFrame(tick);
}

function updateAnimationAngles() {
  if (g_animateJoint1) {
    g_joint1Angle = 15 * Math.sin(g_seconds);
  } if (g_animateJoint2) {
    g_joint2Angle = 5 * Math.sin(2 * g_seconds);
  } if (g_animateRightArm) {
    g_rightArmAngle = 15 * Math.sin(3 * g_seconds);
  } if (g_animateLeftArm) {
    g_leftArmAngle = -15 * Math.sin(3 * g_seconds);
  } if (g_animateRightLeg) {
    g_rightLegAngle = -15 * Math.sin(2 * g_seconds);
  } if (g_animateLeftLeg) {
    g_leftLegAngle = 15 * Math.sin(2 * g_seconds);
  }
}

// help with getting click coords
// https://stackoverflow.com/questions/23744605/javascript-get-x-and-y-coordinates-on-mouse-click
// mouse angle change
function mouseAngleControl(canvas) {
  // mark where the user clicked down
  canvas.onmousedown = (event) => {
    g_mouseDown = true;
    g_clickX = event.clientX;
    g_clickY = event.clientY;
  };
  canvas.onmousemove = (event) => {
    // only change angle if they are clicking
    if (g_mouseDown) {
      g_mouseAngleY += event.clientX - g_clickX;
      g_mouseAngleX += event.clientY - g_clickY;
      // got a tip to set this again so it doesn't spin as fast
      g_clickX = event.clientX;
      g_clickY = event.clientY;
    }
  };
  // mark when user isn't clicking
  canvas.onmouseup = () => { g_mouseDown = false; };
}

function sendTextToHTML(text, htmlID) {
  let htmlElement = document.getElementById(htmlID);
  if (htmlElement) {
    htmlElement.innerText = text;
  }
}

function renderScene() {
  var startTime = performance.now();

  // camera angle
  // slider
  var globalRotMatrix = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  // mouse drag angle
  globalRotMatrix.rotate(-g_mouseAngleX, 1, 0, 0);
  globalRotMatrix.rotate(-g_mouseAngleY, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotation, false, globalRotMatrix.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var body = new Cube();
  body.color = [0.25, 0.13, 0.05, 1.0];
  body.matrix.translate(-0.35, -0.2, 0.0);
  body.matrix.scale(0.7, 0.4, 0.4);
  body.render();

  var belly = new Cube();
  belly.color = [0.45, 0.30, 0.16, 1.0];
  belly.matrix.translate(-0.3, -0.13, -0.02);
  belly.matrix.scale(0.65, 0.25, 0.02);
  belly.render();

  var tail1 = new Cube();
  tail1.color = [0.24, 0.12, 0.04, 1.0];
  tail1.matrix.translate(-0.15, 0.15, 0.05);
  tail1.matrix.rotate(180, 0, 0, 1);
  tail1.matrix.rotate(g_joint1Angle, 0, 0, 1);
  var tailCoordMat = new Matrix4(tail1.matrix);
  tail1.matrix.scale(0.5, 0.3, 0.3);
  tail1.render();

  var tail2 = new Cube();
  tail2.color = [0.23, 0.11, 0.03, 1.0];
  tail2.matrix = tailCoordMat;
  tail2.matrix.translate(0.35, 0.025, 0.025);
  tail2.matrix.rotate(g_joint2Angle, 0, 0, 1);
  tail2.matrix.scale(0.35, 0.25, 0.25);
  tail2.render();

  var neck = new Cube();
  neck.color = [0.24, 0.12, 0.04, 1.0];
  neck.matrix.translate(0.35, -0.175, 0.05);
  neck.matrix.scale(0.1, 0.35, 0.3);
  neck.render();

  var head = new Cube();
  head.color = [0.45, 0.30, 0.16, 1.0];
  head.matrix.translate(0.45, -0.15, 0.075);
  head.matrix.scale(0.2, 0.3, 0.3);
  head.render();

  var eye1 = new Cube();
  eye1.color = [0.0, 0.0, 0.0, 1.0];
  eye1.matrix.translate(0.55, -0.09, 0.07);
  eye1.matrix.scale(0.03, 0.03, 0.02);
  eye1.render();

  var eye2 = new Cube();
  eye2.color = [0.0, 0.0, 0.0, 1.0];
  eye2.matrix.translate(0.55, 0.04, 0.07);
  eye2.matrix.scale(0.03, 0.03, 0.02);
  eye2.render();

  var nose = new Cube();
  nose.color = [0.23, 0.15, 0.10, 1.0];
  nose.matrix.translate(0.5, -0.03, 0.07);
  nose.matrix.scale(0.05, 0.05, 0.02);
  nose.render();

  // right arm
  var arm1 = new Cube();
  arm1.color = [0.23, 0.11, 0.03, 1.0];
  arm1.matrix.translate(0.2, 0.09, 0.1);
  arm1.matrix.rotate(35, 0, 0, 1);
  arm1.matrix.rotate(g_rightArmAngle, 0, 0, 1);
  arm1.matrix.scale(0.15, 0.25, 0.2);
  arm1.render();

  // right leg
  var leg1 = new Cube();
  leg1.color = [0.23, 0.11, 0.03, 1.0];
  leg1.matrix.translate(-0.3, 0.05, 0.1);
  leg1.matrix.rotate(45, 0, 0, 1);
  leg1.matrix.rotate(g_rightLegAngle, 0, 0, 1);
  leg1.matrix.scale(0.15, 0.3, 0.2);
  leg1.render();

  // left arm
  var arm2 = new Cube();
  arm2.color = [0.23, 0.11, 0.03, 1.0];
  arm2.matrix.translate(0.32, -0.18, 0.1);
  arm2.matrix.rotate(150, 0, 0, 1);
  arm2.matrix.rotate(g_leftArmAngle, 0, 0, 1);
  arm2.matrix.scale(0.15, 0.25, 0.2);
  arm2.render();

  // left leg
  var leg2 = new Cube();
  leg2.color = [0.23, 0.11, 0.03, 1.0];
  leg2.matrix.translate(-0.2, -0.18, 0.1);
  leg2.matrix.rotate(135, 0, 0, 1);
  leg2.matrix.rotate(g_leftLegAngle, 0, 0, 1);
  leg2.matrix.scale(0.15, 0.3, 0.2);
  leg2.render();

  var duration = performance.now() - startTime;
  sendTextToHTML("fps: " + Math.floor(10000 / duration) / 10, "fps");
}
