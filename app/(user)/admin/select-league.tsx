import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

import { useState } from "react";

interface SelectProps {
  children?: React.ReactNode;
  name: string;
  options: Option[];
  error?: boolean;
  helperText?: string | undefined;
}

type Option = {
  name: string;
  value: string;
};

export default function SelectLeague({
  name,
  options,
  error,
  helperText,
}: SelectProps) {
  const [value, setValue] = useState("");

  const nameWithoutWhiteSpaces = name.replace(/\s+/g, "").toLowerCase();

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
  };

  return (
    <>
      <FormControl sx={{ my: 2, minWidth: "100%" }}>
        <InputLabel id={`${nameWithoutWhiteSpaces}-label`}>{name}</InputLabel>
        <Select
          error={error && error == true ? true : false}
          name={nameWithoutWhiteSpaces}
          fullWidth
          labelId={`${nameWithoutWhiteSpaces}-label`}
          id={nameWithoutWhiteSpaces}
          label={nameWithoutWhiteSpaces}
          onChange={handleChange}
          value={value}
        >
          {options.map((item) => (
            <MenuItem key={item.value + item.name} value={item.value}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
        {error && error == true && (
          <FormHelperText>{helperText}</FormHelperText>
        )}
      </FormControl>
    </>
  );
}
