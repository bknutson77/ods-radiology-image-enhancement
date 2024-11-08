import { makeAutoObservable } from "mobx";


export default class ColorInversionKernelsStore{

  initialize() {
    this.imageWidth = 1000;
    this.imageHeight = 1000;

    this.active = false;

  }

  constructor(rootStore) {
    this.initialize(); // Initialize upon entry into the web-app, once.
    this.rootStore = rootStore; // All stores inherit root store.
    makeAutoObservable(this); // Make all stores auto observable for automatic data binding.
    this.addKernels();
  }

  addKernels() {

    // Define GPU  function:
    this.colorInversionKernel = this.rootStore.gpu.createKernel(
        function (inputTexture) {

            // Unwind/reverse parameters for clarity:
            let x = this.thread.y;
            let y = this.thread.x;

            // Apply colorinversion:
            const pixel = inputTexture[x][y];
            let newValue = 255 - oldValue;

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
    this.colorInversionKernel.setOutput([this.imageHeight, this.imageWidth]);
  }

  cleanupKernels() {

    // Delete textures:
    if (this.outputTexture) {
      this.convertedImageTexture.delete();
      this.colorInvertedTexture.delete();
      this.outputTexture.delete();
    }

    // Destroy kernels:
    this.colorInversionKernel.destroy();
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

  runKernels(inputTexture) {
    this.convertedImageTexture = this.rootStore.colorSpaceKernelsStore.convertRGBToHSLKernel(inputTexture);
    this.colorInvertedTexture = this.colorInversionKernel(
        this.convertedImageTexture
    )
    this.outputTexture = this.rootStore.colorSpaceKernelsStore.convertHSLToRGBKernel(this.colorInvertedTexture);
    return this.outputTexture;
  }

}