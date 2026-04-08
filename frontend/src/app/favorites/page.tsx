"use client";

// types
import type { FC } from "react";

// ui
import { LoadingSplashScreen } from "@/shared/components";
import { FavoritesClientPage } from "./FavoritesClientPage";

import { Collection, CollectionWrapper, MOCK_COLLECTIONS } from "@/entities/collection";

// api
import { useCollectionPins } from "@/entities/collection-pins/";

const Page: FC = () => {
  // const { data: pinned, isLoading: isPinnedLoading } = useCollectionPins();

  // if (isPinnedLoading) {
  //   return <LoadingSplashScreen />;
  // }
  // return <FavoritesClientPage pinned={pinned} />;

  return <CollectionWrapper collections={MOCK_COLLECTIONS} />
};

export default Page;
