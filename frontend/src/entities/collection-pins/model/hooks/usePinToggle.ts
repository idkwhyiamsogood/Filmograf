import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { collecionPinsApi } from "../api/collectionPins.api";
import { PINS_KEY } from "./useCollectionPins";

const usePinMutation = (pin: boolean) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [pin ? "pinCollection" : "unpinCollection"],
    mutationFn: async (id: string) =>
      (pin ? await collecionPinsApi.pinCollection(id) : await collecionPinsApi.unpinCollection(id))
        .data.collectionIds,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: PINS_KEY });
      const previous = queryClient.getQueryData<string[]>(PINS_KEY);
      queryClient.setQueryData<string[]>(PINS_KEY, (old = []) =>
        pin ? [...old.filter((p) => p !== id), id] : old.filter((p) => p !== id),
      );
      return { previous };
    },
    // Сервер вернул актуальный список — берём его как источник правды.
    onSuccess: (ids) => {
      if (ids) queryClient.setQueryData(PINS_KEY, ids);
      toast.success(pin ? "Подборка закреплена в избранном" : "Подборка откреплена");
    },
    onError: (_e, _id, ctx) => {
      queryClient.setQueryData(PINS_KEY, ctx?.previous);
      toast.error(pin ? "Не удалось закрепить подборку" : "Не удалось открепить подборку");
    },
  });
};

export const usePinCollection = () => usePinMutation(true);
export const useUnpinCollection = () => usePinMutation(false);
