"use client";
import Image from "next/image";
import Button from "@mui/material/Button";
import { Poppins } from "next/font/google";
import { ThemeProvider, createTheme } from "@mui/material/styles";

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

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <main>
        <div>
          <p>
            <Image
              src="/logo-full.svg"
              alt="Iceday logo"
              width={100}
              height={24}
              priority
            />
            <Button variant="contained">Hello this is a button</Button>
          </p>
        </div>
      </main>{" "}
    </ThemeProvider>
  );
}
