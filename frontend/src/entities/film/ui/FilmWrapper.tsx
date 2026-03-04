import React from "react";

import styles from "./FilmWrapper.module.css";

import { FilmCover } from "./FilmCover";

interface Props {
  items: number[] | undefined;
}

export const FilmWrapper: React.FC<Props> = ({ items }) => {
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
      {items.map((id, index) => (
        <FilmCover filmId={id} key={`film-cover-${id + index}`} />
      ))}
    </div>
  );
};
