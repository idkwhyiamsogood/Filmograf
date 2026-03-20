"use client";

import { collectionApi, useCollections } from "@/entities/collection/";
import React, { useEffect, useState } from "react";

import { CollectionSelector } from "@/widgets/collection-selector";
import {
  CreateCollectionButton,
  EditCollectionButton,
} from "@/widgets/collection-editor";

interface Props {
  className?: string;
}

const Page: React.FC<Props> = ({ className }) => {
  const [collectionsIds, setCollectionsIds] = useState<string[]>([]);

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

  console.log(collections);

  return (
    <div className={className}>
      <h1 className="text-foreground text-xl font-semibold">Коллекции</h1>
      <CollectionSelector collections={collections || []} onClick={() => {}} />
      <div className="flex gap-2.5 max-w-full">
        <CreateCollectionButton />
        <EditCollectionButton />
      </div>
    </div>
  );
};

export default Page;
