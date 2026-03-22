"use client";

import type { FC } from "react";
import type { TagSchema } from "../model/types/tag.type";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Form } from "@/shared/ui/form";
import { Button } from "@/shared/ui/button";
import { TagContent } from "./TagContent";

import { collecionTagsApi } from "@/entities/collection-tags";

import { useModals } from "@/shared/hooks";
import { useTagsForm } from "../model/hooks/useTagsForm";

export const CreateTagModal: FC = () => {
  const { openModal, isOpen, closeModal } = useModals();
  const { tagsForm } = useTagsForm();

  const handleSubmit = (data: TagSchema) => {
    collecionTagsApi.createTag(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent showCloseButton={false}>
        <Form {...tagsForm}>
          <form
            onSubmit={tagsForm.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <DialogHeader className="text-left">
              <DialogTitle>Создание нового тега</DialogTitle>
              <DialogDescription>
                Введите название тега, который хотите создать
              </DialogDescription>
            </DialogHeader>

            <TagContent />

            <DialogFooter>
              <DialogClose>
                <Button>Отмена</Button>
              </DialogClose>
              <Button type="submit">Создать</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
