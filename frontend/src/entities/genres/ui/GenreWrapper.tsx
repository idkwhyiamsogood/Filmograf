// types
import type { FC } from "react";
import type { Genre as GenreType } from "../model/types/types";

// ui
import { Genre } from "./Genre";

interface Props {
  genres: GenreType[];
}

export const GenreWrapper: FC<Props> = ({ genres }) => {
  return (
    <div className="flex gap-1.25 flex-wrap px-2.5 py-1">
      {genres.map((genre) => (
        <Genre genre={genre} key={genre.id} />
      ))}
    </div>
  );
};
