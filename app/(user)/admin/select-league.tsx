import { InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

import { useState } from "react";

export default function SelectLeague() {
  const [league, setLeague] = useState("League 1");

  const handleChange = (event: SelectChangeEvent) => {
    setLeague(event.target.value);
  };

  return (
    <>
      <InputLabel id="league-label">League</InputLabel>
      <Select
        name="league"
        fullWidth
        labelId="league-label"
        id="league"
        label="League"
        onChange={handleChange}
        value={league}
      >
        <MenuItem value={"League 1"}>League 1</MenuItem>
        <MenuItem value={"League 2"}>League 2</MenuItem>
        <MenuItem value={"League 3"}>League 3</MenuItem>
      </Select>
    </>
  );
}
