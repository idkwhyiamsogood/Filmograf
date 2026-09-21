import React from "react";

import { Separator } from "@/shared/ui/separator";
import { Button } from "@/shared/ui/button";

interface Props {
  handleSubmit: () => void;
}

export const FilterCommonFooter: React.FC<Props> = ({ handleSubmit }) => {
  return (
    <div className="fixed bottom-0 w-full">
      <Separator />

      <div className="flex gap-2.5 items-center justify-center mx-auto p-5 max-w-80">
        <Button className="w-full" variant={"default"} onClick={handleSubmit}>
          Подтвердить
        </Button>
      </div>
    </div>
  );
};
