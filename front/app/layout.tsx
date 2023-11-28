import type { Metadata } from "next";

import "./globals.css";
import React from "react";
import { AuthContextProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "The Weathermen",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
