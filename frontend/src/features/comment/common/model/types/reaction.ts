import type { EntityType } from "@/shared/types";

export interface ReactionProps {
  userId: string | undefined;
  entityType: EntityType;
  entityId: string;
}
