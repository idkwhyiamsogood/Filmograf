import type { FC } from "react";

import { Button } from "@/shared/ui/button";
import { ArrowDownUp } from "lucide-react";

import { useModals } from "@/shared/hooks";

export const SortingButton: FC = () => {
  const { openModal } = useModals();

  const handleOpenModal = () => {
    openModal("select-sorting");
  };

  return (
    <Button
      onClick={handleOpenModal}
      variant={"secondary"}
    >
      <ArrowDownUp size={16} /> Сортировка
    </Button>
  );
};
