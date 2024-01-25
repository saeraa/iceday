"use client";

import * as React from "react";

import { Alert, AlertColor } from "@mui/material";
import { useFormState, useFormStatus } from "react-dom";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import forgotPasswordFunction from "./forgot-password-function";

const initialState = {
  message: "",
  status: "success" as AlertColor,
  errors: "",
};

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending}>
      Submit
    </Button>
  );
}

export default function FormDialog({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(
    forgotPasswordFunction,
    initialState
  );

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            const formData = new FormData(event.currentTarget);
            const thing = await formAction(formData);
            console.log(thing);
            if (state.message == "success") handleClose();
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
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
          {state.message && (
            <Alert severity={state.status && state.status}>
              {state.errors}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Submit />
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
