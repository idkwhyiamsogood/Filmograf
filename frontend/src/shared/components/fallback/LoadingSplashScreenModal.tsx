"use client";

import { FC } from "react";
import { Spinner } from "@/shared/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui/dialog";
import { useModals } from "@/shared/hooks";

interface Props {
  message?: string;
  showMessage?: boolean;
}

import type { BaseModalProps } from "@/shared/types";

export const LoadingSplashScreenModal: FC<BaseModalProps & Props> = ({
  isOpen,
  message,
  showMessage,
}) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogTitle hidden>Загрузка</DialogTitle>
        <DialogDescription hidden>
          Дождитесь окончания загрузки
        </DialogDescription>

        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <Spinner className="opacity-65 h-12 w-12" />
          {showMessage && (
            <div className="text-sm opacity-65 text-center">{message}</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
