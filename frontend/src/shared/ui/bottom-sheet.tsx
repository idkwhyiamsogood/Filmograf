import React, { type ReactNode } from "react";
import { ChevronLeft, X } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { useSheetDrag } from "@/shared/hooks/useSheetDrag";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/shared/ui/sheet";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /** Кнопка справа в шапке (например, «Сбросить») */
  headerAction?: ReactNode;
  /** Стрелка «назад» вместо крестика — для внутренних экранов шторки */
  onBack?: () => void;
  /** auto — по контенту (до 88% экрана), tall — почти на весь экран */
  size?: "auto" | "tall";
  /** Центрированная шапка для «диалоговых» шторок (вход, подтверждение) */
  centered?: boolean;
  className?: string;
  bodyClassName?: string;
}

/**
 * Единая шторка приложения на shadcn Sheet (side="bottom").
 * Ручка + шапка — зона свайпа вниз для закрытия; закрытие по оверлею, Esc,
 * крестику — с анимацией. На широких экранах ограничена по ширине.
 */
export const BottomSheet: React.FC<Props> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  headerAction,
  onBack,
  size = "auto",
  centered,
  className,
  bodyClassName,
}) => {
  const close = () => onOpenChange(false);
  const { contentRef, dragHandleProps } = useSheetDrag(close);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        ref={contentRef}
        side="bottom"
        showCloseButton={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className={cn(
          "mx-auto w-full max-w-lg gap-0 rounded-t-[28px] border-x-0 border-t bg-popover p-0 text-popover-foreground shadow-2xl sm:border-x",
          "data-[state=open]:duration-300 data-[state=closed]:duration-200",
          size === "tall" ? "h-[92dvh]" : "max-h-[88dvh]",
          className,
        )}
      >
        {/* Зона свайпа: ручка + шапка */}
        <div {...dragHandleProps} className="shrink-0 cursor-grab select-none active:cursor-grabbing">
          <div className="flex justify-center pt-2.5 pb-1">
            <span className="h-1.5 w-10 rounded-full bg-muted-foreground/30" />
          </div>

          <div
            className={cn(
              "flex items-start gap-2 px-5 pt-1 pb-3",
              centered && "flex-col items-center text-center",
            )}
          >
            {onBack && (
              <button
                type="button"
                aria-label="Назад"
                onClick={onBack}
                className="press -ml-2 flex size-9 shrink-0 items-center justify-center rounded-full hover:bg-accent"
              >
                <ChevronLeft className="size-6" />
              </button>
            )}
            <div className={cn("min-w-0 flex-1", onBack && "pt-1")}>
              <SheetTitle className={cn("text-lg leading-tight font-extrabold", !title && "sr-only")}>
                {title ?? "Диалог"}
              </SheetTitle>
              <SheetDescription
                className={cn("mt-1 text-sm text-muted-foreground", !description && "sr-only")}
              >
                {description ?? ""}
              </SheetDescription>
            </div>
            {!centered && (
              <div className="flex shrink-0 items-center gap-1">
                {headerAction}
                {!onBack && (
                  <button
                    type="button"
                    aria-label="Закрыть"
                    onClick={close}
                    className="press flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4", bodyClassName)}>
          {children}
        </div>

        {footer && (
          <div className="shrink-0 border-t bg-popover px-5 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            {footer}
          </div>
        )}
        {!footer && <div className="shrink-0 pb-safe" />}
      </SheetContent>
    </Sheet>
  );
};

/** Строка-переключатель в стиле настроек iOS для шторок. */
export const SheetOptionRow: React.FC<{
  title: ReactNode;
  description?: ReactNode;
  control: ReactNode;
  disabled?: boolean;
}> = ({ title, description, control, disabled }) => (
  <label
    className={cn(
      "flex items-center gap-3 px-4 py-3.5",
      disabled ? "pointer-events-none opacity-45" : "cursor-pointer",
    )}
  >
    <div className="min-w-0 flex-1">
      <p className="text-[15px] font-semibold">{title}</p>
      {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
    </div>
    {control}
  </label>
);

/** Сгруппированный блок строк (как в профиле). */
export const SheetGroup: React.FC<{ title?: string; children: ReactNode; className?: string }> = ({
  title,
  children,
  className,
}) => (
  <section className={cn("space-y-2", className)}>
    {title && (
      <h3 className="px-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">{title}</h3>
    )}
    <div className="divide-y overflow-hidden rounded-2xl bg-muted/50">{children}</div>
  </section>
);
