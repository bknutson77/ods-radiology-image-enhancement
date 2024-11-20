import React, { useContext, useEffect } from "react";
import { RootStoreContext } from "../../providers/RootStoreContext";
import { observer } from "mobx-react";
import ButtonComponent from "../../components/Button/ButtonComponent";
import ModalComponent from "../../components/Modal/ModalComponent";
import DropdownComponent from "../../components/Dropdown/DropdownComponent";
import RangeSliderComponent from "../../components/RangeSlider/RangeSliderComponent";
import SwitchComponent from "../../components/Switch/SwitchComponent";
import { XLg, Trash3 } from "react-bootstrap-icons";

const ImageViewerView = observer(() => {

  // Stores:
  let rootStore = useContext(RootStoreContext);
  let imageViewerStore = rootStore.imageViewerStore;
  let windowKernelsStore = rootStore.windowKernelsStore;
  let gammaKernelsStore = rootStore.gammaKernelsStore;
  let colorInversionKernelsStore = rootStore.colorInversionKernelsStore;
  let brightnessKernelsStore = rootStore.brightnessKernelsStore;

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">

      {/* Image Selection */}
      <input className="mb-[-8px]" type="file"  accept="*" name="image" id="file" onChange={(e) => imageViewerStore.loadImage(e)}></input>

      {/* Body Section */}
      <div className="flex w-full h-full">

        {/* Image */}
        <div className="w-[800px] h-[800px] bg-gray-800 flex relative rounded">

          {/* Display Canvas */}
          <canvas 
            id="destCanvas"
            style={{width: imageViewerStore.imgScaledWidth, height: imageViewerStore.imgScaledHeight}}
            className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
          />
        </div>

        {/* Image Processing */}
        <div className="w-[230px] h-[800px] flex flex-col ml-3 gap-6">

          {/* Window Contrast */}
          <div className="flex flex-col">
            <div className="flex items-center">
              <div className="font-medium">Window Contrast</div>
            </div>
            <div className="flex mt-2 ml-2">
              <div className="font-light mr-4 mt-[2px]">Center</div>
              <RangeSliderComponent
                width={150}
                min={0}
                max={20000}
                value={windowKernelsStore.windowCenter}
                onChangeCallback={(e) => windowKernelsStore.changeWindowCenter(e.target.value, true)}
                disabled={false}
              />
            </div>
            <div className="flex mt-[-8px] ml-2">
              <div className="font-light mr-4 mt-[2px]">Width</div>
              <RangeSliderComponent
                width={150}
                min={0}
                max={20000}
                value={windowKernelsStore.windowWidth}
                onChangeCallback={(e) => windowKernelsStore.changeWindowWidth(e.target.value, true)}
                disabled={false}
              />
            </div>
          </div>        

          {/* Gamma */}
          <div className="flex flex-col">
            <div className="flex items-center">
              <div className="font-medium">Gamma</div>
              <SwitchComponent
                checked={gammaKernelsStore.active}
                onChangeCallback={() => gammaKernelsStore.toggle(true)}
              />
            </div>
            <div className="flex mt-2 ml-2">
              <div className="font-light mr-4 mt-[2px]">Alpha</div>
              <RangeSliderComponent
                width={150}
                min={0}
                max={10}
                value={gammaKernelsStore.alpha}
                onChangeCallback={(e) => gammaKernelsStore.changeAlpha(e.target.value, true)}
                disabled={!gammaKernelsStore.active}
              />
            </div>
            <div className="flex mt-[-8px] ml-2">
              <div className="font-light mr-4 mt-[2px]">Correction</div>
              <RangeSliderComponent
                width={150}
                min={0}
                max={10}
                value={gammaKernelsStore.gamma}
                onChangeCallback={(e) => gammaKernelsStore.changeGamma(e.target.value, true)}
                disabled={!gammaKernelsStore.active}
              />
            </div>
          </div>


          {/* Color Inversion */}
          <div className="flex flex-col">
            <div className="flex items-center">
              <div className="font-medium">ColorInversion</div>
              <SwitchComponent
                checked={colorInversionKernelsStore.active}
                onChangeCallback={() => colorInversionKernelsStore.toggle(true)}
              />
            </div>

          </div>
          {/* Brightness */}
          <div className="flex flex-col">
            <div className="flex items-center">
              <div className="font-medium">Brightness</div>
              <SwitchComponent
                checked={brightnessKernelsStore.active}
                onChangeCallback={() => brightnessKernelsStore.toggle(true)}
              />
            </div>
            <div className="flex mt-2 ml-2">
              <div className="font-light mr-4 mt-[2px]">Alpha</div>
              <RangeSliderComponent
                width={150}
                min={0}
                max={4}
                value={brightnessKernelsStore.alpha}
                onChangeCallback={(e) => brightnessKernelsStore.changeAlpha(e.target.value, true)}
                disabled={!brightnessKernelsStore.active}
              />
            </div>
            <div className="flex mt-[-8px] ml-2">
              <div className="font-light mr-4 mt-[2px]">Brightness</div>
              <RangeSliderComponent
                width={150}
                min={-255}
                max={255}
                value={brightnessKernelsStore.brightness}
                onChangeCallback={(e) => brightnessKernelsStore.changeBrightness(e.target.value, true)}
                disabled={!brightnessKernelsStore.active}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ImageViewerView;