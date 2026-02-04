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
  FormMessage
} from "@/shared/ui/form";

import { Input } from "@/shared/ui/input";
import { useBookmarkForm } from "../../model/hooks/useBookmark";
import { type bookmarkCreateSchemeInfer } from "../../model/schemas/book.scheme";

export const CreateBookmarkModal: React.FC = () => {
  const { createBookmark } = useBookmarks();
  const bookmarkForm = useBookmarkForm();
  const { isOpen, closeModal } = useModals();

  const handleSubmit = (data: bookmarkCreateSchemeInfer) => {
    createBookmark(data.label);
    console.log("xyi")
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
              <DialogTitle>Создание новой закладки</DialogTitle>
              <DialogDescription>
                Введите название закладки, которую хотите создать
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
              <Button type="submit" >Создать</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
