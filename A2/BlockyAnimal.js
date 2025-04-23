// AWESOMENESS: 

// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  `attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  void main() {
    gl_Position = u_ModelMatrix * a_Position;
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
let u_Size;

// Setup WebGL with canvas
function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

// Connect vars to GLSL
function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
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

  // Get the storage location of u_Size
  // u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  // if (!u_Size) {
  //   console.log('Failed to get the storage location of u_Size');
  //   return;
  // }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Set initial value for this matrix to identify
  var identifyM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identifyM.elements);
}

// constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// global vars for HTML UI elements
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 10.0;
let g_selectedType = POINT;
let g_selectedSegment = 10;

function addActionsForUI() {
  // buttons
  // document.getElementById('green').onclick = function () { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
  // document.getElementById('red').onclick = function () { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };

  // clear button
  document.getElementById('clear').onclick = function () { g_shapesList = []; renderAllShapes(); };

  // drawing modes
  document.getElementById('square').onclick = function () { g_selectedType = POINT; };
  document.getElementById('triangle').onclick = function () { g_selectedType = TRIANGLE; };
  document.getElementById('circle').onclick = function () { g_selectedType = CIRCLE; };

  // sliders
  document.getElementById('redSlide').addEventListener('mouseup', function () { g_selectedColor[0] = this.value / 100; });
  document.getElementById('greenSlide').addEventListener('mouseup', function () { g_selectedColor[1] = this.value / 100; });
  document.getElementById('blueSlide').addEventListener('mouseup', function () { g_selectedColor[2] = this.value / 100; });
  // size slider
  document.getElementById('sizeSlide').addEventListener('mouseup', function () { g_selectedSize = this.value; });
  // segment slider
  document.getElementById('segSlide').addEventListener('mouseup', function () { g_selectedSegment = this.value; });
}

function main() {
  // call setup and connect functs
  setupWebGL();
  connectVariablesToGLSL();

  gl.enable(gl.DEPTH_TEST);

  // setup for HTML UI
  addActionsForUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function (ev) { if (ev.buttons == 1) { click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT);
  renderAllShapes();
}

var g_shapesList = [];

// ev is the event
function click(ev) {
  // call helper funct
  [x, y] = convertCoordinatesForGL(ev);

  // create and store point
  let point;
  if (g_selectedType == POINT) {
    point = new Point();
  } else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
  } else if (g_selectedType == CIRCLE) {
    point = new Circle();
  }

  point.position = [x, y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  if (g_selectedType == CIRCLE) {
    point.segments = g_selectedSegment;
  }
  g_shapesList.push(point);

  // call helper funct
  renderAllShapes();
}

function convertCoordinatesForGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  return ([x, y]);
}

function renderAllShapes() {
  // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //var len = g_points.length;
  // var len = g_shapesList.length;

  // for (var i = 0; i < len; i++) {
  //   g_shapesList[i].render();
  // }

  // test triangle
  drawTriangle3D([-1.0, 0.0, 0.0,  -0.5, -1.0, 0.0,  0.0, 0.0, 0.0]);

  // cube
  var body = new Cube();
  body.color = [1.0, 0.0, 0.0, 1.0];
  body.matrix.translate(-0.25, -0.5, 0.0);
  body.matrix.scale(0.5, 1, 0.5);
  body.render();

  var leftarm = new Cube();
  leftarm.color = [1.0, 1.0, 0.0, 1.0];
  leftarm.matrix.translate(0.7, 0.0, 0.0);
  leftarm.matrix.rotate(45, 0, 0, 1);
  leftarm.matrix.scale(0.25, 0.7, 0.5);
  leftarm.render();
}
