import type { FC } from "react";

import Link from "@/shared/ui/link";
import { cn } from "@/shared/lib/utils";
import { usePathname } from "@/shared/lib/router-compat";
import { tabBarItems, type TabBarItem } from "@/shared/configs";

const isActive = (item: TabBarItem, pathname: string) => {
  const prefixes = [item.url, ...(item.match ?? [])];
  return prefixes.some((p) =>
    p === "/" ? pathname === "/" : pathname === p || pathname.startsWith(`${p}/`),
  );
};

export const Navigation: FC = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Основная навигация"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-surface-glass backdrop-blur-xl pb-safe"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2">
        {tabBarItems.map((item) => {
          const active = isActive(item, pathname);
          const Icon = item.icon;

          return (
            <li key={item.url} className="flex-1">
              <Link
                href={item.url}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "press relative flex flex-col items-center gap-1 pt-2.5 pb-2 text-[11px] font-semibold transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0 h-0.5 w-8 rounded-full bg-primary transition-opacity",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
                <Icon
                  className="size-[22px]"
                  strokeWidth={active ? 2.4 : 1.8}
                  fill={active && item.url !== "/catalog" ? "currentColor" : "none"}
                  fillOpacity={0.15}
                />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
