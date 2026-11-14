import type { Metadata } from "next";
import "./globals.css";


export const metadata = {
  title: "Krishna Algure | Frames with Feeling",
  description:
    "Cinematic films, creative storytelling and advertisement films by Krishna Algure.",
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