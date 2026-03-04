import { useContext } from "react";
import { type CollectionContextType, CollectionContext } from "../context/collection.context";

export const useCollections = (): CollectionContextType => {
  const context = useContext(CollectionContext);
  if (context === undefined) {
    throw new Error("Необходимо подключение соответствующего провайдера!");
  }
  return context;
};
