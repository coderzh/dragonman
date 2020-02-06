
import { GLBuffer } from '../gl/glbuffer'

export class Sprite {
  private buffer_: GLBuffer;
  private gl_: WebGLRenderingContext;

  constructor(gl: WebGLRenderingContext, width: number, height: number) {
    this.gl_ = gl;
    this.createBuffer();
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
    this.buffer_.addAttributeInfo(0, 3, 0);
    this.buffer_.unbind();
  }


  draw() {
    this.buffer_.bind();
    this.buffer_.draw();
  }
}