"use client";

import React, { useCallback } from "react";

import { useUser } from "@/entities/user";
import { useAuth, useModals } from "@/shared/hooks";

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
import { useRouter } from "next/navigation";

import { authApi } from "@/shared/lib";

import type { BaseModalProps } from "@/shared/types";

export const AuthorizationModal: React.FC<BaseModalProps> = ({ isOpen }) => {
  const { closeModal } = useModals();
  const { temporaryToken, callAuthError } = useAuth();
  const { setCurrentUser } = useUser();

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    authApi.googleLogin(router);
  };

  const handleLater = useCallback(() => {
    try {
      temporaryToken().then(() => {
        setCurrentUser();
      });
    } catch (e) {
      callAuthError();
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent
        showCloseButton={false}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader className="text-left">
            <DialogTitle>Авторизация</DialogTitle>
            <DialogDescription>
              Для использования всех возможностей приложения необходимо
              авторизоваться, используя учетную запись google
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-row justify-end">
            <DialogClose asChild>
              <Button variant="outline" onClick={handleLater}>
                Позже
              </Button>
            </DialogClose>
            <Button type="submit">Продолжить</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
