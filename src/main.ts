import '../public/styles/style.css'
import {GLInstance} from "./Components/GL";
import {ShaderUtils} from "./Components/Shaders";
import {Buffer} from "./Components/Buffer";

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

let glInstance: GLInstance;
let gl!: WebGL2RenderingContext;

const triangleData: Float32Array = new Float32Array([0.0,   0.5, 0.0,
    0.5,  -0.5, 0.0,
    -0.5, -0.5, 0.0]);
let triangleBuffer: Buffer;

window.addEventListener("load", ()=>{
    //............................................
    //Get our extended GL Context Object
    glInstance = new GLInstance("glCanvas");
    if(glInstance.gl != null)
        gl = glInstance.gl;
    glInstance.fSetSize(sizes.width,sizes.height).fClear();

    //............................................
    //SHADER STEPS
    // 1. Get Vertex and Fragment Shader Text
    let vertexShaderText: string = ShaderUtils.domShader("vertex_shader");
    let fragmentShaderText: string = ShaderUtils.domShader("fragment_shader");
    // 2. Compile text and validate
    let vertexShaderID = ShaderUtils.CreateShader(gl,vertexShaderText,gl.VERTEX_SHADER);
    let fragmentShaderID = ShaderUtils.CreateShader(gl,fragmentShaderText,gl.FRAGMENT_SHADER);
    // 3. Link the shaders together as a program.
    let shaderID = ShaderUtils.CreateProgram(gl,vertexShaderID,fragmentShaderID);

    // 4. Get Location of Uniforms and Attributes.
    gl?.useProgram(shaderID);
    let aPositionLocation = gl?.getAttribLocation(shaderID,"a_position");
    let uPointSizeLocation = gl?.getUniformLocation(shaderID, "uPointSize");
    gl?.useProgram(null);

    //............................................
    //Set Up For Drawing
    gl?.useProgram(shaderID);				//Activate the Shader
    gl?.uniform1f(uPointSizeLocation!,50.0);		//Store data to the shader's uniform variable uPointSize

    triangleBuffer = new Buffer(triangleData, gl);
    triangleBuffer.bind();
    gl.enableVertexAttribArray(aPositionLocation);					// Enable the position attribute in the shader
    gl.vertexAttribPointer(aPositionLocation,3,gl.FLOAT,false,0,0);	// Set which buffer the attribute will pull its data from
    triangleBuffer.unbind();
    triangleBuffer.draw(gl.TRIANGLES,0,3);                        // Draw the Triangle
});

window.addEventListener("resize", ()=>{
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    glInstance.fSetSize(sizes.width,sizes.height);
    triangleBuffer.draw(gl.TRIANGLES,0,3);
    //TODO: set camera aspect radio
})

