import React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { PlusCircleFill } from "react-bootstrap-icons";

const CssButton = styled(Button)({
  backgroundColor: "white",
  opacity: 1,
  border: "none !important",
  borderRadius: 0,
  textTransform: "none",
  color: "#6F7484",
  textAlign: "left",
  minWidth: 0,
  paddingLeft: "12px",
  paddingRight: "12px"
});

const FileComponent = ({
  size = "large",
  label,
  accepts,
  onChangeCallback,
}) => {
  return (
    <CssButton
      variant="outlined"
      fullWidth
      size={size}
      component="label"
      endIcon={<PlusCircleFill color="#6F7484" />}
    >
      <div className="w-full">{label}</div>
      <input multiple type="file" accept={accepts} hidden onChange={onChangeCallback} />
    </CssButton>
  );
};

export default FileComponent;
