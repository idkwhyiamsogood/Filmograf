"use client";

import React from "react";

import { useModals } from "@/shared/hooks";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
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
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";

import { useCollections } from "entities/collection";
import { useCollectionRedactForm } from "entities/collection";
import type { CollectionRedactSchema } from "entities/collection";

export const CreateCollectionModal: React.FC = () => {
  const { createCollection } = useCollections();
  const { collectionRedactForm, isPublic } = useCollectionRedactForm();
  const { isOpen, closeModal } = useModals();

  const handleSubmit = (data: CollectionRedactSchema) => {
    createCollection(data);
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent showCloseButton={false}>
        <Form {...collectionRedactForm}>
          <form
            onSubmit={collectionRedactForm.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <DialogHeader className="text-left">
              <DialogTitle>Создание новой закладки</DialogTitle>
              <DialogDescription>
                Введите название закладки, которую хотите создать
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2.5">
              <FormField
                control={collectionRedactForm.control}
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

              <FormField
                control={collectionRedactForm.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Сделать публичной</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Приватные закладки видны только вам
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {isPublic && (
                <FormField
                  control={collectionRedactForm.control}
                  name="isCommentable"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Разрешить коментарии</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Разрешение даст возможность дргуим пользователям
                          делиться впечатлениями о вашей колекции
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter className="flex flex-row justify-end">
              <DialogClose asChild>
                <Button variant="outline">Отмена</Button>
              </DialogClose>
              <Button type="submit">Создать</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
