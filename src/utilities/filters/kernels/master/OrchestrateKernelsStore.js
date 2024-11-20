import { makeAutoObservable } from "mobx";

export default class OrchestrateKernelsStore {

  initialize() {
    this.workingTexture = null;
    this.filterKernels = [
      'windowKernelsStore',
      'gammaKernelsStore',
      'colorInversionKernelsStore',
      'brightnessKernelsStore'
    ]
  }

  constructor(rootStore) {
    this.initialize(); // Initialize upon entry into the web-app, once.
    this.rootStore = rootStore; // All stores inherit root store.
    makeAutoObservable(this); // Make all stores auto observable for automatic data binding.
  }

  transition(destCanvas) {

    // Clear and Re-initialize:
    if (this.workingTexture) {

      // Clear:
      this.cleanup();
      this.rootStore.colorSpaceKernelsStore.cleanupKernels();
      this.rootStore.displayKernelsStore.cleanupKernels();

      this.filterKernels.forEach(filterKernel => {
        this.rootStore[filterKernel].cleanupKernels();
      });

      // Re-initialize:
      this.rootStore.colorSpaceKernelsStore.addKernels();
      this.rootStore.displayKernelsStore.addKernels();

      this.filterKernels.forEach(filterKernel => {
        this.rootStore[filterKernel].addKernels();
      });
    }

    // Update canvases and dimensions in all kernel stores:
    this.rootStore.displayKernelsStore.changeCanvases(destCanvas);
    this.rootStore.displayKernelsStore.changeDimensions(destCanvas.width, destCanvas.height);
    this.rootStore.colorSpaceKernelsStore.changeDimensions(destCanvas.width, destCanvas.height);

    this.filterKernels.forEach(filterKernel => {
      this.rootStore[filterKernel].changeDimensions(destCanvas.width, destCanvas.height);
    });
  }

  applyActiveFilters() {

    this.filterKernels.forEach(filterKernel => {
      if (this.rootStore[filterKernel].active) {
        this.workingTexture = this.rootStore[filterKernel].runKernels(this.workingTexture);
      }
    });

    this.rootStore.displayKernelsStore.renderDestImagePixels(this.workingTexture);
  }

  cleanup() {
    this.workingTexture.delete();
  }

}