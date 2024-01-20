import React from "react";
import TextField from "@mui/material/TextField";

interface PasswordInputProps {
  label: string;
  value: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  autoFocus?: boolean;
}

const TextFieldInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  required = true,
  error = false,
  helperText = "",
  autoFocus = false,
}) => {
  return (
    <TextField
      InputLabelProps={{ shrink: true }}
      margin="normal"
      required={required}
      fullWidth
      id={label.toLowerCase()}
      name={label.toLowerCase()}
      autoFocus={autoFocus}
      error={error}
      helperText={error ? helperText : ""}
      label={label}
      autoComplete={label.toLowerCase()}
      type="text"
      defaultValue={value}
    />
  );
};

export default TextFieldInput;
