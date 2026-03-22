import z from "zod/v4";

export const createTag = z.object({
  name: z.string().min(3).max(20)
});

