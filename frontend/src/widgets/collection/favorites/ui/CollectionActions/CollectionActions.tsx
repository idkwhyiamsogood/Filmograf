"use client";

import { Button } from "@/shared/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { Collection } from "@/entities/collection";
import { CollectionActionsDropdown } from "./CollectionActionsDropdown";

interface Props {
  collection: Collection;
  userId: string;
}

export const CollectionActions: React.FC<Props> = ({ collection, userId }) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <Button
        className="absolute top-0 left-0 text-accent-foreground z-20"
        variant="ghost"
        onClick={handleBack}
      >
        <ArrowLeft size={16} />
      </Button>

      <CollectionActionsDropdown collection={collection} userId={userId} />
    </div>
  );
};
