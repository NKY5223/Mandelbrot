/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

/** @type {{ [palette: string]: (iter: number) => [number, number, number] }} */
const palettes = {
    wikipedia: i => i === -1 ? [0, 0, 0] : [[66,30,15],[25,7,26],[9,1,47],[4,4,73],[0,7,100],[12,44,138],[24,82,177],[57,125,209],[134,181,229],[211,236,248],[241,233,191],[248,201,95],[255,170,0],[204,128,0],[153,87,0],[106,52,3]][i % 16],
    blueYellow: i => i === -1 ? [0, 0, 0] : (i = Math.exp(-i / 20), [255 - 255 * i, 192 - 192 * i, 128 * i])
};

const settings = {
    left: -2,
    top: 3,
    right: 2,
    bottom: -2,
    resx: 100,
    resy: 125,
    max_iter: 10,
    palette: palettes.blueYellow,
};

function render() {
    canvas.width = settings.resx;
    canvas.height = settings.resy;
    let w = settings.right - settings.left;
    let h = settings.bottom - settings.top;
    const data = [];
    for (let y = 0; y < settings.resy; y++) for (let x = 0; x < settings.resx; x++) data.push(...settings.palette(mandelbrot(settings.left + w * x / settings.resx, settings.top + h * y / settings.resy)), 1);
    ctx.putImageData(new ImageData(data, settings.resx, settings.resy), 0, 0);
}
function mandelbrot(cr, ci) {
    let zr = 0;
    let zi = 0;
    for (let i = 0; i < settings.max_iter; i++) {
        [zr, zi] = [zr * zr - zi * zi + cr, 2 * zr * zi + ci];
        if (zr < -2 || zr > 2 || zi < -2 || zi > 2 || zr * zr + zi * zi > 4) return i;
    }
    return -1;
}
