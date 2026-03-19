import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "St. Georges Trust Bank Cayman",
  description: "The future of borderless banking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
