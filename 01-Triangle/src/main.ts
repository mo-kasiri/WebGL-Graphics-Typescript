import '../public/styles/style.css'
import {GLInstance} from "./Components/GL";
import {ShaderUtils} from "./Components/Shaders";
import {Buffer} from "./Components/Buffer";
import {AnimationLoop} from "./Components/AnimatinLoop";

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


let gl: WebGL2RenderingContext = GLInstance.Instance().gl!;
const triangleData: Float32Array = new Float32Array([0.0,  0.5, 0.0,
                                                              0.5, -0.5, 0.0,
                                                             -0.5, -0.5, 0.0]);
let triangleBuffer: Buffer;
let programID: WebGLProgram;

window.addEventListener("load", ()=>{

    GLInstance.Instance().fSetSize(sizes.width,sizes.height).fClear();

    // ======================
    // Shader part
    // getting shader text
    let vertexShaderText: string = ShaderUtils.Instance().domShader("vertex_shader");
    //console.log(vertexShaderText);
    let fragmentShaderText: string = ShaderUtils.Instance().domShader("fragment_shader");
    // creating vertex and fragment shader
    let vertexShaderID = ShaderUtils.Instance().CreateShader(vertexShaderText, gl.VERTEX_SHADER);
    let fragmentShaderID = ShaderUtils.Instance().CreateShader(fragmentShaderText, gl.FRAGMENT_SHADER);
    // creating program based on shaders
    programID = ShaderUtils.Instance().CreateProgram(vertexShaderID,fragmentShaderID);

    // ===================================
    // Buffer part
    triangleBuffer = new Buffer();
    triangleBuffer.CreateBuffer(3);
    triangleBuffer.FillBuffer("VERTEX_BUFFER", triangleData, gl.STATIC_DRAW);
    triangleBuffer.LinkBuffer("a_position","VERTEX_BUFFER",3,gl.FLOAT);
    // Buffer

    gl?.useProgram(programID);

    let uSize = 0.5;
    let direction = 1;
    let animationLoop = new AnimationLoop(onRender);
    animationLoop.start();

    // ===================================
    // Render Loop
    function onRender(dt: number){

        if(uSize > 1 || uSize < 0)
        {
            direction *= -1;
        }
        uSize += direction*dt;


        ShaderUtils.Instance().SendUniformData("uSize",uSize);

        triangleBuffer.Render(gl.TRIANGLES);
    }
//triangleBuffer.DestroyBuffer();
});

window.addEventListener("resize", ()=>{
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    GLInstance.Instance().fSetSize(sizes.width,sizes.height);
    gl?.useProgram(programID);
    triangleBuffer.Render(gl.TRIANGLES);
    //TODO: set camera aspect radio
})



