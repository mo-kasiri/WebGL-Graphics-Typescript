import {GLInstance} from "../GL"
export class GridLines{
    readonly gl: WebGL2RenderingContext = GLInstance.Instance().gl!;
    private static size: number = 0.8;
    private static vertices: number[] = [];
    private static scaledVertices: number[] = [];
    static CreateMesh(YaxisDevision: number, XaxisDevision: number){
        //let ratio = YaxisDevision/XaxisDevision;
        let ratioX = 2/(YaxisDevision);
        let ratioY = 2/(XaxisDevision);
        let y = 1.0;
        let j = 0;

        let totalNumberOfVerts = (YaxisDevision + 1) * (XaxisDevision + 1);

        for(let i=0; i < totalNumberOfVerts; i++) // yaxis
        {
            if(j * ratioX > 2.0)
            {
                //console.log("inside if");
                y -= ratioY;
                j = 0;
            }
            this.vertices.push(-1.0 + j * ratioX); // X position
            this.vertices.push(y);
            this.vertices.push(0.0);
            j++;
            //console.log(y);
        }

        //console.log(this.vertices);
        //console.log(this.vertices.length)
        this.vertices.map((e)=>{this.scaledVertices.push(e*this.size)});
        return this.vertices;
    }
}