import React, { type ReactNode } from "react";
import { Dialog as SheetPrimitive } from "radix-ui";

import { cn } from "@/shared/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/**
 * Нижняя шторка в мобильном стиле: скруглённый верх, «ручка», отступ под
 * home-indicator. На широких экранах центрируется и ограничивается по ширине.
 */
export const BottomSheet: React.FC<Props> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}) => (
  <SheetPrimitive.Root open={open} onOpenChange={onOpenChange}>
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
      <SheetPrimitive.Content
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[88dvh] w-full max-w-lg flex-col rounded-t-3xl border-t bg-popover text-popover-foreground shadow-2xl outline-none",
          "data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=open]:duration-300",
          "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=closed]:duration-200",
          className,
        )}
      >
        <div className="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-muted-foreground/30" />
        <div className="px-5 pt-3 pb-2">
          <SheetPrimitive.Title
            className={cn("text-lg font-bold", !title && "sr-only")}
          >
            {title ?? "Диалог"}
          </SheetPrimitive.Title>
          <SheetPrimitive.Description
            className={cn(
              "mt-1 text-sm text-muted-foreground",
              !description && "sr-only",
            )}
          >
            {description ?? ""}
          </SheetPrimitive.Description>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">{children}</div>
        {footer && <div className="border-t px-5 pt-3 pb-safe">{footer}</div>}
        {!footer && <div className="pb-safe" />}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  </SheetPrimitive.Root>
);
