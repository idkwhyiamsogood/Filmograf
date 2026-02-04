"use client";

import React from "react";

import { useBookmarks, useModals } from "@/shared/hooks";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/ui/form";

import { Input } from "@/shared/ui/input";
import type { bookmarkCreateSchemeInfer } from "../../model/schemas/book.scheme";
import { useBookmarkForm } from "../../model/hooks/useBookmark";

export const UpdateBookmarkModal: React.FC = () => {
  const { updateBookmark } = useBookmarks();
  const bookmarkForm = useBookmarkForm();
  const { isOpen, closeModal, modalProps } = useModals();

  const handleSubmit = (data: bookmarkCreateSchemeInfer) => {
    updateBookmark(modalProps.id, data.label);
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent showCloseButton={false}>
        <Form {...bookmarkForm}>
          <form
            onSubmit={bookmarkForm.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <DialogHeader className="text-left">
              <DialogTitle>Изменить закладку</DialogTitle>
              <DialogDescription>
                Введите новое название закладки
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={bookmarkForm.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Введите название закладки"
                      className="w-full rounded-2xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex flex-row justify-end">
              <DialogClose asChild>
                <Button variant="outline">Отмена</Button>
              </DialogClose>
              <Button type="submit">Внести изменения</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
