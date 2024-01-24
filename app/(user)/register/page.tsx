"use client";

import { AlertColor, Checkbox, FormControlLabel, Link } from "@mui/material";
import { useFormState, useFormStatus } from "react-dom";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CustomAlert from "@/app/components/alert";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PasswordInput from "@/app/components/password-input";
import React from "react";
import TextFieldInput from "@/app/components/textfield-input";
import Typography from "@mui/material/Typography";
import { loginWithGoogle } from "@/utils/firebase-account";
import registerFunction from "./register-function";
import { useRouter } from "next/navigation";

const initialState = {
  message: "",
  status: "success" as AlertColor,
  errors: {
    email: { success: true, error: "" },
    passwordOne: { success: true, error: "" },
    passwordTwo: { success: true, error: "" },
  },
};
export default function RegisterPage() {
  const { pending } = useFormStatus();
  const [open, setOpen] = React.useState(false);
  const [state, formAction] = useFormState(registerFunction, initialState);

  const router = useRouter();

  React.useEffect(() => {
    if (state.message == "Success!") {
      router.push("/");
    }
  }, [state.message]);

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate action={formAction} sx={{ mt: 3 }}>
          <Grid container spacing={2} marginBlock={2}>
            <Grid item xs={12}>
              <TextFieldInput
                label="Email"
                value=""
                autoFocus={true}
                error={!state.errors?.email.success && true}
                helperText={
                  state.errors?.email.success == false
                    ? state.errors.email.error
                    : ""
                }
              />
            </Grid>

            <Grid item xs={12}>
              <PasswordInput
                name="passwordOne"
                required
                label="Password"
                value=""
                error={!state.errors?.passwordOne.success && true}
                helperText={
                  state.errors?.passwordOne.success == false
                    ? state.errors.passwordOne.error
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <PasswordInput
                name="passwordTwo"
                required
                label="Password"
                value=""
                error={!state.errors?.passwordTwo.success && true}
                helperText={
                  state.errors?.passwordTwo.success == false
                    ? state.errors.passwordTwo.error
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    name="emailAlerts"
                    defaultChecked
                    value="true"
                  />
                }
                label="Receive email alerts for games I favourite."
              />
            </Grid>
          </Grid>
          <CustomAlert state={state} />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {pending ? "Signing Up..." : "Sign Up"}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
            <Button
              type="button"
              onClick={loginWithGoogle}
              fullWidth
              variant="outlined"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up With Google
            </Button>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
