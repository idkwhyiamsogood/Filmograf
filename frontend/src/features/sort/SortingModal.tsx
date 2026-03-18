"use client";

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
          Выбор опции сортировки контента
        </SheetDescription>
      </SheetHeader>

      <SheetContent
        side="bottom"
        className={`
          h-auto max-h-[85vh] overflow-y-auto overflow-x-hidden /* Сделал высоту авто, чтобы шторка не была пустой внизу */
          w-full
          bg-background 
          rounded-t-3xl /* Красивое скругление верхних углов */
          p-0 /* Убираем дефолтные паддинги Sheet, чтобы настроить свои */
          data-[state=open]:animate-in 
          data-[state=open]:slide-in-from-bottom 
          data-[state=closed]:animate-out 
          data-[state=closed]:slide-out-to-top
          duration-200 /* Чуть плавнее анимация */
        `}
        style={{
          transform: `translateY(${translateY}px)`,
          transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
          touchAction: "pan-y",
        }}
        {...handlers}
      >
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-muted-foreground/20" />

        <div className="px-6 py-8">
          <WrapperSheetContent>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                Сортировка
              </h3>
            </div>

            <div className="flex flex-col gap-6">
              <SortingOptions />
              
              <Separator className="bg-border/60" /> 
              
              <SortingVariants />
            </div>
          </WrapperSheetContent>
        </div>
      </SheetContent>
    </Sheet>
  );
};