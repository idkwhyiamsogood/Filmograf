"use client";

import { useEffect, useState, type FC } from "react";

import { CommonSearchSelector } from "@/shared/components";

import useDebounce from "react-use/esm/useDebounce";

const CommandEmpty: FC = () => {
  return (
    <div className="">
      По вашему запросу ничего не найдено
      {/* создать новый тег ? */}
    </div>
  );
};

export const TagsSearchSelector: FC = () => {
  const [value, setValue] = useState<string>("");
  const [debouncedValue, setDebouncedValue] = useState<string>("");

  useDebounce(
    () => {
      setDebouncedValue(value);
    },
    300,
    [value],
  );

  useEffect(() => {
    if (debouncedValue) {
      console.log("Searching for tags with query:", debouncedValue);
    }
  }, [debouncedValue]);

  return (
    <CommonSearchSelector
      items={[]}
      onChangeValue={setValue}
      commandEmpty={<CommandEmpty />}
    />
  );
};
