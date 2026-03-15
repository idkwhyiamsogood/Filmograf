import React, { type ReactNode } from "react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";

interface Props {
  defaultValue: TargetType;
  childrens: ChildrenProps[];
}

interface ChildrenProps {
  value: TargetType;
  content: ReactNode;
}

export type TargetType = "movie" | "collection";

export const CatalogTabs: React.FC<Props> = ({ defaultValue, childrens }) => {
  return (
    <Tabs defaultValue={defaultValue}>
      <TabsList>
        <TabsTrigger value="movie">Фильмы</TabsTrigger>
        <TabsTrigger value="collection">Подборки</TabsTrigger>
      </TabsList>
      {childrens.map((children) => (
        <TabsContent value={children.value}>{children.content}</TabsContent>
      ))}
    </Tabs>
  );
};
