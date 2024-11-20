import { makeAutoObservable, toJS } from "mobx";
import daikon from "daikon";
import Panzoom from '@panzoom/panzoom';

export default class ImageViewerStore {

  initialize() {

    //-- IMAGE DISPLAY --//
    this.destCanvas = null;
    this.panzoom = null;
    this.imgOriginalWidth = 800;
    this.imgOriginalHeight = 800;
    this.scale = 1.0;
    this.imgScaledWidth = 800;
    this.imgScaledHeight = 800;
  }

  constructor(rootStore) {
    this.initialize(); // Initialize upon entry into the web-app, once.
    this.rootStore = rootStore; // All stores inherit root store.
    makeAutoObservable(this); // Make all stores auto observable for automatic data binding.
  }

  //-- IMAGE DISPLAY --//
  initializePanZoom() {
    const elem = document.getElementById('destCanvas');
    this.panzoom = Panzoom(elem, { canvas: true });
    const parent = elem.parentElement;
    parent.addEventListener('wheel', this.panzoom.zoomWithWheel);
    parent.addEventListener('wheel', function(event) {
      if (!event.shiftKey) return
      this.panzoom.zoomWithWheel(event)
    });
  }
  
  async getImageBuffer(file) {
    return new Promise((resolve, reject) => {
      var fr = new FileReader();
      fr.onload = () => {
        resolve({
          buffer: fr.result
        })
      };
      fr.readAsArrayBuffer(file);
    });
  };

  async getImageData(file) {
    return new Promise((resolve, reject) => {
      var u = URL.createObjectURL(file);
      var img = new Image;
      img.onload = () => {

        // Draw image on offscreen canvas and get pixel data:
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        context.drawImage(img, 0, 0);
        const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imgData.data;

        // Return data:
        resolve({
          pixels: pixels,
          channels: 3,
          width: img.naturalWidth,
          height: img.naturalHeight,
          windowCenter: 128,
          windowWidth: 256,
        })
      };
      img.src = u;
    });
  };

  getDicomData(buffer) {
    daikon.Parser.verbose = true;
    let data = new DataView(buffer);
    let image = daikon.Series.parseImage(data);
    return {
      pixels: image.getInterpretedData(),
      channels: 1,
      width: image.getCols(),
      height: image.getRows(),
      windowCenter: image.getWindowCenter(),
      windowWidth: image.getWindowWidth(),
    }
  }

  computeDimensions(disLength, imgWidth, imgHeight) {

    let resultWidth = 0;
    let resultHeight = 0;

    if (imgWidth >= imgHeight) {
      resultWidth = disLength; 
      resultHeight = disLength * (imgHeight / imgWidth);
    } else {
      resultWidth = disLength * (imgWidth / imgHeight);
      resultHeight = disLength;
    }

    return {
      width: resultWidth,
      height: resultHeight
    }
  }

  centerImage() {

    let s = 800;
    let x = 0;
    let y = 0;

    if (this.imgScaledWidth != s) {
      x = (s - this.imgScaledWidth) / 2;
    }
    if (this.imgScaledHeight != s) {
      y = (s - this.imgScaledHeight) / 2;
    }

    this.panzoom.pan(x, y);
    this.panzoom.zoom(1, { animate: false });

  }

  async loadImage(e) {

    if (e.target.files.length > 0) {

      // Acquire file and type of file:
      let file = e.target.files[0];
      let fileExtension = file.name.split('.').pop();

      // Initialize image data dictionary:
      let imageData = {};
    
      // Handle DICOM:
      if (file.type == "application/dicom" || fileExtension == "dicom" || fileExtension == "dcm") {

        // Set canvas(es):
        this.destCanvas = document.getElementById("destCanvas");

        // Hide canvas(es):
        this.destCanvas.hidden = true;

        // Get image buffer array:
        let imageBuffer = await this.getImageBuffer(file);

        // Acquire interpreted/parsed DICOM data:
        imageData = this.getDicomData(imageBuffer.buffer);

      }

      // Handle PNG/JPG:
      if (file.type == "image/png"|| file.type == "image/jpg" || file.type == "image/jpeg") {

        // Set canvas(es):
        this.destCanvas = document.getElementById("destCanvas");

        // Hide canvas(es):
        this.destCanvas.hidden = true;

        // Acquire parsed png/jpg data:
        imageData = await this.getImageData(file);

      }

      // Update window data:
      this.rootStore.windowKernelsStore.changePixels(imageData.pixels, false);
      this.rootStore.windowKernelsStore.changeChannels(imageData.channels, false);
      this.rootStore.windowKernelsStore.changeWindowCenter(imageData.windowCenter, false);
      this.rootStore.windowKernelsStore.changeWindowWidth(imageData.windowWidth, false);

      // Save new image's inherent dimensions:
      this.imgOriginalWidth = imageData.width;
      this.imgOriginalHeight = imageData.height;

      // Compute scaled dimensions (to fit in screen view):
      let dimensions = this.computeDimensions(800, this.imgOriginalWidth, this.imgOriginalHeight);
      this.imgScaledWidth = dimensions.width;
      this.imgScaledHeight = dimensions.height;

      // Show and set destination canvas dimensions:
      this.destCanvas.hidden = false;
      this.destCanvas.width = this.imgOriginalWidth;
      this.destCanvas.height = this.imgOriginalHeight;

      // Call orchestrator to switch image and apply active filters:
      this.rootStore.orchestrateKernelsStore.transition(this.destCanvas);
      this.rootStore.orchestrateKernelsStore.applyActiveFilters(this.filterSettings);

      // Move image to center:
      this.centerImage();
    }
  };

}
