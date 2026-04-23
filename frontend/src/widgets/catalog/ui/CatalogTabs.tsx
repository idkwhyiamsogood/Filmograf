"use client";

import { memo, useEffect, type FC } from "react";
import { useParams, useSearchParams } from "next/navigation";

// types
import type {
  EntityType,
  SearchTypeMovie,
  SearchTypeCollection,
} from "@/shared/types";

// ui
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { CollectionContent } from "./TabsContent/CollectionContent";
import { MovieContent } from "./TabsContent/MovieContent";

// hooks
import { useCatalog } from "../model/hooks/useCatalog";
import { useGenresFilter } from "@/features/filter";

export const CatalogTabs: FC = memo(() => {
  const { activeType, setActiveType } = useCatalog();
  const { toggleGenre } = useGenresFilter();
  const params = useSearchParams();

  const searchTypeParams = params.get("searchType");
  const typeParams = params.get("type");
  const genre = params.get("genres");

  useEffect(() => {
    if (genre) {
      console.log(genre);
      toggleGenre(genre);
      toggleGenre(genre);
    }
  }, []);

  const currentTab = (typeParams as EntityType) || activeType;

  const contentType = searchTypeParams;

  return (
    <Tabs
      value={currentTab}
      onValueChange={(value) => setActiveType(value as EntityType)}
    >
      <TabsList className="w-full border-0">
        <TabsTrigger value="Movie">Фильмы</TabsTrigger>
        <TabsTrigger value="Collection">Подборки</TabsTrigger>
      </TabsList>

      {currentTab === "Movie" && (
        <MovieContent
          type={contentType ? (contentType as SearchTypeMovie) : "top"}
        />
      )}

      {currentTab === "Collection" && (
        <CollectionContent
          type={contentType ? (contentType as SearchTypeCollection) : "popular"}
        />
      )}
    </Tabs>
  );
});

CatalogTabs.displayName = "CatalogTabs";
