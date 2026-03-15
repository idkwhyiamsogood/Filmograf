"ise client";

import type { FC } from "react";

import { useModals, useSwipe } from "@/shared/hooks";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
import { Separator } from "@/shared/ui/separator";
import { SortingOptions } from "./ui/SortingOptions";
import { SortingVariants } from "./ui/SortingVariants";
import { WrapperSheetContent } from "@/shared/components";

export const SortingModal: FC = () => {
  const { closeModal, isOpen } = useModals();
  const { translateY, isDragging, handlers } = useSwipe({
    isOpen,
    onClose: closeModal,
    threshold: 190,
    maxDrag: 200,
  });

  return (
    <Sheet open={isOpen} onOpenChange={closeModal}>
      <SheetHeader>
        <SheetTitle hidden>Сортировка</SheetTitle>
        <SheetDescription hidden>
          Выбор опции сортировки, контента
        </SheetDescription>
      </SheetHeader>

      <SheetContent
        side="bottom"
        className={`
                h-[80%]
                w-full
                bg-background 
                data-[state=open]:animate-in 
                data-[state=open]:slide-in-from-bottom 
                data-[state=closed]:animate-out 
                data-[state=closed]:slide-out-to-top
                duration-100
              `}
        style={{
          transform: `translateY(${translateY}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
          touchAction: "pan-y",
        }}
        {...handlers}
      >
        <div className="py-2.5">
          <WrapperSheetContent>
            <h3 className="mb-2.5 text-lg">Сортировка</h3>

            <SortingOptions />

            <Separator />

            <SortingVariants />
          </WrapperSheetContent>
        </div>
      </SheetContent>
    </Sheet>
  );
};
