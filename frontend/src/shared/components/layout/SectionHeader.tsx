import React, { type ReactNode } from "react";
import { ChevronRight } from "lucide-react";

import Link from "@/shared/ui/link";
import { cn } from "@/shared/lib/utils";

interface Props {
  title: ReactNode;
  subtitle?: ReactNode;
  href?: string;
  className?: string;
}

export const SectionHeader: React.FC<Props> = ({
  title,
  subtitle,
  href,
  className,
}) => {
  const content = (
    <>
      <div className="min-w-0">
        <h2 className="truncate text-lg font-bold">{title}</h2>
        {subtitle && (
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {href && (
        <span className="flex shrink-0 items-center text-sm font-semibold text-primary">
          Все
          <ChevronRight className="size-4" />
        </span>
      )}
    </>
  );

  const classes = cn("flex items-center justify-between gap-3 px-4", className);

  return href ? (
    <Link href={href} className={cn(classes, "press")}>
      {content}
    </Link>
  ) : (
    <div className={classes}>{content}</div>
  );
};
