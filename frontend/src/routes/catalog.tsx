import { createFileRoute } from "@tanstack/react-router";

import { CommonWrapper, PageHeader } from "@/shared/components";
import { SortingProvider } from "@/features/sort/";
import { CatalogClientPage } from "@/widgets/catalog/ui/CatalogClientPage";

export const Route = createFileRoute("/catalog")({
  component: CatalogRoute,
});

// CatalogProvider подключён в корне — запрос и фильтры переживают переход
// на карточку фильма и обратно.
function CatalogRoute() {
  return (
    <SortingProvider>
      <CommonWrapper className="gap-4">
        <PageHeader title="Каталог" />
        <CatalogClientPage />
      </CommonWrapper>
    </SortingProvider>
  );
}
