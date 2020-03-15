import { GLBuffer } from '../gl/glbuffer'
import { Mat4 } from '../math/mat4'

export class Sprite {
  private width_: number;
  private height_: number;
  private buffer_: GLBuffer;
  private canvas_: HTMLCanvasElement;
  private gl_: WebGLRenderingContext;

  constructor(canvas: HTMLCanvasElement, gl: WebGLRenderingContext, width: number, height: number) {
    this.canvas_ = canvas;
    this.gl_ = gl;
    this.width_ = width;
    this.height_ = height;
    this.buffer_ = this.createBuffer();
  }

  private createBuffer() {
    let buffer = new GLBuffer(this.gl_, 3);
    let clientWidth = this.canvas_.width, clientHeight = this.canvas_.height;
    const vertices = [
      -1, 1, 0,
      1, 1, 0,
      1, -1, 0,
      1, -1, 0,
      -1, -1, 0,
      -1, 1, 0
    ];
    buffer.pushBackData(new Float32Array(vertices));
    buffer.addAttributeInfo(0, 3, 0);
    buffer.unbind();
    return buffer;
  }

  modelView() {
    let modelView = new Mat4();
    modelView.translate(0, 0, -5);
    // modelView.rotate(0, 0, 90);
    // modelView.scale(2);
    return new Float32Array(modelView.data);
  }

  draw() {
    this.buffer_.bind();
    this.buffer_.draw();
  }
}