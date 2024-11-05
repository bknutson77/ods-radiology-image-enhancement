import { makeAutoObservable } from "mobx";

export default class RoutesStore {
  initialize() {
    this.messageType = undefined;
    this.message = "";
    this.open = false;
  }

  constructor(rootStore) {
    this.initialize(); // Initialize upon entry into the web-app, once.
    this.rootStore = rootStore; // All stores inherit root store.
    makeAutoObservable(this); // Make all stores auto observable for automatic data binding.
  }

  closeToastMessage() {
    this.open = false;
    this.messageType = undefined;
    this.message = "";
  }

  openToastSuccess(msg) {
    this.messageType = "success";
    this.message = msg;
    this.open = true;
  }

  openToastError(msg) {
    this.messageType = "error";
    this.message = msg;
    this.open = true;
  }

  openToastWarning(msg) {
    this.messageType = "warning";
    this.message = msg;
    this.open = true;
  }
  
  openToastInfo(msg) {
    this.messageType = "info";
    this.message = msg;
    this.open = true;
  }
}
