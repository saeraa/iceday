import { Alert, Box, Button, Input, TextField } from "@mui/material";
import { useFormState, useFormStatus } from "react-dom";

import { AlertColor } from "@mui/material";
import SelectLeague from "./select-league";
import TextFieldInput from "@/app/components/textfield-input";
import upload from "./uploadFile";

const initialState = {
  message: "",
  status: "success" as AlertColor,
  errors: {
    name: { success: "true", error: "" },
    abbreviation: { success: "true", error: "" },
    city: { success: "true", error: "" },
    file: { success: "true", error: "" },
  },
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
        error={state.errors?.name.success == "false" && true}
        helperText={
          state.errors?.name.success == "false" ? state.errors.name.error : ""
        }
      />
      <TextFieldInput
        label="Abbreviation"
        value="RBK"
        error={state.errors?.abbreviation.success == "false" && true}
        helperText={
          state.errors?.abbreviation.success == "false"
            ? state.errors.abbreviation.error
            : ""
        }
      />
      <TextFieldInput
        label="City"
        value="Ängelholm"
        error={state.errors?.city.success == "false" && true}
        helperText={
          state.errors?.city.success == "false" ? state.errors.city.error : ""
        }
      />
      <SelectLeague />
      <TextField
        type="file"
        InputLabelProps={{ shrink: true }}
        margin="normal"
        required
        fullWidth
        id="uploadFile"
        name="file"
        label="Team icon"
        error={state.errors?.file.success == "false" && true}
        helperText={
          state.errors?.file.success == "false" ? state.errors.file.error : ""
        }
      />
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
