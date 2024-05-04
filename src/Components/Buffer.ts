
export class Buffer{
    private readonly VBO!: WebGLVertexArrayObject | null;
    constructor(private data: Float32Array, private gl:WebGL2RenderingContext) {
        this.VBO = this.gl?.createBuffer();
        this.bind();
            this.gl?.bufferData(this.gl.ARRAY_BUFFER, this.data, this.gl.STATIC_DRAW);
        this.unbind();

    }

    draw(mode: number, first: number, count: number){
        this.gl.drawArrays(mode, first, count);
    }

    bind() {this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.VBO)}
    unbind(){this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null)}
}