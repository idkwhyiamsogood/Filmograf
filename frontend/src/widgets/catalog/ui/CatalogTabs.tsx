// types
import type { EntityType } from "@/shared/types";
import { memo, type FC } from "react";

// ui
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { CollectionContent } from "./TabsContent/CollectionContent";
import { MovieContent } from "./TabsContent/MovieContent";

// hooks
import { useCatalog } from "../model/hooks/useCatalog";

export const CatalogTabs: FC = memo(() => {
  const { activeType, setActiveType } = useCatalog();

  return (
    <Tabs
      defaultValue={activeType}
      onValueChange={(value) => setActiveType(value as EntityType)}
    >
      <TabsList className="w-full border-0">
        <TabsTrigger value="Movie" className="">
          Фильмы
        </TabsTrigger>
        <TabsTrigger value="Collection">Подборки</TabsTrigger>
      </TabsList>

      <MovieContent />

      <CollectionContent />
    </Tabs>
  );
});

CatalogTabs.displayName = "CatalogTabs";
