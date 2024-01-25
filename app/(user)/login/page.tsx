"use client";

import * as React from "react";

import { useFormState, useFormStatus } from "react-dom";

import { AlertColor } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import CustomAlert from "@/app/components/alert";
import FormDialog from "./forgot-password";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PasswordInput from "@/app/components/password-input";
import TextFieldInput from "@/app/components/textfield-input";
import Typography from "@mui/material/Typography";
import loginFunction from "./login-function";
import { loginWithGoogle } from "@/utils/firebase-account";
import { useRouter } from "next/navigation";

const initialState = {
  message: "",
  status: "success" as AlertColor,
  errors: {
    email: { success: true, error: "" },
    password: { success: true, error: "" },
  },
};

export default function LoginPage() {
  const { pending } = useFormStatus();
  const [open, setOpen] = React.useState(false);
  const [state, formAction] = useFormState(loginFunction, initialState);
  const router = useRouter();

  React.useEffect(() => {
    if (state.message == "Success!") {
      router.push("/");
    }
  }, [state.message]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const loginWithGoogleAndRedirect = async () => {
    const result = await loginWithGoogle();
    if (result) {
      router.push("/");
    }
  };

  return (
    <Container maxWidth="xs">
      <CssBaseline />
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
          Sign in
        </Typography>
        <Box component="form" noValidate action={formAction} sx={{ mt: 1 }}>
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
          <PasswordInput
            required
            label="Password"
            value=""
            error={!state.errors?.password.success && true}
            helperText={
              state.errors?.password.success == false
                ? state.errors.password.error
                : ""
            }
          />
          <CustomAlert state={state} />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <FormDialog open={open} handleClose={handleClose} />
              <Link href="#" onClick={handleClickOpen} variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
            <Button
              type="button"
              onClick={loginWithGoogleAndRedirect}
              fullWidth
              variant="outlined"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In With Google
            </Button>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
