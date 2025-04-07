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
