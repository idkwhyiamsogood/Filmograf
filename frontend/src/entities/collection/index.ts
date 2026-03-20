// api
export { collectionApi } from "./model/api/collection.api";

// ui
export { CollectionCard } from "./ui/Collection";
export { CollectionSkeleton } from "./ui/CollectionSkeleton";
export { CollectionCover } from "./ui/CollectionCover";

// schemas
export {
  collectionRedactSchema,
  type CollectionRedactSchema,
} from "./model/schemas/collection.schema";

// hooks
export { useCollectionRedactForm } from "./model/hooks/useCollectionRedactForm";
export { useCollections } from "./model/hooks/useCollections";
export { useCreateCollection } from "./model/hooks/useCreateCollection";
export { useDeleteCollection } from "./model/hooks/useDeleteCollection";
export { useUpdateCollection } from "./model/hooks/useUpdateCollection";

// types
export type { CreateCollection, Collection } from "./model/types";
