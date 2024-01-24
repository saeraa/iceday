import { AlertColor, Box, Button } from "@mui/material";
import { useFormState, useFormStatus } from "react-dom";

import CustomAlert from "@/app/components/alert";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SelectLeague from "./select-league";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import upload from "./add-game-function";

const LeagueArray = [
  { name: "Svenska Ishockeyligan", value: "SHL" },
  { name: "Hockeyallsvenskan", value: "HA" },
];
const TeamArray = [
  { name: "Rögle BK", value: "RBK" },
  { name: "Djurgårdens IF", value: "DIF" },
];

const initialState = {
  message: "",
  status: "success" as AlertColor,
  errors: {
    homeTeam: { success: true, error: "" },
  },
};

export default function AddGameForm() {
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(upload, initialState);

  return (
    <Box component="form" noValidate action={formAction} sx={{ mt: 1 }}>
      <SelectLeague
        name="Home Team"
        options={TeamArray}
        error={
          state.errors?.homeTeam && !state.errors?.homeTeam.success && true
        }
        helperText={
          state.errors?.homeTeam.success == false
            ? state.errors.homeTeam.error
            : ""
        }
      />

      <SelectLeague
        name="Away Team"
        options={TeamArray}
        error={
          state.errors?.homeTeam && !state.errors?.homeTeam.success && true
        }
        helperText={
          state.errors?.homeTeam.success == false
            ? state.errors.homeTeam.error
            : ""
        }
      />

      <SelectLeague name="League" options={LeagueArray} />

      <DatePicker name="date" sx={{ mr: 2 }} timezone="Europe/Paris" />
      <TimePicker name="time" />

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
