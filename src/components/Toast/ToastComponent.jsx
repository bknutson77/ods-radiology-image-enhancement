import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

const config = {
  error: {
    type: "error",
    duration: 6000,
    vertical: "bottom",
    horizontal: "right",
  },
  success: {
    type: "success",
    duration: 2000,
    vertical: "top",
    horizontal: "right",
  },
  warning: {
    type: "warning",
    duration: 4000,
    vertical: "bottom",
    horizontal: "right",
  },
  info: {
    type: "info",
    duration: 4000,
    vertical: "top",
    horizontal: "right"
  },
};

const ToastComponent = ({
  messageType = "success",
  message,
  open,
  onClose,
  ...otherProps
}) => {
  const { type, duration, vertical, horizontal } = {
    ...config[messageType],
    ...otherProps,
  };
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical, horizontal }}
      autoHideDuration={duration}
    >
      <Alert onClose={onClose} severity={type}>
        {message}
      </Alert>
    </Snackbar>
  );
};
export default ToastComponent;