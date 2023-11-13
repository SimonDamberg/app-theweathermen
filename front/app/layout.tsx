import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import NavbarComponent from "./components/NavbarComponent";
import React from "react";
import LocationComponent from "./components/LocationComponent";

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
        <div className="grid grid-rows-2 grid-flow-col gap-8 m-16">
          <div className="row-span-3">
            <LocationComponent name="Uppsala" />
          </div>
          <LocationComponent name="Pling Plong" />
          <LocationComponent name="Kista" />
          <LocationComponent name="Las Vegas" />
        </div>
      </body>
    </html>
  );
}
