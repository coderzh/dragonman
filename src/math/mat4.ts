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
    e[12] += e[0] * x + e[4] * y + e[8] * z;
    e[13] += e[1] * x + e[5] * y + e[9] * z;
    e[14] += e[2] * x + e[6] * y + e[10] * z;
    e[15] += e[3] * x + e[7] * y + e[11] * z;
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

  perspective(fovy: number, aspect: number, near: number, far: number) {
    var m = new Mat4();
    var e, rd, s, ct;

    if (near === far || aspect === 0) {
      throw 'null frustum';
    }
    if (near <= 0) {
      throw 'near <= 0';
    }
    if (far <= 0) {
      throw 'far <= 0';
    }
  
    fovy = Math.PI * fovy / 180 / 2;
    s = Math.sin(fovy);
    if (s === 0) {
      throw 'null frustum';
    }
  
    rd = 1 / (far - near);
    ct = Math.cos(fovy) / s;
  
    e = m.elements_;
  
    e[0]  = ct / aspect;
    e[1]  = 0;
    e[2]  = 0;
    e[3]  = 0;
  
    e[4]  = 0;
    e[5]  = ct;
    e[6]  = 0;
    e[7]  = 0;
  
    e[8]  = 0;
    e[9]  = 0;
    e[10] = -(far + near) * rd;
    e[11] = -1;
  
    e[12] = 0;
    e[13] = 0;
    e[14] = -2 * near * far * rd;
    e[15] = 0;

    this.mul(m);
  } 
  
  lookAt(eyeX: number, eyeY: number, eyeZ: number,
    centerX: number, centerY: number, centerZ: number,
    upX: number, upY: number, upZ: number) {
    var m = new Mat4();
    var e, fx, fy, fz, rlf, sx, sy, sz, rls, ux, uy, uz;

    fx = centerX - eyeX;
    fy = centerY - eyeY;
    fz = centerZ - eyeZ;

    // Normalize f.
    rlf = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz);
    fx *= rlf;
    fy *= rlf;
    fz *= rlf;

    // Calculate cross product of f and up.
    sx = fy * upZ - fz * upY;
    sy = fz * upX - fx * upZ;
    sz = fx * upY - fy * upX;

    // Normalize s.
    rls = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz);
    sx *= rls;
    sy *= rls;
    sz *= rls;

    // Calculate cross product of s and f.
    ux = sy * fz - sz * fy;
    uy = sz * fx - sx * fz;
    uz = sx * fy - sy * fx;

    // Set to this.
    e = m.elements_;
    e[0] = sx;
    e[1] = ux;
    e[2] = -fx;
    e[3] = 0;

    e[4] = sy;
    e[5] = uy;
    e[6] = -fy;
    e[7] = 0;

    e[8] = sz;
    e[9] = uz;
    e[10] = -fz;
    e[11] = 0;

    e[12] = 0;
    e[13] = 0;
    e[14] = 0;
    e[15] = 1;

    // Translate.
    m.translate(-eyeX, -eyeY, -eyeZ);
    this.mul(m);
  }
}