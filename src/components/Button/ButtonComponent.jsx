import React from "react";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

const ButtonComponent = ({
  size = "small",
  label,
  type,
  onClickCallback,
  disabled = false,
  loading = false,
  loadingLabel = "",
}) => {

  function styleLookup(type, disabled) {
    if (disabled) {
      return {
        backgroundColor: "#E3E3E3 !important",
        color: "#FFFFFF",
        "&:hover": { backgroundColor: "#E3E3E3", color: "#FFFFFF" },
      }
    } else {
      if (type == "primary") {
        return {
          backgroundColor: "#7989AD",
          "&:hover": { backgroundColor: "#697BA3" },
        }
      } else if (type == "secondary") {
        return {
          backgroundColor: "#586890",
          "&:hover": { backgroundColor: "#4E5D80" },
        }
      }
    }
  };

  return (
    <>
      {loading ? (
        <LoadingButton
          color="secondary"
          loading={loading}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="contained"
          fullWidth
          size={size}
        >
          {loadingLabel}
        </LoadingButton>
      ) : (
        <Button
          variant="contained"
          fullWidth
          size={size}
          disabled={disabled}
          onClick={onClickCallback}
          sx={styleLookup(type, disabled)}
        >
          {label}
        </Button>
      )}
    </>
  );
};

export default ButtonComponent;