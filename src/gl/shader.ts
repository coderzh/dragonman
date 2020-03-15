export class Shader {
  private gl_: WebGLRenderingContext;
  private name_: string;
  private program_: WebGLProgram;
  private attributes_: { [name: string]: number } = {}
  private uniforms_: { [name: string]: WebGLUniformLocation } = {}

  constructor(name: string, gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
    this.gl_ = gl;
    this.name_ = name;
    let vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
    let fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    this.program_ = this.createProgram(gl, vertexShader, fragmentShader);
    this.detectAttributes();
    this.detectUniforms();
  }

  get name(): string {
    return this.name_;
  }

  use() : void {
    this.gl_.useProgram(this.program_);
  }
  
  getAttribteLocation(name: string): number {
    if (this.attributes_[name] === undefined) {
      throw new Error(`attribute '${name}' not found in shader '${this.name_}'`);
    }
    return this.attributes_[name];
  }

  getUniformLocation(name: string): WebGLUniformLocation {
    if (this.uniforms_[name] === undefined) {
      throw new Error(`uniform '${name}' not found in shader '${this.name_}'`);
    }
    return this.uniforms_[name];
  }

  private loadShader(gl: WebGLRenderingContext, shaderType: number, source: string): WebGLShader {
    const shader = gl.createShader(shaderType);
    if (!shader) {
      throw new Error(`createShader type '${shaderType}' failed`);
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      throw new Error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    }

    return shader;
  }

  private createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    let program = gl.createProgram();
    if (program == null) {
      throw new Error('createProgram failed');
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(
        'Unable to initialize the shader program: ' +
          gl.getProgramInfoLog(program)
      );
    }
    return program;
  }

  private detectAttributes() {
    let count = this.gl_.getProgramParameter(this.program_, this.gl_.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < count; i++) {
      let attr = this.gl_.getActiveAttrib(this.program_, i);
      if (!attr) {
        continue;
      }
      this.attributes_[attr.name] = this.gl_.getAttribLocation(this.program_, attr.name);
    }
  }

  private detectUniforms() {
    let count = this.gl_.getProgramParameter(this.program_, this.gl_.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) {
      let uniform = this.gl_.getActiveUniform(this.program_, i);
      if (!uniform) {
        continue;
      }
      const location = this.gl_.getUniformLocation(this.program_, uniform.name);
      if (location) {
        this.uniforms_[uniform.name] = location;
      }
    }
  }
}