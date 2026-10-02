import React, { useState } from "react";

import { useModals } from "@/shared/contexts/modal-context";
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

import type { CreateCollection } from "@/entities/collection";
import { useCollectionForm, useCreateCollection } from "@/entities/collection";

import type { BaseModalProps } from "@/shared/contexts/modal-context/modals.type";

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
    <Dialog open={isOpen} onOpenChange={() => closeModal()}>
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
              <DialogTitle>Новая подборка</DialogTitle>
              <DialogDescription>
                Название, видимость и теги — всё можно поменять позже
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
                          placeholder="Например, «На выходные»"
                          className="h-12 w-full rounded-xl text-base"
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
                    <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-xl bg-muted/60 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Сделать публичной</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Скрытые подборки видны только вам
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
                      <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-xl bg-muted/60 p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Разрешить комментарии</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Другие смогут обсуждать вашу подборку
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
                      <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-xl bg-muted/60 p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Разрешить копирование</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Другие смогут сохранять копию подборки себе
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

            <DialogFooter className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
              {step === 0 ? (
                <>
                  <DialogClose asChild>
                    <Button variant="secondary" className="h-11 rounded-xl font-bold">Отмена</Button>
                  </DialogClose>
                  <Button
                    type="button"
                    className="h-11 rounded-xl font-bold"
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
                    variant="secondary"
                    className="h-11 rounded-xl font-bold"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePrev();
                    }}
                  >
                    Назад
                  </Button>
                  <Button type="submit" className="h-11 rounded-xl font-bold">Создать</Button>
                </>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
