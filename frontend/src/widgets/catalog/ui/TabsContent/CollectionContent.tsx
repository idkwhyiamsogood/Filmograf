import type { FC } from "react";
import { useEffect, memo, useMemo } from "react";
import { useInView } from "react-intersection-observer";

import { TabsContent } from "@/shared/ui/tabs";
import { 
  CollectionWrapper, 
  CollectionSkeletonWrapper, 
  useInfiniteCollections,
  type Collection 
} from "@/entities/collection";
import { EmptyState, QueryErrorState } from "@/shared/components";
import { FolderOpen, SearchX } from "lucide-react";
import type { SearchTypeCollection } from "@/shared/types";

import { useCatalog } from "../../model/hooks/useCatalog";

interface Props {
  type: SearchTypeCollection;
}

export const CollectionContent: FC<Props> = memo(({ type }) => {
  const {
    items, 
    isLoading: isSearchLoading,
    isFetchingNextPage: isSearchFetchingNext,
    hasNextPage: searchHasNext,
    fetchNextPage: fetchSearchNext,
    activeType,
    query,
    hasActiveFilters,
    isError: isSearchError,
    error: searchError,
    handleSearch,
  } = useCatalog();

  const isSearchMode = query.trim() !== "" || hasActiveFilters;

  const searchCollections = useMemo(() => {
    if (activeType !== "Collection") return [];
    return items.filter((item): item is Collection => !("year" in item));
  }, [items, activeType]);

  const { 
    collections: catalogCollections, 
    fetchNextPage: fetchCatalogNext, 
    hasNextPage: catalogHasNext, 
    isFetchingNextPage: isCatalogFetchingNext,
    isLoading: isCatalogLoading,
    isError: isCatalogError,
    error: catalogError,
    refetch: refetchCatalog,
  } = useInfiniteCollections({
    pageSize: 20, 
    type: type
  });

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  const collectionsToDisplay = isSearchMode 
    ? searchCollections 
    : (catalogCollections ?? []);

  useEffect(() => {
    if (!inView) return;

    if (isSearchMode) {
      if (searchHasNext) fetchSearchNext();
    } else {
      if (catalogHasNext) fetchCatalogNext();
    }
  }, [inView, isSearchMode, searchHasNext, catalogHasNext, fetchSearchNext, fetchCatalogNext]);

  const showInitialLoader = isSearchMode
    ? isSearchLoading && !isSearchFetchingNext && collectionsToDisplay.length === 0
    : isCatalogLoading && !isCatalogFetchingNext && collectionsToDisplay.length === 0;

  if (showInitialLoader) {
    return <CollectionSkeletonWrapper count={6} />;
  }

  const isError = isSearchMode ? isSearchError : isCatalogError;

  if (isError) {
    return (
      <TabsContent value="Collection">
        <QueryErrorState
          error={isSearchMode ? searchError : catalogError}
          onRetry={isSearchMode ? handleSearch : () => refetchCatalog()}
        />
      </TabsContent>
    );
  }

  if (isSearchMode && collectionsToDisplay.length === 0 && !isSearchLoading) {
    return (
      <TabsContent value="Collection">
        <EmptyState
          icon={SearchX}
          title="Ничего не нашлось"
          description={
            query.trim() !== ""
              ? `Подборок по запросу «${query}» нет. Попробуйте другое название.`
              : "Под эти фильтры подборок нет — ослабьте условия."
          }
        />
      </TabsContent>
    );
  }

  if (!isSearchMode && collectionsToDisplay.length === 0) {
    return (
      <TabsContent value="Collection">
        <EmptyState
          icon={FolderOpen}
          title={type === "my" ? "У вас пока нет подборок" : "Здесь пока пусто"}
          description={
            type === "my"
              ? "Создайте первую в «Закладках» — и добавляйте туда фильмы."
              : "Загляните чуть позже."
          }
        />
      </TabsContent>
    );
  }

  const isFetchingNext = isSearchMode ? isSearchFetchingNext : isCatalogFetchingNext;
  const hasMore = isSearchMode ? searchHasNext : catalogHasNext;

  return (
    <TabsContent value="Collection">
      <CollectionWrapper collections={collectionsToDisplay} />

      <div className="py-8 min-h-[100px]">
        {isFetchingNext && <CollectionSkeletonWrapper count={6} />}
        {hasMore && <div ref={ref} className="h-4" />}
      </div>
    </TabsContent>
  );
});

CollectionContent.displayName = "CollectionContent";