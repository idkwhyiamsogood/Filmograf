// types
import type { Genre as GenreType } from "../model/types/types";
import type { FC } from "react";

// ui
import { Badge } from "@/shared/ui/badge";
import Link from "@/shared/ui/link";

interface Props {
  genre: GenreType;
}

export const Genre: FC<Props> = ({ genre }) => {
  return (
    <Badge variant={"secondary"}>
      <Link href={`/catalog/?genres=${[genre.id]}`}>
      {genre.name}
      </Link>
    </Badge>
  );
};
