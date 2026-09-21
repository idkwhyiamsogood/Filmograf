import type { LucideProps } from "lucide-react";

export interface INavigationItem {
  id: number;
  icon?: React.ComponentType<LucideProps>;
  label: string;
  url: string;

  header?: boolean;
  isMain?: boolean;

  childs?: INavigationItem[];
}

export interface INavigationMenu {
  items: INavigationItem[];
}