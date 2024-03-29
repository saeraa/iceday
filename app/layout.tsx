import "./globals.css";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import type { Metadata } from "next";
import Wrapper from "./wrapper";

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
          <Wrapper>
            <main>{children}</main>
          </Wrapper>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
