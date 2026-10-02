import React from "react";

import { CollectionCover, useInfiniteCollections } from "@/entities/collection/";
import { QueryErrorState, Rail, SectionHeader } from "@/shared/components";
import type { SearchTypeCollection } from "@/shared/types";
import { Skeleton } from "@/shared/ui/skeleton";

interface CollectionsSectionProps {
  title: string;
  subtitle?: string;
  type: SearchTypeCollection;
  limit?: number;
  viewAllHref?: string;
}

export const CollectionsSection: React.FC<CollectionsSectionProps> = ({
  title,
  subtitle,
  type,
  limit = 10,
  viewAllHref,
}) => {
  const { collections, isLoading, isError, error, refetch } =
    useInfiniteCollections({ pageSize: limit, type });

  if (!isLoading && !isError && collections.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <SectionHeader title={title} subtitle={subtitle} href={viewAllHref} />
      {isError ? (
        <QueryErrorState
          compact
          error={error}
          onRetry={() => refetch()}
          serverErrorMessage="Не удалось загрузить подборки"
        />
      ) : (
        <Rail itemClassName="w-[46%] sm:w-[30%]">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] w-full rounded-2xl" />
              ))
            : collections.map((c) => <CollectionCover key={c.id} collection={c} />)}
        </Rail>
      )}
    </section>
  );
};
