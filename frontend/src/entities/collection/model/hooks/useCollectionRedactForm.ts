"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import {
  type CollectionRedactSchema,
  collectionRedactSchema,
} from "entities/collection";

import { useEffect } from "react";

export const useCollectionRedactForm = () => {
  const collectionRedactForm = useForm<CollectionRedactSchema>({
    defaultValues: {
      label: "",
      isPublic: false,
      isCommentable: false,
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
    }
  }, [isPublic, collectionRedactForm]);

  return {
    collectionRedactForm,
    isPublic,
  };
};
