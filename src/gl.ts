export var gl: WebGLRenderingContext;

export class GLUtils {
  public static init(canvas: HTMLCanvasElement): void {
    gl = canvas.getContext("webgl");
    if (gl === undefined) {
      throw new Error("webgl is not supported!");
    }
  }
}