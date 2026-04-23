"use client";

import { Collection, collectionApi, useCollections } from "@/entities/collection/";
import React, { useEffect, useState } from "react";

import {
  CreateCollectionButton,
  EditCollectionButton,
  CollectionActions,
} from "@/widgets/collection/";
import { CollectionSelector } from "@/widgets/collection";
import { LoadingSplashScreen } from "@/shared/components";
import { useCallback } from "react";

export const FavoriteClientPage: React.FC = () => {
  const [collectionsIds, setCollectionsIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("");

  const getMy = useCallback(async () => {
    try {
      const { data: collectionsIds } = await collectionApi.getMy();

      console.log(collectionsIds);

      if (collectionsIds) {
        setCollectionsIds(collectionsIds.ids);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    getMy();
  }, []);

  useEffect(() => {
    setSelected(collectionsIds[0]);
  }, [collectionsIds]);

  const { data: collections, isLoading } = useCollections(collectionsIds);

  return (
    <div className={"flex flex-col gap-1.25"}>
      <h1 className="text-foreground text-xl font-semibold">Коллекции</h1>
      <div className="flex gap-2.5 w-full justify-between items-center">
        <div className="flex gap-2.5 w-full items-center">
          <CreateCollectionButton />
          <EditCollectionButton
            collection={collections?.find((item) => item.id === selected) || {} as Collection}
          />
        </div>
        <CollectionActions collectionId={selected} onSuccess={getMy} />
      </div>

      {isLoading ? (
        <LoadingSplashScreen />
      ) : (
        <CollectionSelector
          collections={collections || []}
          onClick={setSelected}
        />
      )}
    </div>
  );
};
