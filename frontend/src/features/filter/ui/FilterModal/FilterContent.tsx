"use client";

import type { TargetType } from "@/widgets/CatalogTabs";
import type { FC } from "react";

import { CommonCheckboxField } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Separator } from "@/shared/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { MessageCircleQuestionMark } from "lucide-react";
import { WrapperSheetContent } from "@/shared/components/";

import { useModals } from "@/shared/hooks";
import { useFilter } from "../../model/hooks/useFilter";

interface Props {
  targetType: TargetType;
}

export const FilterContent: FC<Props> = ({ targetType }) => {
  const { openModal } = useModals();
  const { toggleStrictMatch, filterState } = useFilter();

  return (
    <div className="my-11 h-max">
      <WrapperSheetContent>
        <div className="flex justify-between items-center py-2.5 max-h-10 h-10 mb-1">
          <CommonCheckboxField
            label="Строгое совпадение"
            handleToggle={toggleStrictMatch}
            checked={filterState.strictMatch}
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="bg-blue-400 rounded-full max-h-8 max-w-8">
                <MessageCircleQuestionMark size={12} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              При строгом совпадении результаты поиска будут содержать только те
              элементы, которые полностью соответствуют поисковому запросу.
              Частичные совпадения и похожие варианты не будут включены в
              результат.
            </TooltipContent>
          </Tooltip>
        </div>
      </WrapperSheetContent>

      <Separator />

      <WrapperSheetContent>
        <ScrollArea className="w-full mt-2.5">
          <Button
            onClick={() => {
              openModal("search-genres-filter");
            }}
          >
            клик
          </Button>
        </ScrollArea>
      </WrapperSheetContent>
    </div>
  );
};
