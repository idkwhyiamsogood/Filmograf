import z from "zod/v4";

export const collectionRedactSchema = z.object({
  name: z
    .string()
    .min(1, "Название обязательно")
    .max(20, "Максимум 20 символов"),
  tags: z.array(z.string()),
  isPublic: z.boolean(),
  isCommentable: z.boolean(),
  isCopiable: z.boolean(),
});

export type CollectionRedactSchema = z.infer<typeof collectionRedactSchema>;
