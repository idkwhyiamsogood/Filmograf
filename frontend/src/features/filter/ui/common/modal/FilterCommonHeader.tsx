"use client";

import React, { ChangeEventHandler, InputEvent } from "react";

import { Separator } from "@/shared/ui/separator";
import { SheetClose } from "@/shared/ui/sheet";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import { useModals } from "@/shared/hooks";

interface InputProps {
  value: string;
  placeholder: string;
  handleChange: ChangeEventHandler<HTMLInputElement>;
}

interface Props {
  title: string;
  inputOptions?: InputProps;
  handleReset?: () => void;
}

export const FilterCommonHeader: React.FC<Props> = ({
  title,
  handleReset,
  inputOptions,
}) => {
  const { prevModal } = useModals();

  return (
    <div className="fixed top-0 w-full">
      <div className="flex items-center px-3 justify-between h-10">
        <div className="flex gap-2.5">
          <SheetClose
            autoFocus={false}
            className="outline-none"
            onClick={prevModal}
          >
            <ArrowLeft size={16} />
          </SheetClose>

          <h3 className="text-sm font-medium">{title}</h3>
        </div>

        {handleReset && (
          <Button onClick={handleReset} variant={"ghost"} className="text-sm font-medium">
            Сбросить
          </Button>
        )}
      </div>

      <Separator />

      {/* input */}
      {inputOptions && <Input placeholder={inputOptions.placeholder} value={inputOptions.value} onChange={inputOptions.handleChange} className="border-0"/>}
    </div>
  );
};
