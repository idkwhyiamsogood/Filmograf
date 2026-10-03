import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";
import { LoadingSplashScreen } from "@/shared/components";
import { bootstrapAppearance } from "@/shared/lib/appearance";
import "./app/globals.css";

const router = createRouter({
  routeTree,
  defaultPendingComponent: LoadingSplashScreen,
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;

// Цвет и режим темы — из Preferences до первого кадра, без вспышки.
bootstrapAppearance().finally(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
  // Фон-заглушка из index.html больше не нужен: тему ведёт приложение.
  requestAnimationFrame(() => {
    document.getElementById("boot-bg")?.remove();
    delete document.documentElement.dataset.bootTheme;
  });
});
