import React, { type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";

interface Props {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export const EmptyState: React.FC<Props> = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-3 px-8 py-14 text-center animate-fade-up",
      className,
    )}
  >
    <div className="flex size-16 items-center justify-center rounded-2xl bg-brand-soft text-primary">
      <Icon className="size-7" />
    </div>
    <div className="space-y-1">
      <p className="text-base font-bold">{title}</p>
      {description && (
        <p className="mx-auto max-w-xs text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
    {action && <div className="mt-1">{action}</div>}
  </div>
);
