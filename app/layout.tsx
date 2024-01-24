import "./globals.css";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { Box } from "@mui/material";
import type { Metadata } from "next";
import ThemeClient from "./themeclient";

export const metadata: Metadata = {
  title: "Iceday",
  description: "Hockey Calendar Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeClient>
            <main>{children}</main>
          </ThemeClient>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
