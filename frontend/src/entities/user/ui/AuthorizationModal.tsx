"use client";

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
import { useRouter } from "next/navigation";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { Capacitor } from "@capacitor/core";

import { authApi } from "@/shared/lib";

import type { BaseModalProps } from "@/shared/types";
import { LoadingSplashScreen } from "@/shared/components";

export const AuthorizationModal: React.FC<BaseModalProps> = ({ isOpen }) => {
  const { closeModals } = useModals();
  const { temporaryToken, callAuthError } = useAuth();
  const { setCurrentUser } = useUser();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  const nativeGoogle = async () => {
    try {
      const googleUser = await GoogleAuth.signIn();
      const idToken = googleUser.authentication.idToken;

      if (!idToken) {
        throw new Error("No ID Token received from Google");
      }

      // 4. Отправка idToken на ваш бекенд (метод google-native)
      const response = await authApi.googleNative(idToken);
      const jwt = response.data.jwt;

      // 5. Сохранение JWT и загрузка данных профиля
      authApi.setAccessToken(jwt);
    } catch (e) {
      console.error(e);
    } finally {
      closeModals();
    }
  };

  const webGoogle = () => {
    authApi.googleLogin(router);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (Capacitor.isNativePlatform()) {
      nativeGoogle();
    } else {
      webGoogle();
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

  useEffect(() => {
    const initAndCheck = async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          GoogleAuth.initialize({
            clientId:
              "341334726956-oo7rlsn0743ot821mdqoaj5e6uk442vr.apps.googleusercontent.com",
            scopes: ["profile", "email"],
            grantOfflineAccess: true,
          });
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAndCheck();
  }, []);

  if (isLoading) return <LoadingSplashScreen />;

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
