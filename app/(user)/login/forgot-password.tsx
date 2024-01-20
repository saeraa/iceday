"use client";

import * as React from "react";

import { Alert } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { resetPassword } from "@/utils/firebase-functions";
import { useState } from "react";

const defaultNoError = {
  value: false,
  message: "",
};

export default function FormDialog({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  const [formError, setFormError] = useState(defaultNoError);
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const email = formJson.email;

            const result = await resetPassword(email);
            if (result == "Password reset email sent successfully") {
              handleClose();
            } else {
              setFormError({
                value: true,
                message: result,
              });
            }
          },
        }}
      >
        <DialogTitle>Reset password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To reset your password, enter your email and press submit.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
          {formError.value && (
            <Alert severity="error">{formError.message}</Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
