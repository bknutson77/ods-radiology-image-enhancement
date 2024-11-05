import { makeAutoObservable } from "mobx";

export default class LoginStore {
  initialize() {
    this.username = "";
    this.password = "";
    this.newName = "";
    this.newEmail = "";
    this.newUsername = "";
    this.newPassword = "";
    this.showSignupModal = false;
  }

  constructor(rootStore) {
    this.initialize(); // Initialize upon entry into the web-app, once.
    this.rootStore = rootStore; // All stores inherit root store.
    makeAutoObservable(this); // Make all stores auto observable for automatic data binding.
  }

  changeUsername(e) {
    this.username = e.target.value;
  }

  changePassword(e) {
    this.password = e.target.value;
  }

  async login() {
    let token = await this.rootStore.apiStore.login(this.username, this.password);
    if (!token.error && (typeof token === 'string' || token instanceof String)) {
      sessionStorage.setItem("token", token);
      this.rootStore.apiStore.token = token;
      this.rootStore.authenticationStore.isAuthenticated = true;
    } else {
      this.rootStore.routesStore.openToastError("Invalid credentials");
    }
  }

  openSignupModal() {
    this.showSignupModal = true;
  }

  changeNewName(e) {
    this.newName = e.target.value;
  }

  changeNewEmail(e) {
    this.newEmail = e.target.value;
  }

  changeNewUsername(e) {
    this.newUsername = e.target.value;
  }

  changeNewPassword(e) {
    this.newPassword = e.target.value;
  }

  cancelSignup() {
    this.showSignupModal = false;
  }

  async signup() {
    let newUser = {
      "user_name": this.newUsername,
      "user_password": this.newPassword,
      "user_full_name": this.newName,
      "user_email": this.newEmail,
      "user_access": "admin",
      "user_settings": {
        "subscriber": true
      }
    }
    let myUser = await this.rootStore.apiStore.signup(newUser);
    if (!myUser.error) {

      // Log success:
      this.showSignupModal = false;
      this.rootStore.routesStore.openToastSuccess("Signup successful");

      // Login:
      this.username = this.newUsername;
      this.password = this.newPassword;
      await this.login();
    } else {
      this.rootStore.routesStore.openToastError("Error signing up");
    }
  }
}
