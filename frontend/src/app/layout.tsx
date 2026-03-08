import type { Metadata } from "next";
import { CollectionProvider } from "entities/collection/";
import { CommonWrapper } from "@/shared/components/";
import { ModalProvider, AuthProvider } from "@/shared/context/";
import { UserProvider } from "@/entities/user";
import { ModalRenderer } from "@/shared/lib";
import { ThemeProvider } from "next-themes";
import "./globals.css";

// components
import { Header } from "@/widgets/Header/ui/Header";
import { Navigation } from "@/widgets/Navigation";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ModalProvider>
              <CollectionProvider>
                <UserProvider>
                  <CommonWrapper>
                    <Header />
                    {children}
                    <ModalRenderer />
                  </CommonWrapper>
                </UserProvider>
              </CollectionProvider>
              <div className="fixed bottom-0 left-0 right-0 border-t">
                <Navigation />
              </div>
            </ModalProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}