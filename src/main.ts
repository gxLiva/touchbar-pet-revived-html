import {match, P} from "ts-pattern";
import "./styles.css";
import {Game} from "./game.ts";

window.addEventListener("load", () => {
    const canvas = match(document.getElementById("canvas"))
        .with(P.instanceOf(HTMLCanvasElement), it => it)
        .otherwise(() => null);
    if (canvas === null) {
        throw new Error("Canvas not found!");
    }

    const ctx = canvas.getContext("2d");
    if (ctx === null) {
        throw new Error("Failed to retrieve canvas context!");
    }

    const game = new Game(ctx,{
        updateInterval: 1000 / 60
    });

    game.start();
});