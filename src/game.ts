type Config = {
    updateInterval: number,
};

export class Game {
    private ctx: CanvasRenderingContext2D;
    private config: Config;
    private rectWidth: number = 0;
    private rectWidthInc: number = 0.1;

    public constructor(ctx: CanvasRenderingContext2D, config: Config) {
        this.ctx = ctx;
        this.config = config;
    }

    private updateCanvasSize() {
        this.ctx.canvas.width = this.ctx.canvas.clientWidth;
        this.ctx.canvas.height = this.ctx.canvas.clientHeight;
    }

    private clearScreen() {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    public start() {
        setInterval(() => {
            this.update()
        }, this.config.updateInterval);
    }

    public update() {
        this.updateCanvasSize();

        

        const nextRectWidth = this.rectWidth + this.rectWidthInc * this.config.updateInterval;
        if (nextRectWidth > 100) {
            this.rectWidthInc = -0.1;
        }
        if (nextRectWidth < 0) {
            this.rectWidthInc = 0.1;
        }
        this.rectWidth += this.rectWidthInc * this.config.updateInterval;
    }
}