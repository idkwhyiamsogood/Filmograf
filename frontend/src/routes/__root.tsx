import { Suspense, useEffect, useState } from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { UserProvider } from "@/entities/user";
import { AuthProvider } from "@/shared/context";
import { ModalProvider, ModalRenderer, useModals } from "@/shared/contexts/modal-context";
import { modalBridge } from "@/shared/services/modalBridge";
import { NotFound, ServerError, LoadingSplashScreen } from "@/shared/components";
import { Navigation } from "@/widgets/Navigation/";
import { FilterProvider } from "@/features/filter/common";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { Toaster } from "@/shared/ui/sonner";
import { CatalogProvider } from "@/widgets/catalog/model/context/catalog.context";

// Регистрирует живой openModal/closeModal/activeModals модуля modal-context
// в modalBridge — чтобы код вне React (ErrorService, дёргается из
// axios-интерцептора) тоже мог открывать модалки.
const ModalBridgeRegistrar = () => {
  const { openModal, closeModal, activeModals } = useModals();

  useEffect(() => {
    // openModal — дженерик `<K extends ModalType>(...args: OpenModalArgs<K>)`,
    // структурно не сводится к упрощённой (type, props?) сигнатуре моста —
    // это ожидаемо, мост намеренно слабо типизирован (см. modalBridge.ts).
    modalBridge.register(openModal as never, closeModal, activeModals);
  });

  return null;
};

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
          <ModalBridgeRegistrar />
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
                    <Suspense fallback={<LoadingSplashScreen />}>
                      <ModalRenderer />
                    </Suspense>
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
  errorComponent: ({ reset }) => <ServerError onRetry={reset} />,
});
