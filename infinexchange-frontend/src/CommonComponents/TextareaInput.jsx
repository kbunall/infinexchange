import React from "react";
import TextField from "@mui/material/TextField";

const TextareaInput = ({ label, rows, ...props }) => {
  return (
    <TextField
      label={label}
      multiline
      rows={rows}
      {...props}
    />
  );
};

export default TextareaInput;
