import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookmarkScheme, type bookmarkCreateSchemeInfer } from "../schemas/book.scheme";

export const useBookmarkForm = () => {
  return useForm<bookmarkCreateSchemeInfer>({
    defaultValues: {
      label: "",
    },
    resolver: zodResolver(bookmarkScheme)
  });
};