"use client";

import React from "react";

import { CommonDropdownMenu } from "@/shared/components";
import { useModals } from "@/shared/hooks/";
import { Button } from "@/shared/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";

import type { ICollection } from "entities/collection";
import { useCollections } from "entities/collection";


export const BookmarkSelectorActions: React.FC = () => {
  const { collections, deleteCollection } = useCollections();
  const { openModal } = useModals();

  return (
    <div className={"flex gap-2.5"}>
      <Button
        className="rounded-full bg-accent-foreground w-10 h-10"
        onClick={() => {
          openModal("create-bookmark");
          console.log(1);
        }}
      >
        <Plus size={24} className="h-6! w-6!" strokeWidth={1.5} />
      </Button>
      
      <CommonDropdownMenu
        trigger={
          <Button className="rounded-full bg-accent-foreground w-10 h-10">
            <Pencil size={24} className="h-6! w-6!" strokeWidth={1.5} />
          </Button>
        }
        
        content={
          <>
            {collections.map((item: ICollection) => (
              <div
                key={`${item.id}-${item.label}-collection-action`}
                className="cursor-pointer"
              >
                <div className="flex justify-between items-center p-2 gap-1">
                  <span className="text-sm">{item.label}</span>
                  <div className="flex gap-1">
                    <div 
                      className="p-1 rounded hover:bg-accent-foreground/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal("update-bookmark", { data: item });
                      }}
                    >
                      <Pencil
                        size={20}
                        className="text-primary"
                        strokeWidth={1.5}
                      />
                    </div>

                    <div 
                      className="p-1 rounded hover:bg-accent-foreground/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal("confirmation", {
                          title: `Вы уверены, что хотите удалить коллкцию "${item.label}"`,
                          function: deleteCollection,
                          data: item.id,
                        });
                      }}
                    >
                      <Trash2
                        size={20}
                        className="text-primary"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        }
        align="center"
      />
    </div>
  );
};