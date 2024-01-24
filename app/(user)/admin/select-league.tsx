import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

import { useState } from "react";

export default function SelectLeague() {
  const [league, setLeague] = useState("League 1");

  const handleChange = (event: SelectChangeEvent) => {
    setLeague(event.target.value);
  };

  return (
    <>
      <FormControl sx={{ my: 2, minWidth: "100%" }}>
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
          <MenuItem value={"SHL"}>Svenska Hockeyligan</MenuItem>
          <MenuItem value={"HA"}>Hockeyallsvenskan</MenuItem>
        </Select>
      </FormControl>
    </>
  );
}
