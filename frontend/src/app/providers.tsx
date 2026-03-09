"use client";

import React from "react";
import type { PropsWithChildren } from "react";

import { CollectionProvider } from "@/entities/collection";
import { UserProvider } from "@/entities/user";
import { CommonWrapper } from "@/shared/components";
import { AuthProvider, ModalProvider } from "@/shared/context";
import { ModalRenderer } from "@/shared/lib";
import { Header } from "@/widgets/Header/ui/Header";
import { Navigation } from "@/widgets/Navigation/";
import { ThemeProvider } from "next-themes";

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
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
            <Navigation />
          </ModalProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
};
