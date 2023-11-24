import type { Metadata } from "next";

import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  title: "The Weathermen",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <html>{children}</html>;
}
