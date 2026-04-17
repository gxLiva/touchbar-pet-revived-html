type Config = {
    updateInterval: number,
};

enum states {
    Idle,
    Moving,
    Resting,
    Died
}

export class Game {
    private ctx: CanvasRenderingContext2D;
    private config: Config;
    private rectWidth: number = 0;
    private rectWidthInc: number = 0.1;
    private state = states.Idle;
    private midH: number;
    private midW: number;
    private health: number = 10;
    private hunger: number = 0;
    private foods: {
        x: number,
        y: number
        acc: number;
    }[] = [];
    private counter = {
        count: 0,
        eye_count: 0,
        body_count: 0,
        mouse_count: 0
    }
    private eye: string[] = [
        "src/assets/eyesOpen_Normal@2x.png",
        "src/assets/eyesClosed_Normal@2x.png",
        "src/assets/eyesDead_Normal@2x.png"
    ]
    private body: string[] = [
        "src/assets/layDownAdult4_Normal@2x.png",
        "src/assets/layDownAdult3_Normal@2x.png",
        "src/assets/layDownAdult2_Normal@2x.png",
        "src/assets/layDownAdult1_Normal@2x.png",
        "src/assets/adultWalk1_Normal@2x.png",
        "src/assets/adultWalk2_Normal@2x.png",
        "adultWalk3_Normal@2x.png",
        "adultWalk4_Normal@2x.png"
    ]

    public constructor(ctx: CanvasRenderingContext2D, config: Config) {
        this.ctx = ctx;
        this.config = config;
        this.midH = this.ctx.canvas.clientHeight/2;
        this.midW = this.ctx.canvas.clientWidth/2;
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
        this.ctx.canvas.addEventListener("click", (event) => {
            this.onClick(event.offsetX, event.offsetY, this.midH + 30);
        });

        setInterval(() => {
            this.update();
        }, this.config.updateInterval);
    }

    public update() {
        this.counter.count += 1;
        if (this.counter.count % 180 == 0) {
            if (this.counter.eye_count == 0) {
                this.counter.eye_count = 1;
            } else {
                this.counter.eye_count = 0;
            }
        }


        this.updateCanvasSize();

        //assets display
        const pet = new Image();
        if (this.state == states.Idle) {
            pet.src = this.body[this.counter.body_count];
        }
        this.ctx.drawImage(pet, this.midW, this.midH);

        const eye = new Image();
        eye.src = this.eye[this.counter.eye_count];
        this.ctx.drawImage(eye, this.midW, this.midH)

        const mouth = new Image();
        mouth.src = "src/assets/mouthNeutral_Normal@2x.png";
        this.ctx.drawImage(mouth, this.midW, this.midH)

        const food = new Image();
        food.src = "src/assets/food_Normal@2x.png";

        //text display
        this.ctx.letterSpacing = `${this.midW * 2 * 0.001}px`
        this.ctx.fillStyle = "white"
        this.ctx.font = `${this.midW * 2 * 0.009}px 'Varela Round'`;
        this.ctx.fillText(`Health: ${this.health}    Hunger: ${this.hunger}`, this.midW * 2 * 0.85, this.midH * 2 * 0.92);

        //food positions
        for (let i = 0; i < this.foods.length; i++) {
            this.ctx.drawImage(food, this.foods[i].x, this.foods[i].y);
            if (this.foods[i].y < this.midH + 30) {
                this.foods[i].acc += 0.22
                this.foods[i].y += 0.1 * this.config.updateInterval * this.foods[i].acc;
                if (this.foods[i].y > this.midH + 30) {
                    this.foods[i].y = this.midH + 30;
                }
            }
        }



        /*
        this.ctx.fillStyle = "green";

        this.ctx.fillRect(10, 10, this.rectWidth, 100);

        const nextRectWidth = this.rectWidth + this.rectWidthInc * this.config.updateInterval;
        if (nextRectWidth > 100) {
            this.rectWidthInc = -0.1;
        }
        if (nextRectWidth < 0) {
            this.rectWidthInc = 0.1;
        }
        this.rectWidth += this.rectWidthInc * this.config.updateInterval;

         */
    }

    private onClick(x: number, y: number, hNum: number) {
        if (y < hNum) {
            this.foods.push({x: x, y: y, acc: 1});
        }
    }

}