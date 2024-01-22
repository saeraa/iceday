import { Alert, Box, Button } from "@mui/material";
import { useFormState, useFormStatus } from "react-dom";

import { AlertColor } from "@mui/material";
import PublishIcon from "@mui/icons-material/Publish";
import SelectLeague from "./select-league";
import TextFieldInput from "@/app/components/textfield-input";
import upload from "./uploadFile";

const initialState = {
  message: "",
  status: "success" as AlertColor,
};

export default function AddTeamForm() {
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(upload, initialState);

  return (
    <Box component="form" noValidate action={formAction} sx={{ mt: 1 }}>
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

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        aria-disabled={pending}
      >
        Add team
      </Button>
      {state.message && (
        <Alert severity={state.status && state.status}>{state.message}</Alert>
      )}
    </Box>
  );
}
