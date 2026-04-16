"use client";

import React, { useState } from "react";

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
import { TagsSearchSelector } from "../../common/";

import type { CreateCollection } from "entities/collection";
import { useCollectionForm, useCreateCollection } from "entities/collection";

import type { BaseModalProps } from "@/shared/types";

export const CreateCollectionModal: React.FC<BaseModalProps> = ({ isOpen }) => {
  const { mutate: createCollection } = useCreateCollection();
  const { collectionRedactForm, isPublic, toggleTag } = useCollectionForm();
  const { closeModal } = useModals();

  const [step, setStep] = useState<number>(0);

  const handleSubmit = (data: CreateCollection) => {
    // console.log(data, "raw-data");

    // console.log(collectionRedactForm.getValues("tags"), "tags");

    createCollection(data);
    closeModal();
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent
        showCloseButton={false}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
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

            {step === 0 ? (
              <div className="space-y-2.5">
                <FormField
                  control={collectionRedactForm.control}
                  name="name"
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
            ) : (
              <div className="space-y-2.5">
                <TagsSearchSelector toggleTag={toggleTag} />
              </div>
            )}

            <DialogFooter className="flex flex-row justify-end">
              {step === 0 ? (
                <>
                  <DialogClose asChild>
                    <Button variant="outline">Отмена</Button>
                  </DialogClose>
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNext();
                    }}
                  >
                    Дальше
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePrev();
                    }}
                  >
                    Назад
                  </Button>
                  <Button type="submit">Создать</Button>
                </>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
