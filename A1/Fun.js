class Fun {
    constructor() {
        this.type = 'fun';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        // changes radius
        this.size = 10.0;
        this.segments = 8;
        // actual point size will stay the same
        this.pointSize = 2.0;
    }

    render() {
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Draw
        var d = size/200.0;

        // point size constant
        gl.uniform1f(u_Size, this.pointSize);

        let angleStep = 360/this.segments;
        for (var angle = 0; angle < 360; angle += angleStep) {
            // I asked chatgpt to help me get the math for this
            // it doesn't draw the middle point this way
            let rad = angle * Math.PI / 180;
            let x = xy[0] + Math.cos(rad) * d;
            let y = xy[1] + Math.sin(rad) * d;
            drawFun([x, y]);
        }
    }
}


function drawFun(vertex) {
    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.DYNAMIC_DRAW);
    
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.POINTS, 0, 1);
}
