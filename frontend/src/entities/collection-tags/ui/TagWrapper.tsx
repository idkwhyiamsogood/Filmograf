// types
import type { FC } from "react";
import type { Tag as TagType } from "../model/types";

// ui
import { Tag } from "./Tag";

interface Props {
  tags: TagType[];
}

export const TagWrapper: FC<Props> = ({ tags }) => {
  return (
    <div className="flex gap-1.25 flex-wrap px-2.5 py-1">
      {tags.map((tag) => (
        <Tag tag={tag} key={tag.id} />
      ))}
    </div>
  );
};
