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

  if (!pinned || pinned.length === 0) {
    return (
      <div className="flex flex-col gap-2.5">
        <span className="text-[20px] font-bold">Избранные подборки</span>
        <div className="flex items-center justify-center">
          Вы еще не добавили подборки в избранное.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[20px] font-bold">Избранные подборки</span>
      <FavoritesClientPage pinned={pinned} />
    </div>
  );

  // return <CollectionWrapper collections={MOCK_COLLECTIONS} />
};

export default Page;
