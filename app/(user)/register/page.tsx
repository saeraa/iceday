"use client";

import { Alert, Checkbox, FormControlLabel, Link } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";
import { createNewUser, loginWithGoogle } from "@/utils/firebase-account";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PasswordInput from "@/app/components/password-input-controlled";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

const defaultNoError = {
  value: false,
  message: "",
};
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(defaultNoError);
  const [email, setEmail] = useState("");
  const [passwordOne, setPasswordOne] = useState("");
  const [passwordTwo, setPasswordTwo] = useState("");
  const [emailAlerts, setEmailAlerts] = useState(false);
  const router = useRouter();

  const registerAndRedirect = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await createNewUser(email, password, emailAlerts);

      if (result && result != "User created successfully") {
        setFormError({
          value: true,
          message: result,
        });
      } else if (formError.value === false) {
        router.push("/");
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateForm();
  }, [email, passwordOne, passwordTwo]);

  const validateForm = () => {
    setFormError(defaultNoError);

    if (!passwordOne) {
      setFormError({
        value: true,
        message: "Password is required",
      });
    } else if (passwordOne.length < 6) {
      setFormError({
        value: true,
        message: "Password must be at least 6 characters.",
      });
    } else {
      setFormError(defaultNoError);
    }

    if (!email) {
      setFormError({
        value: true,
        message: "Email is required",
      });
    } else if (!EMAIL_REGEX.test(email)) {
      setFormError({
        value: true,
        message: "Email format is invalid",
      });
    } else {
      setFormError(defaultNoError);
    }

    if (passwordOne !== passwordTwo) {
      setFormError({
        value: true,
        message: "Passwords do not match",
      });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(defaultNoError);

    if (formError.value) {
      return;
    } else {
      registerAndRedirect(email, passwordOne);
    }
  };

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
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2} marginBlock={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email Address"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                name="email"
                id="signUpEmail"
              />
            </Grid>
            <Grid item xs={12}>
              <PasswordInput
                label="Password"
                value={passwordOne}
                onChange={(value) => setPasswordOne(value)}
              />
            </Grid>
            <Grid item xs={12}>
              <PasswordInput
                label="Password"
                value={passwordTwo}
                onChange={(value) => setPasswordTwo(value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    value="emailAlerts"
                    color="primary"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                  />
                }
                label="Receive email alerts for games I favourite."
              />
            </Grid>
          </Grid>
          {formError.value && (
            <Alert severity="error">{formError.message}</Alert>
          )}
          <Button
            disabled={formError.value && formError.value}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? "Signing Up..." : "Sign Up"}
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
