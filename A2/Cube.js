// So it doesn't create a buffer every time
let buffer = null;

class Cube {
    constructor() {
        this.type = 'cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
    }

    render() {
        var rgba = this.color;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        
        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

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
    gl.uniform4f(u_FragColor, rgba[0] * 0.98, rgba[1] * 0.98, rgba[2] * 0.98, rgba[3]);
    drawTriangle3D([0.0, 0.0, 1.0,   1.0, 0.0, 1.0,   1.0, 1.0, 1.0]);
    drawTriangle3D([0.0, 0.0, 1.0,   1.0, 1.0, 1.0,   0.0, 1.0, 1.0]);
    // Top of cube
    gl.uniform4f(u_FragColor, rgba[0] * 0.96, rgba[1] * 0.96, rgba[2] * 0.96, rgba[3]);
    drawTriangle3D([0.0, 1.0, 0.0,   1.0, 1.0, 0.0,   1.0, 1.0, 1.0]);
    drawTriangle3D([0.0, 1.0, 0.0,   1.0, 1.0, 1.0,   0.0, 1.0, 1.0]);
    // Bottom of cube
    gl.uniform4f(u_FragColor, rgba[0] * 0.94, rgba[1] * 0.94, rgba[2] * 0.94, rgba[3]);
    drawTriangle3D([0.0, 0.0, 0.0,   1.0, 0.0, 1.0,   1.0, 0.0, 0.0]);
    drawTriangle3D([0.0, 0.0, 0.0,   0.0, 0.0, 1.0,   1.0, 0.0, 1.0]);
    // Left of cube
    gl.uniform4f(u_FragColor, rgba[0] * 0.92, rgba[1] * 0.92, rgba[2] * 0.92, rgba[3]);
    drawTriangle3D([0.0, 0.0, 0.0,   0.0, 1.0, 1.0,   0.0, 0.0, 1.0]);
    drawTriangle3D([0.0, 0.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 1.0]);
    // Right of cube
    gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);
    drawTriangle3D([1.0, 0.0, 0.0,   1.0, 0.0, 1.0,   1.0, 1.0, 1.0]);
    drawTriangle3D([1.0, 0.0, 0.0,   1.0, 1.0, 1.0,   1.0, 1.0, 0.0]);
}

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
