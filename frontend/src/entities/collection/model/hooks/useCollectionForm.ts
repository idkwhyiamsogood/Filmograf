"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import {
  type CollectionRedactSchema,
  collectionRedactSchema,
} from "entities/collection";

import { useEffect } from "react";

export const useCollectionForm = () => {
  const collectionRedactForm = useForm<CollectionRedactSchema>({
    defaultValues: {
      name: "",
      isPublic: false,
      isCommentable: false,
      isCopiable: false,
      tags: [],
    },
    resolver: zodResolver(collectionRedactSchema),
  });

  const isPublic = useWatch({
    control: collectionRedactForm.control,
    name: "isPublic",
    defaultValue: false,
  });

  useEffect(() => {
    if (!isPublic) {
      collectionRedactForm.setValue("isCommentable", false);
      collectionRedactForm.setValue("isCopiable", false);
    }
  }, [isPublic, collectionRedactForm]);

  const toggleTag = (tag: string) => {
    const currentTags = collectionRedactForm.getValues("tags");
    const trimmedTag = tag.trim();

    if (!trimmedTag) return;

    if (currentTags.includes(trimmedTag)) {
      // Если тег есть - удаляем
      collectionRedactForm.setValue(
        "tags",
        currentTags.filter((t) => t !== trimmedTag),
      );
    } else {
      // Если тега нет - добавляем
      collectionRedactForm.setValue("tags", [...currentTags, trimmedTag]);
    }

    // console.log(collectionRedactForm.getValues("tags"), "tags");
  };

  return {
    collectionRedactForm,
    isPublic,
    toggleTag
  };
};
