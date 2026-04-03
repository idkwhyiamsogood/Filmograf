"use client";

// types
import type { FC } from "react";

// ui
import { TabsContent } from "@/shared/ui/tabs";
import { CollectionWrapper } from "@/entities/collection";
import { CollectionSkeletonWrapper } from "@/entities/collection";

// hooks
import { useState, useEffect } from "react";
import { useCollections } from "@/entities/collection";

// api
import { collectionApi } from "@/entities/collection";

export const CollectionContent: FC = () => {
  const [top, setTop] = useState<string[]>([]);

  useEffect(() => {
    const getTop = async () => {
      try {
        const { data } = await collectionApi.getTop();

        if (data) setTop(data.ids);
      } catch (e) {
        console.log(e);
      }
    };

    getTop();
  }, []);

  const { data, isLoading } = useCollections(top);

  return (
    <TabsContent value="Collection">
      {isLoading || !top ? (
        <CollectionWrapper collections={data || []} />
      ) : (
        <CollectionSkeletonWrapper count={9} />
      )}
    </TabsContent>
  );
};
