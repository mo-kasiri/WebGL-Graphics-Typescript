/* Singleton */

import {GLInstance} from "./GL";
export class ShaderUtils
{
    readonly gl:WebGL2RenderingContext = GLInstance.Instance().gl!;
    private static instance: ShaderUtils;
    private constructor() {}

    private static _programID: WebGLProgram | null;
    private static _shaderID: WebGLShader | null;

    public static Instance(): ShaderUtils
    {
        if (!ShaderUtils.instance)
        {
            ShaderUtils.instance = new ShaderUtils();
        }
        return ShaderUtils.instance;
    }

    domShader(elementID: string): string
    {
        let element: HTMLElement = <HTMLElement>document.getElementById(elementID);
        if(element == null || element.innerText == ""){console.log(elementID + " shader not found or no text.")}
        return element!.innerText;
    }

     CreateShader( src: string, type: GLenum): WebGLShader
    {
        ShaderUtils._shaderID = this.gl?.createShader(type);
        this.gl?.shaderSource(ShaderUtils._shaderID!, src);
        this.gl?.compileShader(ShaderUtils._shaderID!);

        ShaderUtils.ErrorManagement("shader");

        return ShaderUtils._shaderID!;
    }

     CreateProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader)
    {
        ShaderUtils._programID = this.gl?.createProgram();
        this.gl?.attachShader(ShaderUtils._programID!, vertexShader);
        this.gl?.attachShader(ShaderUtils._programID!, fragmentShader);
        this.gl?.linkProgram(ShaderUtils._programID!);

        //Can delete the shaders since the program has been made.
        this.gl.detachShader(ShaderUtils._programID!,vertexShader); //TODO, detaching might cause issues on some browsers, Might only need to delete.
        this.gl.detachShader(ShaderUtils._programID!,fragmentShader);
        this.gl.deleteShader(fragmentShader);
        this.gl.deleteShader(vertexShader);

        ShaderUtils.ErrorManagement("program");


        return ShaderUtils._programID!;

    }

    private static ErrorManagement(type: "shader" | "program"): null | undefined | void
    {
        let selfGL = GLInstance.Instance().gl!;
        if(type === "shader")
        {
            //Get Error data if shader failed compiling
            if(!selfGL.getShaderParameter(ShaderUtils._shaderID!, selfGL.COMPILE_STATUS)){
                console.error("Error compiling shader : " , selfGL.getShaderInfoLog(ShaderUtils._shaderID!));
                selfGL.deleteShader(ShaderUtils._shaderID!);
                return null;
            }
        }
        else if(type === "program")
        {
            //Check if successful
            if(!selfGL.getProgramParameter(ShaderUtils._programID!, selfGL.LINK_STATUS)){
                console.error("Error creating shader program.",selfGL.getProgramInfoLog(ShaderUtils._programID!));
                selfGL.deleteProgram(ShaderUtils._programID!); return null;
            }

            //Only do this for additional debugging.
            selfGL.validateProgram(ShaderUtils._programID!);
            if(!selfGL.getProgramParameter(ShaderUtils._programID!,selfGL.VALIDATE_STATUS)){
                console.error("Error validating program", selfGL.getProgramInfoLog(ShaderUtils._programID!));
                selfGL.deleteProgram(ShaderUtils._programID!); return null;
            }
        }
    }

    get GetProgramID(){
        return ShaderUtils._programID!;
    }

     SendUniformData( uniformName: string, data: number):boolean
    {
        let ID: WebGLUniformLocation = this.gl.getUniformLocation(ShaderUtils._programID!, uniformName)!;
        if(ID == -1)
        {
            console.log("shader variable "+ uniformName + "not found or not used");
            return false;
        }

        if(typeof data == "number"){
        this.gl?.uniform1f(ID,data);
            return true;
        }
        return false;
    }

}