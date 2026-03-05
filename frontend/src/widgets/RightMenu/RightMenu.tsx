"use client";

import React from "react";

import { useModals } from "@/shared/hooks";
import { Sheet, SheetContent } from "@/shared/ui/sheet";
import { useUser } from "@/entities/user";

export const RightMenu: React.FC = () => {
  const { isOpen, closeModal, modalProps } = useModals();
  const { user } = useUser();

  return (
    <Sheet open={isOpen} onOpenChange={closeModal}>
      <SheetContent 
        side="right" 
        className="p-0"
        showCloseButton={false}
      >
        
      </SheetContent>
    </Sheet>
  );
};