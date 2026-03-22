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

  return {
    collectionRedactForm,
    isPublic,
  };
};
