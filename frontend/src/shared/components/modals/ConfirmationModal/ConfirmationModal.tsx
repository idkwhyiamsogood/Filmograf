import React, { type FormEvent } from "react";
import { useModals } from "@/shared/contexts/modal-context";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import type { BaseModalProps } from "@/shared/contexts/modal-context/modals.type";
import type { ConfirmationModalProps } from "./props";

export const ConfirmationModal: React.FC<BaseModalProps & ConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  confirmText,
  onConfirm,
  destructive = true,
}) => {
  const { closeModal } = useModals();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!onConfirm) {
      toast.error("Не удалось выполнить действие");
      closeModal();
      return;
    }

    try {
      await onConfirm();
      closeModal();
    } catch (error) {
      toast.error("Произошла ошибка, пожалуйста повторите позже");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => closeModal()}>
      <DialogContent
        showCloseButton={false}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader className="text-left">
            <DialogTitle>{title ?? "Вы уверены?"}</DialogTitle>
            <DialogDescription>
              {description ?? "Данное действие является необратимым."}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              className="h-11 rounded-xl font-bold"
              onClick={() => closeModal()}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant={destructive ? "destructive" : "default"}
              className="h-11 rounded-xl font-bold"
            >
              {confirmText ?? "Подтвердить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
