export class AttributeInfo {
  location: number;
  size: number;
  offset: number;
}

export class GLBuffer {
  private gl_: WebGLRenderingContext;
  private targetBufferType_: number;
  private elementSize_: number;
  private dataType_: number;
  private typeSize_: number;
  private stride_: GLsizei;
  private offset_: GLintptr;
  private drawMode_: number;
  private buffer_: WebGLBuffer;
  private attributeInfos_: AttributeInfo[] = [];
  private hasAttributeInfo_: boolean = false;
  private drawCount_: number;

  constructor(gl: WebGLRenderingContext, elementSize: number, targetBufferType: number = gl.ARRAY_BUFFER, 
    dataType: number = gl.FLOAT, drawMode: number = gl.TRIANGLES) {
    this.gl_ = gl;
    this.targetBufferType_ = targetBufferType;
    this.elementSize_ = elementSize;
    this.dataType_ = dataType;
    this.drawMode_ = drawMode;

    switch (dataType) {
      case gl.FLOAT:
      case gl.INT:
      case gl.UNSIGNED_INT:
        this.typeSize_ = 4;
        break;
      case gl.SHORT:
      case gl.UNSIGNED_SHORT:
        this.typeSize_ = 2;
        break;
      case gl.BYTE:
      case gl.UNSIGNED_BYTE:
        this.typeSize_ = 1;
        break;
      default:
        throw new Error(`Unrecognized data type ${dataType}`);
    }

    this.stride_ = elementSize * this.typeSize_;
    this.buffer_ = gl.createBuffer();
  }

  bind(normalized: boolean = false) {
    this.gl_.bindBuffer(this.targetBufferType_, this.buffer_);
    if (this.hasAttributeInfo_) {
      for (let it of this.attributeInfos_) {
        this.gl_.enableVertexAttribArray(it.location);
        this.gl_.vertexAttribPointer(it.location, it.size,
          this.dataType_, normalized, this.stride_, it.offset * this.dataType_);
      }
    }
  }

  unbind() {
    this.gl_.bindBuffer(this.targetBufferType_, undefined);
  }

  draw() {
    if (this.targetBufferType_ == this.gl_.ARRAY_BUFFER) {
      this.gl_.drawArrays(this.drawMode_, 0, this.drawCount_);
    } else if (this.targetBufferType_ == this.gl_.ELEMENT_ARRAY_BUFFER) {
      // this.gl_.drawElements(this.drawMode_, )
    }
  }

  addAttributeInfo(location: number, size: number, offset: number) {
    this.attributeInfos_.push({ location, size, offset })
    this.hasAttributeInfo_ = true;
  }

  pushBackData(data: BufferSource) {
    this.gl_.bindBuffer(this.targetBufferType_, this.buffer_);
    this.gl_.bufferData(this.targetBufferType_, data, this.gl_.STATIC_DRAW); 
    this.drawCount_ = data.byteLength / (this.typeSize_ * this.elementSize_);
  }
}