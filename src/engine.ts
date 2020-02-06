import { GLUtils } from './gl/glutils'
import { Shader } from './gl/shader'
import { GLBuffer } from './gl/glbuffer'
import { Mat4 } from './math/mat4'

export class Engine {
  private canvas_: HTMLCanvasElement;
  private shader_: Shader;
  private buffer_: GLBuffer;
  private gl_: WebGLRenderingContext;

  constructor() {

  }

  start() {
    this.canvas_ = document.getElementById("glCanvas") as HTMLCanvasElement;
    this.gl_ = GLUtils.init(this.canvas_);
    this.gl_.clearColor(0, 0, 0, 1);
    this.loadShader();
    this.shader_.use();
    this.createBuffer();
    this.resize();
    this.loop();
  }

  resize() {
    if (this.canvas_ !== undefined) {
      this.canvas_.width = window.innerWidth;
      this.canvas_.height = window.innerHeight;
      this.gl_.viewport(0, 0, this.canvas_.width, this.canvas_.height);
    }
  }

  private loop() {
    this.gl_.clear(this.gl_.COLOR_BUFFER_BIT);
    let colorUniformLocation = this.shader_.getUniformLocation("u_color");
    this.gl_.uniform4f(colorUniformLocation, 0.5, 1, 1, 1);

    let modelViewMatrixLocation = this.shader_.getUniformLocation("u_modelView");

    let modelViewMatrix = new Mat4();
    // modelViewMatrix.translate(-0.25, -0.25, 0);
    modelViewMatrix.rotate(0, 0, 90);
    // console.log(modelViewMatrix.data)
    modelViewMatrix.scale(0.5);
    this.gl_.uniformMatrix4fv(modelViewMatrixLocation, false, new Float32Array(modelViewMatrix.data));
    this.buffer_.bind();
    this.buffer_.draw();
    requestAnimationFrame(this.loop.bind(this));
  }

  private createBuffer() {
    this.buffer_ = new GLBuffer(this.gl_, 3);
    const vertices = [
      0, 0, 0,
      0, 0.5, 0,
      0.5, 0, 0,
      0.5, 0, 0,
      0.5, 0.5, 0,
      0, 0.5, 0
    ];
    this.buffer_.pushBackData(new Float32Array(vertices));
    this.buffer_.addAttributeInfo(this.shader_.getAttribteLocation("a_position"), 3, 0);
    this.buffer_.unbind();
  }

  private loadShader() {
    let vsSource = `
attribute vec4 a_position;
uniform mat4 u_modelView;
void main() {
    gl_Position = u_modelView * a_position;
}`;
    let fsSource = `
precision mediump float;
uniform vec4 u_color;
void main() {
  gl_FragColor = u_color;
}`;
    this.shader_ = new Shader("basic", this.gl_, vsSource, fsSource);
  }
}