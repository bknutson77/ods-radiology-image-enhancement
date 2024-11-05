import React, { useContext } from "react";
import { RootStoreContext } from "../../providers/RootStoreContext";
import { observer } from "mobx-react";
import TextInputComponent from "../../components/TextInput/TextInputComponent";
import ButtonComponent from "../../components/Button/ButtonComponent";
import ModalComponent from "../../components/Modal/ModalComponent";

const SignupModal = observer(() => {

  // Stores:
  let rootStore = useContext(RootStoreContext);
  let loginStore = rootStore.loginStore;

  return (
    <ModalComponent open={loginStore.showSignupModal} width={600}>
      <div className="w-full flex flex-col">

        {/* Header */}
        <div className="text-lg font-medium">Sign Up</div>

        {/* Inputs */}
        <div className="w-full mt-4 flex flex-col">
          <TextInputComponent
            label="Name"
            value={loginStore.newName}
            onChangeCallback={(e) => loginStore.changeNewName(e)}
          />
          <TextInputComponent
            label="Email"
            value={loginStore.newEmail}
            onChangeCallback={(e) => loginStore.changeNewEmail(e)}
          />
          <TextInputComponent
            label="Username"
            value={loginStore.newUsername}
            onChangeCallback={(e) => loginStore.changeNewUsername(e)}
          />
          <TextInputComponent
            label="Password"
            value={loginStore.newPassword}
            onChangeCallback={(e) => loginStore.changeNewPassword(e)}
          />
        </div>
        
        {/* Buttons */}
        <div className="w-full flex justify-end mt-4">
            <div className="flex w-[40%] gap-2">
            <ButtonComponent
                label="Cancel"
                type="secondary"
                onClickCallback={() => loginStore.cancelSignup()}
            />
            <ButtonComponent
                label="Sign Up"
                type="primary"
                onClickCallback={() => loginStore.signup()}
            />
            </div>
        </div>
      </div>
    </ModalComponent>
  );
});

const LoginView = observer(() => {

  // Stores:
  let rootStore = useContext(RootStoreContext);
  let loginStore = rootStore.loginStore;

  return (
    <div className="w-full h-full flex items-center justify-center mt-40">

      {/* Modals */}
      <SignupModal/>

      <div className="w-[300px] flex flex-col items-center justify-center">
        <TextInputComponent
          label="Username"
          value={loginStore.username}
          onChangeCallback={(e) => loginStore.changeUsername(e)}
        />
        <TextInputComponent
          label="Password"
          value={loginStore.password}
          onChangeCallback={(e) => loginStore.changePassword(e)}
        />
        <div className="w-full h-2"></div>
        <ButtonComponent
          label="Login"
          type="primary"
          onClickCallback={() => loginStore.login()}
        />
        <div className="w-full mt-8 flex items-center justify-center">
          <div className="text-sm mr-1">Don't have an account?</div>
          <div
            className="text-sm text-slate-500 cursor-pointer"
            onClick={() => loginStore.openSignupModal()}
          >Sign Up.</div>
        </div>
      </div>
    </div>
  );
});

export default LoginView;
