"use client";

import React, { useCallback } from "react";
import {
  CollectionCarousel,
  useInfiniteCollections,
} from "@/entities/collection/";

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
  const { collections, isLoading, isError, fetchNextPage, hasNextPage } =
    useInfiniteCollections({
      pageSize,
      type,
    });

  const handleFetch = useCallback(() => {
    if (hasFetch && hasNextPage) {
      fetchNextPage();
    }
  }, [hasFetch, hasNextPage, fetchNextPage]);

  if (isError) {
    return null;
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
