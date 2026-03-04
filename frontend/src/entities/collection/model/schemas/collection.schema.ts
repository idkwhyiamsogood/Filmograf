import z from "zod/v4"

export const collectionRedactSchema = z.object({
  label: z.string().max(20),
  isPublic: z.boolean(),
  isCommentable: z.boolean(),
})

export type CollectionRedactSchema = z.infer<typeof collectionRedactSchema>;