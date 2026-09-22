// types
import type { FC } from "react";
import type { TagSchema } from "../../model/types/tag.type";
import type { BaseModalProps } from "@/shared/contexts/modal-context/modals.type";
import type { CreateTagModalProps } from "./props";

// ui
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/shared/ui/dialog";
import { Form } from "@/shared/ui/form";
import { TagContent } from "./TagContent";

// hooks
import { useModals } from "@/shared/contexts/modal-context";
import { useTagsForm } from "../../model/hooks/useTagsForm";
import { useCreateTag } from "../../model/hooks/useCreateTag";

export const CreateTagModal: FC<BaseModalProps & CreateTagModalProps> = ({
  isOpen,
  text,
}) => {
  const { closeModal } = useModals();
  const { tagsForm } = useTagsForm(text);
  const { mutate: createTag } = useCreateTag();

  const handleSubmit = async (data: TagSchema) => {
    try {
      createTag(data);

      tagsForm.reset();

      closeModal();
    } catch (error) {
      console.error("Ошибка при создании тега:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) closeModal(); }}>
      <DialogContent
        showCloseButton={false}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <Form {...tagsForm}>
          <form
            onSubmit={tagsForm.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <DialogHeader className="text-left">
              <DialogTitle>Создание нового тега</DialogTitle>
              <DialogDescription>
                Вы создаете тег: <strong>{text}</strong>
              </DialogDescription>
            </DialogHeader>

            <TagContent text={text} />

            <DialogFooter className="flex flex-row justify-end">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Отмена
                </Button>
              </DialogClose>
              <Button type="submit" disabled={tagsForm.formState.isSubmitting}>
                {tagsForm.formState.isSubmitting ? "Создание..." : "Создать"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
