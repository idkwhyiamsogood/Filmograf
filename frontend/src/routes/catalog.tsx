import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { CommonWrapper } from "@/shared/components";
import { SortingProvider } from "@/features/sort/";
import { CatalogProvider } from "@/widgets/catalog/model/context/catalog.context";
import { CatalogClientPage } from "@/widgets/catalog/ui/CatalogClientPage";
import { AuthProvider } from "@/shared/context";

export const Route = createFileRoute("/catalog")({
  component: CatalogRoute,
  errorComponent: CatalogError,
});

function CatalogPage() {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[30px] font-bold">Каталог</span>
      <CatalogClientPage />
    </div>
  );
}

function CatalogLayout({ children }: { children: React.ReactNode }) {
  return (
    <CatalogProvider>
      <SortingProvider>
        <AuthProvider>
          <CommonWrapper>{children}</CommonWrapper>
        </AuthProvider>
      </SortingProvider>
    </CatalogProvider>
  );
}

function CatalogRoute() {
  return (
    <CatalogLayout>
      <CatalogPage />
    </CatalogLayout>
  );
}

function CatalogError({ error }: { error: unknown }) {
  useEffect(() => {
    console.error("Пойманная ошибка:", error instanceof Error ? error.message : error);
  }, [error]);

  return (
    <CatalogLayout>
      <CatalogPage />
    </CatalogLayout>
  );
}
