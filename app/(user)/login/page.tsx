"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { loginUser, signInWithGoogle } from "@/utils/firebase-functions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@mui/material";
import FormDialog from "./forgot-password";
import PasswordInput from "@/app/components/password-input";

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const defaultNoError = {
  value: false,
  message: "",
};

export default function LoginPage() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState({ value: false, message: "" });
  const [passwordError, setPasswordError] = useState(defaultNoError);
  const [formError, setFormError] = useState(defaultNoError);

  React.useEffect(() => {
    validateForm();
  }, [email, password]);

  const validateForm = () => {
    setPasswordError(defaultNoError);
    setEmailError(defaultNoError);

    if (!password) {
      setPasswordError({
        value: true,
        message: "Password is required",
      });
    } else if (password.length < 6) {
      setPasswordError({
        value: true,
        message: "Password must be at least 6 characters.",
      });
    } else {
      setPasswordError({
        value: false,
        message: "",
      });
    }

    if (!email) {
      setEmailError({
        value: true,
        message: "Email is required",
      });
    } else if (!EMAIL_REGEX.test(email)) {
      setEmailError({
        value: true,
        message: "Email format is invalid",
      });
    } else {
      setEmailError({
        value: false,
        message: "",
      });
    }
  };

  const loginWithGoogleAndRedirect = async () => {
    const result = await signInWithGoogle();
    if (result) {
      router.push("/");
    }
  };

  const loginAndRedirect = async (email: string, password: string) => {
    const result = await loginUser(email, password);

    if (result && result.length > 0) {
      setFormError({
        value: true,
        message: result,
      });
    } else if (!formError.value) {
      router.push("/");
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!emailError.value && !passwordError.value) {
      loginAndRedirect(email, password);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
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
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            error={emailError.value && emailError.value}
            helperText={emailError.value && emailError.message}
            onChange={(event) => setEmail(event.target.value)}
          />
          <PasswordInput
            required
            label="Password"
            value={password}
            error={passwordError.value && passwordError.value}
            helperText={passwordError.message}
            onChange={(value) => setPassword(value)}
          />
          {formError.value && (
            <Alert severity="error">{formError.message}</Alert>
          )}
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
