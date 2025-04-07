// DrawTriangle.js (c) 2012 matsuda

// global canvas and ctx
let canvas, ctx;

function main() {  
  // Retrieve <canvas> element
  canvas = document.getElementById('example');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  ctx = canvas.getContext('2d');

  // Draw a blue rectangle
  // ctx.fillStyle = 'rgba(0, 0, 255, 1.0)'; // Set color to blue
  // ctx.fillRect(120, 10, 150, 150);        // Fill a rectangle with the color

  // Black canvas
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw a red vector v1
  // let v1 = new Vector3([2.25, 2.25, 0]);
  // drawVector(v1, "red", canvas, ctx);
}

function drawVector(v, color) {
  const [x, y] = v.elements;
  // origin in middle
  let cx = canvas.width/2;
  let cy = canvas.width/2;
  ctx.strokeStyle = color;

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + x * 20, cy - y *20);
  ctx.stroke();
}

function handleDrawEvent() {
  // clear canvas
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // get coords as floats
  let x1 = parseFloat(document.getElementById('x1').value);
  let y1 = parseFloat(document.getElementById('y1').value);
  let x2 = parseFloat(document.getElementById('x2').value);
  let y2 = parseFloat(document.getElementById('y2').value);

  // draw
  let v1 = new Vector3([x1, y1, 0]);
  drawVector(v1, "red");
  let v2 = new Vector3([x2, y2, 0]);
  drawVector(v2, "blue");
}

function handleDrawOperationEvent() {
  // clear canvas
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // get coords as floats
  let x1 = parseFloat(document.getElementById('x1').value);
  let y1 = parseFloat(document.getElementById('y1').value);
  let x2 = parseFloat(document.getElementById('x2').value);
  let y2 = parseFloat(document.getElementById('y2').value);

  // draw
  let v1 = new Vector3([x1, y1, 0]);
  drawVector(v1, "red");
  let v2 = new Vector3([x2, y2, 0]);
  drawVector(v2, "blue");

  // selector value
  let op = document.getElementById('op-select').value;
  let s = parseFloat(document.getElementById('scalar').value);
  let v3 = new Vector3();
  v3.set(v1);
  let v4 = new Vector3();
  v4.set(v2);

  // add sub
  if (op === "add"){
    v3.add(v2);
    drawVector(v3, "green");
  } else if (op === "sub") {
    v3.sub(v2);
    drawVector(v3, "green");
  }

  // div mul
  if (op === "div"){
    v3.div(s);
    v4.div(s);
    drawVector(v3, "green");
    drawVector(v4, "green");
  } else if (op === "mul") {
    v3.mul(s)
    v4.mul(s);
    drawVector(v3, "green");
    drawVector(v4, "green");
  }

  // mag norm angle
  if (op === "mag") {
    console.log("Magnitude v1: " + v1.magnitude());
    console.log("Magnitude v2: " + v2.magnitude());
  } else if (op === "norm") {
    v3.normalize();
    v4.normalize();
    drawVector(v3, "green");
    drawVector(v4, "green");
  } else if (op === "angle") {
    console.log("Angle: " + angleBetween(v1, v2));
  }
}

function angleBetween(v1, v2) {
  let dotProd = Vector3.dot(v1, v2);
  let mag1 = v1.magnitude();
  let mag2 = v2.magnitude();
  let cosAlpha = dotProd / (mag1*mag2);
  let radians = Math.acos(cosAlpha);
  let degrees = radians * (180/Math.PI);
  return degrees;
}
