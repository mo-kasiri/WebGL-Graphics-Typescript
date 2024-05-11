import '../public/styles/style.css'
import {GLInstance} from "./Components/GL";
import {ShaderUtils} from "./Components/Shaders";
import {Buffer} from "./Components/Buffer";
import {AnimationLoop} from "./Components/AnimatinLoop";
import {GridLines} from "./Components/primitives/gridLines";

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


let gl: WebGL2RenderingContext = GLInstance.Instance().gl!;
const triangleData: Float32Array = new Float32Array([0.0,  0.5, 0.0,
                                                              0.5, -0.5, 0.0,
                                                             -0.5, -0.5, 0.0]);
let triangleBuffer: Buffer;
let meshBuffer: Buffer;
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
    // ===================================Buffer Part
    // Mesh
    meshBuffer = new Buffer();
    let meshData =new Float32Array(GridLines.CreateMesh(10,10))
    console.log(meshData);
    meshBuffer.CreateBuffer(meshData.length/3);
    meshBuffer.FillBuffer("VERTEX_BUFFER", meshData, gl.STATIC_DRAW);
    meshBuffer.LinkBuffer("a_position", "VERTEX_BUFFER",3, gl.FLOAT);

    //==================================== Buffer Part

    gl?.useProgram(programID);

    let animationLoop = new AnimationLoop(onRender);
    animationLoop.start();

    // ===================================
    // Render Loop
    function onRender(dt: number){
        meshBuffer.Render(gl.POINTS);
    }

});

window.addEventListener("resize", ()=>{
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    GLInstance.Instance().fSetSize(sizes.width,sizes.height);
    gl?.useProgram(programID);
    triangleBuffer.Render(gl.TRIANGLES);
    //TODO: set camera aspect radio
});





