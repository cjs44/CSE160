/*
textureNum
0 - color texture interpolation
1 - second image interpolation
2 - normals
-1 - UV debug
other - error red
*/

// So it doesn't create a buffer every time
let buffer = null;
let vertexBuffer = null;
let uvBuffer = null;
let normalBuffer = null;

class Cube {
    constructor() {
        this.type = 'cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.textureNum = 0;
        this.texColorWeight = 1.0;
    }

    render() {
        var rgba = this.color;

        // which texture
        gl.uniform1i(u_whichTexture, this.textureNum);

        // which texture weight
        gl.uniform1f(u_texColorWeight, this.texColorWeight);

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_baseColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        if (this.texColorWeight === 0) {
            drawCubeFast();
        } else if (this.textureNum === 2) {
            drawCubeNormal();
        }
        else {
            drawCubeTextured();
        }
    }
}

function drawCubeTextured() {
    // Pos combined with UV
    // front
    drawTriangle3DUV([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0], [0, 0, 1, 1, 1, 0]);
    drawTriangle3DUV([0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0], [0, 0, 0, 1, 1, 1]);
    // back
    drawTriangle3DUV([0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0], [1, 0, 0, 0, 0, 1]);
    drawTriangle3DUV([0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0], [1, 0, 0, 1, 1, 1]);
    // top
    drawTriangle3DUV([0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0], [0, 0, 1, 0, 1, 1]);
    drawTriangle3DUV([0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0], [0, 0, 1, 1, 0, 1]);
    // bottom
    drawTriangle3DUV([0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0], [1, 0, 0, 1, 1, 1]);
    drawTriangle3DUV([0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0], [1, 0, 0, 0, 0, 1]);
    // left
    drawTriangle3DUV([0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0], [0, 0, 1, 1, 1, 0]);
    drawTriangle3DUV([0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0], [0, 0, 0, 1, 1, 1]);
    // right
    drawTriangle3DUV([1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0], [0, 0, 1, 1, 1, 0]);
    drawTriangle3DUV([1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0], [0, 0, 0, 1, 1, 1]);
}

function drawCubeNormal() {
    // Pos combined with UV and Normals
    // front
    drawTriangle3DUVNormal([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0],
        [0, 0, 1, 1, 1, 0],
        [0, 0, -1, 0, 0, -1, 0, 0, -1]);
    drawTriangle3DUVNormal([0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0],
        [0, 0, 0, 1, 1, 1],
        [0, 0, -1, 0, 0, -1, 0, 0, -1]);
    // back
    drawTriangle3DUVNormal([0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0],
        [1, 0, 0, 0, 0, 1],
        [0, 0, 1, 0, 0, 1, 0, 0, 1]);
    drawTriangle3DUVNormal([0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0],
        [1, 0, 0, 1, 1, 1],
        [0, 0, 1, 0, 0, 1, 0, 0, 1]);
    // top
    drawTriangle3DUVNormal([0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0],
        [0, 0, 1, 0, 1, 1],
        [0, 1, 0, 0, 1, 0, 0, 1, 0]);
    drawTriangle3DUVNormal([0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0],
        [0, 0, 1, 1, 0, 1],
        [0, 1, 0, 0, 1, 0, 0, 1, 0]);
    // bottom
    drawTriangle3DUVNormal([0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0],
        [1, 0, 0, 1, 1, 1],
        [0, -1, 0, 0, -1, 0, 0, -1, 0]);
    drawTriangle3DUVNormal([0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0],
        [1, 0, 0, 0, 0, 1],
        [0, -1, 0, 0, -1, 0, 0, -1, 0]);
    // left
    drawTriangle3DUVNormal([0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0],
        [0, 0, 1, 1, 1, 0],
        [-1, 0, 0, -1, 0, 0, -1, 0, 0]);
    drawTriangle3DUVNormal([0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0],
        [0, 0, 0, 1, 1, 1],
        [-1, 0, 0, -1, 0, 0, -1, 0, 0]);
    // right
    drawTriangle3DUVNormal([1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0],
        [0, 0, 1, 1, 1, 0],
        [1, 0, 0, 1, 0, 0, 1, 0, 0]);
    drawTriangle3DUVNormal([1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0],
        [0, 0, 0, 1, 1, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 0]);
}

function drawCubeFast() {
    var allVerts = [];

    // front
    allVerts = allVerts.concat([0, 0, 0, 1, 1, 0, 1, 0, 0]);
    allVerts = allVerts.concat([0, 0, 0, 0, 1, 0, 1, 1, 0]);
    // back
    allVerts = allVerts.concat([0, 0, 1, 1, 0, 1, 1, 1, 1]);
    allVerts = allVerts.concat([0, 0, 1, 1, 1, 1, 0, 1, 1]);
    // top
    allVerts = allVerts.concat([0, 1, 0, 1, 1, 0, 1, 1, 1]);
    allVerts = allVerts.concat([0, 1, 0, 1, 1, 1, 0, 1, 1]);
    // bottom
    allVerts = allVerts.concat([0, 0, 0, 1, 0, 1, 1, 0, 0]);
    allVerts = allVerts.concat([0, 0, 0, 0, 0, 1, 1, 0, 1]);
    // left
    allVerts = allVerts.concat([0, 0, 0, 0, 1, 1, 0, 0, 1]);
    allVerts = allVerts.concat([0, 0, 0, 0, 1, 0, 0, 1, 1]);
    // right
    allVerts = allVerts.concat([1, 0, 0, 1, 0, 1, 1, 1, 1]);
    allVerts = allVerts.concat([1, 0, 0, 1, 1, 1, 1, 1, 0]);

    drawTriangle3D(allVerts);
}

function drawTriangle3D(vertices) {
    var n = vertices.length / 3; // The number of vertices

    if (buffer === null) {
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

    // No uv for this
    gl.disableVertexAttribArray(a_UV);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function drawTriangle3DUV(vertices, uv) {
    var n = vertices.length/3; // The number of vertices

    // Vertices
    if (vertexBuffer === null) {
        // Create a buffer object
        vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            console.log('Failed to create the vertex buffer object');
            return -1;
        }
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    // UV
    if (uvBuffer === null) {
        // Create a buffer object
        uvBuffer = gl.createBuffer();
        if (!uvBuffer) {
            console.log('Failed to create the uv buffer object');
            return -1;
        }
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_UV);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function drawTriangle3DUVNormal(vertices, uv, normals) {
    var n = vertices.length/3; // The number of vertices

    // Vertices
    if (vertexBuffer === null) {
        // Create a buffer object
        vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            console.log('Failed to create the vertex buffer object');
            return -1;
        }
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    // UV
    if (uvBuffer === null) {
        // Create a buffer object
        uvBuffer = gl.createBuffer();
        if (!uvBuffer) {
            console.log('Failed to create the uv buffer object');
            return -1;
        }
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_UV);

    if (normalBuffer === null) {
        // Create a buffer object
        normalBuffer = gl.createBuffer();
        if (!normalBuffer) {
            console.log('Failed to create the normal buffer object');
            return -1;
        }
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Normal);

    gl.drawArrays(gl.TRIANGLES, 0, n);

    // gl.vertexBuffer = null;
}
