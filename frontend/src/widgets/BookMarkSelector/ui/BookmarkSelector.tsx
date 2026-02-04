"use client";

import React, { useCallback, useEffect } from "react";

import { CommonDropdownMenu } from "@/shared/components/";
import { ChevronDown } from "lucide-react";

import { useState } from "react";

import { useBookmarks } from "@/shared/hooks";
import { BookMarkSelectorActions } from "./BookMarkSelectorActions";
import { cn } from "@/shared/lib/utils";

import type { IBookmark } from "@/shared/types";
import { Button } from "@/shared/ui/button";

export const BookmarkSelector: React.FC = () => {
  const [label, setLabel] = useState<string>("Все");

  const { bookmarks } = useBookmarks();

  const handleClick = useCallback((item: IBookmark) => {
    setLabel(item.label);
  }, []);

  useEffect(() => {}, [bookmarks]);

  return (
    <div className="flex justify-between w-full items-end">
      <BookMarkSelectorActions />
      <CommonDropdownMenu
        trigger={
          <Button
            variant="default"
            className="select-none rounded-2xl text-accent"
          >
            <div className="flex justify-between items-center w-auto gap-2.5 cursor-pointer">
              <span>{label}</span>
              <ChevronDown className="text-accent" />
            </div>
          </Button>
        }
        content={
          bookmarks.length > 0 && (
            <>
              {bookmarks.map((item: IBookmark) => (
                <div
                  key={`${item.id}-${item.label}`}
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
