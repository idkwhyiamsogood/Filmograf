import type { INavigationMenu } from "../types";
import {
  NotepadText,
  BookmarkMinus,
  Home,
  User,
  Settings,
  Film,
  LayoutList,
  ChartNoAxesColumn,
  Menu,
  MenuSquareIcon,
  MenuSquare,
  History,
  Package
} from "lucide-react";

// устарело
export const navigationMenuFirst: INavigationMenu = {
  items: [
    { id: 0, icon: NotepadText, label: "Подборки", url: "/films" },
    { id: 1, icon: BookmarkMinus, label: "Закладки", url: "/collections" },
    { id: 2, icon: Home, label: "Главная", url: "/", isMain: true },
    { id: 3, icon: User, label: "Профиль", url: "/profile", header: false },
    { id: 4, icon: Settings, label: "123123", url: "/settings", header: false },
  ],
};

export const navigationMenu: INavigationMenu = {
  items: [
    { id: 0, icon: LayoutList, label: "Каталог", url: "/catalog", childs: [
      {
        id: 6, icon: Film, label: "Фильмы", url: "/catalog/?searchParams='films'"
      },
      {
        id: 7, icon: Package, label: "Подборки", url: "/catalog/?searchParams='collections'"
      },
    ] },
    {
      id: 1,
      icon: ChartNoAxesColumn,
      label: "Топ",
      url: "/top",
      header: false,
    },
    { id: 2, icon: Home, label: "Главная", url: "/", isMain: true },
    { id: 3, icon: BookmarkMinus, label: "Закладки", url: "/collections" },
    { id: 4, icon: Menu, label: "Меню", url: "/", header: false },
  ],
};

export const fullNavigation: INavigationMenu = {
  items: [...navigationMenu.items, 
    {
      id: 5, icon: History, label: "История просмотра", url: "/user/history",
    }
  ],
};
