import React from 'react';

import styles from './FilmWrapper.module.css';

import { FilmCover } from './FilmCover';

interface Props {
  items: number[];
}

export const FilmWrapper: React.FC<Props> = ({ items }) => {
  return (
    <div className={styles.FilmWrapper}>
      {items.map((id, index) => (
        <FilmCover filmId={id} key={`film-cover-${id + index}`}/>
      ))}
    </div>
  );
};
