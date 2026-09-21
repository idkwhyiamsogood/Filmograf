import type { FC } from "react";

import { useCollections } from "@/entities/collection";
import { useParams } from "@/shared/lib/router-compat";

import { LoadingSplashScreen } from "@/shared/components";
import { CollectionDetails } from "@/widgets/collection/";

export const CollectionClientPage: FC = () => {
  const params = useParams();

  const { data: collection, isLoading } = useCollections(params.id as string);

  if (isLoading) return <LoadingSplashScreen />;

  if (!collection) return <div>Ничего не найдено</div>;

  return <CollectionDetails collection={collection[0]} />;
};
