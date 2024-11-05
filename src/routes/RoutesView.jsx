import React, { useContext } from "react";
import { RootStoreContext } from "../providers/RootStoreContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { observer } from "mobx-react";
import ToastComponent from "../components/Toast/ToastComponent";
import ImageViewerView from "../pages/ImageViewer/ImageViewerView";

const RoutesView = observer(() => {

  // Stores:
  const rootStore = useContext(RootStoreContext); // root store
  const routesStore = rootStore.routesStore; // native store

  return (
    <div className="w-full h-full">

      {/* Routes */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ImageViewerView/>}></Route>
        </Routes>
      </BrowserRouter>

      {/* Toast Messages */}
      <ToastComponent
        messageType={routesStore.messageType}
        open={routesStore.open}
        message={<div>{routesStore.message}</div>}
        onClose={() => routesStore.closeToastMessage()}
      />
    </div>
  );
});

export default RoutesView;
