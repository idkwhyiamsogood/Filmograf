import React, { useState } from "react";
import { AlertTriangle, HelpCircle } from "lucide-react";
import { toast } from "sonner";

import { useModals } from "@/shared/contexts/modal-context";
import { cn } from "@/shared/lib/utils";
import { BottomSheet } from "@/shared/ui/bottom-sheet";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";
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
  const [pending, setPending] = useState(false);
  const close = () => closeModal("confirmation-menu");

  const confirm = async () => {
    if (!onConfirm) return close();
    try {
      setPending(true);
      await onConfirm();
      close();
    } catch {
      toast.error("Не получилось, попробуйте ещё раз");
    } finally {
      setPending(false);
    }
  };

  const Icon = destructive ? AlertTriangle : HelpCircle;

  return (
    <BottomSheet
      open={isOpen}
      onOpenChange={(open) => !open && close()}
      hideClose
      icon={
        <span
          className={cn(
            "flex size-12 items-center justify-center rounded-2xl",
            destructive ? "bg-destructive/12 text-destructive" : "bg-brand-soft text-primary",
          )}
        >
          <Icon className="size-6" />
        </span>
      }
      bodyClassName="hidden"
      title={title ?? "Вы уверены?"}
      description={description ?? "Это действие нельзя отменить."}
      footer={
        <div className="grid grid-cols-2 gap-2 pb-1">
          <Button variant="secondary" className="h-12 rounded-xl text-[15px] font-bold" onClick={close}>
            Отмена
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            className="h-12 rounded-xl text-[15px] font-bold"
            disabled={pending}
            onClick={confirm}
          >
            {pending ? <Spinner /> : confirmText ?? "Подтвердить"}
          </Button>
        </div>
      }
    >
      {null}
    </BottomSheet>
  );
};
