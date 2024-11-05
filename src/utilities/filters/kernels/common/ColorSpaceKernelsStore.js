import { makeAutoObservable } from "mobx";

export default class ColorSpaceKernelsStore {

  initialize() {
    this.imageWidth = 100;
    this.imageHeight = 100;
  }

  constructor(rootStore) {
    this.initialize(); // Initialize upon entry into the web-app, once.
    this.rootStore = rootStore; // All stores inherit root store.
    makeAutoObservable(this); // Make all stores auto observable for automatic data binding.
    this.addKernels();
  }

  addKernels() {

    //-- NOTE - These are different input/output than functions, to-do.

    // Define GPU convertRGBToHSL function:
    this.convertRGBToHSLKernel = this.rootStore.gpu.createKernel(
        function (imagePixelsTexture) {

            // Unwind/reverse parameters for clarity:
            let x = this.thread.y;
            let y = this.thread.x;

            // Get pixel (get the r, g and b in range 0 - 1):
            const pixel = imagePixelsTexture[x][y];
            let r = pixel[0];
            let g = pixel[1];
            let b = pixel[2];

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

            // Return (range 0 - 255):
            return [h, s, l];
        },
        {
            output: [this.imageHeight, this.imageWidth],
            pipeline: true,
            dynamicOutput: true,
            dynamicArguments: true,
            precision: 'single',
            tactic: 'precision'
        }
    );

    // Define GPU convertHSLToRGB function:
    this.convertHSLToRGBKernel = this.rootStore.gpu.createKernel(
        function (equalizedChannelImageTexture) {

            // Unwind/reverse parameters for clarity:
            let x = this.thread.y;
            let y = this.thread.x;

            // Get pixel (range 0 - 255):
            const pixel = equalizedChannelImageTexture[x][y];
            let h = pixel[0];
            let s = pixel[1];
            let l = pixel[2];

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

            // Return (range 0 - 1):
            return [r, g, b];
        },
        {
            output: [this.imageHeight, this.imageWidth],
            pipeline: true,
            dynamicOutput: true,
            dynamicArguments: true,
            precision: 'single',
            tactic: 'precision'
        }
    );
  }

  resizeKernels() {
    this.convertRGBToHSLKernel.setOutput([this.imageHeight, this.imageWidth]);
    this.convertHSLToRGBKernel.setOutput([this.imageHeight, this.imageWidth]);
  }

  cleanupKernels() {

    // Destroy kernels:
    this.convertRGBToHSLKernel.destroy();
    this.convertHSLToRGBKernel.destroy();
  }

  changeDimensions(imageWidth, imageHeight) {
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.resizeKernels();
  }

}