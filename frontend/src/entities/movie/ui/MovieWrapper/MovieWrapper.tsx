import React from "react";

import styles from "./MovieWrapper.module.css"

import { MovieCover } from "../FilmCover";

interface Props {
  items: number[] | undefined;
}

export const MovieWrapper: React.FC<Props> = ({ items }) => {
  if (!items || items.length < 1)
    return (
      <div>
        <p className="text-lg">В данной коллекции пока еще нет фильмов.</p>
        <p className="text-sm text-accent-foreground/90">
          Чтобы добавить фильм в коллецию перейдите на страницу нужного фильма и
          нажмите на кнопку добавить в коллекцию.
        </p>
      </div>
    );

  return (
    <div className={styles.FilmWrapper}>
      {/* {items.map((id, index) => (
        <MovieCover filmId={id} key={`film-cover-${id + index}`} />
      ))} */}
    </div>
  );
};
