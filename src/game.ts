type Config = {
    updateInterval: number;
    framePerSec: number;
};

// @ts-ignore
enum states {
    Idle,
    Moving,
    Resting,
    Died,
    WantFood,
    Eating
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
    private hunger: number = 5;
    private social: number = 5;
    private bodyPos: number;
    private targetPos: number;
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


//constructor
    public constructor(ctx: CanvasRenderingContext2D, config: { updateInterval: number; framePerSec: number}) {
        this.ctx = ctx;
        this.config = config;
        this.midH = this.ctx.canvas.clientHeight/2;
        this.midW = this.ctx.canvas.clientWidth/2;
        this.bodyPos = this.midW;
        this.targetPos = this.bodyPos;
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
        if (this.counter.count * this.config.framePerSec / 1000 % 4 == 0) {
            if (this.counter.eye_count == 0) {
                this.counter.eye_count = 1;
            } else {
                this.counter.eye_count = 0;
            }
        }


        this.updateCanvasSize();

        //assets display
        let eating_time = 0;
        let ind: number = 0;
        const pet = new Image();
        if (this.state == states.Idle) {
            pet.src = this.body[this.counter.body_count];
            if (this.foods.length != 0) {
                this.state = states.WantFood;
                ind = this.getFoodPos(this.foods, this.bodyPos);
                this.targetPos = this.foods[ind].x
            }
        } else if (this.state == states.WantFood) {
            if (Math.abs(this.targetPos - this.bodyPos) <= 0.5 * this.config.updateInterval) {
                this.bodyPos = this.targetPos;
            }

             if (this.targetPos > this.bodyPos) {
                 this.bodyPos += 0.3 * this.config.updateInterval
             } else if (this.targetPos < this.bodyPos) {
                 this.bodyPos -= 0.3 * this.config.updateInterval
             } else {
                 if (this.hunger != 0) {
                     this.hunger -= 1
                 }

                 this.foods.splice(ind, 1);
                 this.state = states.Eating
             }
            eating_time = this.counter.count + this.config.framePerSec * 2;
            pet.src = this.body[this.counter.body_count];
        } else if (this.state == states.Eating) {
            if (this.counter.count > eating_time) {
                this.state = states.Idle
            }
        }
        this.ctx.drawImage(pet, this.bodyPos, this.midH);

        const eye = new Image();
        eye.src = this.eye[this.counter.eye_count];
        this.ctx.drawImage(eye, this.bodyPos, this.midH)

        const mouth = new Image();
        mouth.src = "src/assets/mouthNeutral_Normal@2x.png";
        this.ctx.drawImage(mouth, this.bodyPos, this.midH)

        const food = new Image();
        food.src = "src/assets/food_Normal@2x.png";

        //text display
        this.ctx.letterSpacing = `${this.midW * 2 * 0.001}px`
        this.ctx.fillStyle = "white"
        this.ctx.font = `${this.midW * 2 * 0.008}px 'Varela Round'`;
        this.ctx.fillText(`Health: ${this.health}    Hunger: ${this.hunger}    Social: ${this.social}`, this.midW * 2 * 0.8, this.midH * 2 * 0.92);

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

    private getFoodPos(foods, petPos: number) {
        let ind = 0;
        let min = Math.abs(foods[0].x - petPos)
        for (let i = 0; i < foods.length; i++) {
            if (Math.abs(foods[i].x - petPos) < min) {
                ind = i;
            }
        }

        return ind

    }

    private onClick(x: number, y: number, hNum: number) {
        if (y < hNum) {
            this.foods.push({x: x, y: y, acc: 1});
        }
    }

}