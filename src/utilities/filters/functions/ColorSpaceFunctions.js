// COLOR TRANSFORMATIONS:

function RGBToXYZ(r, g, b) {
    // r, g and b (Standard RGB) input range = 0 - 255
    // X, Y and Z output refer to a D65/2° standard illuminant.

    let let_R = r / 255;
    let let_G = g / 255;
    let let_B = b / 255;

    if (let_R > 0.04045) {
        let_R = Math.pow((let_R + 0.055) / 1.055, 2.4);
    } else {
        let_R = let_R / 12.92;
    }
    if (let_G > 0.04045) {
        let_G = Math.pow((let_G + 0.055) / 1.055, 2.4);
    } else {
        let_G = let_G / 12.92;
    }
    if (let_B > 0.04045) {
        let_B = Math.pow((let_B + 0.055) / 1.055, 2.4);
    } else {
        let_B = let_B / 12.92;
    }

    let_R = let_R * 100;
    let_G = let_G * 100;
    let_B = let_B * 100;

    let X = let_R * 0.4124 + let_G * 0.3576 + let_B * 0.1805;
    let Y = let_R * 0.2126 + let_G * 0.7152 + let_B * 0.0722;
    let Z = let_R * 0.0193 + let_G * 0.1192 + let_B * 0.9505;

    return [X, Y, Z];
}
function XYZToRGB(X, Y, Z) {
    // X, Y and Z input refer to a D65/2° standard illuminant.
    // r, g, and b (standard RGB) output range = 0 - 255

    let let_X = X / 100;
    let let_Y = Y / 100;
    let let_Z = Z / 100;

    let let_R = let_X * 3.2406 - let_Y * 1.5372 - let_Z * 0.4986;
    let let_G = -1 * let_X * 0.9689 + let_Y * 1.8758 + let_Z * 0.0415;
    let let_B = let_X * 0.0557 - let_Y * 0.204 + let_Z * 1.057;

    if (let_R > 0.0031308) {
        let_R = 1.055 * Math.pow(let_R, 1 / 2.4) - 0.055;
    } else {
        let_R = 12.92 * let_R;
    }
    if (let_G > 0.0031308) {
        let_G = 1.055 * Math.pow(let_G, 1 / 2.4) - 0.055;
    } else {
        let_G = 12.92 * let_G;
    }
    if (let_B > 0.0031308) {
        let_B = 1.055 * Math.pow(let_B, 1 / 2.4) - 0.055;
    } else {
        let_B = 12.92 * let_B;
    }

    let r = Math.floor(let_R * 255);
    let g = Math.floor(let_G * 255);
    let b = Math.floor(let_B * 255);

    return [r, g, b];
}

function XYZToLAB(X, Y, Z) {
    // X, Y and Z input refer to a D65/2° standard illuminant.
    // L, a and b output with L range 0 - 255

    let let_X = X / 95.047;
    let let_Y = Y / 100.0;
    let let_Z = Z / 108.883;

    if (let_X > 0.008856) {
        let_X = Math.pow(let_X, 1 / 3);
    } else {
        let_X = 7.787 * let_X + 16.0 / 116.0;
    }
    if (let_Y > 0.008856) {
        let_Y = Math.pow(let_Y, 1 / 3);
    } else {
        let_Y = 7.787 * let_Y + 16.0 / 116.0;
    }
    if (let_Z > 0.008856) {
        let_Z = Math.pow(let_Z, 1 / 3);
    } else {
        let_Z = 7.787 * let_Z + 16.0 / 116.0;
    }

    let L = Math.round(2.55 * (116 * let_Y - 16));
    let a = 500 * (let_X - let_Y);
    let b = 200 * (let_Y - let_Z);

    return [L, a, b];
}
function LABToXYZ(L, a, b) {
    // L, a and b input with L range 0 - 255
    // X, Y and Z output refer to a D65/2° standard illuminant.

    let let_Y = (L / 2.55 + 16) / 116;
    let let_X = a / 500 + let_Y;
    let let_Z = let_Y - b / 200;

    let let_X_Cubed = Math.pow(let_X, 3);
    let let_Y_Cubed = Math.pow(let_Y, 3);
    let let_Z_Cubed = Math.pow(let_Z, 3);

    if (let_Y_Cubed > 0.008856) {
        let_Y = let_Y_Cubed;
    } else {
        let_Y = (let_Y - 16.0 / 116.0) / 7.787;
    }
    if (let_X_Cubed > 0.008856) {
        let_X = let_X_Cubed;
    } else {
        let_X = (let_X - 16.0 / 116.0) / 7.787;
    }
    if (let_Z_Cubed > 0.008856) {
        let_Z = let_Z_Cubed;
    } else {
        let_Z = (let_Z - 16.0 / 116.0) / 7.787;
    }

    let X = let_X * 95.047;
    let Y = let_Y * 100.0;
    let Z = let_Z * 108.883;

    return [X, Y, Z];
}

function RGBToHSV(r, g, b) {
    // r, g and b input range 0 - 255
    // h, s and v output with v range 0 - 255

    // Find min:
    let min = r;
    if (g < min) {
        min = g;
    }
    if (b < min) {
        min = b;
    }

    // Find max:
    let max = r;
    if (g > max) {
        max = g;
    }
    if (b > max) {
        max = b;
    }

    // Calculate distance between them:
    let d = max - min;

    // H Channel:
    let h = -1;
    if (max == min) {
        h = 0;
    } else if (max == r) {
        h = g - b + d * (g < b ? 6 : 0);
        h /= 6 * d;
    } else if (max == g) {
        h = b - r + d * 2;
        h /= 6 * d;
    } else {
        h = r - g + d * 4;
        h /= 6 * d;
    }

    // S Channel:
    let s = max === 0 ? 0 : d / max;

    // V Channel:
    let v = Math.round(max);

    return [h, s, v];
}
function HSVToRGB(h, s, v) {
    // h, s and v input with v range 0 - 255
    // r, g and b output range 0 - 255

    v = v / 255.0;

    let i = Math.floor(h * 6);
    let l = i % 6;
    let f = h * 6 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);

    let r = 0;
    let g = 0;
    let b = 0;

    if (l == 0) {
        r = v;
        g = t;
        b = p;
    } else if (l == 1) {
        r = q;
        g = v;
        b = p;
    } else if (l == 2) {
        r = p;
        g = v;
        b = t;
    } else if (l == 3) {
        r = p;
        g = q;
        b = v;
    } else if (l == 4) {
        r = t;
        g = p;
        b = v;
    } else {
        r = v;
        g = p;
        b = q;
    }

    r *= 255.0;
    g *= 255.0;
    b *= 255.0;
    r = Math.round(r);
    g = Math.round(g);
    b = Math.round(b);

    return [r, g, b];
}

function RGBToHSL(r, g, b) {
    // r, g and b input with range 0 - 255
    // h, s and l output with l range 0 - 255

    r = r / 255.0;
    g = g / 255.0;
    b = b / 255.0;

    // Find min:
    let min = r;
    if (g < min) {
        min = g;
    }
    if (b < min) {
        min = b;
    }

    // Find max:
    let max = r;
    if (g > max) {
        max = g;
    }
    if (b > max) {
        max = b;
    }

    // Calculate distance between them:
    let d = max - min;

    // Find h:
    let h = 0;
    if (d == 0) {
        h = 0;
    } else if (max == r) {
        h = ((g - b) / d) % 6;
    } else if (max == g) {
        h = (b - r) / d + 2;
    } else {
        h = (r - g) / d + 4;
    }

    // Find l:
    let l = 0;
    l = (max + min) / 2;

    // Find s:
    let s = 0;
    if (d == 0) {
        s = 0;
    } else {
        s = d / (1 - Math.abs(2 * l - 1));
    }

    // Normalize and adjust cycle if necessary:
    h *= 60;
    if (h < 0) {
        h += 360;
    }
    s *= 100;
    l = Math.round(l * 255);

    // Return:
    return [h, s, l];
}
function HSLToRGB(h, s, l) {
    // h, s and l input with l range 0 - 255
    // r, g and b output range 0 - 255

    let hh = h / 60.0;
    s = s / 100.0;
    l = l / 255.0;

    let r = 0;
    let g = 0;
    let b = 0;

    let C = (1 - Math.abs(2 * l - 1)) * s;
    let X = C * (1 - Math.abs((hh % 2) - 1));

    if (hh >= 0 && hh < 1) {
        r = C;
        g = X;
    } else if (hh >= 1 && hh < 2) {
        r = X;
        g = C;
    } else if (hh >= 2 && hh < 3) {
        g = C;
        b = X;
    } else if (hh >= 3 && hh < 4) {
        g = X;
        b = C;
    } else if (hh >= 4 && hh < 5) {
        r = X;
        b = C;
    } else {
        r = C;
        b = X;
    }

    let m = l - C / 2;
    r += m;
    g += m;
    b += m;

    r *= 255.0;
    g *= 255.0;
    b *= 255.0;
    r = Math.round(r);
    g = Math.round(g);
    b = Math.round(b);

    return [r, g, b];
}

export { RGBToXYZ, XYZToRGB, XYZToLAB, LABToXYZ, RGBToHSV, HSVToRGB, RGBToHSL, HSLToRGB };