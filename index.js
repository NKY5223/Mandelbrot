/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

/** @type {{ [palette: string]: (iter: number) => [number, number, number] }} */
const palettes = {
    wikipedia: i => i === -1 ? [0, 0, 0] : [[66,30,15],[25,7,26],[9,1,47],[4,4,73],[0,7,100],[12,44,138],[24,82,177],[57,125,209],[134,181,229],[211,236,248],[241,233,191],[248,201,95],[255,170,0],[204,128,0],[153,87,0],[106,52,3]][i % 16],
    blueYellow: i => i === -1 ? [0, 0, 0] : (i = Math.exp(-i / 20), [255 - 255 * i, 192 - 192 * i, 128 * i])
};

// render vars
let left = -2;
let top = 3;
let right = 2;
let bottom = -2;
let resx = 100;
let resy = 125;
let max_iter = 10;
let palette = palettes.blueYellow;

function render() {
    canvas.width = resx;
    canvas.height = resy;
    let w = right - left;
    let h = bottom - top;
    const data = [];
    for (let y = 0; y < resy; y++) for (let x = 0; x < resx; x++) data.push(...palette(mandelbrot(left + w * x / resx, top + h * y / resy)), 1);
    ctx.putImageData(new ImageData(data, resx, resy), 0, 0);
}
function mandelbrot(cr, ci) {
    let zr = 0;
    let zi = 0;
    for (let i = 0; i < max_iter; i++) {
        [zr, zi] = [zr * zr - zi * zi + cr, 2 * zr * zi + ci];
        if (zr < -2 || zr > 2 || zi < -2 || zi > 2 || zr * zr + zi * zi > 4) return i;
    }
    return -1;
}