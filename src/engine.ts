import { GLUtils } from './gl/glutils'
import { Shader } from './gl/shader'
import { Sprite } from './graphics/sprite'
import { Mat4 } from './math/mat4'

export class Engine {
  private canvas_: HTMLCanvasElement;
  private gl_: WebGLRenderingContext;
  private sprite_: Sprite;
  private shader_: Shader;

  constructor() {
    this.canvas_ = document.getElementById("glCanvas") as HTMLCanvasElement;
    this.gl_ = GLUtils.init(this.canvas_);
    this.sprite_ = new Sprite(this.canvas_, this.gl_, 100, 100);
    this.shader_ = this.loadShader();
  }

  start() {
    this.gl_.clearColor(0, 0, 0, 1);
    this.shader_.use();
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

    let projectionLocation = this.shader_.getUniformLocation("u_projection");
    let projection = new Mat4();
    projection.perspective(45, this.canvas_.width / this.canvas_.height, 0.1, 100);
    this.gl_.uniformMatrix4fv(projectionLocation, false, new Float32Array(projection.data));

    let modelViewLocation = this.shader_.getUniformLocation("u_modelView");
    let spriteModelView = this.sprite_.modelView();
    this.gl_.uniformMatrix4fv(modelViewLocation, false, spriteModelView);

    this.sprite_.draw();
    requestAnimationFrame(this.loop.bind(this));
  }

  private loadShader() {
    let vsSource = `
attribute vec4 a_position;
uniform mat4 u_projection;
uniform mat4 u_modelView;
void main() {
    gl_Position = u_projection * u_modelView * a_position;
}`;
    let fsSource = `
precision mediump float;
uniform vec4 u_color;
void main() {
  gl_FragColor = u_color;
}`;
    return new Shader("basic", this.gl_, vsSource, fsSource);
  }
}