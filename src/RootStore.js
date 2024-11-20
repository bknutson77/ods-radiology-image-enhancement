import { GPU } from 'gpu.js';
import AuthenticationStore from "./authentication/AuthenticationStore";
import RoutesStore from "./routes/RoutesStore";
import LoginStore from "./pages/Login/LoginStore";
import ImageViewerStore from "./pages/ImageViewer/ImageViewerStore";
import { RGBToXYZ, XYZToRGB, XYZToLAB, LABToXYZ, RGBToHSV, HSVToRGB, RGBToHSL, HSLToRGB } from "./utilities/filters/functions/ColorSpaceFunctions";
import OrchestrateKernelsStore from "./utilities/filters/kernels/master/OrchestrateKernelsStore";
import ColorSpaceKernelsStore from "./utilities/filters/kernels/common/ColorSpaceKernelsStore";
import DisplayKernelsStore from "./utilities/filters/kernels/common/DisplayKernelsStore";
import WindowKernelsStore from "./utilities/filters/kernels/common/WindowKernelsStore";
import GammaKernelsStore from "./utilities/filters/kernels/contrast/GammaKernelsStore";
import ColorInversionKernelsStore from './utilities/filters/kernels/inversion/ColorInversionKernelsStore';
import BrightnessKernelsStore from './utilities/filters/kernels/brightness/BrightnessKernelsStore';

export default class RootStore {
  constructor() {

    // INFRA:
    this.authenticationStore = new AuthenticationStore(this);
    this.routesStore = new RoutesStore(this);
    this.loginStore = new LoginStore(this);

    // INITIALIZE:
    this.gpu = new GPU();

    // FUNCTIONS:
    this.gpu.addFunction(RGBToXYZ);
    this.gpu.addFunction(XYZToRGB);
    this.gpu.addFunction(XYZToLAB);
    this.gpu.addFunction(LABToXYZ);
    this.gpu.addFunction(RGBToHSV);
    this.gpu.addFunction(HSVToRGB);
    this.gpu.addFunction(RGBToHSL);
    this.gpu.addFunction(HSLToRGB);

    // FILTERS:
    this.orchestrateKernelsStore = new OrchestrateKernelsStore(this);
    this.displayKernelsStore = new DisplayKernelsStore(this);
    this.windowKernelsStore = new WindowKernelsStore(this);
    this.colorSpaceKernelsStore = new ColorSpaceKernelsStore(this);
    this.gammaKernelsStore = new GammaKernelsStore(this);
    this.colorInversionKernelsStore = new ColorInversionKernelsStore(this);
    this.brightnessKernelsStore = new BrightnessKernelsStore(this);

    // PAGES:
    this.imageViewerStore = new ImageViewerStore(this);
  }
}
