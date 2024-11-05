import React from "react";
import ButtonComponent from "../Button/ButtonComponent";

const HoverPopoverComponent = ({
    label,
    content
}) => {
  return (
    <div className="group relative inline-block">
        <ButtonComponent
            label={label}
            type="primary"
            onClickCallback={() => {}}
        />
        <div className="hidden absolute shadow z-1 group-hover:block">
            {content}
        </div>
    </div>
  );
};

export default HoverPopoverComponent;