import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import NavbarComponent from "./components/NavbarComponent";
import React from "react";

const lexend = Lexend({ subsets: ["latin"] });

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
      <body className={`bg-sky-950 ${lexend.className}`}>
        <NavbarComponent />
        {children}
      </body>
    </html>
  );
}
