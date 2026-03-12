import React from "react";

import styles from "./MovieWrapper.module.css"

import { MovieCover } from "../FilmCover";

import type { IMovie } from "../../model/types/types";

interface Props {
  movies: IMovie[];
  isLoading: boolean;
}

export const MovieWrapper: React.FC<Props> = ({ movies, isLoading}) => {
  if (!movies || movies.length < 1)
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
      {movies.map((movie) => (
        <MovieCover movie={movie} key={`film-cover-${movie.id}`} isLoading={isLoading}/>
      ))}
    </div>
  );
};
