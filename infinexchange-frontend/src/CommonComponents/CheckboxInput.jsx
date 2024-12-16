import React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const CheckboxInput = ({ label, ...props }) => {
  return (
    <FormControlLabel
      control={<Checkbox {...props} />}
      label={label}
    />
  );
};

export default CheckboxInput;
