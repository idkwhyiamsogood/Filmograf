"use client";

import type { PropsWithChildren } from "react";
import React from "react";

import { CollectionProvider } from "@/entities/collection";
import { UserProvider } from "@/entities/user";
import { AuthProvider, ModalProvider } from "@/shared/context";
import { ModalRenderer } from "@/shared/lib";
import { Navigation } from "@/widgets/Navigation/";
import { ThemeProvider } from "next-themes";

import { FilterProvider } from "@/features/filter/model/context/filter.context";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  const queryClient = new QueryClient();

  return (
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
                <FilterProvider>
                  <TooltipProvider>
                    {children}
                    <ReactQueryDevtools initialIsOpen={false} />
                    <ModalRenderer />
                  </TooltipProvider>
                </FilterProvider>
              </UserProvider>
            </CollectionProvider>
          </QueryClientProvider>
          <Navigation />
        </ModalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
