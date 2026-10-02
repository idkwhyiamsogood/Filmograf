import React, { useEffect, useState } from "react";

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
import { TagsSearchSelector } from "../../../common/";

import { useModals } from "@/shared/contexts/modal-context";
import { useUpdateCollection } from "@/entities/collection";
import {
  useCollectionForm,
  type CollectionRedactSchema,
} from "@/entities/collection";

import type { BaseModalProps } from "@/shared/contexts/modal-context/modals.type";
import type { UpdateCollectionModalProps } from "./props";

export const UpdateCollectionModal: React.FC<BaseModalProps & UpdateCollectionModalProps> = ({
  isOpen,
  collection,
}) => {
  const { collectionRedactForm, isPublic, toggleTag } = useCollectionForm();
  const { closeModal } = useModals();
  const updateCollection = useUpdateCollection();

  const [step, setStep] = useState<number>(0);

  const handleSubmit = (data: CollectionRedactSchema) => {
    updateCollection.mutate({ id: collection.id, data: data });
    closeModal();
    setStep(0);
  };

  const handlePrev = () => setStep((prev) => prev - 1);
  const handleNext = () => setStep((prev) => prev + 1);

  useEffect(() => {
    if (isOpen) {
      collectionRedactForm.reset({
        name: collection.name,
        isCommentable: collection.isCommentable,
        isCopiable: collection.isCopiable,
        isPublic: collection.isPublic,
        tags: collection.tags,
      });
    }
  }, [isOpen, name, collectionRedactForm]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeModal();
          setStep(0);
        }
      }}
    >
      <DialogContent
        showCloseButton={false}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <Form {...collectionRedactForm}>
          <form
            onSubmit={collectionRedactForm.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <DialogHeader className="text-left">
              <DialogTitle>Настройки подборки</DialogTitle>
              <DialogDescription>
                {step === 0
                  ? "Название и видимость подборки"
                  : "Настройте теги для вашей коллекции"}
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
                          placeholder="Название подборки"
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
                  <>
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
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                <TagsSearchSelector toggleTag={toggleTag} />
              </div>
            )}

            <DialogFooter className="flex flex-row justify-end gap-2">
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
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePrev();
                    }}
                  >
                    Назад
                  </Button>
                  <Button type="submit" className="h-11 rounded-xl font-bold">Сохранить</Button>
                </>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
