"use client";

import type { PropsWithChildren } from "react";
import React from "react";

import { UserProvider } from "@/entities/user";
import { AuthProvider, ModalProvider } from "@/shared/context";
import { ModalRenderer } from "@/shared/lib";
import { Navigation } from "@/widgets/Navigation/";
import { ThemeProvider } from "next-themes";

import { FilterProvider } from "@/features/filter/common";
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
            <UserProvider>
              <FilterProvider>
                <TooltipProvider>
                  <div className="flex flex-col h-screen">
                    <div className="flex-1 overflow-y-auto">{children}</div>
                    <Navigation />
                  </div>
                  <ReactQueryDevtools initialIsOpen={false} />
                  <ModalRenderer />
                </TooltipProvider>
              </FilterProvider>
            </UserProvider>
          </QueryClientProvider>
        </ModalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
