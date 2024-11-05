import { makeAutoObservable } from "mobx";

export default class AuthenticationStore {
  initialize() {
    // this.isAuthenticated = sessionStorage.getItem("token") ? true : false;
    this.isAuthenticated = true;
  }

  constructor(rootStore) {
    this.initialize(); // Initialize upon entry into the web-app, once.
    this.rootStore = rootStore; // All stores inherit root store.
    makeAutoObservable(this); // Make all stores auto observable for automatic data binding.
  }
}
