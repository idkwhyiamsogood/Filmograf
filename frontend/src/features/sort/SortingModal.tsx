import type { FC } from "react";

import { useModals } from "@/shared/contexts/modal-context";
import type { BaseModalProps } from "@/shared/contexts/modal-context/modals.type";
import { BottomSheet } from "@/shared/ui/bottom-sheet";
import { Separator } from "@/shared/ui/separator";

import { SortingOptions } from "./ui/SortingOptions";
import { SortingVariants } from "./ui/SortingVariants";

export const SortingModal: FC<BaseModalProps> = ({ isOpen }) => {
  const { closeModal } = useModals();
  const close = () => closeModal("select-sorting");

  return (
    <BottomSheet open={isOpen} onOpenChange={(open) => !open && close()} title="Сортировка">
      <div className="flex flex-col gap-5 pt-1 pb-2">
        <SortingOptions />
        <Separator />
        <SortingVariants />
      </div>
    </BottomSheet>
  );
};
