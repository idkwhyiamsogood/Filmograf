"use client";

// types
import type { FC } from "react";

// components
import Image from "next/image";

// hooks
import { memo } from "react";

interface Props {
  data: any;
}

export const SearchItem: FC<Props> = memo(({ data }) => {
  return (
    <div className="flex gap-2.5 p-3 cursor-pointer transition-colors items-center">
      {data.poster?.previewUrl || data.url ? (
        <Image
          src={data.poster?.previewUrl || data.url}
          alt={data.name || data.title || ""}
          height={64}
          width={64}
          className="object-cover rounded"
        />
      ) : (
        <div className="w-16 h-24 bg-gray-200 rounded flex items-center justify-center" />
      )}

      <div className="flex-1 flex flex-col gap-1">
        <span className="font-medium">
          {data.name || "Без названия"}
        </span>
        <p className="text-sm text-gray-600 line-clamp-2">
          {data.shortDescription || data.description || "Описание отсутствует"}
        </p>
      </div>

      <div className="flex flex-col gap-1 min-w-20">
        <span className="flex items-center gap-1 text-sm">
          <Image src="/kp.png" alt="КиноПоиск" height={16} width={16} />
          {data.rating.kp || "Нет данных"}
        </span>
        <span className="flex items-center gap-1 text-sm">
          <Image src="/imdb.png" alt="IMDB" height={16} width={16} />
          {data.rating.imdb || "Нет данных"}
        </span>
      </div>
    </div>
  );
});
