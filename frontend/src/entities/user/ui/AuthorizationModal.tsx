import React, { useCallback, useEffect, useState } from "react";

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
import { useRouter } from "@/shared/lib/router-compat";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { Capacitor } from "@capacitor/core";

import { authApi } from "@/shared/lib";

import type { BaseModalProps } from "@/shared/types";
import { LoadingSplashScreen } from "@/shared/components";

export const AuthorizationModal: React.FC<BaseModalProps> = ({ isOpen }) => {
  const { closeModals } = useModals();
  const { temporaryToken, callAuthError, loginWithNativeGoogle } = useAuth();
  const { setCurrentUser } = useUser();

  const router = useRouter();

  const webGoogle = () => {
    authApi.googleLogin(router);
  };

  const nativeGoogle = async () => {
    try {
      await loginWithNativeGoogle();
      await setCurrentUser(); 
      closeModals();
    } catch (e) {
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (Capacitor.isNativePlatform()) {
        nativeGoogle();
      } else {
        webGoogle();
      }
    } finally {
      closeModals();
    }
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
    <Dialog open={isOpen} onOpenChange={closeModals}>
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
