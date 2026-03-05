import type { Metadata } from "next";
// import { Geist, Geist_Mono, Roboto } from "next/font/google";
import { CollectionProvider } from "entities/collection/";
import { CommonWrapper } from "@/shared/components/";
import { ModalProvider, AuthProvider } from "@/shared/context/";
import { UserProvider } from "@/entities/user";
import { ModalRenderer } from "@/shared/lib";
import { ThemeLayout } from "@/widgets/ThemeLayout/ThemeLayout";
import { ThemeProvider } from "next-themes";
import "./globals.css";

// components
import { Header } from "@/widgets/Header/ui/Header";
import { Footer } from "widgets/Footer";

// const roboto = Roboto({
//   variable: "--font-roboto",
//   subsets: ["latin", "cyrillic"],
//   weight: ["300", "400", "500", "700"],
// });

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

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
      <body
      // className={`${roboto.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-black/80 m-2.5`}
      >
        <AuthProvider>
          <ThemeProvider>
            <CollectionProvider>
              <ModalProvider>
                <UserProvider>
                  <CommonWrapper>
                    <Header />
                    {children}
                    <ModalRenderer />
                    <ThemeLayout />
                  </CommonWrapper>
                </UserProvider>
              </ModalProvider>
            </CollectionProvider>
            <div className="fixed bottom-0 left-0 right-0 border-t">
              <Footer />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
