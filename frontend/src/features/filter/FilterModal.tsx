// types
import type { BaseModalProps } from "@/shared/contexts/modal-context/modals.type";
import type { FC } from "react";

// ui
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
import { FilterCommonHeader } from "./common/ui/FilterCommonHeader";
import { FilterContent } from "./ui/FilterModal/FilterContent";
import { FilterFooter } from "./ui/FilterModal/FilterFooter";

// hooks
import { useSwipe } from "@/shared/hooks";
import { useModals } from "@/shared/contexts/modal-context";
import { useCatalog } from "@/widgets/catalog/model/hooks/useCatalog";
import { useCallback, useEffect } from "react";
import { useFilter } from "./common";
import { validateFilters } from "./common/model/lib/validateFilters";
import { hasActiveFilters } from "./common/model/lib/validateFilters";

export const FilterModal: FC<BaseModalProps> = ({ isOpen }) => {
  const { closeModal } = useModals();
  const { filterState, globalReset } = useFilter();
  const { handleSearch } = useCatalog();
  const validation = validateFilters(filterState);
  const canApply = validation.isValid;

  const { translateY, isDragging, handlers } = useSwipe({
    onClose: closeModal,
    threshold: 190,
    maxDrag: 200,
  });

  const handleSubmit = () => {
    if (!canApply) return;
    closeModal();
    handleSearch();
  };

  // useEffect(() => console.log(filterState), [filterState]);

  return (
    <div className="bg-background border-accent">
      <Sheet open={isOpen} onOpenChange={() => closeModal()}>
        <SheetHeader>
          <SheetTitle hidden>Фильтры</SheetTitle>
          <SheetDescription hidden>
            Выбор фильтров для настройки поиска
          </SheetDescription>
        </SheetHeader>

        <SheetContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          side="bottom"
          className={`
            h-full
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
          showCloseButton={false}
          {...handlers}
        >
          <FilterCommonHeader title="Фильтры" handleClose={closeModal} />

          <FilterContent targetType={filterState.filterOptions.targetType} />

          <FilterFooter
            handleResetFilter={globalReset}
            handleSubmit={handleSubmit}
            disabled={!canApply}
            errorText={
              validation.errors.fromYearTo ??
              validation.errors.fromGradeTo
            }
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};
