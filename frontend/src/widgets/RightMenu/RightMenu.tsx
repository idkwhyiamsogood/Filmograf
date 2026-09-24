import React, { memo, useEffect, useState } from "react";

import { useUser } from "@/entities/user";
import { useModals } from "@/shared/contexts/modal-context";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetHeader,
} from "@/shared/ui/sheet";

import { UserFull, LogoutButton } from "@/entities/user";
import { Separator } from "@/shared/ui/separator";
import { NavigationMenu } from "./ui/NavigationMenu";

import { WrapperContent } from "./ui/WrapperContent";
import { ThemeToggleFull } from "@/features/change-theme";

import type { BaseModalProps } from "@/shared/contexts/modal-context/modals.type";

export const RightMenu: React.FC<BaseModalProps> = memo(({ isOpen }) => {
  const { closeModal, openModal } = useModals();
  const { user, logout } = useUser();

  const [userAvailable, setUserAvailable] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      openModal("authorization-menu");
      setUserAvailable(false);
    }
  }, [user]);

  if (!userAvailable || !user) return null;

  return (
    <div className="bg-background border-accent-foreground">
      <Sheet open={isOpen} onOpenChange={() => closeModal()}>
        {/* ✅ Убрал дублирующийся SheetHeader */}
        <SheetHeader>
          <SheetTitle hidden>Боковая менюшка</SheetTitle>
          <SheetDescription hidden>
            Меню для управления текущим пользователем и доступа к расширенной
            навигации
          </SheetDescription>
        </SheetHeader>

        <SheetContent
          side="right"
          className="p-0"
          showCloseButton={false}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <WrapperContent>
            <div className="flex flex-col gap-4">
              <UserFull
                user={user}
                isComment={false}
                openModal={() => openModal("authorization-menu")}
              />

              <Separator />

              <NavigationMenu />

              <Separator />

              <ThemeToggleFull />

              <Separator />
            </div>

            <LogoutButton onClick={logout} onComplete={closeModal} />
          </WrapperContent>
        </SheetContent>
      </Sheet>
    </div>
  );
});

RightMenu.displayName = "RightMenu";