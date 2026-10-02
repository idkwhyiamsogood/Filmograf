import type { FC } from "react";

import { useCollections } from "@/entities/collection";
import { useParams } from "@/shared/lib/router-compat";
import { QueryErrorState } from "@/shared/components";
import { Skeleton } from "@/shared/ui/skeleton";
import { CollectionDetails } from "@/widgets/collection/";

export const CollectionClientPage: FC = () => {
  const params = useParams();

  const { data: collection, isLoading, isError, error, refetch } =
    useCollections(params.id as string);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4 px-4 pt-16">
        <Skeleton className="aspect-[2/3] w-[40%] max-w-44 rounded-xl" />
        <Skeleton className="h-7 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    );
  }

  if (isError || !collection?.[0]) {
    return (
      <QueryErrorState
        error={error}
        onRetry={() => refetch()}
        notFoundMessage="Подборка не найдена или скрыта автором"
      />
    );
  }

  return <CollectionDetails collection={collection[0]} />;
};
