// AWESOMENESS: 

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

function addActionsForUI() {
  // angle slider
  document.getElementById('angleSlide').addEventListener('input', function () { g_globalAngle = this.value; renderScene();});
}

function main() {
  // call setup and connect functs
  setupWebGL();
  connectVariablesToGLSL();

  // setup for HTML UI
  addActionsForUI();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  renderScene();
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
  var globalRotMatrix = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
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
  belly.matrix.scale(0.74, 0.25, 0.02);
  belly.render();

  // eye1.matrix.translate(0.55, -0.09, 0.07);
  // eye1.matrix.scale(0.03, 0.03, 0.02);

  var tail1 = new Cube();
  tail1.color = [0.24, 0.12, 0.04, 1.0];
  tail1.matrix.translate(-0.65, -0.15, 0.05);
  tail1.matrix.scale(0.3, 0.3, 0.3);
  tail1.render();

  var tail2 = new Cube();
  tail2.color = [0.23, 0.11, 0.03, 1.0];
  tail2.matrix.translate(-0.9, -0.125, 0.075);
  tail2.matrix.scale(0.25, 0.25, 0.25);
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

  // top right
  var arm1 = new Cube();
  arm1.color = [0.23, 0.11, 0.03, 1.0];
  arm1.matrix.translate(0.2, 0.12, 0.1);
  arm1.matrix.rotate(35, 0, 0, 1);
  arm1.matrix.scale(0.15, 0.2, 0.2);
  arm1.render();

  // top left
  var leg1 = new Cube();
  leg1.color = [0.23, 0.11, 0.03, 1.0];
  leg1.matrix.translate(-0.3, 0.1, 0.1);
  leg1.matrix.rotate(45, 0, 0, 1);
  leg1.matrix.scale(0.15, 0.25, 0.2);
  leg1.render();

  // bottom right
  var arm1 = new Cube();
  arm1.color = [0.23, 0.11, 0.03, 1.0];
  arm1.matrix.translate(0.33, -0.21, 0.1);
  arm1.matrix.rotate(145, 0, 0, 1);
  arm1.matrix.scale(0.15, 0.2, 0.2);
  arm1.render();

  // bottom left
  var leg2 = new Cube();
  leg2.color = [0.23, 0.11, 0.03, 1.0];
  leg2.matrix.translate(-0.2, -0.2, 0.1);
  leg2.matrix.rotate(135, 0, 0, 1);
  leg2.matrix.scale(0.15, 0.25, 0.2);
  leg2.render();

  var duration = performance.now() - startTime;
  sendTextToHTML("fps: " + Math.floor(10000/duration)/10, "fps");
}
