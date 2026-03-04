"use client";

import React, { useCallback } from "react";

import { CommonDropdownMenu } from "@/shared/components/";
import { ChevronDown } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { useCollections } from "entities/collection";
import { BookmarkSelectorActions } from "./BookmarkSelectorActions";

import type { ICollection } from "entities/collection";

interface Props {
  selected: number;
  setSelected: (selected: number) => void;
}

export const CollectionSelector: React.FC<Props> = ({ selected, setSelected }) => {
  const { collections } = useCollections();

  const handleClick = useCallback((collection: ICollection) => {
    setSelected(collection.id);
    console.log(collection.id, "clicked")
  }, []);

  return (
    <div className="flex justify-between w-full items-end">
      <BookmarkSelectorActions />
      
      <CommonDropdownMenu
        trigger={
          <Button
            variant="default"
            className="select-none rounded-2xl text-accent"
          >
            <div className="flex justify-between items-center w-auto gap-2.5 cursor-pointer">
              <span>{collections[selected].label}</span>
              <ChevronDown className="text-accent" />
            </div>
          </Button>
        }
        
        content={
          collections.length > 0 && (
            <>
              {collections.map((item: ICollection) => (
                <div
                  key={`${item.id}-${item.label}-collections`}
                  className="cursor-pointer p-1 hover:bg-accent"
                  onClick={() => handleClick(item)}
                >
                  {item.label}
                </div>
              ))}
            </>
          )
        }
        align="end"
      />
    </div>
  );
};
