import React, { type ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { useRouter } from "@/shared/lib/router-compat";

interface Props {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Показать кнопку «назад» */
  back?: boolean;
  actions?: ReactNode;
  className?: string;
}

export const PageHeader: React.FC<Props> = ({
  title,
  subtitle,
  back,
  actions,
  className,
}) => {
  const router = useRouter();

  return (
    <header className={cn("flex items-end justify-between gap-3", className)}>
      <div className="flex min-w-0 items-center gap-1">
        {back && (
          <button
            type="button"
            aria-label="Назад"
            onClick={() => router.back()}
            className="press -ml-2 flex size-9 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-accent"
          >
            <ChevronLeft className="size-6" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-[26px] leading-tight font-extrabold">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
    </header>
  );
};
