import { useState } from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { UserProvider } from "@/entities/user";
import { AuthProvider, ModalProvider } from "@/shared/context";
import { ModalRenderer } from "@/shared/lib";
import { NotFound } from "@/shared/components";
import { Navigation } from "@/widgets/Navigation/";
import { FilterProvider } from "@/features/filter/common";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { Toaster } from "@/shared/ui/sonner";
import { CatalogProvider } from "@/widgets/catalog/model/context/catalog.context";

const RootComponent = () => {
  const [queryClient] = useState(() => new QueryClient({}));

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
                  <CatalogProvider>
                    <div className="flex flex-col h-screen">
                      <div className="flex-1 overflow-y-auto">
                        <Outlet />
                      </div>
                      <Navigation />
                    </div>
                    <Toaster position="top-center" />
                    <ModalRenderer />
                  </CatalogProvider>
                </TooltipProvider>
              </FilterProvider>
            </UserProvider>
          </QueryClientProvider>
        </ModalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => <NotFound />,
});
