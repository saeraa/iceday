"use client";

import "dayjs/locale/en-gb";

import { ThemeProvider, createTheme } from "@mui/material/styles";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AuthProvider } from "./context/Auth.context";
import { CssBaseline } from "@mui/material";
import Footer from "./components/footer";
import { LocalizationProvider } from "@mui/x-date-pickers";
import Menu from "./components/menu";
import { Poppins } from "next/font/google";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(customParseFormat);
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.tz.setDefault("Europe/Stockholm");

export const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#26a69a",
    },
    secondary: {
      main: "#8bc34a",
    },
    divider: "rgba(255,255,255,0.11)",
  },
  typography: {
    fontFamily: poppins.style.fontFamily,
  },
  components: {
    // Name of the component
    MuiButtonBase: {
      defaultProps: {
        // The props to change the default for.
        disableRipple: true, // No more ripple, on the whole application 💣!
      },
    },
  },
});

export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Menu />
          {children}
          <Footer />
        </ThemeProvider>{" "}
      </AuthProvider>
    </LocalizationProvider>
  );
}
