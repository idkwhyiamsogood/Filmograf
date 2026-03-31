// types
import type { FC } from "react";

// ui
import { ModalType } from "@/shared/types";
import { Button } from "@/shared/ui/button";

interface Props {
  text: string;
  handleOpenModal: (modalType: ModalType, modalProps: any) => void;
}

export const CommandEmpty: FC<Props> = ({ text, handleOpenModal }) => {
  return (
    <div className="text-base flex flex-col gap-2.5 items-cnter justify-center">
      По вашему запросу ничего не найдено
      <div className="flex items-center justify-center">
        <Button
          variant={"default"}
          onClick={() => {
            handleOpenModal("create-tag", { text });
          }}
          className="w-2/3"
        >
          Создать новый тег?
        </Button>
      </div>
    </div>
  );
};
