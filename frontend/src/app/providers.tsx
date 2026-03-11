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

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  const queryClient = new QueryClient();

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
            <QueryClientProvider client={queryClient}>
              <CollectionProvider>
                <UserProvider>
                  <CommonWrapper>
                    <Header />
                    {children}
                    <ReactQueryDevtools initialIsOpen={false} />
                    <ModalRenderer />
                  </CommonWrapper>
                </UserProvider>
              </CollectionProvider>
            </QueryClientProvider>
            <Navigation />
          </ModalProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
};
