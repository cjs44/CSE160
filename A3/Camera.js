class Camera {
    constructor(canvas) {
        this.fov = 60.0;
        this.eye = new Vector3([0, 0, -3.5]);;
        this.at = new Vector3([0, 0, -1]);
        this.up = new Vector3([0, 1, 0]);
        this.viewMatrix = new Matrix4();
        this.viewMatrix.setIdentity();
        this.viewMatrix.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]
        );
        this.projectionMatrix = new Matrix4();
        this.projectionMatrix.setIdentity();
        this.projectionMatrix.setPerspective(this.fov, canvas.width / canvas.height, 0.1, 1000);
    }

    moveForward() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        f.mul(0.1)

        this.eye.add(f);
        this.at.add(f);
        this.updateView();
    }

    moveBackwards() {
        let b = new Vector3();
        b.set(this.eye);
        b.sub(this.at);
        b.normalize();
        b.mul(0.1);

        this.eye.add(b);
        this.at.add(b);
        this.updateView();
    }

    moveLeft() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();

        let s = Vector3.cross(this.up, f);
        s.normalize();
        s.mul(0.1);

        this.eye.add(s);
        this.at.add(s);
        this.updateView();
    }

    moveRight() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();

        let s = Vector3.cross(f, this.up);
        s.normalize();
        s.mul(0.1);

        this.eye.add(s);
        this.at.add(s);
        this.updateView();
    }

    panLeft() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);

        let rotMatrix = new Matrix4();
        rotMatrix.setRotate(5, this.up.elements[0], this.up.elements[1], this.up.elements[2]);

        let f_prime = rotMatrix.multiplyVector3(f);

        this.at.set(this.eye);
        this.at.add(f_prime);
        this.updateView();
    }

    panRight() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);

        let rotMatrix = new Matrix4();
        rotMatrix.setRotate(-5, this.up.elements[0], this.up.elements[1], this.up.elements[2]);

        let f_prime = rotMatrix.multiplyVector3(f);

        this.at.set(this.eye);
        this.at.add(f_prime);
        this.updateView();
    }

    updateView() {
        this.viewMatrix.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]
        );
    }
}