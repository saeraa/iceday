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
  Snackbar,
  TextField,
  Typography,
  Divider,
  DialogContent,
  DialogContentText,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import {
  updateAlertPreferences,
  deleteUserFromAuthAndDatabase,
} from "@/utils/firebase-functions";

export default function AccountPage() {
  const [wrongPassword, setWrongPassword] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [showAlert, setShowAlert] = useState(false);
  const { user, refreshAuthenticationState } = useContext(AuthContext) || {};
  const userId = user?.uid;
  const admin = user?.isAdmin;

  const [emailAlerts, setEmailAlerts] = useState(
    user?.emailAlerts !== undefined ? user.emailAlerts : false
  );
  const [userEmail, setUserEmail] = useState(
    user?.email !== undefined ? user.email : ""
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
      if (userEmail != user?.email) {
        // update user email
      }
      const result = await updateAlertPreferences(userId, emailAlerts);
      refreshAuthenticationState();
      setShowAlert(true);
    }
  };

  const handleDeleteAccount = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const password = formJson.password;
    const result = await deleteUserFromAuthAndDatabase(password);
    if (result == "Wrong password") {
      // mark field with wrong password, do not close
      setWrongPassword(true);
    } else {
      handleClose();
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
      <Box sx={{ p: 2 }}>
        <Typography variant="h4">Account settings</Typography>
        <Grid container spacing={5} sx={{ py: 3 }}>
          <Grid item xs={12} md={6}>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
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
              <TextField
                required
                fullWidth
                label="Email Address"
                autoComplete="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                disabled={disabled}
                name="email"
                id="signUpEmail"
              />
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: "row",
                  justifyContent: "end",
                }}
              >
                <Button
                  type="button"
                  onClick={(e) => setDisabled(!disabled)}
                  variant="outlined"
                >
                  Change
                </Button>
                <Button type="submit" variant="contained">
                  Save
                </Button>{" "}
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              gap: { xs: 2, md: 2 },
              display: { xs: "flex", md: "flex" },
              flexDirection: { md: "column" },
              alignItems: { md: "end" },
              justifyContent: { md: "center" },
            }}
          >
            <Button type="button" variant="outlined" onClick={handleClickOpen}>
              Delete account
            </Button>
            {admin && (
              <Button type="button" variant="contained">
                Admin panel
              </Button>
            )}
          </Grid>
        </Grid>
        <Divider variant="fullWidth" sx={{ my: 5 }} />
        <Grid container spacing={5} sx={{ py: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography>My favourite games</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography>My favourite teams</Typography>
          </Grid>
        </Grid>
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

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleDeleteAccount,
        }}
      >
        <DialogContent>
          <DialogTitle>
            <Alert severity="warning">
              Deleting your account cannot be undone. This will also delete all
              your user preferences.
            </Alert>
          </DialogTitle>
          <DialogContentText>
            Reenter your password to delete your account
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="password"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            error={wrongPassword && wrongPassword}
            helperText={wrongPassword && "Wrong password"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="outlined">
            Delete account
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}
