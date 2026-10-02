import React from "react";

import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { cn } from "@/shared/lib/utils";

interface Props {
  logo?: string;
  name?: string;
  className?: string;
}

const initials = (name?: string) =>
  (name ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

export const UserLogo: React.FC<Props> = ({ logo, name, className }) => (
  <Avatar className={className}>
    {logo && <AvatarImage src={logo} alt={name ?? "Аватар"} className="object-cover" />}
    <AvatarFallback className={cn("bg-brand-soft font-bold text-primary")}>
      {initials(name)}
    </AvatarFallback>
  </Avatar>
);
