// types
import type { FC } from "react";

// ui
import { Button } from "@/shared/ui/button";
import { FunnelPlus } from "lucide-react";

// hooks
import { useModals } from "@/shared/contexts/modal-context";

export const FilterButton: FC = () => {
  const { openModal } = useModals();

  return (
    <Button
      onClick={() => openModal("search-filter")}
      variant={"secondary"}
    >
      Фильтры
      <FunnelPlus className="size-4" />
    </Button>
  );
};
