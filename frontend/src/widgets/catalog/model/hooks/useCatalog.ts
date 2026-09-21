// ui
import { CatalogContext } from "../context/catalog.context";

// hooks
import { useContext } from "react";

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error("useCatalog must be used within a CatalogProvider");
  }
  return context;
};