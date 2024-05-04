export class ShaderUtils
{
    public static programID: WebGLProgram | null;
    public static shaderID: WebGLShader | null;

    static domShader(elementID: string): string
    {
        let element: HTMLElement = <HTMLElement>document.getElementById(elementID);
        if(element == null || element.innerText == ""){console.log(elementID + " shader not found or no text.")}
        return element!.innerText;
    }

    static CreateShader(gl: WebGL2RenderingContext, src: string, type: number): WebGLShader
    {
        this.shaderID = gl?.createShader(type);
        gl?.shaderSource(this.shaderID!, src);
        gl?.compileShader(this.shaderID!);

        this.ErrorManagement("shader",gl);

        return this.shaderID!;
    }

    static CreateProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader)
    {
        this.programID = gl?.createProgram();
        gl?.attachShader(this.programID!, vertexShader);
        gl?.attachShader(this.programID!, fragmentShader);
        gl?.linkProgram(this.programID!);

        //Can delete the shaders since the program has been made.
        gl.detachShader(this.programID!,vertexShader); //TODO, detaching might cause issues on some browsers, Might only need to delete.
        gl.detachShader(this.programID!,fragmentShader);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);

        this.ErrorManagement("program",gl);


        return this.programID!;

    }

    private static ErrorManagement(type: "shader" | "program",gl:WebGL2RenderingContext): null | undefined | void
    {
        let self = this;
        if(type === "shader")
        {
            //Get Error data if shader failed compiling
            if(!gl.getShaderParameter(self.shaderID!, gl.COMPILE_STATUS)){
                console.error("Error compiling shader : " , gl.getShaderInfoLog(self.shaderID!));
                gl.deleteShader(self.shaderID!);
                return null;
            }
        }
        else if(type === "program")
        {
            //Check if successful
            if(!gl.getProgramParameter(self.programID!, gl.LINK_STATUS)){
                console.error("Error creating shader program.",gl.getProgramInfoLog(self.programID!));
                gl.deleteProgram(self.programID!); return null;
            }

            //Only do this for additional debugging.
            gl.validateProgram(self.programID!);
            if(!gl.getProgramParameter(self.programID!,gl.VALIDATE_STATUS)){
                console.error("Error validating program", gl.getProgramInfoLog(self.programID!));
                gl.deleteProgram(self.programID!); return null;
            }
        }
    }
}