import {
  BookmarkMinus,
  ChartNoAxesColumn,
  Film,
  History,
  Home,
  LayoutList,
  Menu,
  Package,
  Heart
} from "lucide-react";
import type { INavigationMenu } from "../types";

export const navigationMenu: INavigationMenu = {
  items: [
    {
      id: 0,
      icon: LayoutList,
      label: "Каталог",
      url: "/catalog",
      childs: [
        {
          id: 6,
          icon: Film,
          label: "Фильмы",
          url: "/catalog/?type=Movie",
        },
        {
          id: 7,
          icon: Package,
          label: "Подборки",
          url: "/catalog/?type=Collection",
        },
      ],
    },
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
  items: [
    ...navigationMenu.items,
    // {
    //   id: 5,
    //   icon: History,
    //   label: "История просмотра",
    //   url: "/user/history",
    // },
    { id: 8, icon: Package, label: "Избранные подборки", url: "/favorites" },
    { id: 9, icon: Heart, label: "Мои оценки", url: "/rates" }
  ],
};
