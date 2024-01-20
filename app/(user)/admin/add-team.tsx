import { Box, Button } from "@mui/material";

import PublishIcon from "@mui/icons-material/Publish";
import SelectLeague from "./select-league";
import TextFieldInput from "@/app/components/textfield-input";
import upload from "./uploadFile";

export default function AddTeamForm() {
  return (
    <Box component="form" noValidate action={upload} sx={{ mt: 1 }}>
      <TextFieldInput
        label="Name"
        value="Rögle BK"
        autoFocus={true}
        required={true}
      />
      <TextFieldInput label="Abbreviation" value="RBK" required={true} />
      <TextFieldInput label="City" value="Ängelholm" required={true} />

      <SelectLeague />

      <input
        style={{ display: "none" }}
        accept="image/*"
        id="uploadFile"
        type="file"
        name="file"
      />
      <label htmlFor="uploadFile">
        <Button
          component="span"
          startIcon={<PublishIcon />}
          sx={{ my: 2 }}
          variant="outlined"
          color="secondary"
        >
          Upload team icon
        </Button>
      </label>

      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Add team
      </Button>
    </Box>
  );
}
