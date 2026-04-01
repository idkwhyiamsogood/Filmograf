"use client";

// types
import type { FC } from "react";

import { collectionApi, useCollections } from "@/entities/collection/";
import { useEffect, useState } from "react";

import {
  CreateCollectionButton,
  EditCollectionButton,
} from "@/widgets/collection-editor";
import { CollectionSelector } from "@/widgets/collection-selector";
import { LoadingSplashScreen } from "@/shared/components";

const Page: FC = () => {
  const [collectionsIds, setCollectionsIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    const getMy = async () => {
      try {
        const { data: collectionsIds } = await collectionApi.getMy();

        if (collectionsIds) {
          setCollectionsIds(collectionsIds.ids);
        }
      } catch (e) {
        console.log(e);
      }
    };

    getMy();
  }, []);

  const { data: collections, isLoading } = useCollections(collectionsIds);

  if (isLoading) return <LoadingSplashScreen />;

  return (
    <div className="flex flex-col gap-1.25">
      <h1 className="text-foreground text-xl font-semibold">Коллекции</h1>
      <div className="flex gap-2.5 w-full">
        <CreateCollectionButton />
        <EditCollectionButton collectionId={selected} />
      </div>
      <CollectionSelector
        collections={collections || []}
        onClick={setSelected}
      />
    </div>
  );
};

export default Page;
