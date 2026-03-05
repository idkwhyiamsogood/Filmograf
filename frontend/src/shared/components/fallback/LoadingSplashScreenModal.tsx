"use client";

import { FC } from "react";
import { Spinner } from "@/shared/ui/spinner";
import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { useModals } from "@/shared/hooks";

interface ILoadingSplashScreenModalProps {
  message?: string;
  showMessage?: boolean;
}

export const LoadingSplashScreenModal: FC = () => {
  const { isOpen, modalProps } = useModals();

  const { message = "Загрузка данных", showMessage = true } =
    (modalProps as ILoadingSplashScreenModalProps) || {};

  return (
    <Dialog open={isOpen}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
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
