"use client";

import { collectionApi, useCollections } from "@/entities/collection/";
import React, { useEffect, useState } from "react";

import {
  CreateCollectionButton,
  EditCollectionButton,
} from "@/widgets/collection-editor";
import { CollectionSelector } from "@/widgets/collection-selector";


interface Props {
  className?: string;
}

const Page: React.FC<Props> = ({ className }) => {
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

  const { data: collections } = useCollections(collectionsIds);

  return (
    <div className={className}>
      <h1 className="text-foreground text-xl font-semibold">Коллекции</h1>
      <CollectionSelector
        collections={collections || []}
        onClick={setSelected}
      />
      <div className="flex gap-2.5 w-full">
        <CreateCollectionButton />
        <EditCollectionButton collectionId={selected} />
      </div>
    </div>
  );
};

export default Page;
