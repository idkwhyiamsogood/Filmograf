"use client";

import React from "react";

import { Button } from "@/shared/ui/button";
import { LogOut } from "lucide-react";

import { useUser } from "../model/hooks/useUser";
import { useModals } from "@/shared/hooks";

interface Props {
  className?: string;
}

export const LogoutButton: React.FC<Props> = ({ className }) => {
  const { logout } = useUser();
  const { closeModal } = useModals();

  const handleLogout = () => {
    try {
      logout();
    } finally {
      closeModal();
    }
  };

  return (
    <div className="flex text-red-500  items-center">
      <Button onClick={handleLogout} className="text-sm" variant={"ghost"}>
        <LogOut size={16} />
        Выйти
      </Button>
    </div>
  );
};
