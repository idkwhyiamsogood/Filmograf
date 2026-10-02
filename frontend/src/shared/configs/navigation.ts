import { Bookmark, Compass, Home, UserRound, type LucideIcon } from "lucide-react";

export interface TabBarItem {
  label: string;
  icon: LucideIcon;
  url: string;
  /** Дополнительные префиксы путей, на которых вкладка активна */
  match?: string[];
}

export const tabBarItems: TabBarItem[] = [
  { label: "Главная", icon: Home, url: "/", match: ["/top"] },
  { label: "Каталог", icon: Compass, url: "/catalog", match: ["/movies"] },
  { label: "Закладки", icon: Bookmark, url: "/collections", match: ["/favorites"] },
  { label: "Профиль", icon: UserRound, url: "/profile", match: ["/history", "/rates"] },
];
