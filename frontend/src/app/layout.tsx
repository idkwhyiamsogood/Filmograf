import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

// components

export const metadata: Metadata = {
  title: "Filmograf",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
