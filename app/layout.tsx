import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KRIS AI STUDIO",
  description: "Your creative AI studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}