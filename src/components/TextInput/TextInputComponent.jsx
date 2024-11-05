import { styled } from "@mui/material/styles";
import { TextField } from "@mui/material";

const CssTextField = styled(TextField)({
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

const TextInputComponent = ({
  id = "new-element",
  size = "small",
  label,
  noLabel,
  value,
  onChangeCallback,
  error,
  helperText,
  placeholder,
  disabled=false,
  charCheck=false
}) => {

  function forbidSpecialChars(value, error, helperText) {
    if(charCheck){
      const specialChars = /[!@#$%^&*()<>?/]/;
      const whitespace = /\s/;
      if (specialChars.test(value)) {
        error = true;
        helperText = "Warning: Special characters detected.";
      } else if (whitespace.test(value)) {
        error = true;
        helperText = "Warning: Your entry contains whitespace.";
      }
    }
  
    return [error, helperText];
  };

  [error, helperText] = forbidSpecialChars(value, error, helperText);

  return (
    <CssTextField
      disabled={disabled}
      id={id}
      variant="outlined"
      fullWidth
      size={size}
      label={label}
      hiddenLabel={noLabel}
      value={value}
      onChange={onChangeCallback}
      error={error}
      helperText={helperText}
      placeholder={placeholder}
      autoComplete="off"
    />
  );
};

export default TextInputComponent;
