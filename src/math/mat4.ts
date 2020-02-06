export class Mat4 {
  private elements_: number[] = [];

  constructor() {
    this.elements_ = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ];
  }

  get data() : number[] {
    return this.elements_;
  }

  translate(x: number, y: number, z: number) {
    var e = this.elements_;
    e[12] += x;
    e[13] += y;
    e[14] += z;
  }

  mul(other: Mat4) {
    var i, e, a, b, ai0, ai1, ai2, ai3;
    // Calculate e = a * b
    e = this.elements_;
    a = this.elements_;
    b = other.elements_;
    
    // If e equals b, copy b to temporary matrix.
    if (e === b) {
      b = new Float32Array(16);
      for (i = 0; i < 16; ++i) {
        b[i] = e[i];
      }
    }
    for (i = 0; i < 4; i++) {
      ai0=a[i];  ai1=a[i+4];  ai2=a[i+8];  ai3=a[i+12];
      e[i]    = ai0 * b[0]  + ai1 * b[1]  + ai2 * b[2]  + ai3 * b[3];
      e[i+4]  = ai0 * b[4]  + ai1 * b[5]  + ai2 * b[6]  + ai3 * b[7];
      e[i+8]  = ai0 * b[8]  + ai1 * b[9]  + ai2 * b[10] + ai3 * b[11];
      e[i+12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
    }
  }

  rotate(x: number, y: number, z: number) {
    if (x != 0) {
      let radian = Math.PI * x / 180;
      let cosB = Math.cos(radian), sinB = Math.sin(radian);
      var m = new Mat4();
      var xe = m.elements_;
      xe[5] = cosB; xe[6] = sinB; xe[9] = -sinB; xe[10] = cosB;
      this.mul(m);
    }

    if (y != 0) {
      let radian = Math.PI * y / 180;
      let cosB = Math.cos(radian), sinB = Math.sin(radian);
      var m = new Mat4();
      var ye = m.elements_;
      ye[0] = cosB; ye[2] = sinB; ye[8] = -sinB; ye[10] = cosB;
      this.mul(m);
    }

    if (z != 0) {
      let radian = Math.PI * z / 180;
      let cosB = Math.cos(radian), sinB = Math.sin(radian);
      var m = new Mat4();
      var ze = m.elements_;
      ze[0] = cosB; ze[1] = sinB; ze[4] = -sinB; ze[5] = cosB;
      this.mul(m);
    }
  }

  scale(s: number) {
    var m = new Mat4();
    var e = m.elements_;
    e[0] = s; e[5] = s; e[10] = s;
    this.mul(m);
  }
}