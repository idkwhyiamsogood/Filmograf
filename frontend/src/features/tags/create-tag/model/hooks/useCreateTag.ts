import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { toast } from "sonner";

import { collecionTagsApi } from "@/entities/collection-tags";
import type { TagType } from "@/entities/collection-tags";

type TagsPage = { tags: TagType[]; nextPage: number | null };

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createTag"],
    mutationFn: async (newTag: { name: string }) => (await collecionTagsApi.createTag(newTag)).data,

    // Тег сразу появляется первым в списке выбора тегов.
    onMutate: async ({ name }) => {
      await queryClient.cancelQueries({ queryKey: ["infinity-tags"] });
      const previous = queryClient.getQueriesData<InfiniteData<TagsPage>>({ queryKey: ["infinity-tags"] });
      const tempTag: TagType = { id: `temp-${Date.now()}`, name, createData: new Date().toISOString() };

      queryClient.setQueriesData<InfiniteData<TagsPage>>({ queryKey: ["infinity-tags"] }, (old) =>
        old?.pages.length
          ? { ...old, pages: [{ ...old.pages[0], tags: [tempTag, ...old.pages[0].tags] }, ...old.pages.slice(1)] }
          : old,
      );
      return { previous, tempId: tempTag.id };
    },

    onSuccess: (tag, _v, ctx) => {
      queryClient.setQueriesData<InfiniteData<TagsPage>>({ queryKey: ["infinity-tags"] }, (old) =>
        old && {
          ...old,
          pages: old.pages.map((p) => ({ ...p, tags: p.tags.map((t) => (t.id === ctx?.tempId ? tag : t)) })),
        },
      );
      queryClient.setQueryData(["tag", tag.id], tag);
      toast.success(`Тег «${tag.name}» создан`);
    },

    onError: (_e, _v, ctx) => {
      ctx?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
      toast.error("Не удалось создать тег");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["infinity-tags"] });
      queryClient.invalidateQueries({ queryKey: ["tags", "search-ids"] });
    },
  });
};
