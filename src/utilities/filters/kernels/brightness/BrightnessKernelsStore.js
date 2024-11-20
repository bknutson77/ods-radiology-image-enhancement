import { makeAutoObservable } from "mobx";

export default class BrightnessKernelsStore {

  initialize() {
    this.imageWidth = 1000;
    this.imageHeight = 1000;

    this.active = false;
    this.alpha = 1.0;
    this.brightness = 0;
  }

  constructor(rootStore) {
    this.initialize(); // Initialize upon entry into the web-app, once.
    this.rootStore = rootStore; // All stores inherit root store.
    makeAutoObservable(this); // Make all stores auto observable for automatic data binding.
    this.addKernels();
  }

  addKernels() {

    // Define GPU brightnessCorrection function:
    this.brightnessCorrectionKernel = this.rootStore.gpu.createKernel(
        function (inputTexture, alpha, brightness) {

            // Unwind/reverse parameters for clarity:
            let x = this.thread.y;
            let y = this.thread.x;

            // Apply brightness and alpha correction:
            const pixel = inputTexture[x][y];
            let newValue = alpha * pixel[2] + brightness;

            // Snap to 0-255 range:
            if (newValue < 0) {
                newValue = 0;
            }
            if (newValue > 255) {
                newValue = 255;
            }

            // Return:
            return [pixel[0], pixel[1], newValue];
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
    this.brightnessCorrectionKernel.setOutput([this.imageHeight, this.imageWidth]);
  }

  cleanupKernels() {

    // Delete textures:
    if (this.outputTexture) {
      this.convertedImageTexture.delete();
      this.brightnessCorrectedTexture.delete();
      this.outputTexture.delete();
    }

    // Destroy kernels:
    this.brightnessCorrectionKernel.destroy();
  }

  changeDimensions(imageWidth, imageHeight) {
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.resizeKernels();
  }

  toggle(apply) {
    this.active = !this.active;
    if (apply) {
      this.rootStore.orchestrateKernelsStore.applyActiveFilters();
    }
  }

  changeAlpha(alpha, apply) {
    this.alpha = alpha;
    if (apply) {
      this.rootStore.orchestrateKernelsStore.applyActiveFilters();
    }
  }

  changeBrightness(brightness, apply) {
    this.brightness = brightness;
    if (apply) {
      this.rootStore.orchestrateKernelsStore.applyActiveFilters();
    }
  }

  runKernels(inputTexture) {
    this.convertedImageTexture = this.rootStore.colorSpaceKernelsStore.convertRGBToHSLKernel(inputTexture);
    this.brightnessCorrectedTexture = this.brightnessCorrectionKernel(
        this.convertedImageTexture,
        this.alpha,
        this.brightness
    );
    this.outputTexture = this.rootStore.colorSpaceKernelsStore.convertHSLToRGBKernel(this.brightnessCorrectedTexture);
    return this.outputTexture;
  }

}