import type { INavigationMenu } from "../types";
import { NotepadText, BookmarkMinus, Home, User, Settings } from "lucide-react";

export const navigationMenu: INavigationMenu = {
  items: [
    { id: 0, icon: NotepadText, label: "Подборки", url: "/films" },
    { id: 1, icon: BookmarkMinus, label: "Закладки", url: "/bookmarks" },
    { id: 2, icon: Home, label: "Главная", url: "/", isMain: true },
    { id: 3, icon: User, label: "Профиль", url: "/profile", header: false },
    { id: 4, icon: Settings, label: "123123", url: "/settings", header: false },
  ],
};
