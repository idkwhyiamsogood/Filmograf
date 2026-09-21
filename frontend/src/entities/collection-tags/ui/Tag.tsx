// types
import type { Tag as TagType } from "../model/types";
import type { FC } from "react";

// ui
import { Badge } from "@/shared/ui/badge";
import Link from "@/shared/ui/link";

interface Props {
  tag: TagType;
}

export const Tag: FC<Props> = ({ tag }) => {
  return (
    <Badge variant={"secondary"}>
      <Link href={`/catalog/?searchType="Collection"&genres=${[tag.id]}`}>
        {tag.name}
      </Link>
    </Badge>
  );
};
