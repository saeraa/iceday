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
import { loginUser } from "@/utils/firebase-functions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@mui/material";

export default function LoginPage() {
  const EMAIL_REGEX =
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const router = useRouter();
  const [emailError, setEmailError] = useState({ value: false, message: "" });
  const [passwordError, setPasswordError] = useState({
    value: false,
    message: "",
  });
  const [formError, setFormError] = useState({
    value: false,
    message: "",
  });
  const [formValues, setFormValues] = useState({
    email: {
      value: "",
    },
    password: {
      value: "",
    },
  });

  React.useEffect(() => {
    validateForm();
  }, [formValues.email, formValues.password]);

  const handleChange = (
    e: React.FormEvent<HTMLInputElement> & { target: HTMLInputElement }
  ) => {
    const { target } = e;
    const { name, value } = target;
    setFormValues({
      ...formValues,
      [name]: {
        value,
      },
    });
  };

  const validateForm = () => {
    if (!formValues.password.value) {
      setPasswordError({
        value: true,
        message: "Password is required",
      });
    } else if (formValues.password.value.length < 6) {
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

    if (!formValues.email.value) {
      setEmailError({
        value: true,
        message: "Email is required",
      });
    } else if (!EMAIL_REGEX.test(formValues.email.value)) {
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

  const loginAndRedirect = async (email: string, password: string) => {
    const result = await loginUser(email, password);

    if (result && result.length > 0) {
      setFormError({
        value: true,
        message: result,
      });
    }

    if (formError.value) {
      router.push("/");
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (emailError.value == true || passwordError.value == true) {
      console.log("Form has errors. Please correct them.");
    } else {
      console.log("Form submitted successfully!");
      loginAndRedirect(formValues.email.value, formValues.password.value);
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
            value={formValues.email.value}
            error={emailError.value && emailError.value}
            helperText={emailError.value && emailError.message}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formValues.password.value}
            error={passwordError.value && passwordError.value}
            helperText={passwordError.value && passwordError.message}
            onChange={handleChange}
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
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
