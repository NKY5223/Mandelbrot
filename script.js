/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const SearchParams = new URLSearchParams(location.search);


// Minibrot: scale 11811.06559786763 camX -1.75488
const unit = parseFloat(SearchParams.get("unit")) || 200;
const scale = parseFloat(SearchParams.get("scale")) || 200;
const camX = parseFloat(SearchParams.get("camX")) || 0;
const camY = parseFloat(SearchParams.get("camY")) || 0;
const max_iter = parseFloat(SearchParams.get("maxIter")) || 1000;
const n = parseFloat(SearchParams.get("n")) || 2;
let palette = null;
if (SearchParams.has("palette"))
    if (SearchParams.get("palette").toLowerCase() === "wikipedia") palette = ["#421e0f", "#19071a", "#09012f", "#040449", "#000764", "#0c2c8a", "#1852b1", "#397dd1", "#86b5e5", "#d3ecf8", "#f1e9bf", "#f8c95f", "#ffaa00", "#cc8000", "#995700", "#6a3403"];
    else if (SearchParams.get("palette").toLowerCase() === "rainbow") palette = "rainbow";
    else if (SearchParams.get("palette").split(",").length) palette = SearchParams.get("palette").split(",");

canvas.width = 4 * unit;
canvas.height = 4 * unit;
let cenX = canvas.width / 2;
let cenY = canvas.height / 2;

const worker = new Worker("worker.js");
worker.addEventListener("message", e => {
    let { x, y, col } = e.data;
    x = parseInt(x);
    y = parseInt(y);
    if (col === true) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(x, y, 1, 1);
    } else if (col !== -1) {
        ctx.fillStyle =
            palette === null
                ? `rgb(${255 - 255 * Math.exp(-col / 20)}, ${192 - 192 * Math.exp(-col / 20)}, ${128 * Math.exp(-col / 20)})`
                : palette === "rainbow"
                    ? `hsl(${col * 10}, 100%, 50%)`
                    : palette[(col + 1) % palette.length];
        ctx.fillRect(x, y, 1, 1);
    }
});
worker.postMessage({
    width: canvas.width,
    height: canvas.height,
    cenX: cenX,
    cenY: cenY,
    camX: camX,
    camY: camY,
    scale: scale,
    n: n,
    max_iter: max_iter
});