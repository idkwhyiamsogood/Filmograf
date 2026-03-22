"use client";

import React, { type FormEvent } from "react";

import { useModals } from "@/shared/hooks";
import { toast } from "sonner";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

interface IConfirmationModalProps {
  title?: string;
  deskription?: string;
  confirmText?: string;
  function: Function;
}

export const ConfirmationModal: React.FC = () => {
  const { isOpen, closeModal, modalProps } = useModals();

  const receivedData = modalProps as IConfirmationModalProps;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await receivedData.function();
    } catch (error) {
      toast.error(
        "Произошла непредвиденная ошибка, пожалуйста повторите позже",
      );
    }

    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent showCloseButton={false}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader className="text-left">
            <DialogTitle>{receivedData.title ? receivedData.title : "Вы уверены?"}</DialogTitle>
            <DialogDescription>
              {receivedData.deskription
                ? receivedData.deskription
                : "Данное действие является необратимым."}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-row justify-end">
            <DialogClose asChild>
              <Button variant="outline">Отмена</Button>
            </DialogClose>
            <Button type="submit">
              {receivedData.confirmText
                ? receivedData.confirmText
                : "Подтвердить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
