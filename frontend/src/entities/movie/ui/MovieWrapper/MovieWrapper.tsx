import React from "react";

import styles from "./MovieWrapper.module.css";

import { MovieCover } from "../FilmCover";

import type { IMovie } from "../../model/types/types";

interface Props {
  movies: IMovie[] | undefined[];
  isLoading: boolean;
}

export const MovieWrapper: React.FC<Props> = ({ movies, isLoading }) => {
  return (
    <div className={styles.FilmWrapper}>
      {movies.map((movie, idx) => (
        <MovieCover
          movie={movie}
          key={`film-cover-${movie?.id || idx}`}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};
