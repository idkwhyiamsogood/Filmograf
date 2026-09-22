import React, { useCallback } from "react";
import {
  CollectionCarousel,
  useInfiniteCollections,
} from "@/entities/collection/";
import { QueryErrorState } from "@/shared/components";

interface CollectionsSectionProps {
  title: string;
  type: "popular" | "recommended" | "my";
  pageSize?: number;
  carouselType?: "full" | "partial";
  orientation?: "horizontal" | "vertical";
  hasFetch?: boolean;
  viewAllHref?: string;
}

export const CollectionsSection: React.FC<CollectionsSectionProps> = ({
  title,
  type,
  pageSize = 10,
  carouselType = "partial",
  orientation = "horizontal",
  hasFetch = false,
  viewAllHref,
}) => {
  const {
    collections,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteCollections({
    pageSize,
    type,
  });

  const handleFetch = useCallback(() => {
    if (hasFetch && hasNextPage) {
      fetchNextPage();
    }
  }, [hasFetch, hasNextPage, fetchNextPage]);

  if (isError) {
    return (
      <div className="px-2">
        <h2 className="text-xl font-semibold tracking-tight px-1 mb-2">
          {title}
        </h2>
        <QueryErrorState
          compact
          error={error}
          onRetry={() => refetch()}
          serverErrorMessage="Не удалось загрузить подборки"
        />
      </div>
    );
  }

  if (!isLoading && collections.length === 0) {
    return null;
  }

  return (
    <CollectionCarousel
      title={title}
      collections={collections}
      isLoading={isLoading}
      type={carouselType}
      orientation={orientation}
      onFetch={hasFetch ? handleFetch : undefined}
      viewAllHref={viewAllHref}
    />
  );
};
