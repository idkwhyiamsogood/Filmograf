// API`s
export { collecionTagsApi } from "./model/api/collection-tags.api";


// types
export type { Tag as TagType } from "./model/types"


// hooks
export { useInfinityTags } from "./model/hooks/useInfinityTags";
export { useTags } from "./model/hooks/useTags";
export { useTagsSearch } from "./model/hooks/useSearchTags";

// ui
export { Tag } from "./ui/Tag";
export { TagWrapper } from "./ui/TagWrapper";