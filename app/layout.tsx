import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import I18nProvider from "./i18n/I18nProvider";
import GlobalFooterConditional from "./components/landing/GlobalFooterConditional";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BorsaZeka Dashboard",
  description: "Algoritmik Ticaretin Gücü",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} min-h-full flex flex-col`}>
        <I18nProvider>
          {children}
          <GlobalFooterConditional />
        </I18nProvider>
      </body>
    </html>
  );
}
