// types
import type { EntityType } from "@/shared/types";

// hooks
import { useState, useEffect } from "react";
import { useFilter } from "@/features/filter/";

export const useCatalog = () => {
  const [activeType, setActiveType] = useState<EntityType>("Movie");

  const { updateFilterOption } = useFilter();

  useEffect(() => {
    updateFilterOption("targetType", () => {
      return activeType;
    });
  }, [activeType]);

  return {
    activeType,
    setActiveType,
  };
};
