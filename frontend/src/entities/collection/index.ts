// api
export { collectionApi } from "./model/api/collection.api";

// ui
export { CollectionCover } from "./ui/CollectionCover";
export { CollectionSkeleton } from "./ui/CollectionSkeleton";
export { CollectionWrapper } from "./ui/CollectionWrapper/CollectionWrapper";
export { CollectionSkeletonWrapper } from "./ui/CollectionSkeletonWrapper";

// schemas
export {
  collectionRedactSchema,
  type CollectionRedactSchema,
} from "./model/schemas/collection.schema";

// hooks
export { useMovieToCollection } from "../../features/movie/movie-to-collection/model/useMovieToCollection";
export { useCollectionForm } from "./model/hooks/useCollectionForm";
export { useCollections } from "./model/hooks/useCollections";
export { useCreateCollection } from "./model/hooks/useCreateCollection";
export { useDeleteCollection } from "./model/hooks/useDeleteCollection";
export { useUpdateCollection } from "./model/hooks/useUpdateCollection";

// types
export type { Collection, CreateCollection } from "./model/types";


// mock
export { MOCK_COLLECTIONS } from "./model/constants/mock-collections";