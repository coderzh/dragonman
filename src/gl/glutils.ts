export class GLUtils {
  static init(canvas: HTMLCanvasElement): WebGLRenderingContext {
    let gl = canvas.getContext("webgl");
    if (gl === undefined) {
      throw new Error("webgl is not supported!");
    }
    return gl;
  }
}