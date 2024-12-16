import { TextField } from "@mui/material";

const InputComponent = ({ label, id, ...otherProps }) => {
  return (
    <div>
      <TextField
        fullWidth
        id={id}
        label={label}
        multiline
        maxRows={4}
        style={{ marginBottom: 20 }}
        {...otherProps}
      />
    </div>
  );
};

export default InputComponent;
