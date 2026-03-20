"use client";

import React from "react";

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

import { useModals } from "@/shared/hooks";
import { useUpdateCollection } from "entities/collection";
import {
  useCollectionRedactForm,
  type CollectionRedactSchema,
} from "entities/collection";

interface Props {
  data: {
    id: string;
  };
}

export const UpdateCollectionModal: React.FC = () => {
  const { collectionRedactForm, isPublic } = useCollectionRedactForm();
  const { isOpen, closeModal, modalProps } = useModals();
  const updateCollection = useUpdateCollection();

  const { data: recieveData } = modalProps as Props;

  const handleSubmit = (data: CollectionRedactSchema) => {
    updateCollection.mutate({ id: recieveData.id, data: data });
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent showCloseButton={false}>
        <Form {...collectionRedactForm}>
          <form
            onSubmit={collectionRedactForm.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <DialogHeader className="text-left">
              <DialogTitle>Изменить закладку</DialogTitle>
              <DialogDescription>
                Введите новое название закладки и настройте видимость
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2.5">
              <FormField
                control={collectionRedactForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Введите новое название закладки"
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

              {isPublic && (
                <FormField
                  control={collectionRedactForm.control}
                  name="isCopiable"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Разрешить копирование</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Разрешение даст возможность дргуим пользователям
                          копировать вашу подборку к себе в коллекцию
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter className="flex flex-row justify-end gap-2">
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
