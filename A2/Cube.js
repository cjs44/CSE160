// So it doesn't create a buffer every time
let buffer = null;

class Cube {
    constructor() {
        this.type = 'cube';
        // this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        // this.size = 10.0;
        // this.segments = 10;
        this.matrix = new Matrix4();
    }

    render() {
        // var xy = this.position;
        var rgba = this.color;
        // var size = this.size;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        
        // Pass the matrix to u_ModelMatrix attribute
        // gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        drawCube(this.matrix, this.color);
    }
}

function drawCube(M, rgba) {
    // Appy matrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, M.elements);

    // Front of cube
    drawTriangle3D([0.0, 0.0, 0.0,  1.0, 1.0, 0.0,  1.0, 0.0, 0.0]);
    drawTriangle3D([0.0, 0.0, 0.0,  0.0, 1.0, 0.0,  1.0, 1.0, 0.0]);
    // Back of cube
    gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);
    drawTriangle3D([0.0, 0.0, 1.0,   1.0, 0.0, 1.0,   1.0, 1.0, 1.0]);
    drawTriangle3D([0.0, 0.0, 1.0,   1.0, 1.0, 1.0,   0.0, 1.0, 1.0]);
    // Top of cube
    gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);
    drawTriangle3D([0.0, 1.0, 0.0,   1.0, 1.0, 0.0,   1.0, 1.0, 1.0]);
    drawTriangle3D([0.0, 1.0, 0.0,   1.0, 1.0, 1.0,   0.0, 1.0, 1.0]);
    // Bottom of cube
    gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);
    drawTriangle3D([0.0, 0.0, 0.0,   1.0, 0.0, 1.0,   1.0, 0.0, 0.0]);
    drawTriangle3D([0.0, 0.0, 0.0,   0.0, 0.0, 1.0,   1.0, 0.0, 1.0]);
    // Left of cube
    gl.uniform4f(u_FragColor, rgba[0] * 0.6, rgba[1] * 0.6, rgba[2] * 0.6, rgba[3]);
    drawTriangle3D([0.0, 0.0, 0.0,   0.0, 1.0, 1.0,   0.0, 0.0, 1.0]);
    drawTriangle3D([0.0, 0.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 1.0]);
    // Right of cube
    gl.uniform4f(u_FragColor, rgba[0] * 0.5, rgba[1] * 0.5, rgba[2] * 0.5, rgba[3]);
    drawTriangle3D([1.0, 0.0, 0.0,   1.0, 0.0, 1.0,   1.0, 1.0, 1.0]);
    drawTriangle3D([1.0, 0.0, 0.0,   1.0, 1.0, 1.0,   1.0, 1.0, 0.0]);
}

/* function drawCube(M) {
    var vertices = new Float32Array([
      // Front of cube
      0.0, 0.0, 0.0,  1.0, 1.0, 0.0,  1.0, 0.0, 0.0,
      0.0, 0.0, 0.0,  0.0, 1.0, 0.0,  1.0, 1.0, 0.0,
      // Back of cube
      0.0, 0.0, 1.0,   1.0, 0.0, 1.0,   1.0, 1.0, 1.0,
      0.0, 0.0, 1.0,   1.0, 1.0, 1.0,   0.0, 1.0, 1.0,
      // Top of cube
      0.0, 1.0, 0.0,   1.0, 1.0, 0.0,   1.0, 1.0, 1.0,
      0.0, 1.0, 0.0,   1.0, 1.0, 1.0,   0.0, 1.0, 1.0,
      // Bottom of cube
      0.0, 0.0, 0.0,   1.0, 0.0, 1.0,   1.0, 0.0, 0.0,
      0.0, 0.0, 0.0,   0.0, 0.0, 1.0,   1.0, 0.0, 1.0,
      // Left of cube
      0.0, 0.0, 0.0,   0.0, 1.0, 1.0,   0.0, 0.0, 1.0,
      0.0, 0.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 1.0,
      // Right of cube
      1.0, 0.0, 0.0,   1.0, 0.0, 1.0,   1.0, 1.0, 1.0,
      1.0, 0.0, 0.0,   1.0, 1.0, 1.0,   1.0, 1.0, 0.0
    ]);
    var n = 36; // The number of vertices

    if (buffer === null){
        // Create a buffer object
        buffer = gl.createBuffer();
        if (!buffer) {
            console.log('Failed to create the buffer object');
            return -1;
        }
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    // Appy matrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, M.elements);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}*/

function drawTriangle3D(vertices) {
    var n = 3; // The number of vertices

    if (buffer === null){
        // Create a buffer object
        buffer = gl.createBuffer();
        if (!buffer) {
            console.log('Failed to create the buffer object');
            return -1;
        }
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}
