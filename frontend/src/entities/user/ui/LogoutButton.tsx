import React from "react";

import { Button } from "@/shared/ui/button";
import { LogOut } from "lucide-react";

interface Props {
  className?: string;
  onClick: () => void;
  onComplete: () => void;
}

export const LogoutButton: React.FC<Props> = ({
  className,
  onClick,
  onComplete,
}) => {
  const handleLogout = () => {
    try {
      onClick();
    } finally {
      onComplete();
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
