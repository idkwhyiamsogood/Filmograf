import React from 'react';

import { FilmToCollection } from '@/features/film/film-to-collection';

interface Props {
  className?: string;
}

const Page: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <FilmToCollection filmId={0}/>
    </div>
  );
};

export default Page;