"use client";
import { FormEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/app/context/Auth.context";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { updateAlertPreferences } from "@/utils/firebase-functions";

export default function AccountPage() {
  const [showAlert, setShowAlert] = useState(false);
  const { user, refreshAuthenticationState } = useContext(AuthContext) || {};
  const userId = user?.uid;
  const userEmail = user?.email;

  const [emailAlerts, setEmailAlerts] = useState(
    user?.emailAlerts !== undefined ? user.emailAlerts : false
  );

  useEffect(() => {
    if (user?.emailAlerts !== undefined) {
      setEmailAlerts(user.emailAlerts);
    }
  }, [user?.emailAlerts]);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const [disabled, setDisabled] = useState(true);

  const handleSubmit = async function (event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (userId) {
      const result = await updateAlertPreferences(userId, emailAlerts);
      refreshAuthenticationState();
      setShowAlert(true);
    }
  };

  if (!user || !userId) {
    return (
      <main>
        <Box sx={{ p: 2 }}>
          <Typography variant="h5"> You're not logged in!</Typography>

          <Button href="/login" variant="outlined" sx={{ m: 1 }}>
            Log in
          </Button>
          <Button href="/" variant="text" sx={{ m: 1 }}>
            Back to the front page
          </Button>
        </Box>
      </main>
    );
  }

  return (
    <main>
      <Typography variant="h2">Account settings</Typography>
      <Grid container>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid item xs>
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

          <TextField
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            value={userEmail}
            disabled={disabled}
            name="email"
            id="signUpEmail"
          />
          <Button type="button" onClick={(e) => setDisabled(!disabled)}>
            Change
          </Button>
          <Button type="submit">Save</Button>
        </Box>
        <Snackbar
          open={showAlert}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setShowAlert(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Email preferences updated!
          </Alert>
        </Snackbar>
      </Grid>
    </main>
  );
}
