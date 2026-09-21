import { usePathname } from "@/shared/lib/router-compat";
import type { Entity } from "@/shared/types";

export const useSearchEntity = () => {
  const pathname = usePathname();

  const pathParts = pathname.split("/").filter(Boolean);

  const getEntity = (pathParts: string[]) => {
    try {
      const entityType =
        pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1, -1);
      const id = pathParts[1];

      return { entityId: id, type: entityType } as Entity;
    } catch (e) {
      console.log(e);
    }
  };

  const entity = getEntity(pathParts) || ({} as Entity);
  return entity;
};
