// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  `precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotation;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotation * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`;

// Fragment shader program
var FSHADER_SOURCE =
  `precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_baseColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichTexture;
  uniform float u_texColorWeight;
  void main() {
    vec4 texColor0 = texture2D(u_Sampler0, v_UV); // texture0
    vec4 texColor1 = texture2D(u_Sampler1, v_UV); // texture1
    if (u_whichTexture == 0) {
      gl_FragColor = mix(u_baseColor, texColor0, u_texColorWeight); // color texture interpolation
    } else if (u_whichTexture == 1) {
      gl_FragColor = mix(u_baseColor, texColor1, u_texColorWeight);
    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0); // UV debug
    } else {
     gl_FragColor = vec4(1, 0.2, 0.2, 1); // error
    }
  }`;

// Global vars
let canvas;
let gl;
let a_Position;
let a_UV;
let u_Sampler0;
let u_Sampler1;
let u_FragColor;
let u_baseColor;
let u_texColorWeight;

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

  // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_whichTexture
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return false;
  }

  // Get the storage location of u_Sampler0
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }

  // Get the storage location of u_baseColor
  u_baseColor = gl.getUniformLocation(gl.program, 'u_baseColor');
  if (!u_baseColor) {
    console.log('Failed to get the storage location of u_baseColor');
    return;
  }

  // Get the storage location of texColorWeight
  u_texColorWeight = gl.getUniformLocation(gl.program, 'u_texColorWeight');
  if (!u_texColorWeight) {
    console.log('Failed to get the storage location of u_texColorWeight');
    return;
  }
  // Get the storage location of u_FragColor
  // u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  // if (!u_FragColor) {
  //   console.log('Failed to get the storage location of u_FragColor');
  //   return;
  // }

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

  // Get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  // Get the storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  // Set initial value for this matrix to identify
  var identifyM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identifyM.elements);
}

let g_globalAngle = 0;
let g_joint1Angle = 0;
let g_joint2Angle = 0;
let g_joint3Angle = 0;
let g_rightArmAngle = 0;
let g_leftArmAngle = 0;
let g_rightLegAngle = 0;
let g_leftLegAngle = 0;

let g_animateJoint1 = false;
let g_animateJoint2 = false;
let g_animateJoint3 = false;
let g_animateRightArm = false;
let g_animateLeftArm = false;
let g_animateRightLeg = false;
let g_animateLeftLeg = false;

function addActionsForUI() {
  // camera angle slider
  document.getElementById('angleSlide').addEventListener('input', function () { g_globalAngle = this.value; renderScene(); });
  // joint 1 - tail base - angle
  document.getElementById('joint1Slide').addEventListener('input', function () { g_joint1Angle = this.value; renderScene(); });
  // joint 1 - animate buttons
  document.getElementById('joint1On').onclick = function () { g_animateJoint1 = true; };
  document.getElementById('joint1Off').onclick = function () { g_animateJoint1 = false; };
  // joint 2 - tail middle - angle
  document.getElementById('joint2Slide').addEventListener('input', function () { g_joint2Angle = this.value; renderScene(); });
  // joint 2 - animate buttons
  document.getElementById('joint2On').onclick = function () { g_animateJoint2 = true; };
  document.getElementById('joint2Off').onclick = function () { g_animateJoint2 = false; };
  // joint 3 - tail end - angle
  document.getElementById('joint3Slide').addEventListener('input', function () { g_joint3Angle = this.value; renderScene(); });
  // joint 3 - animate buttons
  document.getElementById('joint3On').onclick = function () { g_animateJoint3 = true; };
  document.getElementById('joint3Off').onclick = function () { g_animateJoint3 = false; };
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

function initTextures() {
  var image = new Image();  // Create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function () { sendImageToTexture0(image); };
  // Tell the browser to load an image
  image.src = 'ocean.jpg';

  // can add more textures
  // add texture functs and send other images
  var image1 = new Image();  // Create the image object
  if (!image1) {
    console.log('Failed to create the image1 object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image1.onload = function () { sendImageToTexture1(image1); };
  // Tell the browser to load an image
  image1.src = 'sand.jpg';

  // Set default base color
  gl.uniform4f(u_baseColor, 0.0, 0.0, 1.0, 1.0);
  // set default texColorWeight to fullt texture
  gl.uniform1f(u_texColorWeight, 1.0);

  return true;
}

function sendImageToTexture0(image) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);
}

function sendImageToTexture1(image1) {
  var texture1 = gl.createTexture();   // Create a texture object
  if (!texture1) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE1);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture1);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image1);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler1, 1);
}

function main() {
  // call setup and connect functs
  setupWebGL();
  connectVariablesToGLSL();

  // setup for HTML UI
  addActionsForUI();

  initTextures();

  camera = new Camera(canvas);
  document.onkeydown = keydown;

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
  } if (g_animateJoint3) {
    g_joint3Angle = 4 * Math.sin(2.5 * g_seconds);
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

function keydown(ev) {
  if (ev.keyCode === 87) { // W
    camera.moveForward();
  } else if (ev.keyCode === 83) { // S
    camera.moveBackwards()
  } else if (ev.keyCode === 65) { // A
    camera.moveLeft()
  } else if (ev.keyCode === 68) { // D
    camera.moveRight()
  } else if (ev.keyCode === 81) { // Q
    camera.panLeft()
  } else if (ev.keyCode === 69) { // E
    camera.panRight()
  }

  renderScene();
}

let g_mouseAngleX = 0;
let g_mouseAngleY = 0;
let g_mouseDown = false;
// have to track where it is clicked and calculate position off of that
let g_clickX = 0;
let g_clickY = 0;
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

let camera = null;

var kelpMap = [
  [0, 8, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 9, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 4, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [8, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 9],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 3, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 8, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

function drawKelpMap() {
  for (let z = 0; z < 32; z++) {
    for (let x = 0; x < 32; x++) {
      const height = kelpMap[z][x];
      for (let y = 0; y < height; y++) {
        let w = new Cube();
        w.color = [0.5, 1.0, 0.5, 1];
        w.textureNum = 0;
        w.texColorWeight = 0.0;
        w.matrix.translate(0, y * 0.3 - 0.7, 0);
        w.matrix.scale(0.3, 0.3, 0.3);
        w.matrix.translate(z - 16, 0, x - 16);
        w.render();
      }
    }
  }
}

var foodMap = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let foodCount = 0;
countFood();

function countFood() {
  for (let z = 0; z < 32; z++) {
    for (let x = 0; x < 32; x++) {
      if (foodMap[z][x] === 1) {
        foodCount++;
      }
    }
  }
}

function drawFoodMap() {
  for (let z = 0; z < 32; z++) {
    for (let x = 0; x < 32; x++) {
      if (foodMap[z][x] === 1) {
        let w = new Cube();
        w.color = [0.2, 0.2, 0.2, 1];
        w.textureNum = 0;
        w.texColorWeight = 0.0;
        w.matrix.translate(0, -0.7, 0);
        w.matrix.scale(0.2, 0.2, 0.2);
        w.matrix.translate(z - 16, 0, x - 16);
        w.render();
      }
    }
  }
}

function renderScene() {
  var startTime = performance.now();

  // Projection
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, camera.projectionMatrix.elements);
  // View
  gl.uniformMatrix4fv(u_ViewMatrix, false, camera.viewMatrix.elements);

  // camera angle
  // slider
  var globalRotMatrix = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  // mouse drag angle
  globalRotMatrix.rotate(-g_mouseAngleX, 1, 0, 0);
  globalRotMatrix.rotate(-g_mouseAngleY, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotation, false, globalRotMatrix.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  drawKelpMap();
  drawFoodMap();

  // Ground
  var ground = new Cube();
  ground.color = [0.3, 0.8, 0.3, 1.0];
  ground.textureNum = 1;
  ground.texColorWeight = 1.0;
  ground.matrix.translate(0, -0.75, 0.0);
  ground.matrix.scale(10, 0, 10);
  ground.matrix.translate(-0.5, 0, -0.5);
  ground.render();

  // Sky
  var sky = new Cube();
  sky.color = [0.0, 0.5, 1.0, 1.0];
  sky.textureNum = 0;
  sky.texColorWeight = 1.0;
  sky.matrix.scale(50, 50, 50);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  sky.render();


  // otter
  var body = new Cube();
  body.color = [0.25, 0.13, 0.05, 1.0];
  body.textureNum = 0;
  body.texColorWeight = 0.0;
  body.matrix.translate(-0.35, -0.2, 0.0);
  body.matrix.scale(0.7, 0.4, 0.4);
  body.render();

  var belly = new Cube();
  belly.color = [0.45, 0.30, 0.16, 1.0];
  belly.textureNum = 0;
  belly.texColorWeight = 0.0;
  belly.matrix.translate(-0.3, -0.13, -0.02);
  belly.matrix.scale(0.65, 0.25, 0.02);
  belly.render();

  var tail1 = new Cube();
  tail1.color = [0.24, 0.12, 0.04, 1.0];
  tail1.textureNum = 0;
  tail1.texColorWeight = 0.0;
  tail1.matrix.translate(-0.15, 0.15, 0.05);
  tail1.matrix.rotate(180, 0, 0, 1);
  tail1.matrix.rotate(g_joint1Angle, 0, 0, 1);
  var tailCoordMat1 = new Matrix4(tail1.matrix);
  tail1.matrix.scale(0.45, 0.3, 0.3);
  tail1.render();

  var tail2 = new Cube();
  tail2.color = [0.23, 0.11, 0.03, 1.0];
  tail2.textureNum = 0;
  tail2.texColorWeight = 0.0;
  tail2.matrix = tailCoordMat1;
  tail2.matrix.translate(0.35, 0.025, 0.025);
  tail2.matrix.rotate(g_joint2Angle, 0, 0, 1);
  var tailCoordMat2 = new Matrix4(tail2.matrix);
  tail2.matrix.scale(0.3, 0.25, 0.25);
  tail2.render();

  var tail3 = new Cube();
  tail3.color = [0.19, 0.09, 0.03, 1.0];
  tail3.texColorWeight = 0.0;
  tail3.matrix = tailCoordMat2;
  tail3.matrix.translate(0.25, 0.025, 0.025);
  tail3.matrix.rotate(g_joint3Angle, 0, 0, 1);
  tail3.matrix.scale(0.18, 0.2, 0.2);
  tail3.render();

  var neck = new Cube();
  neck.color = [0.24, 0.12, 0.04, 1.0];
  neck.texColorWeight = 0.0;
  neck.matrix.translate(0.35, -0.175, 0.05);
  neck.matrix.scale(0.1, 0.35, 0.3);
  neck.render();

  var head = new Cube();
  head.color = [0.45, 0.30, 0.16, 1.0];
  head.texColorWeight = 0.0;
  head.matrix.translate(0.45, -0.15, 0.075);
  head.matrix.scale(0.2, 0.3, 0.3);
  head.render();

  var eye1 = new Cube();
  eye1.color = [0.0, 0.0, 0.0, 1.0];
  eye1.texColorWeight = 0.0;
  eye1.matrix.translate(0.55, -0.09, 0.07);
  eye1.matrix.scale(0.03, 0.03, 0.02);
  eye1.render();

  var eye2 = new Cube();
  eye2.color = [0.0, 0.0, 0.0, 1.0];
  eye2.texColorWeight = 0.0;
  eye2.matrix.translate(0.55, 0.04, 0.07);
  eye2.matrix.scale(0.03, 0.03, 0.02);
  eye2.render();

  var nose = new Cube();
  nose.color = [0.23, 0.15, 0.10, 1.0];
  nose.texColorWeight = 0.0;
  nose.matrix.translate(0.5, -0.03, 0.07);
  nose.matrix.scale(0.05, 0.05, 0.02);
  nose.render();

  // right arm
  var arm1 = new Cube();
  arm1.color = [0.23, 0.11, 0.03, 1.0];
  arm1.texColorWeight = 0.0;
  arm1.matrix.translate(0.2, 0.09, 0.1);
  arm1.matrix.rotate(35, 0, 0, 1);
  arm1.matrix.rotate(g_rightArmAngle, 0, 0, 1);
  arm1.matrix.scale(0.15, 0.25, 0.2);
  arm1.render();

  // right leg
  var leg1 = new Cube();
  leg1.color = [0.23, 0.11, 0.03, 1.0];
  leg1.texColorWeight = 0.0;
  leg1.matrix.translate(-0.3, 0.05, 0.1);
  leg1.matrix.rotate(45, 0, 0, 1);
  leg1.matrix.rotate(g_rightLegAngle, 0, 0, 1);
  leg1.matrix.scale(0.15, 0.3, 0.2);
  leg1.render();

  // left arm
  var arm2 = new Cube();
  arm2.color = [0.23, 0.11, 0.03, 1.0];
  arm2.texColorWeight = 0.0;
  arm2.matrix.translate(0.32, -0.18, 0.1);
  arm2.matrix.rotate(150, 0, 0, 1);
  arm2.matrix.rotate(g_leftArmAngle, 0, 0, 1);
  arm2.matrix.scale(0.15, 0.25, 0.2);
  arm2.render();

  // left leg
  var leg2 = new Cube();
  leg2.color = [0.23, 0.11, 0.03, 1.0];
  leg2.texColorWeight = 0.0;
  leg2.matrix.translate(-0.2, -0.18, 0.1);
  leg2.matrix.rotate(135, 0, 0, 1);
  leg2.matrix.rotate(g_leftLegAngle, 0, 0, 1);
  leg2.matrix.scale(0.15, 0.3, 0.2);
  leg2.render();

  var duration = performance.now() - startTime;
  sendTextToHTML("fps: " + Math.floor(10000 / duration) / 10, "fps");

  sendTextToHTML("Food Count: " + foodCount, "food");
}
