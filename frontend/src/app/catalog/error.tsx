// app/error.tsx
"use client";

import { CatalogClientPage } from "@/widgets/catalog";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Пойманная ошибка:", error.message);
  }, [error]);

  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[30px] font-bold">Каталог</span>
      <CatalogClientPage />
    </div>
  );
}
