import Checkbox from "@mui/material/Checkbox";

const CheckboxComponent = ({
  id = "new-element",
  size = "small",
  label,
  value,
  checked,
  onChangeCallback,
}) => {
  return (
    <Checkbox
      id={id}
      size={size}
      label={label}
      value={value}
      checked={checked}
      onChange={onChangeCallback}
    />
  );
};

export default CheckboxComponent;
