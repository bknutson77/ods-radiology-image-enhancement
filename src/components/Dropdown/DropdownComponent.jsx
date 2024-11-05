import React from "react";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import { TextField, Select } from "@mui/material";

/**
 * A styled wrapper of the MUI component TextField
 */
const CssTextField = styled(TextField)({
  // background: "white",
  // opacity: 1,
  // "& .MuiInputBase-input": {
  //   background: "white",
  //   opacity: 1,
  //   border: "1px solid #8c8c8c",
  // },
  // "& .MuiTextField-root": {
  //   background: "white",
  //   opacity: 1,
  //   border: "1px solid #8c8c8c",
  // },
});

const DropdownComponent = ({
  id = "new-element",
  size = "small",
  label,
  noLabel,
  value,
  multiple,
  options,
  onChangeCallback,
  error,
  helperText,
}) => {
  return (
    <CssTextField
      id={id}
      name={id}
      variant="outlined"
      select
      fullWidth
      size={size}
      label={label}
      hiddenLabel={noLabel}
      error={error}
      helperText={helperText}
      SelectProps={{
        multiple: multiple,
        value: value,
        onChange: onChangeCallback,
      }}
    >
      {options.map((item, i) => (
        <MenuItem id={i} key={i} value={item}>
          {item}
        </MenuItem>
      ))}
    </CssTextField>
  );
};

export default DropdownComponent;
