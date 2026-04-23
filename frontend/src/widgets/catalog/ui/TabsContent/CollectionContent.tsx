"use client";

import type { FC } from "react";
import type { SearchTypeCollection } from "@/shared/types";
import { TabsContent } from "@/shared/ui/tabs";
import { 
  CollectionWrapper, 
  CollectionSkeletonWrapper, 
  useInfiniteCollections, 
  useCollections 
} from "@/entities/collection";
import { useMemo, useEffect, memo } from "react";
import { useInView } from "react-intersection-observer";
import { useCatalog } from "../../model/hooks/useCatalog";
import { LoadingSplashScreen } from "@/shared/components";

interface Props {
  type: SearchTypeCollection;
}

export const CollectionContent: FC<Props> = memo(({ type }) => {
  console.log(type);

  const { data: searchData, isFetching: isSearchLoading, activeType, query } = useCatalog();

  const { data: searchCollections } = useCollections(searchData.entityIds || []);

  const { 
    collections, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading 
  } = useInfiniteCollections({ 
    pageSize: 20, 
    type: type
  });

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  const collectionsToDisplay = useMemo(() => {
    if (query.trim() !== "") {
      if (activeType === "Collection" && searchData?.entityIds?.length > 0) {
        return searchCollections ?? [];
      }

      return [];
    }
    return collections ?? [];
  }, [activeType, query, searchData, searchCollections, collections]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && query.trim() === "") {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, query]);

  if (isLoading || isSearchLoading) return 
    <LoadingSplashScreen />

  if (query.trim() !== "" && collectionsToDisplay.length === 0) {
    return (
      <TabsContent value="Collection">
        <div className="text-center py-8">
          <p className="text-gray-500">Не найдено подборок "{query}"</p>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="Collection">
      <CollectionWrapper collections={collectionsToDisplay} />

      {query.trim() === "" && (
        <div className="py-8">
          {isFetchingNextPage && <CollectionSkeletonWrapper count={10} />}
        </div>
      )}

      {query.trim() === "" && <div ref={ref} className="py-4" />}
    </TabsContent>
  );
});