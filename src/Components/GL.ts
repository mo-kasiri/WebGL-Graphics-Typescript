/* Singleton */

export class GLInstance{
    private canvas!: HTMLCanvasElement;
    readonly gl!: WebGL2RenderingContext | null;
    private static instance: GLInstance;

    private constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById("glCanvas");
        this.gl = this.canvas.getContext("webgl2");

        if(this.gl == null) {
            console.error("WebGL context is not available");
            return;
        }

        //...................................................
        //Setup GL, Set all the default configurations we need.
        this.gl?.clearColor(1.0,1.0,1.0,1.0); // set clear color
    }

    public static Instance()
    {
        if(!GLInstance.instance){
            GLInstance.instance = new GLInstance();
        }
        return GLInstance.instance;
    }

    // Methods
    fClear(): GLInstance
    {
        this.gl?.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT); return this;
    }

    fSetSize(w:number, h:number): GLInstance
    {
        //set the size of the canvas, on chrome we need to set it 3 ways to make it work perfectly.
        this.canvas.style.width = w + "px";
        this.canvas.style.height = h + "px";
        this.canvas.width = w;
        this.canvas.height = h;

        //when updating the canvas size, must reset the viewport of the canvas
        //else the resolution webgl renders at will not change
        this.gl?.viewport(0,0,w,h);
        return this;
    }
}