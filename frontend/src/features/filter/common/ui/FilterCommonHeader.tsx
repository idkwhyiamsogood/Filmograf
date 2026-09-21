import React from "react";

import { CommonSearchDebounced } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { ArrowLeft } from "lucide-react";


interface InputProps {
  placeholder: string;
  handleSearch: (value: string) => void;
}

interface Props {
  title: string;
  inputOptions?: InputProps;
  handleReset?: () => void;
  handleClose: () => void;
}

export const FilterCommonHeader: React.FC<Props> = ({
  title,
  inputOptions,
  handleReset,
  handleClose
}) => {
  return (
    <div className="fixed top-0 w-full">
      <div className="flex items-center px-3 justify-between h-10">
        <div className="flex gap-2.5 items-center">
          <Button
            variant={"ghost"}
            autoFocus={false}
            className="outline-none p-0!"
            onClick={handleClose}
          >
            <ArrowLeft size={16} />
          </Button>

          <h3 className="text-sm font-medium">{title}</h3>
        </div>

        {handleReset && (
          <Button
            onClick={handleReset}
            variant={"ghost"}
            className="text-sm font-medium"
          >
            Сбросить
          </Button>
        )}
      </div>

      <Separator />

      {inputOptions && (
        <CommonSearchDebounced
          placeholder={inputOptions.placeholder}
          onSearch={inputOptions.handleSearch}
        />
      )}
    </div>
  );
};
