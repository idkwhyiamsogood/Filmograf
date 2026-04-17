import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collecionPinsApi } from "../api/collectionPins.api";
import { toast } from "sonner";

export const usePinCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: collecionPinsApi.pinCollection,
    mutationKey: ["pinCollection"],
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["pins"] });

      const previousPins = queryClient.getQueryData<string[]>(["pins"]) || [];

      // queryClient.setQueryData(["pins"], (oldData: string[] = []) => [
      //   id,
      //   ...oldData,
      // ]);

      return { previousPins };
    },
    onSuccess: (data, variables, context) => {
      // queryClient.setQueryData(["pins"], (oldData: string[] = []) => [
      //   data,
      //   ...oldData.filter((item) => item !== variables),
      // ]);

      toast.success("Коллекция добавлена в избранное");
    },
    onError: (error, variables, context) => {
      if (context?.previousPins) {
        queryClient.setQueryData(["pins"], context.previousPins);
      }

      console.error(error);

      toast.error("При добавлении коллекции в избранное произошла ошибка");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["pins"] });
    },
  });
};
