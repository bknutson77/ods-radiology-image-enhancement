import { makeAutoObservable } from "mobx";

export default class DisplayKernelsStore {

  initialize() {

    this.destCanvas = null;
    this.destContext = null;

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

    // Define GPU render function:
    this.renderKernel = this.rootStore.gpu.createKernel(
        function (outputTexture) {
            // Note - reverse x and y for display:
            const pixel = outputTexture[this.thread.x][this.thread.y];
            this.color(pixel[0], pixel[1], pixel[2], 1);
        },
        {
            output: [this.imageWidth, this.imageHeight],
            graphical: true,
            dynamicOutput: true,
            dynamicArguments: true
        }
    );
  }

  resizeKernels() {
    this.renderKernel.setOutput([this.imageWidth, this.imageHeight]);
  }

  cleanupKernels() {

    // Destroy kernels:
    this.renderKernel.destroy();
  }

  changeDimensions(imageWidth, imageHeight) {
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.resizeKernels();
  }

  changeCanvases(destCanvas) {
    this.destCanvas = destCanvas;
    this.destContext = this.destCanvas.getContext('2d');
  }

  renderDestImagePixels(destTexture) {
    this.renderKernel(destTexture);
    this.destContext.drawImage(
      this.renderKernel.canvas,
      0,
      this.renderKernel.canvas.height - this.imageHeight,
      this.imageWidth,
      this.imageHeight,
      0,
      0,
      this.imageWidth,
      this.imageHeight
    );
  }

}