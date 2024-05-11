import {ShaderUtils} from "./Shaders";
import {GLInstance} from "./GL";
type bufferType = "VERTEX_BUFFER" | "FRAGMENT_BUFFER" | "TEXTURE_BUFFER";
export class Buffer{

    readonly gl:WebGL2RenderingContext = GLInstance.Instance().gl!;
    private vertexVBO: WebGLBuffer | null = 0
    private colorVBO: WebGLBuffer | null = 0;
    private textureVBO: WebGLBuffer | null = 0;
    private VAO: WebGLVertexArrayObject | null = 0;

    private totalVertices: number = 0;
    constructor() {}

    CreateBuffer(totalVertices: number): void{
        this.vertexVBO = this.gl?.createBuffer();
        this.colorVBO = this.gl?.createBuffer();
        this.textureVBO = this.gl?.createBuffer();
        this.VAO = this.gl?.createVertexArray();

        this.totalVertices = totalVertices;
    }
    FillBuffer(vboType: bufferType, data: Float32Array, fillType: GLenum):void{
        this.gl?.bindVertexArray(this.VAO);

            if(vboType == "VERTEX_BUFFER")
            {
                this.gl?.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexVBO);
            }
            else if(vboType == "FRAGMENT_BUFFER")
            {
                this.gl?.bindBuffer(this.gl.ARRAY_BUFFER, this.colorVBO);
            }
            else if(vboType == "TEXTURE_BUFFER")
            {
                this.gl?.bindBuffer(this.gl.ARRAY_BUFFER, this.textureVBO);
            }
            this.gl?.bufferData(this.gl.ARRAY_BUFFER, data, fillType);

        this.gl?.bindVertexArray(null);
    }

    LinkBuffer(attributeName: string, vboType: bufferType, componentType: number, dataType: number){
        let programID = ShaderUtils.Instance().GetProgramID;
        let attribLocationID = this.gl?.getAttribLocation(programID, attributeName);

        this.gl?.bindVertexArray(this.VAO);

            if(vboType == "VERTEX_BUFFER")
            {
                this.gl?.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexVBO);
            }
            else if(vboType == "FRAGMENT_BUFFER")
            {
                this.gl?.bindBuffer(this.gl.ARRAY_BUFFER, this.colorVBO);
            }
            else if(vboType == "TEXTURE_BUFFER")
            {
                this.gl?.bindBuffer(this.gl.ARRAY_BUFFER, this.textureVBO);
            }
            this.gl?.vertexAttribPointer(attribLocationID,componentType, dataType, false,0, 0);
            this.gl?.enableVertexAttribArray(attribLocationID);

        this.gl?.bindVertexArray(null);
    }


    Render(drawType: number){
       this.gl?.bindVertexArray(this.VAO);
       this.gl?.drawArrays(drawType, 0, this.totalVertices);
       //this.gl?.drawElements(drawType,this.totalVertices,this.gl.UNSIGNED_BYTE,0);
    }

    DestroyBuffer()
    {
        this.gl?.deleteBuffer(this.vertexVBO);
        this.gl?.deleteBuffer(this.colorVBO);
        this.gl?.deleteBuffer(this.textureVBO);
        this.gl?.deleteVertexArray(this.VAO);
    }
}