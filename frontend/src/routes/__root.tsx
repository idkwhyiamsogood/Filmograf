import { Suspense, useEffect, useRef, useState } from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { createQueryClient } from "@/shared/lib/query/queryClient";

import { UserProvider } from "@/entities/user";
import { AppearanceProvider, AuthProvider } from "@/shared/context";
import { BootSplash } from "@/widgets/BootSplash";
import { useClipboardLink } from "@/features/clipboard-link";
import { useAuth } from "@/shared/hooks";
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

// Пока нет токена (первый запуск, гостевой токен ещё не пришёл) — сплэш,
// чтобы экраны не стреляли запросами без авторизации.
const AppShell = () => {
  const { isReady, token } = useAuth();
  const queryClient = useQueryClient();
  const prevTokenRef = useRef(token.jwt);

  // Ссылка на фильм/подборку в буфере обмена — предложить перейти.
  useClipboardLink(isReady);

  // Вход/выход: оценки, история, пины и «мои» подборки принадлежат прошлому
  // пользователю — сбрасываем их в кэше, активные экраны перезапросятся.
  useEffect(() => {
    if (prevTokenRef.current && prevTokenRef.current !== token.jwt) {
      queryClient.resetQueries({
        predicate: ({ queryKey }) => {
          const [key, sub] = queryKey as [string, string?];
          return (
            ["pins", "my-rates", "movie-details", "user-light"].includes(key) ||
            (key === "infinite-movies" && (sub === "history" || sub === "recommended")) ||
            (key === "infinite-collections" && sub !== "popular")
          );
        },
      });
    }
    prevTokenRef.current = token.jwt;
  }, [token.jwt, queryClient]);

  return (
    <>
      {/* Прокручивается window: так роутер сам восстанавливает позицию
          при «назад» (каталог → фильм → обратно к тому же месту). */}
      <main className="min-h-dvh pb-[calc(4.5rem+env(safe-area-inset-bottom))]">
        {isReady ? <Outlet /> : <LoadingSplashScreen />}
      </main>
      <Navigation />
      <BootSplash ready={isReady} />
    </>
  );
};

const RootComponent = () => {
  const [queryClient] = useState(createQueryClient);


  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AppearanceProvider>
      <AuthProvider>
        <ModalProvider>
          <ModalBridgeRegistrar />
          <QueryClientProvider client={queryClient}>
            <UserProvider>
              <FilterProvider>
                <TooltipProvider>
                  <CatalogProvider>
                    <AppShell />
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
      </AppearanceProvider>
    </ThemeProvider>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => <NotFound />,
  errorComponent: ({ reset }) => <ServerError onRetry={reset} />,
});
