import { useContext } from "react";
import { SortingContext } from "../context/sort.context";

export const useSort = () => {
  const context = useContext(SortingContext);
  if (!context) {
    throw new Error("useSort должен использоваться внутри SortingProvider");
  }
  return context;
};
