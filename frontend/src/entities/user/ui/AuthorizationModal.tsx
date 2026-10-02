import React, { useState } from "react";
import { Bookmark, MessageCircle, Sparkles, Star } from "lucide-react";
import { Capacitor } from "@capacitor/core";

import { useAuth } from "@/shared/hooks";
import { useModals } from "@/shared/contexts/modal-context";
import { useRouter } from "@/shared/lib/router-compat";
import { authApi, USE_MOCKS } from "@/shared/lib";

import { Button } from "@/shared/ui/button";
import { BottomSheet } from "@/shared/ui/bottom-sheet";
import { Spinner } from "@/shared/ui/spinner";

import type { BaseModalProps } from "@/shared/contexts/modal-context/modals.type";

const BENEFITS = [
  { icon: Star, text: "Оценивайте фильмы и получайте рекомендации" },
  { icon: Bookmark, text: "Собирайте свои подборки и закрепляйте чужие" },
  { icon: MessageCircle, text: "Обсуждайте фильмы в комментариях" },
];

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
    <path fill="#4285F4" d="M22.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-7.9z" />
    <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z" />
    <path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.3V7.1H2.1a11 11 0 0 0 0 9.9l3.7-2.8z" />
    <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z" />
  </svg>
);

interface Props extends BaseModalProps {
  reason?: string;
}

export const AuthorizationModal: React.FC<Props> = ({ isOpen, reason }) => {
  const { closeModal } = useModals();
  const { loginWithNativeGoogle } = useAuth();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const close = () => closeModal("authorization-menu");

  const handleLogin = async () => {
    // Веб без моков — редирект на OAuth бэкенда, вернёмся на /auth-success.
    if (!USE_MOCKS && !Capacitor.isNativePlatform()) {
      authApi.googleLogin(router);
      return;
    }

    try {
      setIsPending(true);
      await loginWithNativeGoogle();
      close();
    } catch {
      // тост показал AuthProvider
    } finally {
      setIsPending(false);
    }
  };

  return (
    <BottomSheet
      open={isOpen}
      onOpenChange={(open) => !open && close()}
      footer={
        <div className="flex flex-col gap-2 pb-3">
          <Button
            size="lg"
            onClick={handleLogin}
            disabled={isPending}
            className="h-12 rounded-xl bg-foreground text-background hover:bg-foreground/90"
          >
            {isPending ? <Spinner /> : <GoogleIcon />}
            Продолжить с Google
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="h-11 rounded-xl text-muted-foreground"
            onClick={close}
          >
            Не сейчас
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-4 pt-1 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-soft text-primary">
          <Sparkles className="size-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-extrabold">
            {reason ? `Войдите, чтобы ${reason}` : "Войдите в Filmograf"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Смотреть каталог можно и так, а с аккаунтом всё сохранится между
            устройствами.
          </p>
        </div>
        <ul className="w-full space-y-2 text-left">
          {BENEFITS.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex items-center gap-3 rounded-xl bg-muted/60 px-3.5 py-3 text-sm"
            >
              <Icon className="size-4.5 shrink-0 text-primary" />
              {text}
            </li>
          ))}
        </ul>
      </div>
    </BottomSheet>
  );
};
