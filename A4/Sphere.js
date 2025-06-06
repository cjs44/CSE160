/*
textureNum
0 - color texture interpolation
1 - second image interpolation (weight = 1)
2 - normals (weight = 1)
-1 - UV debug (weight = 1)
other - error red
*/

// So it doesn't create a buffer every time
let buffer2 = null;
let vertexBuffer2 = null;
let uvBuffer2 = null;
let normalBuffer2 = null;

class Sphere {
    constructor() {
        this.type = 'sphere';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.textureNum = 0;
        this.texColorWeight = 1.0;
        this.verts32 = new Float32Array([]);
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

        drawSphereNormal();
    }
}

function drawSphereNormal() {
    var d = Math.PI / 10;
    var dd = Math.PI / 10;

    for (var t = 0; t < Math.PI; t += d) {
        for (var r = 0; r < (2*Math.PI); r += d){
            var p1 = [Math.sin(t)*Math.cos(r), Math.sin(t)*Math.sin(r), Math.cos(t)];
            var p2 = [Math.sin(t+dd)*Math.cos(r), Math.sin(t+dd)*Math.sin(r), Math.cos(t+dd)];
            var p3 = [Math.sin(t)*Math.cos(r+dd), Math.sin(t)*Math.sin(r+dd), Math.cos(t)];
            var p4 = [Math.sin(t+dd)*Math.cos(r+dd), Math.sin(t+dd)*Math.sin(r+dd), Math.cos(t+dd)];

            var v = [];
            var uv = [];
            v = v.concat(p1); uv = uv.concat([0,0]);
            v = v.concat(p2); uv = uv.concat([0,0]);
            v = v.concat(p4); uv = uv.concat([0,0]);
            gl.uniform4f(u_baseColor, 1, 1, 1, 1);
            drawTriangle3DUVNormal(v, uv, v);

            var v = [];
            var uv = [];
            v = v.concat(p1); uv = uv.concat([0,0]);
            v = v.concat(p4); uv = uv.concat([0,0]);
            v = v.concat(p3); uv = uv.concat([0,0]);
            gl.uniform4f(u_baseColor, 1, 1, 1, 1);
            drawTriangle3DUVNormal(v, uv, v);
        }
    }
}

function drawTriangle3DUVNormal(vertices, uv, normals) {
    var n = vertices.length/3; // The number of vertices

    // Vertices
    if (vertexBuffer2 === null) {
        // Create a buffer object
        vertexBuffer2 = gl.createBuffer();
        if (!vertexBuffer2) {
            console.log('Failed to create the vertex buffer object');
            return -1;
        }
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer2);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    // UV
    if (uvBuffer2 === null) {
        // Create a buffer object
        uvBuffer2 = gl.createBuffer();
        if (!uvBuffer2) {
            console.log('Failed to create the uv buffer object');
            return -1;
        }
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer2);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_UV);

    if (normalBuffer2 === null) {
        // Create a buffer object
        normalBuffer2 = gl.createBuffer();
        if (!normalBuffer2) {
            console.log('Failed to create the normal buffer object');
            return -1;
        }
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer2);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Normal);

    gl.drawArrays(gl.TRIANGLES, 0, n);

    // gl.vertexBuffer = null;
}
