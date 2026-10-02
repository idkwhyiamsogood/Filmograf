import { useEffect, type FC } from "react";
import { Hash } from "lucide-react";

import { useModals } from "@/shared/contexts/modal-context";
import type { BaseModalProps } from "@/shared/contexts/modal-context/modals.type";
import { cn } from "@/shared/lib/utils";
import { BottomSheet } from "@/shared/ui/bottom-sheet";
import { Button } from "@/shared/ui/button";

import { useCreateTag } from "../../model/hooks/useCreateTag";
import { useTagsForm } from "../../model/hooks/useTagsForm";
import type { TagSchema } from "../../model/types/tag.type";
import type { CreateTagModalProps } from "./props";

export const CreateTagModal: FC<BaseModalProps & CreateTagModalProps> = ({ isOpen, text }) => {
  const { closeModal } = useModals();
  // Одна форма на всю шторку (раньше поле жило в отдельной копии формы
  // и правка названия не доходила до отправки).
  const { tagsForm } = useTagsForm(text);
  const { mutate: createTag } = useCreateTag();
  const close = () => closeModal("create-tag");

  useEffect(() => {
    if (isOpen) tagsForm.reset({ name: text ?? "" });
  }, [isOpen, text]);

  const submit = tagsForm.handleSubmit((data: TagSchema) => {
    createTag({ name: data.name.trim() });
    close();
  });

  const name = tagsForm.watch("name") ?? "";
  const error = tagsForm.formState.errors.name;

  return (
    <BottomSheet
      open={isOpen}
      onOpenChange={(open) => !open && close()}
      title="Новый тег"
      description="Теги помогают находить подборки по настроению и теме"
      footer={
        <Button className="mb-1 h-12 w-full rounded-xl text-[15px] font-bold" disabled={name.trim().length < 3} onClick={submit}>
          Создать тег
        </Button>
      }
    >
      <form onSubmit={submit} className="space-y-1.5 pt-1">
        <div
          className={cn(
            "flex h-14 items-center gap-2 rounded-xl bg-muted px-4 ring-primary/50 focus-within:ring-2",
            error && "ring-2 ring-destructive/60",
          )}
        >
          <Hash className="size-5 text-muted-foreground" />
          <input
            {...tagsForm.register("name")}
            autoFocus
            maxLength={20}
            autoComplete="off"
            placeholder="например, уютное"
            className="min-w-0 flex-1 bg-transparent text-[17px] font-semibold outline-none placeholder:font-normal placeholder:text-muted-foreground"
          />
          <span className="text-xs text-muted-foreground tabular-nums">{name.length}/20</span>
        </div>
        {error && <p className="px-1 text-xs font-medium text-destructive">От 3 до 20 символов</p>}
      </form>
    </BottomSheet>
  );
};
