import { AlertColor, Box, Button, TextField } from "@mui/material";
import { useFormState, useFormStatus } from "react-dom";

import CustomAlert from "@/app/components/alert";
import SelectLeague from "./select-league";
import TextFieldInput from "@/app/components/textfield-input";
import upload from "./add-team-function";

const LeagueArray = [
  { name: "Svenska Ishockeyligan", value: "SHL" },
  { name: "Hockeyallsvenskan", value: "HA" },
];

const initialState = {
  message: "",
  status: "success" as AlertColor,
  errors: {
    name: { success: true, error: "" },
    abbreviation: { success: true, error: "" },
    city: { success: true, error: "" },
    file: { success: true, error: "" },
  },
};

export default function AddTeamForm() {
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(upload, initialState);

  return (
    <Box component="form" noValidate action={formAction} sx={{ mt: 1 }}>
      <TextFieldInput
        label="Name"
        value=""
        autoFocus={true}
        error={!state.errors?.name.success && true}
        helperText={
          state.errors?.name.success == false ? state.errors.name.error : ""
        }
      />
      <TextFieldInput
        label="Abbreviation"
        value=""
        error={!state.errors?.abbreviation.success && true}
        helperText={
          state.errors?.abbreviation.success == false
            ? state.errors.abbreviation.error
            : ""
        }
      />
      <TextFieldInput
        label="City"
        value=""
        error={!state.errors?.city.success && true}
        helperText={
          state.errors?.city.success == false ? state.errors.city.error : ""
        }
      />

      <SelectLeague name="League" options={LeagueArray} />

      <TextField
        type="file"
        InputLabelProps={{ shrink: true }}
        margin="normal"
        required
        fullWidth
        id="uploadFile"
        name="file"
        label="Team icon"
        error={!state.errors?.file.success && true}
        helperText={
          state.errors?.file.success == false ? state.errors.file.error : ""
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
      <CustomAlert state={state} />
    </Box>
  );
}
