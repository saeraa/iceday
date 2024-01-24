import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

interface PasswordInputProps {
  label: string;
  value: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  name?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  required = true,
  error = false,
  helperText = "",
  name = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <TextField
      InputLabelProps={{ shrink: true }}
      name={name == "" ? label.toLowerCase() : name}
      margin="normal"
      error={error}
      helperText={error ? helperText : ""}
      required={required}
      fullWidth
      defaultValue={value}
      label={label}
      autoComplete="password"
      type={showPassword ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordInput;
