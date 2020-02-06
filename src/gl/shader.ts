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
    this.createProgram(gl, vertexShader, fragmentShader);
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
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  private createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): void {
    this.program_ = gl.createProgram();
    gl.attachShader(this.program_, vertexShader);
    gl.attachShader(this.program_, fragmentShader);
    gl.linkProgram(this.program_);
    if (!gl.getProgramParameter(this.program_, gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(this.program_));
    }
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
      this.uniforms_[uniform.name] = this.gl_.getUniformLocation(this.program_, uniform.name);
    }
  }
}