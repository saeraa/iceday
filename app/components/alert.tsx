import { Alert, AlertColor } from "@mui/material";

interface AlertProps {
  children?: React.ReactNode;
  state: {
    message: string;
    status: AlertColor;
    errors?: {} | null;
  };
}

export default function (state: AlertProps) {
  const { message, status } = state.state;
  return message ? <Alert severity={status && status}>{message}</Alert> : null;
}
