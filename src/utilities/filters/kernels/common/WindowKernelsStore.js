import { makeAutoObservable } from "mobx";
import { RGBToXYZ, XYZToRGB, XYZToLAB, LABToXYZ, RGBToHSV, HSVToRGB, RGBToHSL, HSLToRGB } from "../../functions/ColorSpaceFunctions";

export default class ColorSpaceKernelsStore {

  initialize() {
    this.imageWidth = 100;
    this.imageHeight = 100;

    this.active = true;
    this.pixels = [];
    this.channels = 1;
    this.windowCenter = 128;
    this.windowWidth = 256;
  }

  constructor(rootStore) {
    this.initialize(); // Initialize upon entry into the web-app, once.
    this.rootStore = rootStore; // All stores inherit root store.
    makeAutoObservable(this); // Make all stores auto observable for automatic data binding.
    this.addKernels();
  }

  addKernels() {

    // Define GPU windowKernel function:
    this.windowKernel = this.rootStore.gpu.createKernel(
        function (pixels, channels, imageWidth, imageHeight, windowCenter, windowWidth) {

            let x = this.thread.y;
            let y = this.thread.x;

            // Handle DICOM:
            if (channels == 1) {

              let val = pixels[(imageWidth * imageHeight - 1) - (y * imageWidth - x)];
              let min = Math.floor(windowCenter - (windowWidth / 2.0));
              let max = Math.floor(windowCenter + (windowWidth / 2.0));
              let newVal = (val - min) / (max - min);

              if (newVal < 0) {
                  newVal = 0;
              }
              if (newVal > 1) {
                  newVal = 1;
              }

              return[newVal, newVal, newVal];
            }

            // Handle PNG/JPG/JPEG:
            if (channels == 3) {

              let i = 4 * ((imageWidth * imageHeight - 1) - (y * imageWidth - x));
              let r = pixels[i + 0];
              let g = pixels[i + 1];
              let b = pixels[i + 2];

              let hsl = RGBToHSL(r, g, b);
              let val = hsl[2];

              let min = Math.floor(windowCenter - (windowWidth / 2.0));
              let max = Math.floor(windowCenter + (windowWidth / 2.0));
              let newVal = (val - min) / (max - min);

              if (newVal < 0) {
                  newVal = 0;
              }
              if (newVal > 1) {
                  newVal = 1;
              }

              let rgb = HSLToRGB(hsl[0], hsl[1], newVal * 255);
              return [rgb[0] / 255.0, rgb[1] / 255.0, rgb[2] / 255.0];
            }
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
    this.windowKernel.setOutput([this.imageHeight, this.imageWidth]);
  }

  cleanupKernels() {

    // Destroy kernels:
    this.windowKernel.destroy();
  }

  changeDimensions(imageWidth, imageHeight) {
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.resizeKernels();
  }

  changePixels(pixels, apply) {
    this.pixels = pixels;
    if (apply) {
      this.rootStore.orchestrateKernelsStore.applyActiveFilters();
    }
  }

  changeChannels(channels, apply) {
    this.channels = channels;
    if (apply) {
      this.rootStore.orchestrateKernelsStore.applyActiveFilters();
    }
  }

  changeWindowCenter(windowCenter, apply) {
    this.windowCenter = windowCenter;
    if (apply) {
      this.rootStore.orchestrateKernelsStore.applyActiveFilters();
    }
  }

  changeWindowWidth(windowWidth, apply) {
    this.windowWidth = windowWidth;
    if (apply) {
      this.rootStore.orchestrateKernelsStore.applyActiveFilters();
    }
  }

  runKernels(inputTexture) {
    this.outputTexture = this.windowKernel(
      this.pixels,
      this.channels,
      this.imageWidth, 
      this.imageHeight, 
      this.windowCenter, 
      this.windowWidth
    );
    return this.outputTexture;
  }

}