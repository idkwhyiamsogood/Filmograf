"use client";

// types
import { type FC } from "react";

import { Collection } from "@/entities/collection";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { useRouter } from "next/navigation";
import { CollectionDetailsDescription } from "../ui/CollectionDetailsDescription/CollectionDetailsDescription";
import { CollectionActions } from "./CollectionActions/CollectionActions";
import { CollectionComments } from "./CollectionTabs/CollectionComments";
import { CollectionMovies } from "./CollectionTabs/CollectionMovies";
import { useUser } from "@/entities/user";

interface Props {
  collection: Collection;
}

export const CollectionDetails: FC<Props> = ({ collection }) => {
  const router = useRouter();
  const { user } = useUser();

  const handleBack = () => {
    router.back();
  };

  const { movies: movieIds } = collection;

  const userId = (user && user.id) || "";

  return (
    <div className="flex flex-col gap-2.5">
      <Card className="relative">
        <div className="my-2.5">
          <CardHeader className="space-y-2 mb-2">
            <CardTitle className="text-xl">{collection.name}</CardTitle>

            <CollectionDetailsDescription collection={collection} />
          </CardHeader>

          <CardContent className="h-full px-0">
            <Tabs defaultValue="default" className="px-2.5">
              <TabsList className="w-full" defaultValue={"default"}>
                <TabsTrigger value="default" className="">
                  Фильмы
                </TabsTrigger>
                <TabsTrigger value="comments" className="">
                  Комментарии
                </TabsTrigger>
              </TabsList>

              <CollectionMovies movieIds={movieIds} />

              <CollectionComments collection={collection} />
            </Tabs>
          </CardContent>

          <CollectionActions collection={collection} userId={userId} />
        </div>
      </Card>
    </div>
  );
};
