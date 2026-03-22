import type { TagSchema } from "../types/tag.type";
import { createTag } from "../schemas/tag.schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const useTagsForm = () => {
  const tagsForm = useForm<TagSchema>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(createTag)
  });

  return {tagsForm};
};
