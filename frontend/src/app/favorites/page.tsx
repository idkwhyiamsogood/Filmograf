"use client";

// types
import type { FC } from "react";

// ui
import { LoadingSplashScreen } from "@/shared/components";
import { FavoritesClientPage } from "./FavoritesClientPage";

import {
  Collection,
  CollectionWrapper,
  MOCK_COLLECTIONS,
} from "@/entities/collection";

// api
import { useCollectionPins } from "@/entities/collection-pins/";

const Page: FC = () => {
  const { data: pinned, isLoading: isPinnedLoading } = useCollectionPins();

  if (isPinnedLoading) {
    return <LoadingSplashScreen />;
  }
  
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[30px] font-bold">Избранные подборки</span>
      <FavoritesClientPage pinned={pinned} />
    </div>
  );

  // return <CollectionWrapper collections={MOCK_COLLECTIONS} />
};

export default Page;
