"use client";

import { FilmWrapper } from '@/entities/movie';
import React, { memo, useState } from 'react';

import { useCollections } from 'entities/collection';

import { CollectionSelector } from './ui/CollectionSelector';


export const BookmarkManagement: React.FC = memo(() => {
  const { collections } = useCollections();

  const [selected, setSelected] = useState<number>(0);

  const items = collections[selected].films;

  return (
    <div className='flex flex-col gap-5'>
      <CollectionSelector selected={selected} setSelected={setSelected}/>
      <FilmWrapper items={items}/>
    </div>
  );
});

BookmarkManagement.displayName = 'BookmarkManagement';