import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import type { Metadata } from "next";
import "./globals.css";
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
          <ThemeClient>{children}</ThemeClient>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
