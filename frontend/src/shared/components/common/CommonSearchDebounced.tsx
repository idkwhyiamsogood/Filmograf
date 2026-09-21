import React, { useState, useCallback } from "react";
import { Input } from "@/shared/ui/input";
import { useDebounce } from "react-use";

interface Props {
  placeholder: string;
  onSearch: (value: string) => void;
  debounceDelay?: number;
}

export const CommonSearchDebounced: React.FC<Props> = ({
  placeholder,
  onSearch,
  debounceDelay = 300,
}) => {
  const [value, setValue] = useState<string>("");

  useDebounce(
    () => {
      onSearch(value);
    },
    debounceDelay,
    [value],
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  return (
    <Input placeholder={placeholder} value={value} onChange={handleChange} className="rounded-none h-10"/>
  );
};
