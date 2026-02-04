import { z } from "zod";

export const bookmarkScheme = z.object({
  label: z
    .string()
    .min(3, "Название закладки должно быть длинее трех символов")
    .max(64, "Слишком длинное название"),
});

export type bookmarkCreateSchemeInfer = z.infer<typeof bookmarkScheme>;
