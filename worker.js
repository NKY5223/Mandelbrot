self.addEventListener("message", e => {
    const { width, height, cenX, cenY, camX, camY, scale, n, max_iter } = e.data;
    const interlaceArr = [0, 4, 2, 6, 1, 5, 3, 7];
    for (let interlace of interlaceArr) {
        for (let y = interlace; y < height; y += interlaceArr.length) {
            for (let x = 0; x < width; x++) {
                let e = isMandelbrot(
                    new Complex(
                        (x - cenX) / scale + camX,
                        (y - cenY) / scale + camY
                    ),
                    n,
                    max_iter
                );
                postMessage({ x: x, y: y, col: e });
            }
        }
    }
});
function isMandelbrot(c, n, max_iter) {
    let z = new Complex();

    let i = 0;
    while (++i < max_iter) {
        z = z.pow(n).add(c);

        if (z.len2 > 4) {
            return i - 2;
        }
    }
    return true;
}

class Complex {
    constructor(real = 0, imag = 0) {
        this.REAL = real;
        this.IMAG = imag;
    }
    add(comp = new Complex()) {
        return new Complex(comp.REAL + this.REAL, comp.IMAG + this.IMAG);
    }
    mult(comp = new Complex()) {
        if (typeof comp === "number") comp = new Complex(comp, 0);
        return new Complex(comp.REAL * this.REAL - comp.IMAG * this.IMAG, comp.REAL * this.IMAG + comp.IMAG * this.REAL);
    }
    /**
     * @returns {Complex} 
     */
    pow(n = 2) {
        return n ? this.pow(n - 1).mult(this) : new Complex(1, 0);
    }
    get len2() {
        return this.REAL * this.REAL + this.IMAG * this.IMAG;
    }
}