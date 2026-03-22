import z from "zod/v4";
import { createTag } from "../schemas/tag.schema";

export type TagSchema = z.infer<typeof createTag>;
