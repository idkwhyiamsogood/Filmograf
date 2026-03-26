import { useContext } from "react";

import { FilterContext } from "../context/filter.context";

export const useFilter = () => {
  const context = useContext(FilterContext);
  
  if (!context) {
    throw new Error("useFilterContext must be used within a FilterProvider");
  }
  
  return context;
};
