import {match, P} from "ts-pattern";
import "./styles.css";

window.addEventListener("load", () => {
    const canvas = match(document.getElementById("canvas"))
        .with(P.instanceOf(HTMLCanvasElement), it => it)
        .otherwise(() => null);

    if (canvas === null) {
        throw new Error("Canvas not found!");
    }
});