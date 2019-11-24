import {gl, GLUtils} from './gl'

export class Engine {
  private canvas_: HTMLCanvasElement;
  constructor() {

  }

  start() {
    this.canvas_ = document.getElementById("glCanvas") as HTMLCanvasElement;
    GLUtils.init(this.canvas_);
    gl.clearColor(0, 0, 1, 1);
    this.loop();
  }

  resize() {
    if (this.canvas_ !== undefined) {
      this.canvas_.width = window.innerWidth;
      this.canvas_.height = window.innerHeight;
    }
  }

  private loop() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    requestAnimationFrame(this.loop.bind(this));
  }
}