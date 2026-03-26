import React from "react";

import styles from "./MovieWrapper.module.css";

import { MovieCover } from "../MovieCover";

import type { IMovie } from "../../model/types/types";

interface Props {
  movies: IMovie[];
}

export const MovieWrapper: React.FC<Props> = ({ movies }) => {
  return (
    <div className={styles.FilmWrapper}>
      {movies.map((movie, idx) => (
        <div key={`film-cover-${movie?.id || idx}`} className={styles.cardContainer}>
          <MovieCover movie={movie} />
        </div>
      ))}
    </div>
  );
};