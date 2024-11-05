import React from "react";

const TextAreaComponent = ({
  minRows,
  value,
  onChangeCallback,
  disabled=false
}) => {
  return (
    <textarea
      style={{width: "100%", border: "solid 1px gray", "padding": "10px"}}
      rows={minRows}
      value={value}
      onChange={onChangeCallback}
      disabled={disabled}
    />
  );
};

export default TextAreaComponent;