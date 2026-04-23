import React from "react";

import { Button } from "@/shared/ui/button";
import { Trash2, Search } from "lucide-react";
import { Separator } from "@/shared/ui/separator";

interface Props {
  handleResetFilter: () => void;
  handleSubmit: () => void;
}

export const FilterFooter: React.FC<Props> = ({
  handleResetFilter,
  handleSubmit,
}) => {
  return (
    <div className="fixed bottom-0 w-full">
      <Separator />

      <div className="flex gap-2.5 items-center justify-center mx-auto p-5">
        <Button
          onClick={handleResetFilter}
          variant="destructive"
          className="p-2.5!"
        >
          <Trash2 size={16} /> Сбросить фильтры
        </Button>

        <Button
          onClick={handleSubmit}
          variant="default"
          className="p-2.5! bg-emerald-600 hover:bg-emerald-700 text-accent-foreground"
        >
          Применить <Search size={16} />
        </Button>
      </div>
    </div>
  );
};
