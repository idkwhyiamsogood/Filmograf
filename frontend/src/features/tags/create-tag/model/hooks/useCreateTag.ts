import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collecionTagsApi } from "@/entities/collection-tags";
import type { Tag } from "@/entities/collection-tags";
import { toast } from "sonner";

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  const listQueryKey = ["infinity-tags", { pageSize: 21 }];

  return useMutation({
    mutationFn: (newTagData: { name: string }) =>
      collecionTagsApi.createTag(newTagData),

    onMutate: async (newTagData) => {
      await queryClient.cancelQueries({ queryKey: listQueryKey });
      const previousTags = queryClient.getQueryData(listQueryKey);

      const tempTag: Tag = {
        id: `temp-${Date.now()}`,
        name: newTagData.name,
        createData: new Date().toISOString(),
      };

      queryClient.setQueryData(listQueryKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any, i: number) => 
            i === 0 ? { ...page, data: [tempTag, ...page.data] } : page
          ),
        };
      });

      return { previousTags, tempTag };
    },

    onSuccess: (response, variables, context) => {
      const serverTag = response.data;

      queryClient.setQueriesData({ queryKey: ["tag"] }, (oldData: any) => {
        if (!oldData) return oldData;
        
        if (oldData.pages) {
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.map((t: Tag) => 
                t.id === context?.tempTag.id ? serverTag : t
              ),
            })),
          };
        }
        
        return Array.isArray(oldData) 
          ? oldData.map((t: Tag) => (t.id === context?.tempTag.id ? serverTag : t))
          : oldData;
      });

      queryClient.setQueryData(["tag", serverTag.id], serverTag);

      toast.success("Тег создан!");
    },

    onError: (err, variables, context) => {
      if (context?.previousTags) {
        queryClient.setQueryData(listQueryKey, context.previousTags);
      }
      toast.error("Не удалось создать тег");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["infinity-tags"] })
    }
  });
};