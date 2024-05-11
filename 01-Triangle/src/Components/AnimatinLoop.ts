/* singleton */

export class AnimationLoop{

    private fpsElement: HTMLElement = <HTMLElement>document.getElementById("frame-rate");

    private isActive: boolean = false;
    private request: number = 0;
    private msLastFrame: number = 0;
    private msCurrent: number = 0;
    private fps: number = 0;
    public delta: number = 0;


    private callback: (delta: number) => void;
    constructor(clb: (delta:number) => void) {
        this.callback = clb;
    }


    run(){
        this.msCurrent = performance.now();
        this.delta = (this.msCurrent - this.msLastFrame) / 1000;
        this.callback(this.delta);
        this.msLastFrame = performance.now();


        this.fps = Math.floor(1/this.delta);
        this.fpsElement.innerText = "Frame Rate: " + this.fps.toString();
        //console.log(this.delta);

        if(this.isActive){
            this.request = requestAnimationFrame(this.run.bind(this));
        }
    }

    start()
    {
        this.isActive = true;
        this.run();
    }

    stop()
    {
        this.isActive = false;
        cancelAnimationFrame(this.request);
    }
}