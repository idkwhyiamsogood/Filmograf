import React from "react";

import styles from "./MovieWrapper.module.css";

import { MovieCover } from "../MovieCover";

import type { IMovie } from "../../model/types/types";

interface Props {
  movies: IMovie[];
  /** movieId → оценка пользователя */
  userRates?: Record<string, number>;
}

export const MovieWrapper: React.FC<Props> = ({ movies, userRates }) => {
  return (
    <div className={styles.FilmWrapper}>
      {movies.map((movie, idx) => (
        <div key={`film-cover-${movie?.id || idx}`} className={styles.cardContainer}>
          <MovieCover movie={movie} userRate={userRates?.[movie.id]} priority={idx < 6} />
        </div>
      ))}
    </div>
  );
};