"use client";

import React from "react";

import { Button } from "@/shared/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useModals, useBookmarks } from "@/shared/hooks/";
import { CommonDropdownMenu } from "@/shared/components";

import type { IBookmark } from "@/shared/types";
import { cn } from "@/shared/lib/utils";

interface Props {
  className?: string;
}

export const BookMarkSelectorActions: React.FC<Props> = ({ className }) => {
  const { bookmarks, deleteBookmark } = useBookmarks();
  const { openModal } = useModals();

  return (
    <div className={className}>
      <div className="flex gap-2.5">
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
              {bookmarks.map((item: IBookmark, index: number) => (
                <div
                  key={`${item.id}-${item.label}`}
                  className="cursor-pointer hover:bg-accent"
                >
                  <div className="flex justify-between items-center p-2">
                    <span className="text-sm">{item.label}</span>
                    <div className="flex gap-3">
                      <Pencil
                        size={20}
                        className="text-primary"
                        strokeWidth={1.5}
                        onClick={() =>
                          openModal("update-bookmark", { id: item.id })
                        }
                      />
                      <Trash2
                        size={20}
                        className="text-primary"
                        strokeWidth={1.5}
                        onClick={() =>
                          openModal("confirmation", {
                            title: `Вы уверены, что хотите удалить закладку "${item.label}"`,
                            function: deleteBookmark,
                            data: item.id,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </>
          }
          align="center"
        />
      </div>
    </div>
  );
};
